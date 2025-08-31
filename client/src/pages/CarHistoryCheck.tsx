import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Clock, Shield, AlertTriangle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import GoogleAd from "@/components/GoogleAd";
import { apiRequest } from "@/lib/queryClient";
import CarHistoryVinSearch from "@/components/CarHistoryVinSearch";
import VinResultsTable from "@/components/VinResultsTable";
import StripeCheckout from "@/components/StripeCheckout";
import type { VinCheck } from "@shared/schema";

export default function CarHistoryCheck() {
  const [, setLocation] = useLocation();
  const [isSearched, setIsSearched] = useState(false);
  const [vinData, setVinData] = useState<VinCheck | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const queryClient = useQueryClient();
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // VIN search mutation with email tracking
  const vinSearchMutation = useMutation({
    mutationFn: async (data: { vin: string; email: string }): Promise<VinCheck> => {
      const response = await apiRequest("POST", "/api/vin/decode", data);
      const result = await response.json();
      return result;
    },
    onSuccess: (data: VinCheck) => {
      setVinData(data);
      setIsSearched(true);
      setSearchEmail(searchEmail);
      
      // Scroll to results
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      queryClient.invalidateQueries({ queryKey: ['/api/vin'] });
    },
  });

  const handleVinSearch = (vin: string, email: string) => {
    setSearchEmail(email);
    vinSearchMutation.mutate({ vin, email });
  };

  const handleGetFullReport = () => {
    if (vinData) {
      setLocation(`/car-history-results?vin=${vinData.vin}&email=${searchEmail}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `repeating-linear-gradient(
                   45deg,
                   transparent,
                   transparent 50px,
                   rgba(255,255,255,0.1) 50px,
                   rgba(255,255,255,0.1) 52px
                 )`
               }}>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight" data-testid="text-hero-title">
              Car History Check
              <span className="block text-yellow-400 transform rotate-[-1deg] -mt-2">
                & Auction Reports
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 font-bold max-w-3xl mx-auto" data-testid="text-hero-description">
              Get comprehensive vehicle history reports including auction records, damage history, 
              market values, and detailed vehicle information.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-yellow-400 text-black px-6 py-3 border-4 border-black font-black text-lg uppercase shadow-[4px_4px_0px_0px_#000]">
                Real Auction Data
              </div>
              <div className="bg-green-400 text-black px-6 py-3 border-4 border-black font-black text-lg uppercase shadow-[4px_4px_0px_0px_#000]">
                $16.99 Full Reports
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIN Search Section */}
      <CarHistoryVinSearch 
        onSearch={handleVinSearch}
        isLoading={vinSearchMutation.isPending}
      />

      {/* Basic Results Section */}
      {isSearched && vinData && (
        <div ref={resultsSectionRef} className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black">
                Basic Vehicle Info
                <span className="block text-blue-600 transform rotate-[-0.5deg] -mt-2">
                  VIN: {vinData.vin}
                </span>
              </h2>
              <p className="text-xl text-gray-700 font-bold">
                Here's the basic information we found. Get the complete auction history below!
              </p>
            </div>

            {/* Basic VIN Results */}
            <div className="bg-blue-50 border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-12">
              <VinResultsTable result={vinData} vin={vinData.vin} />
            </div>

            {/* Upgrade to Full Report */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] text-center">
              <h3 className="text-3xl font-black uppercase mb-4 text-black">
                Get Complete Auction History
              </h3>
              <p className="text-lg font-bold text-gray-800 mb-6">
                Unlock detailed auction records, damage reports, market values, and vehicle images for just $16.99 USD
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl border-8 border-black p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-red-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase mb-2 text-black">TITLE BRAND CHECK</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Lemon history verification<br/>
                        Flood damage indicators<br/>
                        Fire damage records<br/>
                        Salvage title status
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border-8 border-black p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase mb-2 text-black">CAR HISTORY</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Accident reports & claims<br/>
                        Previous owners count<br/>
                        Service & maintenance records<br/>
                        Mileage verification
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border-8 border-black p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-green-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase mb-2 text-black">VEHICLE RECORDS</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Auction sale records<br/>
                        Retail listing history<br/>
                        Price trend analysis<br/>
                        Market value estimates
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGetFullReport}
                className="bg-red-600 hover:bg-red-700 text-white font-black text-xl px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 uppercase"
                data-testid="button-get-full-report"
              >
                Get Full Report - $16.99 USD
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Our Car History Check - Clean 6-Card Layout */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black">
              Why Choose Our
              <span className="block text-blue-600">Car History Check?</span>
            </h2>
            <p className="text-lg md:text-xl font-bold text-gray-600 max-w-3xl mx-auto">
              Our comprehensive car history service provides instant, accurate vehicle reports with
              reliability you can count on.
            </p>
          </div>

          {/* Clean Box Grid Layout - Thick Black Borders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Box 1: $20 Only */}
            <div className="bg-white rounded-2xl border-8 border-black p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-2 text-black">$16.99 ONLY</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    No hidden fees, no subscriptions. Get comprehensive vehicle history reports at a fair, transparent price.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Instant Results */}
            <div className="bg-white rounded-2xl border-8 border-black p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-2 text-black">INSTANT RESULTS</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Get your complete vehicle history report within seconds. No waiting, no delays.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 3: Comprehensive Data */}
            <div className="bg-white rounded-2xl border-8 border-black p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-purple-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-2 text-black">COMPREHENSIVE DATA</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Access detailed information including auction history, damage reports, recalls, and market value.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 4: Secure & Private */}
            <div className="bg-white rounded-2xl border-8 border-black p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-red-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-2 text-black">SECURE & PRIVATE</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Your searches are completely private and secure. We protect your personal data with enterprise-grade security.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 5: Accurate Information */}
            <div className="bg-white rounded-2xl border-8 border-black p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-yellow-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-2 text-black">ACCURATE INFORMATION</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Regularly updated database to keep results relevant, accurate, and dependable for confident decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 6: Trusted by Professionals */}
            <div className="bg-white rounded-2xl border-8 border-black p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-orange-500 rounded-lg border-4 border-black flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-2 text-black">TRUSTED BY PROFESSIONALS</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Built with reliability and clarity for confident vehicle research by dealers, buyers, and industry experts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">
            Start Your
            <span className="block text-yellow-400 transform rotate-[-1deg] -mt-2">
              Car History Check
            </span>
          </h2>
          <p className="text-xl font-bold mb-8">
            Enter your VIN above to get started with your comprehensive vehicle history report
          </p>
          <Link href="/">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xl px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 uppercase">
              Try VIN Decoder First
            </Button>
          </Link>
        </div>
      </div>

      {/* Google Ad */}
      <GoogleAd />
    </div>
  );
}