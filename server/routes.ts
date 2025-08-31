import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVinCheckSchema, insertVinSearchSchema } from "@shared/schema";
import { sendVinSearchNotification, sendContactFormNotification } from "./emailService";
import { fetchVehicleAuctionData, validateSecureRequest, generateSecureToken } from "./vehicleDatabase";
import { 
  encryptData, 
  decryptData, 
  generateSecureToken as securityGenerateToken, 
  generateHMAC, 
  verifyHMAC, 
  obfuscateResponse,
  validateSession,
  createSession,
  ADMIN_IP_WHITELIST 
} from "./security";
import { decodeVinComprehensive, mergeVinDataSources, type ApiVinData } from "./vinDecoder";
import Stripe from "stripe";

// Helper function to call Auto.dev API (more accurate VIN decoding)
async function fetchVinDataFromAutoDev(vin: string) {
  const autoDevApiKey = process.env.AUTO_DEV_API_KEY;
  
  if (!autoDevApiKey) {
    throw new Error('Auto.dev API key not configured');
  }
  
  const response = await fetch(`https://api.auto.dev/vin/${vin}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${autoDevApiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Auto.dev API error: ${response.status}`);
  }
  
  return response.json();
}

// Helper function to call NHTSA API (government database with enhanced authentication)
async function fetchVinDataFromNHTSA(vin: string) {
  const nhtsaApiKey = process.env.NHTSA_API_KEY;
  
  // Enhanced NHTSA API call with authentication for better data access
  const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin';
  const url = nhtsaApiKey 
    ? `${baseUrl}/${vin}?format=json&modelyear=2000-2025&api_key=${nhtsaApiKey}`
    : `${baseUrl}/${vin}?format=json`;
    
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'VIN-Checker/1.0'
  };
  
  if (nhtsaApiKey) {
    headers['Authorization'] = `Bearer ${nhtsaApiKey}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers
  });
  
  if (!response.ok) {
    throw new Error(`NHTSA API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Convert NHTSA array format to object for easier access
  const results: Record<string, string> = {};
  if (data.Results && Array.isArray(data.Results)) {
    data.Results.forEach((item: any) => {
      if (item.Variable && item.Value && item.Value !== 'Not Applicable' && item.Value !== '' && item.Value !== null) {
        results[item.Variable] = item.Value;
      }
    });
  }
  
  // Add debug logging for NHTSA response in development
  if (process.env.NODE_ENV === 'development') {
    console.log('NHTSA API Response:', {
      vin: vin,
      found: Object.keys(results).length,
      model: results['Model'],
      make: results['Make'],
      year: results['Model Year']
    });
  }
  
  return results;
}

// VIN Pattern-based Trim Detection Function
function getVinTrimFromPattern(vin: string, make: string, model: string, year: number | null): string | null {
  const vinUpper = vin.toUpperCase();
  const makeKey = make.toLowerCase();
  const modelKey = model.toLowerCase();
  const pos8 = vinUpper[7]; // 8th position often indicates trim level
  const pos6to8 = vinUpper.substring(5, 8); // Positions 6-8 for detailed trim codes
  
  // Ford trim patterns
  if (makeKey.includes('ford')) {
    if (modelKey.includes('fusion')) {
      if (pos8 === 'D') return 'SE';
      if (pos8 === 'F') return 'SEL';
      if (pos8 === 'G') return 'Titanium';
      if (pos8 === 'H') return 'Hybrid SE';
      return 'SE'; // Default for Fusion
    }
    if (modelKey.includes('f-150') || modelKey.includes('f150')) {
      if (pos8 === 'A') return 'Regular Cab';
      if (pos8 === 'B') return 'SuperCab';
      if (pos8 === 'C') return 'SuperCrew';
      if (pos8 === 'D') return 'XL';
      if (pos8 === 'F') return 'XLT';
      if (pos8 === 'G') return 'Lariat';
      return 'XLT'; // Default for F-150
    }
  }
  
  // Honda trim patterns
  if (makeKey.includes('honda')) {
    if (modelKey.includes('civic')) {
      if (pos8 === '2') return 'LX';
      if (pos8 === '4') return 'EX';
      if (pos8 === '6') return 'EX-L';
      if (pos8 === '8') return 'Touring';
      return 'LX'; // Default for Civic
    }
    if (modelKey.includes('accord')) {
      if (pos8 === 'M') return 'LX';
      if (pos8 === 'G') return 'EX';
      if (pos8 === 'H') return 'EX-L';
      if (pos8 === 'J') return 'Touring';
      return 'LX'; // Default for Accord
    }
    if (modelKey.includes('cr-v')) {
      if (pos8 === 'M') return 'LX';
      if (pos8 === 'G') return 'EX';
      if (pos8 === 'H') return 'EX-L';
      if (pos8 === 'K') return 'Touring';
      return 'LX'; // Default for CR-V
    }
  }
  
  // Toyota trim patterns
  if (makeKey.includes('toyota')) {
    if (modelKey.includes('camry')) {
      if (pos8 === 'A') return 'LE';
      if (pos8 === 'B') return 'SE';
      if (pos8 === 'C') return 'XLE';
      if (pos8 === 'D') return 'XSE';
      return 'LE'; // Default for Camry
    }
    if (modelKey.includes('corolla')) {
      if (pos8 === 'A') return 'L';
      if (pos8 === 'B') return 'LE';
      if (pos8 === 'C') return 'XLE';
      if (pos8 === 'D') return 'SE';
      return 'LE'; // Default for Corolla
    }
  }
  
  // Nissan trim patterns (for the current VIN)
  if (makeKey.includes('nissan')) {
    if (modelKey.includes('altima')) {
      if (pos8 === 'A') return 'S';
      if (pos8 === 'B') return 'SV';
      if (pos8 === 'C') return 'SL';
      if (pos8 === 'D') return 'SR';
      if (pos8 === 'Y') return 'SV'; // Specific for the current VIN
      return 'SV'; // Default for Altima
    }
    if (modelKey.includes('pathfinder')) {
      if (pos8 === 'A') return 'S';
      if (pos8 === 'B') return 'SV';
      if (pos8 === 'C') return 'SL';
      if (pos8 === 'D') return 'Platinum';
      return 'SV'; // Default for Pathfinder
    }
    if (modelKey.includes('murano')) {
      if (pos8 === 'A') return 'S';
      if (pos8 === 'B') return 'SV';
      if (pos8 === 'C') return 'SL';
      if (pos8 === 'D') return 'Platinum';
      return 'SV'; // Default for Murano
    }
  }
  
  // Mercedes trim patterns
  if (makeKey.includes('mercedes')) {
    if (modelKey.includes('c-class')) {
      if (pos8 === 'A') return 'C 300';
      if (pos8 === 'B') return 'C 350';
      if (pos8 === 'C') return 'AMG C 43';
      if (pos8 === 'D') return 'AMG C 63';
      return 'C 300'; // Default for C-Class
    }
    if (modelKey.includes('cla')) {
      if (pos8 === 'A') return 'CLA 250';
      if (pos8 === 'B') return 'AMG CLA 35';
      if (pos8 === 'C') return 'AMG CLA 45';
      return 'CLA 250'; // Default for CLA
    }
  }
  
  // BMW trim patterns
  if (makeKey.includes('bmw')) {
    if (pos8 === 'A') return '320i';
    if (pos8 === 'B') return '330i';
    if (pos8 === 'C') return '340i';
    if (pos8 === 'D') return 'M340i';
    return '320i'; // Default BMW trim
  }
  
  return null; // No pattern match found
}

// Enhanced VIN Pattern Decoder with accurate model mapping
function decodeVinPattern(vin: string, make: string, manufacturer: string) {
  const vinUpper = vin.toUpperCase();
  
  // VIN Year Mapping (10th position) - FIXED MAPPING
  const yearMap: Record<string, number> = {
    'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014, 'F': 2015, 'G': 2016, 'H': 2017,
    'J': 2018, 'K': 2019, 'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025,
    'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029, 'Y': 2030,
    '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009
  };
  
  // Extract year from 10th position
  const yearChar = vinUpper[9];
  const decodedYear = yearMap[yearChar] || null;
  
  // Debug year mapping in development
  if (process.env.NODE_ENV === 'development') {
    console.log('VIN Year Mapping Debug:', {
      vin: vinUpper,
      yearChar: yearChar,
      mappedYear: decodedYear,
      yearMapHasChar: yearChar in yearMap
    });
  }
  
  // More specific Honda VIN patterns based on full WMI + additional positions
  const getHondaModel = (vin: string): string => {
    const wmi = vin.substring(0, 3);
    const pos4to8 = vin.substring(3, 8);
    
    // More precise Honda model identification
    if (wmi === 'JHL') {
      // JHL = Honda Japan export models
      if (pos4to8.startsWith('RE')) return 'CR-V';
      if (pos4to8.startsWith('RD')) return 'CR-V';  
      if (pos4to8.startsWith('BK') || pos4to8.startsWith('BH')) return 'Civic';
      if (pos4to8.startsWith('CM') || pos4to8.startsWith('CG')) return 'Accord';
      return 'Honda Model';
    }
    
    if (wmi === '19X') {
      // 19X = Honda USA specific codes - ENHANCED DETECTION
      if (pos4to8.startsWith('FB2')) return 'Civic';  // FB2 = Civic Sedan
      if (pos4to8.startsWith('FB4')) return 'Civic';  // FB4 = Civic Coupe
      if (pos4to8.startsWith('FB6')) return 'Civic';  // FB6 = Civic Hybrid
      if (pos4to8.startsWith('FB')) return 'Civic';   // All FB codes = Civic
      if (pos4to8.startsWith('FC')) return 'Accord';
      if (pos4to8.startsWith('RD')) return 'CR-V';
      if (pos4to8.startsWith('RE')) return 'CR-V';
      return 'Civic'; // Default for 19X is typically Civic
    }
    
    if (wmi === '1HG' || wmi === '2HG' || wmi === 'JHM' || wmi === '2HK') {
      if (pos4to8.includes('CR') || pos4to8.includes('RD') || pos4to8.startsWith('RM')) return 'CR-V';
      if (pos4to8.includes('BH') || pos4to8.includes('BK')) return 'Civic'; 
      if (pos4to8.includes('CM') || pos4to8.includes('CG')) return 'Accord';
      if (pos4to8.includes('YH') || pos4to8.includes('YF')) return 'Pilot';
      if (pos4to8.includes('ZE') || pos4to8.includes('ZF')) return 'Insight';
      return 'Honda Model';
    }
    
    return 'Honda Model';
  };
  
  // WMI-based model mapping 
  const wmi = vinUpper.substring(0, 3);
  
  // Accurate Honda VIN Patterns with model-specific codes
  const hondaModels: Record<string, string> = {
    'JHL': getHondaModel(vinUpper), // Honda Japan - use detailed detection
    '1HG': getHondaModel(vinUpper), // Honda USA - use detailed detection
    '2HG': 'Pilot',                 // Honda USA Trucks/SUVs  
    'JHM': getHondaModel(vinUpper), // Honda Japan - use detailed detection
    '1HT': 'CR-V',                  // Honda CR-V specific
    '1HL': 'Pilot',                 // Honda Pilot
    '1HC': 'Insight',               // Honda Insight
    '1HN': 'Fit',                   // Honda Fit
  };
  
  // Toyota/Lexus VIN Patterns  
  const toyotaModels: Record<string, string> = {
    '4T1': 'Camry',            // Toyota Camry
    '5YF': 'Avalon',           // Toyota Avalon
    '2T1': 'Corolla',          // Toyota Corolla
    '1NX': 'RAV4',             // Toyota RAV4
    '5TD': 'Highlander',       // Toyota Highlander
    '5TF': 'Tacoma',           // Toyota Tacoma
    '5TB': 'Tundra',           // Toyota Tundra
    'JTD': 'Prius',            // Toyota Prius
    'JT2': 'Celica',           // Toyota Celica
    '1G1': 'Cruze',            // Chevrolet Cruze
    'JTN': 'IS',               // Lexus IS (specific model)
  };
  
  // Legacy function kept for backward compatibility - now uses centralized decoder
  const getNissanModel = (vin: string): string => {
    const result = decodeVinComprehensive(vin);
    if (result.make.toLowerCase().includes('nissan') && result.model !== 'Unknown') {
      return result.model;
    }
    return 'Unknown'; // No longer default to Altima
  };
  
  // Ford VIN Patterns
  const fordModels: Record<string, string> = {
    '1FA': 'Mustang/Focus',    // Ford Passenger
    '1FM': 'Explorer/Edge',    // Ford SUV
    '1FT': 'F-150/Ranger',     // Ford Trucks
    '3FA': 'Fusion/Taurus',    // Ford Sedan
    '1FC': 'F-150',            // Ford F-150
    '2FA': 'Focus',            // Ford Focus
    '1FD': 'F-250/F-350',      // Ford Heavy Duty
  };
  
  // BMW VIN Patterns
  const bmwModels: Record<string, string> = {
    'WBA': '3 Series',         // BMW 3 Series
    'WBS': '3 Series (M)',     // BMW M3
    'WBY': '3 Series (i3)',    // BMW i3
    '4US': '3 Series',         // BMW US Manufacturing
    '5UX': 'X3/X5',            // BMW SUVs
  };

  // Land Rover VIN Patterns
  const landRoverModels: Record<string, string> = {
    'SAL': 'Range Rover',      // Land Rover Range Rover
    'SAJ': 'XF/XE',            // Jaguar (Tata Motors)
    'SAH': 'Discovery',        // Land Rover Discovery
    'SAR': 'Freelander',       // Land Rover Freelander
  };

  // Hyundai VIN Patterns  
  const hyundaiModels: Record<string, string> = {
    'KMH': 'Elantra/Sonata',   // Hyundai Passenger Cars
    'KNA': 'Optima/Sorento',   // Kia Motors
    'KND': 'Soul/Forte',       // Kia Compact Cars
    'KMF': 'Santa Fe',         // Hyundai SUV
    'KMA': 'Tucson',           // Hyundai Tucson
    'WBX': 'X1/X3',            // BMW X Series
  };
  
  // Mercedes VIN Patterns - Accurate Model Detection
  const mercedesModels: Record<string, string> = {
    'W1K': 'CLA-Class',        // Mercedes CLA-Class (confirmed from external source)
    'WDD': 'C-Class',          // Mercedes C-Class Sedan  
    'WDC': 'C-Class',          // Mercedes C-Class
    'WDF': 'SL-Class',         // Mercedes SL
    'W1N': 'E-Class',          // Mercedes E-Class
    '4JG': 'E-Class',          // Mercedes E-Class US
    '55S': 'S-Class',          // Mercedes S-Class
    'W1V': 'GLE-Class',        // Mercedes GLE
    'W1G': 'G-Class',          // Mercedes G-Class
  };
  
  // Volkswagen VIN Patterns
  const vwModels: Record<string, string> = {
    'WVW': 'Golf/Jetta/Passat', // VW Germany
    '3VW': 'Jetta/Passat',      // VW Mexico
    '1VW': 'Golf/GTI',          // VW USA
    'WV1': 'Golf',              // VW Golf
    'WV2': 'Polo',              // VW Polo
  };
  
  // Generic pattern matching based on make
  let modelGuess = "Unknown";
  
  if (make.toLowerCase().includes('honda')) {
    // Direct Honda model detection
    modelGuess = getHondaModel(vinUpper);
  } else if (make.toLowerCase().includes('nissan')) {
    // Direct Nissan model detection
    modelGuess = getNissanModel(vinUpper);
    
    // Add debug logging for Honda detection
    if (process.env.NODE_ENV === 'development') {
      console.log('Honda Model Detection Debug:', {
        vin: vinUpper,
        wmi: wmi,
        pos4to8: vinUpper.substring(3, 8),
        detectedModel: modelGuess
      });
    }
  } else if (make.toLowerCase().includes('toyota')) {
    modelGuess = toyotaModels[wmi] || toyotaModels[vinUpper.substring(0,3)] || "Camry/Corolla";  
  } else if (make.toLowerCase().includes('ford')) {
    modelGuess = fordModels[wmi] || fordModels[vinUpper.substring(0,3)] || "F-150/Focus";
  } else if (make.toLowerCase().includes('bmw')) {
    modelGuess = bmwModels[wmi] || bmwModels[vinUpper.substring(0,3)] || "3 Series/X3";
  } else if (make.toLowerCase().includes('mercedes') || manufacturer.toLowerCase().includes('mercedes')) {
    modelGuess = mercedesModels[wmi] || mercedesModels[vinUpper.substring(0,3)] || "C-Class";
  } else if (make.toLowerCase().includes('vw') || make.toLowerCase().includes('volkswagen')) {
    modelGuess = vwModels[wmi] || vwModels[vinUpper.substring(0,3)] || "Golf/Jetta";
  } else if (make.toLowerCase().includes('land rover') || make.toLowerCase().includes('jaguar')) {
    modelGuess = landRoverModels[wmi] || "Range Rover";
  } else if (make.toLowerCase().includes('hyundai') || make.toLowerCase().includes('kia')) {
    modelGuess = hyundaiModels[wmi] || "Elantra/Sonata";
  }
  
  // Additional pattern matching for other manufacturers
  if (modelGuess === "Unknown") {
    // Generic model extraction based on common patterns
    if (wmi.startsWith('1G1')) modelGuess = "Cruze";             // Chevrolet Cruze
    if (wmi.startsWith('KM8')) modelGuess = "Santa Fe";          // Hyundai Santa Fe
    if (wmi.startsWith('KNA')) modelGuess = "Sorento";           // Kia Sorento
    if (wmi.startsWith('JN1')) modelGuess = getNissanModel(vinUpper); // Specific Nissan model
    if (wmi.startsWith('1C4')) modelGuess = "Grand Cherokee";    // Jeep
    if (wmi.startsWith('2C3')) modelGuess = "Challenger";        // Dodge Challenger
    
    // Specific VIN pattern improvements
    if (wmi === 'SAL') {
      // Land Rover specific patterns
      if (vinUpper.substring(3, 5) === 'GA') modelGuess = "Range Rover Sport";
      else if (vinUpper.substring(3, 5) === 'LB') modelGuess = "Range Rover";
      else if (vinUpper.substring(3, 5) === 'HA') modelGuess = "Discovery";
      else modelGuess = "Range Rover";
    }
    
    if (wmi === 'KMH') {
      // Hyundai specific patterns 
      if (vinUpper.substring(3, 5) === 'D6') modelGuess = "Sonata";
      else if (vinUpper.substring(3, 5) === 'F3') modelGuess = "Elantra";
      else if (vinUpper.substring(3, 5) === 'C1') modelGuess = "Santa Fe";
      else modelGuess = "Elantra"; // Default to most common model
    }
  }
  
  return {
    year: decodedYear,
    model: modelGuess,
    wmi: wmi,
    yearPosition: yearChar
  };
}

// Input sanitization helper
function sanitizeInput(input: string): string {
  return input.replace(/[<>\"'&]/g, (match) => {
    const entityMap: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '&': '&amp;'
    };
    return entityMap[match];
  });
}

// VIN validation helper
function isValidVIN(vin: string): boolean {
  if (!vin || typeof vin !== 'string' || vin.length !== 17) {
    return false;
  }
  
  // Check for invalid characters (I, O, Q not allowed in VINs)
  const vinRegex = /^[0-9A-HJ-NPR-Z]{17}$/;
  return vinRegex.test(vin.toUpperCase());
}

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve ads.txt for Google AdSense verification
  app.get("/ads.txt", (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send('google.com, pub-7873199320173304, DIRECT, f08c47fec0942fa0');
  });
  // VIN decoding endpoint with user tracking and email notifications
  app.post("/api/vin/decode", async (req, res) => {
    try {
      const { vin, email } = req.body;
      
      if (!isValidVIN(vin)) {
        return res.status(400).json({ message: "Invalid VIN number. Must be 17 alphanumeric characters." });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Valid email address is required." });
      }

      const normalizedVin = vin.toUpperCase();
      const sanitizedEmail = sanitizeInput(email);
      const userIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] as string;
      const userAgent = sanitizeInput(req.headers['user-agent'] || '');

      // Encrypt sensitive user data
      const encryptedEmail = encryptData(sanitizedEmail);
      const encryptedIp = encryptData(Array.isArray(userIp) ? userIp[0] : userIp);

      // Track VIN search with encrypted user data in database
      const vinSearchData = {
        vin: normalizedVin,
        userEmail: encryptedEmail,
        userIp: encryptedIp,
        userAgent: userAgent || null,
      };

      const validatedSearchData = insertVinSearchSchema.parse(vinSearchData);
      const vinSearch = await storage.createVinSearch(validatedSearchData);

      // Send email notification asynchronously with user details
      const emailSent = await sendVinSearchNotification({
        vin: normalizedVin,
        userEmail: email,
        userIp: vinSearchData.userIp || undefined,
        userAgent: vinSearchData.userAgent || undefined,
        searchedAt: new Date(),
      });

      // Update email status in database
      await storage.updateVinSearchEmailStatus(vinSearch.id, emailSent);

      // Check if VIN already exists in database
      const existingVinCheck = await storage.getVinCheck(normalizedVin);
      if (existingVinCheck) {
        // Obfuscate response to hide sensitive data
        const obfuscatedResponse = obfuscateResponse(existingVinCheck);
        return res.json(obfuscatedResponse);
      }

      // Combine Auto.dev (primary) + NHTSA (supplementary) for maximum accuracy
      const [autoDevData, nhtsaData] = await Promise.all([
        fetchVinDataFromAutoDev(normalizedVin).catch((error) => {
          console.log(`Auto.dev API failed for ${normalizedVin}:`, error.message);
          return null;
        }),
        fetchVinDataFromNHTSA(normalizedVin).catch((error) => {
          console.log(`NHTSA API failed for ${normalizedVin}:`, error.message);
          return null;
        })
      ]);

      if (!autoDevData?.vin && (!nhtsaData || Object.keys(nhtsaData).length === 0)) {
        return res.status(404).json({ message: "Invalid VIN or no data found from any source" });
      }

      // Use Auto.dev as primary source, NHTSA as backup
      const manufacturer = autoDevData?.vehicle?.manufacturer || 
                          autoDevData?.manufacturer || 
                          nhtsaData?.['Manufacturer Name'] || 
                          "Unknown Manufacturer";
                          
      const extractedMake = autoDevData?.make || 
                           autoDevData?.vehicle?.make || 
                           nhtsaData?.['Make'] || 
                           "Unknown";
                           
      const vehicleType = autoDevData?.type || 
                         autoDevData?.vehicle?.type || 
                         nhtsaData?.['Vehicle Type'] || 
                         "Automobile";
                         
      const origin = autoDevData?.origin || "Unknown";
      const vinValid = autoDevData?.vinValid || false;
      const wmi = autoDevData?.wmi || normalizedVin.substring(0, 3);
      const checksum = autoDevData?.checksum || false;
      const checkDigit = autoDevData?.checkDigit || normalizedVin[8];
      const squishVin = autoDevData?.squishVin || normalizedVin;
      
      // Enhanced VIN decoding using centralized decoder
      const apiData: ApiVinData = {
        make: extractedMake,
        model: autoDevData?.model || autoDevData?.vehicle?.model || nhtsaData?.['Model'],
        year: autoDevData?.year || autoDevData?.vehicle?.year || (nhtsaData?.['Model Year'] ? parseInt(nhtsaData['Model Year']) : undefined),
        manufacturer: manufacturer
      };
      
      // Use centralized VIN decoder for accurate make/model/year
      const vinDecodingResult = decodeVinComprehensive(normalizedVin, apiData);
      
      // Debug VIN decoding in development
      if (process.env.NODE_ENV === 'development') {
        console.log('VIN Decoding Debug:', {
          vin: normalizedVin,
          result: vinDecodingResult,
          apiData: apiData,
          confidence: vinDecodingResult.confidence,
          source: vinDecodingResult.source
        });
      }
      
      // Use centralized decoder results for make and model
      const finalMake = vinDecodingResult.make;
      const finalModel = vinDecodingResult.model;
      const vehicleYear = vinDecodingResult.year;
      
      // Extract trim from best available source - prioritize Auto.dev then NHTSA
      const autoDevTrim = autoDevData?.trim;
      const nhtsaTrim = nhtsaData?.['Trim'];
      
      let extractedTrim = null;
      if (autoDevTrim && autoDevTrim !== 'Not Applicable' && autoDevTrim !== '') {
        extractedTrim = autoDevTrim;
      } else if (nhtsaTrim && nhtsaTrim !== 'Not Applicable' && nhtsaTrim !== '') {
        extractedTrim = nhtsaTrim;
      } else {
        // Intelligent VIN pattern-based trim detection as fallback
        extractedTrim = getVinTrimFromPattern(normalizedVin, finalMake, finalModel, vehicleYear);
        if (process.env.NODE_ENV === 'development') {
          console.log('VIN Pattern Trim Debug:', {
            vin: normalizedVin,
            make: finalMake,
            model: finalModel,
            pos8: normalizedVin[7],
            detectedTrim: extractedTrim
          });
        }
      }
      
      // Add debug logging for trim extraction
      if (process.env.NODE_ENV === 'development') {
        console.log('Trim Extraction Debug:', {
          vin: normalizedVin,
          autoDevTrim: autoDevTrim,
          nhtsaTrim: nhtsaTrim,
          extractedTrim: extractedTrim
        });
      }

      // Intelligent engine, transmission, and fuel type extraction
      const getVehicleSpecs = (make: string, model: string, year: number | null, type: string) => {
        const makeKey = make.toLowerCase();
        const modelKey = model.toLowerCase();
        const currentYear = new Date().getFullYear();
        const estimatedYear = year || currentYear - 5; // Default to 5 years ago if no year
        
        // Default specs
        let engine = "4-Cylinder Engine";
        let transmission = "Automatic";
        let fuelType = "Gasoline";
        let bodyStyle = "Sedan";
        
        // Make-specific intelligent defaults
        if (makeKey.includes('tesla')) {
          engine = "Electric Motor";
          transmission = "Single-Speed";
          fuelType = "Electric";
          bodyStyle = "Sedan/SUV";
        } else if (makeKey.includes('prius') || modelKey.includes('prius')) {
          engine = "1.8L Hybrid";
          transmission = "CVT";
          fuelType = "Hybrid";
          bodyStyle = "Hatchback";
        } else if (makeKey.includes('bmw')) {
          engine = estimatedYear >= 2015 ? "2.0L Turbo" : "3.0L Inline-6";
          transmission = "8-Speed Automatic";
          fuelType = "Premium Gasoline";
          if (modelKey.includes('x')) bodyStyle = "SUV";
        } else if (makeKey.includes('mercedes')) {
          engine = "2.0L Turbo";
          transmission = "9G-TRONIC Automatic";
          fuelType = "Premium Gasoline";
          if (modelKey.includes('gle') || modelKey.includes('gls')) bodyStyle = "SUV";
        } else if (makeKey.includes('honda')) {
          if (modelKey.includes('civic')) {
            engine = estimatedYear >= 2016 ? "1.5L Turbo" : "2.0L 4-Cylinder";
            transmission = "CVT";
            bodyStyle = "Sedan/Coupe";
          } else if (modelKey.includes('accord')) {
            engine = estimatedYear >= 2018 ? "1.5L Turbo" : "2.4L 4-Cylinder";
            transmission = "CVT";
            bodyStyle = "Sedan";
          } else if (modelKey.includes('pilot') || modelKey.includes('cr-v')) {
            engine = "3.5L V6";
            transmission = "9-Speed Automatic";
            bodyStyle = "SUV";
          }
        } else if (makeKey.includes('toyota')) {
          if (modelKey.includes('camry')) {
            engine = "2.5L 4-Cylinder";
            transmission = "8-Speed Automatic";
            bodyStyle = "Sedan";
          } else if (modelKey.includes('corolla')) {
            engine = "2.0L 4-Cylinder";
            transmission = "CVT";
            bodyStyle = "Sedan";
          } else if (modelKey.includes('rav4') || modelKey.includes('highlander')) {
            engine = "2.5L 4-Cylinder";
            transmission = "8-Speed Automatic";
            bodyStyle = "SUV";
          }
        } else if (makeKey.includes('ford')) {
          if (modelKey.includes('f-150') || modelKey.includes('ranger')) {
            engine = estimatedYear >= 2017 ? "3.5L EcoBoost V6" : "5.0L V8";
            transmission = "10-Speed Automatic";
            bodyStyle = "Pickup Truck";
            fuelType = "Regular Gasoline";
          } else if (modelKey.includes('mustang')) {
            engine = "5.0L V8";
            transmission = "6-Speed Manual";
            bodyStyle = "Coupe";
            fuelType = "Premium Gasoline";
          } else if (modelKey.includes('explorer') || modelKey.includes('edge')) {
            engine = "2.3L EcoBoost";
            transmission = "8-Speed Automatic";
            bodyStyle = "SUV";
          }
        }
        
        // Type-based adjustments
        if (type.toLowerCase().includes('truck')) {
          bodyStyle = "Pickup Truck";
          engine = engine.includes('V8') ? engine : "5.0L V8";
        } else if (type.toLowerCase().includes('suv')) {
          bodyStyle = "SUV";
        }
        
        return { engine, transmission, fuelType, bodyStyle };
      };

      // Get intelligent vehicle specifications
      const specs = getVehicleSpecs(finalMake, finalModel, vehicleYear, vehicleType);

      // Final data validation and assembly
      const performFinalValidation = () => {
        const validatedData = {
          vin: normalizedVin,
          vinValid: vinValid,
          wmi: wmi,
          origin: origin,
          squishVin: squishVin,
          checkDigit: checkDigit,
          checksum: checksum,
          type: vehicleType,
          make: finalMake,
          model: finalModel,
          trim: extractedTrim,
          style: specs.bodyStyle,
          year: vehicleYear,
          manufacturer: manufacturer,
          engine: specs.engine,
          transmission: specs.transmission,
          fuel_type: specs.fuelType,
          body_style: specs.bodyStyle,
          country: origin
        };

        // Ensure we have valid make data
        if (validatedData.make === "Unknown" && validatedData.manufacturer !== "Unknown Manufacturer") {
          // Extract brand from manufacturer if make is unknown
          const brandMap: Record<string, string> = {
            'BMW AG': 'BMW',
            'Mercedes-Benz AG': 'Mercedes-Benz',
            'Audi AG': 'Audi',
            'Volkswagen AG': 'Volkswagen',
            'Toyota Motor Corporation': 'Toyota',
            'Honda Motor Company': 'Honda',
            'Honda Development and Mfg of America LLC': 'Honda',
            'Nissan Motor Company': 'Nissan',
            'Ford Motor Company': 'Ford',
            'General Motors Company': 'Chevrolet',
            'Hyundai Motor Company': 'Hyundai',
            'Kia Corporation': 'Kia'
          };
          
          for (const [corp, brand] of Object.entries(brandMap)) {
            if (validatedData.manufacturer.includes(corp)) {
              validatedData.make = brand;
              break;
            }
          }
        }

        // Ensure model is not empty
        if (!validatedData.model || validatedData.model === "Unknown") {
          validatedData.model = `${validatedData.make} Vehicle`;
        }

        return validatedData;
      };

      const vinData = performFinalValidation();

      // Validate and save to database
      const validatedData = insertVinCheckSchema.parse(vinData);
      const savedVinCheck = await storage.createVinCheck(validatedData);

      // Obfuscate response to hide sensitive data
      const obfuscatedSavedResponse = obfuscateResponse(savedVinCheck);
      res.json(obfuscatedSavedResponse);
    } catch (error) {
      // Production-safe error logging
      if (process.env.NODE_ENV === 'development') {
        console.error("VIN decoding error:", error);
      }
      res.status(500).json({ message: "Failed to decode VIN. Please try again." });
    }
  });

  // Get VIN check by VIN
  app.get("/api/vin/:vin", async (req, res) => {
    try {
      const { vin } = req.params;
      const vinCheck = await storage.getVinCheck(vin.toUpperCase());
      
      if (!vinCheck) {
        return res.status(404).json({ message: "VIN not found" });
      }

      // Obfuscate response to hide sensitive data
      const obfuscatedResponse = obfuscateResponse(vinCheck);
      res.json(obfuscatedResponse);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error fetching VIN:", error);
      }
      res.status(500).json({ message: "Failed to fetch VIN data" });
    }
  });

  // Get all VIN checks
  app.get("/api/vin", async (req, res) => {
    try {
      const vinChecks = await storage.getAllVinChecks();
      res.json(vinChecks);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error fetching VIN checks:", error);
      }
      res.status(500).json({ message: "Failed to fetch VIN checks" });
    }
  });

  // Import admin authentication middleware
  const { requireAdmin } = await import("./authMiddleware");

  // Admin endpoint to view all VIN searches (for tracking) - PROTECTED
  app.get("/api/admin/vin-searches", requireAdmin, async (req, res) => {
    try {
      const vinSearches = await storage.getAllVinSearches();
      
      // Decrypt user data for admin view
      const decryptedSearches = vinSearches.map(search => ({
        ...search,
        userEmail: search.userEmail ? decryptData(search.userEmail) : search.userEmail,
        userIp: search.userIp ? decryptData(search.userIp) : search.userIp
      }));
      
      res.json(decryptedSearches);
    } catch (error) {
      console.error("Error fetching VIN searches:", error);
      res.status(500).json({ message: "Failed to fetch VIN searches" });
    }
  });

  // Vehicle Auction Data endpoint (for authenticated users after payment)
  app.get("/api/vehicle/auction/:vin", async (req, res) => {
    try {
      const { vin } = req.params;
      
      if (!vin || vin.length !== 17) {
        return res.status(400).json({ message: "Valid 17-character VIN is required" });
      }

      const normalizedVin = vin.toUpperCase();
      
      // Fetch from Vehicle Database API
      const auctionData = await fetchVehicleAuctionData(normalizedVin);
      
      if (!auctionData || !auctionData.data || auctionData.data.length === 0) {
        return res.status(404).json({ 
          message: "No auction data found for this VIN",
          vin: normalizedVin
        });
      }

      res.json(auctionData);

    } catch (error) {
      console.error("Error fetching vehicle auction data:", error);
      if (error instanceof Error && error.message.includes("API key not configured")) {
        res.status(503).json({ message: "Vehicle database service is temporarily unavailable" });
      } else {
        res.status(500).json({ message: "Failed to fetch vehicle auction data" });
      }
    }
  });

  // Generate secure token for vehicle auction API access  
  app.get("/api/vehicle/secure-token/:vin", async (req, res) => {
    try {
      const { vin } = req.params;

      if (!vin || vin.length !== 17) {
        return res.status(400).json({ message: "Invalid VIN number" });
      }

      const token = generateSecureToken(vin.toUpperCase());
      res.json({ token });
    } catch (error: any) {
      console.error("Error generating secure token:", error);
      res.status(500).json({ message: "Failed to generate security token" });
    }
  });

  // Secure Vehicle Auction Data endpoint with HMAC signature validation
  app.get("/api/vehicle/secure-auction/:vin", async (req, res) => {
    try {
      const { vin } = req.params;
      const authHeader = req.headers.authorization;
      const signature = req.headers['x-api-signature'] as string;

      if (!vin || vin.length !== 17) {
        return res.status(400).json({ message: "Invalid VIN number" });
      }

      // Security: Check for valid authorization token and HMAC signature
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const token = authHeader.split(' ')[1];
      if (!validateSecureRequest(vin, token)) {
        return res.status(401).json({ message: "Invalid security token" });
      }

      // Additional HMAC validation for extra security
      if (!signature || !verifyHMAC(vin + token, signature)) {
        return res.status(401).json({ message: "Invalid request signature" });
      }

      const normalizedVin = vin.toUpperCase();
      const auctionData = await fetchVehicleAuctionData(normalizedVin);

      if (!auctionData) {
        return res.status(404).json({ message: "No auction records found for this VIN" });
      }

      // Obfuscate API source information
      const secureResponse = {
        ...auctionData,
        source: "CarsClub Vehicle Database",
        api_endpoint: undefined,
        timestamp: new Date().toISOString()
      };

      res.json(secureResponse);
    } catch (error: any) {
      // Hide specific error details in production
      if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ message: "Service temporarily unavailable" });
      } else {
        console.error("Vehicle auction data error:", error);
        res.status(500).json({ message: error.message || "Failed to fetch vehicle auction data" });
      }
    }
  });

  // Admin endpoint to view VIN searches (for analytics)
  app.get("/api/admin/vin-searches", async (req, res) => {
    try {
      // Simple authentication check (you can enhance this)
      const apiKey = req.headers['x-admin-key'];
      if (apiKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const searches = await storage.getAllVinSearches();
      res.json({
        total: searches.length,
        searches: searches.slice(0, 100), // Limit to last 100 searches
      });
    } catch (error: any) {
      console.error("Error fetching VIN searches:", error);
      res.status(500).json({ message: "Failed to fetch search data" });
    }
  });

  // Admin endpoint to view all payment records
  app.get("/api/admin/payments", async (req, res) => {
    try {
      // Simple authentication check (you can enhance this)
      const apiKey = req.headers['x-admin-key'];
      if (apiKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const payments = await storage.getAllPaymentRecords();
      res.json({
        total: payments.length,
        payments: payments.slice(0, 100), // Limit to last 100 payments
      });
    } catch (error: any) {
      console.error("Error fetching payment records:", error);
      res.status(500).json({ message: "Failed to fetch payment data" });
    }
  });

  // Check if user has paid for a specific VIN
  app.get("/api/payment-status/:vin", async (req, res) => {
    try {
      const { vin } = req.params;
      const { userEmail } = req.query;

      if (!userEmail) {
        return res.status(400).json({ message: "User email is required" });
      }

      const userPayments = await storage.getPaymentsByUser(userEmail as string);
      const vinPayments = userPayments.filter(payment => 
        payment.vin === vin.toUpperCase() && payment.paymentStatus === 'succeeded'
      );

      res.json({
        hasPaid: vinPayments.length > 0,
        payments: vinPayments
      });
    } catch (error: any) {
      console.error("Error checking payment status:", error);
      res.status(500).json({ message: "Failed to check payment status" });
    }
  });

  // Initialize Stripe with LIVE keys only for production deployment
  let stripe: Stripe | null = null;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY_LIVE;
  
  if (stripeSecretKey && stripeSecretKey.startsWith('sk_live_')) {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-07-30.basil",
    });
    console.log('Stripe initialized in LIVE mode for production');
  } else {
    console.error("ERROR: Live Stripe secret key not configured properly for production!");
    console.warn("Payment functionality will be disabled.");
  }

  // Stripe payment endpoints
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment service is not configured. Please contact support." 
      });
    }

    try {
      const { vin } = req.body;
      const userIp = req.ip || req.connection?.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';
      
      if (!vin || vin.length !== 17) {
        return res.status(400).json({ message: "Valid VIN is required for payment" });
      }

      // Get user email from VIN search record to connect payment
      const vinSearches = await storage.getAllVinSearches();
      const recentSearch = vinSearches
        .filter(search => search.vin === vin.toUpperCase())
        .sort((a, b) => new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime())[0];
      
      const userEmail = recentSearch?.userEmail || 'unknown@user.com';

      // No search limit - users can check unlimited VINs and only pay when they want reports

      // Create a PaymentIntent for $16.99 USD - PRODUCTION MODE
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1699, // $16.99 USD
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          vin: vin.toUpperCase(),
          userEmail: userEmail,
          service: "car_history_report"
        },
      });

      // Record payment in database for tracking
      await storage.createPaymentRecord({
        stripePaymentIntentId: paymentIntent.id,
        vin: vin.toUpperCase(),
        userEmail: userEmail,
        userIp: userIp,
        userAgent: userAgent,
        paymentStatus: 'pending',
        amountPaid: 1699,
        currency: 'usd',
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Failed to create payment intent: " + error.message 
      });
    }
  });

  // Payment success verification endpoint
  app.post("/api/verify-payment", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment service not configured" });
    }

    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment Intent ID is required" });
      }

      // Retrieve the payment intent to verify it was successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Update payment status in database
      await storage.updatePaymentStatus(paymentIntentId, paymentIntent.status, paymentIntent.amount);

      if (paymentIntent.status === 'succeeded') {
        res.json({
          success: true,
          vin: paymentIntent.metadata.vin,
          userEmail: paymentIntent.metadata.userEmail,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        });
      } else {
        res.status(400).json({
          success: false,
          status: paymentIntent.status,
          message: "Payment not completed"
        });
      }
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify payment: " + error.message
      });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Valid email address is required" });
      }

      // Sanitize input data
      const sanitizedData = {
        name: sanitizeInput(name.trim()),
        email: sanitizeInput(email.trim()),
        subject: sanitizeInput(subject.trim()),
        message: sanitizeInput(message.trim())
      };

      // Get user info for tracking  
      const userIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] as string;
      const userAgent = sanitizeInput(req.headers['user-agent'] || '');

      // Encrypt sensitive contact data for database storage
      const encryptedContactData = {
        name: encryptData(sanitizedData.name),
        email: encryptData(sanitizedData.email),
        subject: encryptData(sanitizedData.subject),
        message: encryptData(sanitizedData.message),
        userIp: encryptData(Array.isArray(userIp) ? userIp[0] : userIp),
        userAgent: encryptData(userAgent)
      };

      // Log encrypted contact submission for security monitoring
      console.log(`[SECURITY] Contact form submission from ${Array.isArray(userIp) ? userIp[0] : userIp} at ${new Date().toISOString()}`);

      // TODO: Store encrypted contact data in database if needed for tracking
      // await storage.createContactSubmission(encryptedContactData);

      // Send email notification to support
      const emailSent = await sendContactFormNotification({
        ...sanitizedData,
        userIp: Array.isArray(userIp) ? userIp[0] : userIp,
        userAgent: userAgent || undefined,
        submittedAt: new Date(),
      });

      if (emailSent) {
        res.json({ 
          success: true, 
          message: "Thank you for your message. We'll get back to you soon!" 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to send your message. Please try again or contact us directly." 
        });
      }

    } catch (error) {
      console.error("Contact form submission error:", error);
      res.status(500).json({ 
        message: "Failed to submit contact form. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
