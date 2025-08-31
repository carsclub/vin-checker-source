/**
 * Client-side VIN Decoder Utilities
 * 
 * This module provides client-side VIN validation and basic decoding
 * functionality that can be used across all frontend pages.
 */

export interface BasicVinInfo {
  year: number | null;
  make: string | null;
  wmi: string;
  isValid: boolean;
}

/**
 * Validates VIN format (17 characters, no I, O, Q)
 */
export function isValidVIN(vin: string): boolean {
  if (!vin || typeof vin !== 'string' || vin.length !== 17) {
    return false;
  }
  
  // Check for invalid characters (I, O, Q not allowed in VINs)
  const vinRegex = /^[0-9A-HJ-NPR-Z]{17}$/;
  return vinRegex.test(vin.toUpperCase());
}

/**
 * Extracts basic VIN information on the client side
 */
export function getBasicVinInfo(vin: string): BasicVinInfo {
  const vinUpper = vin.toUpperCase();
  const wmi = vinUpper.substring(0, 3);
  
  if (!isValidVIN(vin)) {
    return {
      year: null,
      make: null,
      wmi: '',
      isValid: false
    };
  }
  
  // Basic year calculation
  const yearChar = vinUpper[9];
  const yearMap: Record<string, number[]> = {
    'A': [1980, 2010], 'B': [1981, 2011], 'C': [1982, 2012], 'D': [1983, 2013],
    'E': [1984, 2014], 'F': [1985, 2015], 'G': [1986, 2016], 'H': [1987, 2017],
    'J': [1988, 2018], 'K': [1989, 2019], 'L': [1990, 2020], 'M': [1991, 2021],
    'N': [1992, 2022], 'P': [1993, 2023], 'R': [1994, 2024], 'S': [1995, 2025],
    'T': [1996, 2026], 'V': [1997, 2027], 'W': [1998, 2028], 'X': [1999, 2029],
    'Y': [2000, 2030], '1': [2001, 2031], '2': [2002, 2032], '3': [2003, 2033],
    '4': [2004, 2034], '5': [2005, 2035], '6': [2006, 2036], '7': [2007, 2037],
    '8': [2008, 2038], '9': [2009, 2039]
  };
  
  const years = yearMap[yearChar];
  const currentYear = new Date().getFullYear();
  const year = years ? (years[1] <= currentYear ? years[1] : years[0]) : null;
  
  // Basic make detection from WMI
  const wmiMakeMap: Record<string, string> = {
    'JN1': 'Nissan', 'JN8': 'Nissan', '1N4': 'Nissan', '1N6': 'Nissan',
    '1HG': 'Honda', '2HG': 'Honda', 'JHM': 'Honda',
    '4T1': 'Toyota', '2T1': 'Toyota', '1NX': 'Toyota', '5TD': 'Toyota', 'JTD': 'Toyota',
    '1FA': 'Ford', '1FM': 'Ford', '1FT': 'Ford', '3FA': 'Ford',
    'WBA': 'BMW', 'WBS': 'BMW', '4US': 'BMW', '5UX': 'BMW',
    'W1K': 'Mercedes-Benz', 'WDD': 'Mercedes-Benz', 'WDC': 'Mercedes-Benz',
    '1G1': 'Chevrolet', '1G6': 'Cadillac', '1GC': 'Chevrolet',
    'KMH': 'Hyundai', 'KNA': 'Kia', 'KND': 'Kia',
    'WVW': 'Volkswagen', '3VW': 'Volkswagen', '1VW': 'Volkswagen',
    'SAL': 'Land Rover', 'SAJ': 'Jaguar', 'SAH': 'Land Rover'
  };
  
  const make = wmiMakeMap[wmi] || null;
  
  return {
    year,
    make,
    wmi,
    isValid: true
  };
}

/**
 * Formats VIN for display (adds spaces for readability)
 */
export function formatVinDisplay(vin: string): string {
  if (!vin || vin.length !== 17) return vin;
  
  // Format as: WMI-VDS-VIS (3-6-8 pattern)
  return `${vin.substring(0, 3)}-${vin.substring(3, 9)}-${vin.substring(9, 17)}`;
}

/**
 * Gets human-readable error message for invalid VIN
 */
export function getVinErrorMessage(vin: string): string | null {
  if (!vin) return "VIN is required";
  if (vin.length !== 17) return "VIN must be exactly 17 characters";
  if (!/^[0-9A-HJ-NPR-Z]+$/i.test(vin)) return "VIN contains invalid characters (I, O, Q not allowed)";
  return null;
}