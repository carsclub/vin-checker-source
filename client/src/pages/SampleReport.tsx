import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Download, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import GoogleAd from "@/components/GoogleAd";

// McLaren 650S auction photos (AVIF format for better performance)
const mclarenPhoto1 = "/assets/2016-Mclaren-650S-SBM11FAA8GW006073-1_1755951776247.avif";
const mclarenPhoto2 = "/assets/2016-Mclaren-650S-SBM11FAA8GW006073-2_1755951776248.avif";
const mclarenPhoto3 = "/assets/2016-Mclaren-650S-SBM11FAA8GW006073-3_1755951776249.avif";
const mclarenPhoto4 = "/assets/2016-Mclaren-650S-SBM11FAA8GW006073-4_1755951776250.avif";
const mclarenPhoto5 = "/assets/2016-Mclaren-650S-SBM11FAA8GW006073-5_1755951776251.avif";
const mclarenPhoto6 = "/assets/2016-Mclaren-650S-SBM11FAA8GW006073-6_1755951776252.avif";
const mclarenPhoto7 = "/assets/2016-Mclaren-650S-SBM11FAA8GW006073-7_1755951776252.avif";
const mclarenPhoto12 = "/assets/2016-Mclaren-650S-SBM11FAA8GW006073-12_1755951776253.avif";

export default function SampleReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-8">
          <div className="text-center mb-6">
            <h1 className="md:text-5xl font-black uppercase text-black text-[34px]">
              Sample VIN History Report
            </h1>
          </div>
          
          <p className="text-lg md:text-xl font-bold text-gray-700 max-w-3xl mx-auto">
            Complete Vehicle History Analysis - powered by authentic auction data
          </p>

          {/* VIN Display Section */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 border-8 border-black shadow-[16px_16px_0px_0px_#000] p-6 max-w-4xl mx-auto">
            <div className="bg-black text-white p-6 border-4 border-yellow-400">
              <div className="text-center space-y-2">
                <p className="text-lg font-bold uppercase">VIN: <span className="text-blue-300">SBM11FAA8GW006073</span></p>
                <h2 className="text-3xl md:text-4xl font-black uppercase text-yellow-400">2016 Mclaren 650S, Spider</h2>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-lg px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200">
              <FileText className="mr-2 h-6 w-6" />
              Print Report
            </Button>
            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 hover:bg-green-700 text-white font-black px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200 bg-[#158840] text-[16px]">
              <Download className="mr-2 h-6 w-6" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Authentic Auction Photos Section */}
        <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
          <CardHeader className="flex flex-col space-y-1.5 p-6 border-b-4 border-black bg-[#facc15] text-[#000000]">
            <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">📷 AUCTION History PHOTOS (8)</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { src: mclarenPhoto1, alt: "McLaren 650S Front View with Damage" },
                { src: mclarenPhoto2, alt: "McLaren 650S Side View in Auction Lot" },
                { src: mclarenPhoto3, alt: "McLaren 650S Rear Three-Quarter View" },
                { src: mclarenPhoto4, alt: "McLaren 650S Rear View at Copart" },
                { src: mclarenPhoto5, alt: "McLaren 650S Front Damage Detail" },
                { src: mclarenPhoto6, alt: "McLaren 650S Rear End View" },
                { src: mclarenPhoto7, alt: "McLaren 650S Interior Dashboard" },
                { src: mclarenPhoto12, alt: "McLaren 650S Damaged Parts Layout" }
              ].map((photo, i) => (
                <div key={i} className="aspect-square border-4 border-black rounded-lg overflow-hidden group cursor-pointer hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-200">
                  <img 
                    src={photo.src} 
                    alt={photo.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
            <div className="bg-yellow-100 border-4 border-yellow-400 p-4">
              <p className="text-center font-bold text-black">
                📸 High-Resolution Images from Live Auction Database<br />
                <span className="text-sm">All images sourced directly from IAAI, Copart, Emirates Auction, Bidcars and other authentic Sources </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Auction Sale Record & Title Condition */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Auction Sale Record */}
          <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
            <CardHeader className="bg-blue-600 text-white border-b-4 border-black">
              <CardTitle className="text-2xl font-black uppercase">
                💲 AUCTION SALE RECORD
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-green-100 border-4 border-green-400 p-6 text-center">
                <div className="text-3xl font-black text-green-600">$92,521</div>
                <div className="text-lg font-bold text-gray-600">AED 339,552</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 border-2 border-gray-300 p-4">
                  <div className="text-sm font-bold text-gray-600">Sale Status</div>
                  <div className="bg-orange-500 text-white px-3 py-1 rounded font-bold text-sm mt-1 inline-block">
                    Active
                  </div>
                </div>
                <div className="bg-gray-100 border-2 border-gray-300 p-4">
                  <div className="text-sm font-bold text-gray-600">Lot Number</div>
                  <div className="font-black text-lg">61343515</div>
                </div>
              </div>

              <div className="bg-blue-100 border-4 border-blue-400 p-4 text-center">
                <div className="text-sm font-bold text-gray-600 mb-1">Estimated Retail Value</div>
                <div className="text-2xl font-black text-blue-600">$160,754</div>
                <div className="text-lg font-bold text-gray-600">AED 589,967</div>
              </div>
            </CardContent>
          </Card>

          {/* Title & Condition */}
          <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
            <CardHeader className="bg-red-600 text-white border-b-4 border-black">
              <CardTitle className="text-2xl font-black uppercase">
                ⚪ TITLE & CONDITION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-yellow-100 border-4 border-yellow-400 p-4">
                <div className="text-sm font-bold text-gray-600 mb-2">Title Type</div>
                <div className="bg-orange-500 text-white px-4 py-2 rounded font-black text-center">SALVAGE</div>
              </div>

              <div className="space-y-3">
                <div className="bg-orange-100 border-2 border-orange-300 p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Primary Damage:</span>
                    <span className="font-black text-red-600">Front End</span>
                  </div>
                </div>
                
                <div className="bg-orange-100 border-2 border-orange-300 p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Secondary Damage:</span>
                    <span className="font-black text-red-600">Rear End</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Specifications */}
        <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
          <CardHeader className="border-b-4 border-black bg-[#facc15] text-[#000000]">
            <CardTitle className="text-2xl font-black uppercase">
              ⚙️ TECHNICAL SPECIFICATIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Engine & Performance */}
              <div>
                <h4 className="text-lg font-black text-green-600 mb-4 border-b-2 border-green-200 pb-2">
                  Engine & Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Engine:</span>
                    <span>3.8L 8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Cylinders:</span>
                    <span>8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Fuel Type:</span>
                    <span>Gas</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div>
                <h4 className="text-lg font-black text-green-600 mb-4 border-b-2 border-green-200 pb-2">
                  Vehicle Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Body Style:</span>
                    <span>Convertible</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Color:</span>
                    <span>Yellow</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Transmission:</span>
                    <span>Automatic</span>
                  </div>
                </div>
              </div>

              {/* Condition & Value */}
              <div>
                <h4 className="text-lg font-black text-green-600 mb-4 border-b-2 border-green-200 pb-2">
                  Condition & Value
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Odometer:</span>
                    <span>41,165 mi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Repair Cost:</span>
                    <span>$61,909</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Drive Type:</span>
                    <span>Rear Wheel Drive</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Features & Condition */}
        <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
          <CardHeader className="flex flex-col space-y-1.5 p-6 border-b-4 border-black bg-[#facc15] text-[#000000]">
            <CardTitle className="text-2xl font-black uppercase">
              ✅ VEHICLE FEATURES & CONDITION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-100 border-4 border-green-300 p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <div className="font-black text-lg">Has Keys</div>
                <div className="text-2xl font-black text-green-600">YES</div>
              </div>
              
              <div className="bg-green-100 border-4 border-green-300 p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <div className="font-black text-lg">Runs & Drives</div>
                <div className="text-2xl font-black text-green-600">YES</div>
              </div>
              
              <div className="bg-gray-100 border-4 border-gray-300 p-6 text-center">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <div className="font-black text-lg">Engine Starts</div>
                <div className="text-2xl font-black text-gray-600">UNKNOWN</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auction Details */}
        <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
          <CardHeader className="bg-orange-600 text-white border-b-4 border-black">
            <CardTitle className="text-2xl font-black uppercase">
              📍 AUCTION DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-100 border-4 border-blue-300 p-6">
                <h4 className="text-lg font-black text-blue-600 mb-4 flex items-center gap-2">
                  📍 Location Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Location:</span>
                    <span>Bridgeton (MO)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Auction Date:</span>
                    <span>August 1, 2025</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-100 border-4 border-purple-300 p-6">
                <h4 className="text-lg font-black text-purple-600 mb-4 flex items-center gap-2">
                  📊 Market Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Current Status:</span>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold text-sm">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Market Trend:</span>
                    <span className="bg-blue-500 text-white px-2 py-1 rounded font-bold text-sm">Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Powered By Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 border-8 border-black shadow-[16px_16px_0px_0px_#000] p-8">
          <div className="bg-black text-white p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-black uppercase text-yellow-400">
                POWERED BY AUTHENTIC DATA
              </h3>
            </div>
            <p className="text-lg font-bold mb-6">
              This report demonstrates live auction data using Copart, IAAI, Bidcars, Emirates Auction & Europe databases
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-yellow-400 text-black p-4 font-black text-center border-2 border-yellow-300">
                🏆 Real Auction Photos
              </div>
              <div className="bg-yellow-400 text-black p-4 font-black text-center border-2 border-yellow-300">
                📋 Authentic Vehicle Data
              </div>
              <div className="bg-yellow-400 text-black p-4 font-black text-center border-2 border-yellow-300">
                🛡️ Verified Information
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 pt-8">
          <h3 className="text-3xl font-black text-black">
            Get Your Own Complete VIN History Report
          </h3>
          <p className="text-lg font-bold text-gray-700 max-w-2xl mx-auto">
            Access real auction data, detailed damage reports, and comprehensive vehicle history for any VIN - just like this sample report.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-black text-xl px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200">
                <Car className="mr-2 h-6 w-6" />
                Check Your VIN Now
              </Button>
            </Link>
            
            <Link href="/history-report">
              <Button variant="outline" className="bg-white hover:bg-blue-50 text-black font-black text-xl px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200">
                <FileText className="mr-2 h-6 w-6" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Google Ad */}
      <GoogleAd />
    </div>
  );
}