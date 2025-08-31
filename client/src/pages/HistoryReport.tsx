import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Car, FileText, Shield, Calendar, Wrench, DollarSign, MapPin, Clock, ChevronLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VinResultsTable from "@/components/VinResultsTable";
import PaymentButton from "@/components/PaymentButton";
import GoogleAd from "@/components/GoogleAd";
import type { VinCheck } from "@shared/schema";

export default function HistoryReport() {
  const [vinInput, setVinInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [vinData, setVinData] = useState<VinCheck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const vinDecodeMutation = useMutation({
    mutationFn: async (data: { vin: string; email: string }) => {
      const response = await apiRequest("POST", "/api/vin/decode", data);
      return response.json();
    },
    onSuccess: (data: VinCheck) => {
      setVinData(data);
      setError(null);
    },
    onError: (error: Error) => {
      setError("Failed to decode VIN. Please check the VIN number and try again.");
      if (process.env.NODE_ENV === 'development') {
        console.error("VIN decoding error:", error);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vinInput.length === 17 && emailInput.includes('@')) {
      vinDecodeMutation.mutate({ 
        vin: vinInput.toUpperCase(), 
        email: emailInput.trim() 
      });
    } else {
      if (vinInput.length !== 17) {
        setError("Please enter a valid 17-character VIN number");
      } else if (!emailInput.includes('@')) {
        setError("Please enter a valid email address");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="mb-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] font-bold"
            data-testid="button-back-home"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to VIN Decoder
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 text-gray-900">
            Car History Report
            <span className="block text-blue-600 md:text-4xl text-[16px]">america, North America,  Canada, GCC</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">Searching for a reliable vehicle history reports? These reports offer crucial insights into a vehicle’s background, including auction history, sales records, theft incidents, salvage title brands, accident history, and much more.</p>
        </div>

        {/* VIN Input Section - Right under header */}
        <div className="mb-12">
          <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-yellow-400 rounded-t-2xl overflow-hidden">
            <CardHeader className="bg-yellow-400 border-b-4 border-black p-6">
              <CardTitle className="text-2xl font-black uppercase text-center flex items-center justify-center gap-3">
                <FileText className="w-8 h-8" />
                ENTER VIN FOR VEHICLE LOOKUP
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-gray-100 border-4 border-black mx-4 mb-4 shadow-[4px_4px_0px_0px_#000]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-black uppercase mb-2 text-gray-700">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-6 py-4 text-lg font-bold border-4 border-black shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[6px_6px_0px_0px_#000] transition-shadow"
                      required
                      data-testid="input-email-history"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-black uppercase mb-2 text-gray-700">
                        VIN Number (17 characters)
                      </label>
                      <input
                        type="text"
                        value={vinInput}
                        onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                        placeholder="Enter 17-character VIN (e.g., 1FMCU0G93GUB08696)"
                        className="w-full px-6 py-4 text-lg font-bold border-4 border-black shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:shadow-[6px_6px_0px_0px_#000] transition-shadow"
                        maxLength={17}
                        data-testid="input-vin-history"
                      />
                    </div>
                    <div className="md:self-end">
                      <button
                        type="submit"
                        disabled={vinDecodeMutation.isPending || vinInput.length !== 17 || !emailInput.includes('@')}
                        className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-black uppercase text-lg border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] disabled:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 rounded-xl"
                        data-testid="button-decode-vin"
                      >
                        {vinDecodeMutation.isPending ? "DECODING VIN..." : "DECODE VIN"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="mt-4 text-center">
                {vinInput.length > 0 && vinInput.length !== 17 && (
                  <p className="text-red-600 font-bold">
                    VIN must be exactly 17 characters ({vinInput.length}/17)
                  </p>
                )}
                {emailInput && !emailInput.includes('@') && (
                  <p className="text-red-600 font-bold">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-100 border-4 border-black text-red-800 font-bold shadow-[4px_4px_0px_0px_#000]">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* VIN Results */}
        {vinData && !vinDecodeMutation.isPending && (
          <div className="bg-gray-50 py-8 mb-12">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <VinResultsTable result={vinData} vin={vinInput} />
              {/* Payment Section */}
              <div className="mt-8 max-w-2xl mx-auto">
                <PaymentButton
                  vin={vinInput}
                  onPaymentSuccess={(vin) => {
                    setLocation(`/payment-success?vin=${vin}`);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {vinDecodeMutation.isPending && (
          <div className="bg-gray-50 py-16 mb-12">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <div className="bg-blue-500 border-4 border-black p-12 shadow-[12px_12px_0px_0px_#000] text-center transform rotate-[-1deg]">
                <div className="transform rotate-[1deg]">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-white font-black text-2xl uppercase">
                    DECODING VIN...
                  </p>
                  <p className="text-white font-bold mt-2">
                    FETCHING VEHICLE DATA
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Why Check Vehicle History Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-center mb-8 text-gray-900">
            Why check Vehicle History?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-blue-200">
              <CardHeader className="bg-blue-200 border-b-4 border-black p-4">
                <CardTitle className="text-xl font-black uppercase text-center">
                  For Buyers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <p className="text-gray-700 leading-relaxed">
                  Did you know that buyers who check a vehicle's history are 70% less likely 
                  to face major issues after purchase? A check helps to easily spot hidden 
                  accidents or title problems, view market value for better negotiations, and 
                  save money long-term.
                </p>
              </CardContent>
            </Card>

            <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-green-200">
              <CardHeader className="bg-green-200 border-b-4 border-black p-4">
                <CardTitle className="text-xl font-black uppercase text-center">
                  For Sellers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <p className="text-gray-700 leading-relaxed">
                  Sellers benefit, too. Cars with detailed checks and window stickers often sell 
                  15% higher and more quickly. When customers see detailed vehicle 
                  specifications, features, options, and packages on window stickers, they are 
                  less likely to contest pricing, which can result in quicker sales.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>



        {/* What our VIN History Reports include Section - Enhanced Design */}
        <div className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Enhanced Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black tracking-tight">
                What our VIN History
                <span className="block text-blue-600 mt-2">Reports Include?</span>
              </h2>
              <div className="w-24 h-2 bg-black mx-auto mb-6"></div>
              <p className="text-lg md:text-xl font-bold text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get comprehensive vehicle insights with our detailed history reports featuring
                critical data from multiple trusted sources.
              </p>
            </div>
          
            {/* Enhanced Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {/* Title Brand Check - Enhanced */}
              <div className="group">
                <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-white overflow-hidden hover:shadow-[16px_16px_0px_0px_#000] transform hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
                  <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 border-b-8 border-black">
                    <CardTitle className="text-xl font-black uppercase text-center flex items-center justify-center gap-4">
                      <div className="p-3 bg-white rounded-full border-4 border-black">
                        <Shield className="w-8 h-8 text-red-500" />
                      </div>
                      <span className="leading-tight">TITLE BRAND<br/>CHECK</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 bg-white">
                    <ul className="space-y-4">
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Lemon history verification</span>
                      </li>
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Flood damage indicators</span>
                      </li>
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200 delay-150">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Fire damage records</span>
                      </li>
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200 delay-200">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Salvage title status</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Car History - Enhanced */}
              <div className="group">
                <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-white overflow-hidden hover:shadow-[16px_16px_0px_0px_#000] transform hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 border-b-8 border-black">
                    <CardTitle className="text-xl font-black uppercase text-center flex items-center justify-center gap-4">
                      <div className="p-3 bg-white rounded-full border-4 border-black">
                        <Car className="w-8 h-8 text-blue-500" />
                      </div>
                      <span className="leading-tight">CAR<br/>HISTORY</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 bg-white">
                    <ul className="space-y-4">
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Accident reports & claims</span>
                      </li>
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Previous owners count</span>
                      </li>
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200 delay-150">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Live Pictures</span>
                      </li>
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200 delay-200">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Mileage verification</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Vehicle Records - Enhanced */}
              <div className="group">
                <Card className="border-8 border-black shadow-[12px_12px_0px_0px_#000] bg-white overflow-hidden hover:shadow-[16px_16px_0px_0px_#000] transform hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 border-b-8 border-black">
                    <CardTitle className="text-xl font-black uppercase text-center flex items-center justify-center gap-4">
                      <div className="p-3 bg-white rounded-full border-4 border-black">
                        <FileText className="w-8 h-8 text-green-500" />
                      </div>
                      <span className="leading-tight">VEHICLE<br/>RECORDS</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 bg-white">
                    <ul className="space-y-4">
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Auction sale records</span>
                      </li>
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Retail listing history</span>
                      </li>
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200 delay-150">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Price trend analysis</span>
                      </li>
                      <li className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-200 delay-200">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0 border-2 border-black"></div>
                        <span className="text-gray-700 font-medium">Market value estimates</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Info Banner */}
            <div className="mt-16 text-center">
              <div className="bg-yellow-400 text-black p-6 border-8 border-black shadow-[8px_8px_0px_0px_#000] transform rotate-[-1deg] inline-block max-w-2xl">
                <div className="transform rotate-[1deg]">
                  <p className="font-black uppercase text-lg md:text-xl leading-tight">
                    ✓ COMPREHENSIVE COVERAGE • ✓ INSTANT ACCESS • ✓ TRUSTED DATA SOURCES
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Our VIN Decoder - Clean Box Layout */}
        <div className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black">
                Why Choose Our
                <span className="block text-blue-600">Car Report?</span>
              </h2>
              <p className="text-lg md:text-xl font-bold text-gray-600 max-w-3xl mx-auto">
                Our comprehensive VIN decoder provides instant, accurate vehicle reports with
                reliability you can count on.
              </p>
            </div>

            {/* Clean Box Grid Layout - Thick Black Borders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Box 1: $20 ONLY */}
              <div className="bg-white rounded-2xl border-8 border-black p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase mb-2 text-black">$16.99 ONLY</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      No hidden fees, no subscriptions. Get comprehensive vehicle reports at a fair, transparent price.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 2: INSTANT RESULTS */}
              <div className="bg-white rounded-2xl border-8 border-black p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase mb-2 text-black">INSTANT RESULTS</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Get your complete vehicle report within seconds. No waiting, no delays.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 3: COMPREHENSIVE DATA */}
              <div className="bg-white rounded-2xl border-8 border-black p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase mb-2 text-black">COMPREHENSIVE DATA</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Access detailed information including specs, history, recalls, and market value.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 4: SECURE & PRIVATE */}
              <div className="bg-white rounded-2xl border-8 border-black p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-red-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase mb-2 text-black">SECURE & PRIVATE</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Your searches are completely private and secure. We don't store your personal data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 5: ACCURATE INFORMATION */}
              <div className="bg-white rounded-2xl border-8 border-black p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-yellow-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase mb-2 text-black">ACCURATE INFORMATION</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Regularly updated to keep results relevant and dependable.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 6: TRUSTED BY PROFESSIONALS */}
              <div className="bg-white rounded-2xl border-8 border-black p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                    <Car className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase mb-2 text-black">TRUSTED BY PROFESSIONALS</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Built with reliability and clarity for confident vehicle research.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black text-white py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-yellow-400 text-black p-6 border-4 border-white shadow-[6px_6px_0px_0px_#fff] transform rotate-[-1deg] inline-block">
              <div className="transform rotate-[1deg]">
                <p className="font-black uppercase text-lg">
                  FREE VIN DECODER • CAR HISTORY CHECK • DUBAI UAE
                </p>
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
      {/* Google Ad */}
      <GoogleAd />
    </div>
  );
}