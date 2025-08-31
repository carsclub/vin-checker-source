import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Shield, FileText, Car, Clock, MapPin, DollarSign, Users, Wrench, AlertTriangle, CheckCircle, XCircle, Image as ImageIcon, Calendar, Gauge, Camera, Info, Zap, Download, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VinResultsTable from "@/components/VinResultsTable";
import type { VinCheck } from "@shared/schema";

interface AuctionData {
  status: string;
  vin: string;
  data: Array<{
    sale_index: string;
    price: string;
    "sale status": string;
    vname: string;
    "lot-number": string;
    "car-features": {
      Has_Keys: string;
      Runs_Drives: string;
      Engine_Starts: string;
    };
    "title-and-condition": {
      "Title Type": string;
      "Title Description": string;
      "Primary Damage": string;
      "Secondary Damage": string;
      VIN: string;
      Common: string;
    };
    "technical-specs": {
      Odometer: string;
      "Estimated Repair Cost": string;
      "Avg. Estimated Retail Value": string;
      "Damage Ratio": string;
      "Estimated Winning Bid": string;
      "Body Style": string;
      Color: string;
      "Engine Type": string;
      "Fuel Type": string;
      Cylinders: string;
      Transmission: string;
      Drive: string;
    };
    "sale-date-location": {
      "Seller Type": string;
      "Auction Date": string;
      "Auction Type": string;
      Location: string;
      "Buyer Country": string;
    };
    "listing-history": Record<string, string>;
    year: string;
    make: string;
    model: string;
    images: string[];
    "market-value": Record<string, any>;
    vin: string;
  }>;
}

export default function CarHistoryResults() {
  const [location, setLocation] = useLocation();
  const [vin, setVin] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isPaid, setIsPaid] = useState(false);
  const [vinData, setVinData] = useState<VinCheck | null>(null);

  // Fetch real auction data from secured Vehicle Database API endpoint
  const { data: auctionData, isLoading: isLoadingAuction, error: auctionError } = useQuery<AuctionData>({
    queryKey: ['/api/vehicle/auction', vin],
    enabled: !!vin && isPaid,
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    queryFn: async () => {
      try {
        // Generate secure token on client side for API access
        const tokenResponse = await fetch(`/api/vehicle/secure-token/${vin}`, {
          method: 'GET',
        });
        
        if (!tokenResponse.ok) {
          throw new Error(`Token generation failed: ${tokenResponse.statusText}`);
        }
        
        const tokenData = await tokenResponse.json();
        if (!tokenData.token) {
          throw new Error('No token received from server');
        }
        
        // Make secure request with authorization token
        const response = await fetch(`/api/vehicle/auction/${vin}`, {
          headers: {
            'Authorization': `Bearer ${tokenData.token}`,
          },
        });
        
        if (!response.ok) {
          // Handle 404 gracefully - no auction data is normal for many vehicles
          if (response.status === 404) {
            return { status: 'success', vin, data: [] };
          }
          throw new Error(`Failed to fetch auction data: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auction data fetch error:', error);
        }
        // Return empty data structure instead of throwing
        return { status: 'success', vin, data: [] };
      }
    },
  });

  // Helper functions for data formatting
  const formatPrice = (price: string): string => {
    const cleanPrice = price.replace(/[$,]/g, '');
    const usdAmount = parseInt(cleanPrice, 10);
    if (isNaN(usdAmount)) return price;
    const aedAmount = Math.round(usdAmount * 3.67);
    return `AED ${aedAmount.toLocaleString()}`;
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Create a print-friendly version and trigger browser's PDF download
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const imagesHtml = auctionData?.data?.[0]?.images ? 
        `<div class="section">
          <div class="section-header">Vehicle Photos</div>
          <div class="section-content">
            <div class="images">
              ${auctionData.data[0].images.slice(0, 6).map(img => `
                <img src="${img}" alt="Vehicle photo" class="image" />
              `).join('')}
            </div>
          </div>
        </div>` : '';

      printWindow.document.write(`
        <html>
          <head>
            <title>Vehicle History Report - ${vin}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; border: 3px solid #000; padding: 20px; background: #f8f9fa; }
              .section { margin-bottom: 20px; border: 2px solid #000; break-inside: avoid; }
              .section-header { background: #000; color: white; padding: 10px; font-weight: bold; font-size: 18px; }
              .section-content { padding: 15px; }
              .data-row { display: flex; justify-content: space-between; margin: 5px 0; padding: 8px; border: 1px solid #ddd; }
              .data-label { font-weight: bold; }
              .images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 15px 0; }
              .image { width: 100%; height: 150px; object-fit: cover; border: 2px solid #000; }
              .price-highlight { text-align: center; background: #e8f5e8; padding: 15px; border: 2px solid #4ade80; margin: 10px 0; }
              .price-usd { font-size: 28px; font-weight: bold; color: #059669; }
              .price-aed { font-size: 16px; color: #6b7280; margin-top: 5px; }
              @media print { 
                body { margin: 10px; font-size: 12px; } 
                .no-print { display: none; }
              }
              @page { margin: 0.5in; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Vehicle History Report</h1>
              <h2>VIN: ${vin}</h2>
              <p>Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            ${vinData ? `
              <div class="section">
                <div class="section-header">Basic Vehicle Information</div>
                <div class="section-content">
                  <div class="data-row"><span class="data-label">Year:</span> <span>${vinData.year || 'N/A'}</span></div>
                  <div class="data-row"><span class="data-label">Make:</span> <span>${vinData.make}</span></div>
                  <div class="data-row"><span class="data-label">Model:</span> <span>${vinData.model}</span></div>
                  <div class="data-row"><span class="data-label">Body Type:</span> <span>${vinData.body_style || 'N/A'}</span></div>
                  <div class="data-row"><span class="data-label">Engine:</span> <span>${vinData.engine || 'N/A'}</span></div>
                  <div class="data-row"><span class="data-label">Transmission:</span> <span>${vinData.transmission || 'N/A'}</span></div>
                  <div class="data-row"><span class="data-label">Fuel Type:</span> <span>${vinData.fuel_type || 'N/A'}</span></div>
                  <div class="data-row"><span class="data-label">Country:</span> <span>${vinData.country || 'N/A'}</span></div>
                </div>
              </div>
            ` : ''}
            ${imagesHtml}
            ${auctionData?.data?.map((record, index) => `
              <div class="section">
                <div class="section-header">Auction Record ${index + 1} - ${record.vname}</div>
                <div class="section-content">
                  <div class="price-highlight">
                    <div class="price-usd">${record.price}</div>
                    <div class="price-aed">${formatPrice(record.price)}</div>
                  </div>
                  <div class="data-row"><span class="data-label">Sale Status:</span> <span>${record["sale status"]}</span></div>
                  <div class="data-row"><span class="data-label">Auction Date:</span> <span>${formatDate(record["sale-date-location"]["Auction Date"])}</span></div>
                  <div class="data-row"><span class="data-label">Location:</span> <span>${record["sale-date-location"]["Location"]}</span></div>
                  <div class="data-row"><span class="data-label">Seller Type:</span> <span>${record["sale-date-location"]["Seller Type"]}</span></div>
                  <div class="data-row"><span class="data-label">Primary Damage:</span> <span>${record["title-and-condition"]["Primary Damage"]}</span></div>
                  <div class="data-row"><span class="data-label">Secondary Damage:</span> <span>${record["title-and-condition"]["Secondary Damage"]}</span></div>
                  <div class="data-row"><span class="data-label">Title Type:</span> <span>${record["title-and-condition"]["Title Type"]}</span></div>
                  <div class="data-row"><span class="data-label">Odometer:</span> <span>${record["technical-specs"]["Odometer"]}</span></div>
                  <div class="data-row"><span class="data-label">Estimated Repair Cost:</span> <span>${record["technical-specs"]["Estimated Repair Cost"]} (${formatPrice(record["technical-specs"]["Estimated Repair Cost"])})</span></div>
                  <div class="data-row"><span class="data-label">Body Style:</span> <span>${record["technical-specs"]["Body Style"]}</span></div>
                  <div class="data-row"><span class="data-label">Color:</span> <span>${record["technical-specs"]["Color"]}</span></div>
                  <div class="data-row"><span class="data-label">Engine Type:</span> <span>${record["technical-specs"]["Engine Type"]}</span></div>
                  <div class="data-row"><span class="data-label">Transmission:</span> <span>${record["technical-specs"]["Transmission"]}</span></div>
                </div>
              </div>
            `).join('') || '<div class="section"><div class="section-header">Auction Records</div><div class="section-content">No auction records found for this vehicle.</div></div>'}
            <div class="section">
              <div class="section-header">Report Information</div>
              <div class="section-content">
                <p>Data sourced from Vehicle Copart, Emirates Auction, Merhaba, IAAI, Auto Expert Bid</p>
                <p>Report generated on: ${new Date().toLocaleString()}</p>
                <p>© 2025 carsclub.ae - All rights reserved</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load then trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vinParam = urlParams.get('vin');
    const emailParam = urlParams.get('email');
    const paidParam = urlParams.get('paid');

    // Allow direct access with VIN and email (for car history check flow)
    // or with paid parameter (for checkout flow)
    if (!vinParam || (!emailParam && paidParam !== 'true')) {
      setLocation('/car-history-check');
      return;
    }

    setVin(vinParam);
    if (emailParam) setEmail(emailParam);
    if (paidParam === 'true') setIsPaid(true);

    // Fetch basic VIN data for display
    fetch(`/api/vin/${vinParam}`)
      .then(async res => {
        if (!res.ok) {
          throw new Error(`VIN fetch failed: ${res.statusText}`);
        }
        return await res.json();
      })
      .then(data => {
        if (data && data.vin) {
          setVinData(data);
        } else {
          throw new Error('Invalid VIN data received');
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('VIN data fetch error:', error);
        }
        // Set minimal VIN data if not found
        setVinData({
          id: 'protected',
          vin: vinParam,
          vinValid: null,
          wmi: null,
          origin: null,
          squishVin: null,
          checkDigit: null,
          checksum: null,
          type: null,
          make: 'Unknown',
          model: 'Unknown',
          trim: null,
          style: null,
          year: null,
          manufacturer: null,
          engine: 'Unknown',
          transmission: 'Unknown',
          fuel_type: 'Unknown',
          body_style: 'Unknown',
          country: 'Unknown',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
  }, [setLocation]);

  if (!isPaid || !vinData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center py-16">
          <div className="bg-red-500 border-8 border-black p-12 shadow-[12px_12px_0px_0px_#000]">
            <div>
              <h1 className="text-3xl font-black uppercase text-white mb-4">
                Access Denied
              </h1>
              <p className="text-white font-bold text-lg">
                This page requires payment verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const auctionRecord = auctionData?.data?.[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-green-500 border-8 border-black p-8 shadow-[16px_16px_0px_0px_#000] inline-block">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase text-white mb-4">
                Complete Car History Report
              </h1>
              <p className="text-white font-bold text-xl mb-4">
                VIN: {vin}
              </p>
              <div className="flex justify-center gap-4 mb-4">
                <Button 
                  onClick={handlePrint}
                  className="bg-blue-500 hover:bg-blue-600 text-white border-4 border-white shadow-[4px_4px_0px_0px_#fff] font-black uppercase"
                  data-testid="button-print-report"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print
                </Button>
                <Button 
                  onClick={handleDownloadPDF}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black border-4 border-white shadow-[4px_4px_0px_0px_#fff] font-black uppercase"
                  data-testid="button-download-pdf"
                >
                  <Download className="w-5 h-5 mr-2" />
                  PDF
                </Button>
              </div>
              <Badge className="bg-yellow-400 text-black font-black border-2 border-black text-lg px-4 py-2">
                ✓ PAID REPORT - FULL ACCESS
              </Badge>
            </div>
          </div>
        </div>

        {/* Basic VIN Information */}
        <div className="mb-12">
          <VinResultsTable result={vinData} vin={vin} />
        </div>

        {/* Loading State */}
        {isLoadingAuction && (
          <div className="mb-12">
            <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-gradient-to-r from-blue-500 to-purple-600">
              <CardHeader className="bg-yellow-400 text-black border-b-4 border-black">
                <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                  <Clock className="w-8 h-8 animate-spin" />
                  Loading Comprehensive Vehicle History...
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-white">
                <div className="text-center space-y-6">
                  <div className="animate-pulse">
                    <h3 className="text-xl font-black mb-4">🔍 Searching Multiple Databases</h3>
                    <div className="space-y-3 text-left max-w-md mx-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                        <span className="font-bold">Copart Auctions Database</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
                        <span className="font-bold">IAAI Auction Records</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-200"></div>
                        <span className="font-bold">Emirates Auction History</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                        <span className="font-bold">Merhaba Auto Records</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/20 p-4 border-4 border-white">
                    <p className="font-bold text-yellow-400">⏱️ This may take 15-30 seconds</p>
                    <p className="text-sm mt-2">We're searching comprehensive auction databases to provide you with the most detailed vehicle history available.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {auctionError && (
          <div className="text-center mb-12">
            <div className="bg-orange-400 border-8 border-black p-8 shadow-[12px_12px_0px_0px_#000] inline-block">
              <div>
                <AlertTriangle className="w-16 h-16 mx-auto text-black mb-4" />
                <h2 className="text-2xl font-black uppercase text-black mb-2">
                  No Auction Records Found
                </h2>
                <p className="text-black font-bold">
                  This vehicle has no recorded auction history in our database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Auction Data Display */}
        {auctionData && auctionRecord && (
          <>
            {/* Vehicle Photos */}
            {auctionRecord.images && auctionRecord.images.length > 0 && (
              <div className="mb-12">
                <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
                  <CardHeader className="bg-purple-600 text-white border-b-4 border-black">
                    <CardTitle className="text-3xl font-black uppercase flex items-center gap-3">
                      <Camera className="w-8 h-8" />
                      Auction Photos ({auctionRecord.images.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {auctionRecord.images.slice(0, 8).map((image, index) => (
                        <div key={index} className="border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                          <img
                            src={image}
                            alt={`Vehicle image ${index + 1}`}
                            className="w-full h-32 object-cover"
                            data-testid={`auction-image-${index}`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Auction Information Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Sale Information */}
              <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-white">
                <CardHeader className="bg-blue-600 text-white border-b-4 border-black">
                  <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                    <DollarSign className="w-8 h-8" />
                    Auction Sale Record
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-100 border-4 border-green-400">
                      <p className="text-sm font-bold text-gray-700 mb-1">Sale Price</p>
                      <p className="text-4xl font-black text-green-700">{auctionRecord.price}</p>
                      <p className="text-lg text-gray-600 font-bold">{formatPrice(auctionRecord.price)}</p>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">Sale Status:</span>
                      <Badge className={`font-black ${auctionRecord["sale status"] === 'Sold' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                        {auctionRecord["sale status"]}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">Vehicle:</span>
                      <span className="font-bold">{auctionRecord.vname}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">Lot Number:</span>
                      <span className="font-bold">{auctionRecord["lot-number"]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Title & Condition */}
              <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-white">
                <CardHeader className="bg-red-600 text-white border-b-4 border-black">
                  <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                    <Shield className="w-8 h-8" />
                    Title & Condition
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-red-100 border-4 border-red-400">
                      <span className="font-bold text-gray-700">Title Type:</span>
                      <Badge className={`font-black ${auctionRecord["title-and-condition"]["Title Type"] === 'Clean' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {auctionRecord["title-and-condition"]["Title Type"]}
                      </Badge>
                    </div>
                    {auctionRecord["title-and-condition"]["Primary Damage"] !== "N/A" && (
                      <div className="flex justify-between items-center p-4 bg-orange-100 border-2 border-orange-300">
                        <span className="font-bold text-gray-700">Primary Damage:</span>
                        <span className="font-bold text-red-600">{auctionRecord["title-and-condition"]["Primary Damage"]}</span>
                      </div>
                    )}
                    {auctionRecord["title-and-condition"]["Secondary Damage"] !== "N/A" && (
                      <div className="flex justify-between items-center p-4 bg-orange-100 border-2 border-orange-300">
                        <span className="font-bold text-gray-700">Secondary Damage:</span>
                        <span className="font-bold text-red-600">{auctionRecord["title-and-condition"]["Secondary Damage"]}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Features */}
              <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-white">
                <CardHeader className="bg-green-600 text-white border-b-4 border-black">
                  <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                    <Zap className="w-8 h-8" />
                    Vehicle Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">Has Keys:</span>
                      <Badge className={`font-black ${auctionRecord["car-features"]["Has_Keys"] === 'yes' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {auctionRecord["car-features"]["Has_Keys"] === 'yes' ? 'YES' : 'NO'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">Runs/Drives:</span>
                      <Badge className={`font-black ${auctionRecord["car-features"]["Runs_Drives"] === 'yes' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {auctionRecord["car-features"]["Runs_Drives"] === 'yes' ? 'YES' : 'NO'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">Engine Starts:</span>
                      <Badge className={`font-black ${auctionRecord["car-features"]["Engine_Starts"] === 'yes' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {auctionRecord["car-features"]["Engine_Starts"] === 'yes' ? 'YES' : 'NO'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Specifications */}
              <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-white">
                <CardHeader className="bg-indigo-600 text-white border-b-4 border-black">
                  <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                    <Gauge className="w-8 h-8" />
                    Technical Specs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-100 border-2 border-blue-300">
                      <span className="font-bold text-gray-700">Odometer:</span>
                      <span className="font-bold">{auctionRecord["technical-specs"]["Odometer"]}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">Body Style:</span>
                      <span className="font-bold">{auctionRecord["technical-specs"]["Body Style"]}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">Engine:</span>
                      <span className="font-bold">{auctionRecord["technical-specs"]["Engine Type"]} ({auctionRecord["technical-specs"]["Cylinders"]} cyl)</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">Transmission:</span>
                      <span className="font-bold">{auctionRecord["technical-specs"]["Transmission"]}</span>
                    </div>
                    {auctionRecord["technical-specs"]["Estimated Repair Cost"] !== "N/A" && (
                      <div className="flex justify-between items-center p-4 bg-red-100 border-2 border-red-300">
                        <span className="font-bold text-gray-700">Estimated Repair Cost:</span>
                        <span className="font-bold text-red-600">{formatPrice(auctionRecord["technical-specs"]["Estimated Repair Cost"])}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sale Location & Date */}
              <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-white lg:col-span-2">
                <CardHeader className="bg-yellow-500 text-black border-b-4 border-black">
                  <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                    <MapPin className="w-8 h-8" />
                    Auction Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-yellow-100 border-2 border-yellow-300">
                        <span className="font-bold text-gray-700">Auction Date:</span>
                        <span className="font-bold">{formatDate(auctionRecord["sale-date-location"]["Auction Date"])}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                        <span className="font-bold text-gray-700">Location:</span>
                        <span className="font-bold">{auctionRecord["sale-date-location"]["Location"]}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                        <span className="font-bold text-gray-700">Seller Type:</span>
                        <span className="font-bold">{auctionRecord["sale-date-location"]["Seller Type"]}</span>
                      </div>
                      {auctionRecord["sale-date-location"]["Buyer Country"] !== "N/A" && (
                        <div className="flex justify-between items-center p-4 bg-gray-100 border-2 border-gray-300">
                          <span className="font-bold text-gray-700">Buyer Country:</span>
                          <span className="font-bold">{auctionRecord["sale-date-location"]["Buyer Country"]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Listing History */}
            {Object.keys(auctionRecord["listing-history"]).length > 0 && (
              <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white mb-12">
                <CardHeader className="bg-gray-700 text-white border-b-4 border-black">
                  <CardTitle className="text-3xl font-black uppercase flex items-center gap-3">
                    <FileText className="w-8 h-8" />
                    Listing History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {Object.entries(auctionRecord["listing-history"]).map(([date, details], index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-100 border-4 border-gray-400">
                        <span className="font-bold text-gray-700">{formatDate(date)}:</span>
                        <Badge className="bg-blue-500 text-white font-black text-lg px-4 py-2">
                          {details}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Footer */}
        <div className="bg-black text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-yellow-400 text-black p-6 border-4 border-white shadow-[6px_6px_0px_0px_#fff] transform rotate-[-1deg] inline-block mb-8">
              <div className="transform rotate-[1deg]">
                <p className="font-black text-lg mb-2">Report Generated: {new Date().toLocaleDateString()}</p>
                <p className="font-bold">Data sourced from Vehicle Copart, Emirates Auction, Merhaba, IAAI, Auto Expert Bid</p>
              </div>
            </div>
            <div className="mt-8">
              <p className="font-bold text-gray-300">
                2025 all rights reserved by carsclub.ae • Email:{" "}
                <a
                  href="mailto:info@carshistorycheck.com"
                  className="underline text-white hover:text-yellow-400 border-4 border-white px-2 py-0.5 inline-block shadow-[4px_4px_0px_0px_#fff]"
                >
                  info@carshistorycheck.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}