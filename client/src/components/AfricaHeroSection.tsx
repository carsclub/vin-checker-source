import React from "react";
import { Shield, Clock, Award } from "lucide-react";

interface AfricaHeroSectionProps {
  onScrollToSearch: () => void;
}

export default function AfricaHeroSection({ onScrollToSearch }: AfricaHeroSectionProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
      {/* Background Pattern */}
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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Powered by badge */}
            <div className="mb-4">
              <a
                href="https://carsclub.ae/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-black bg-white px-3 py-2 border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:bg-yellow-200 transition-colors"
                aria-label="Visit carsclub.ae"
                data-testid="link-powered-by"
              >
                Powered by carsclub.ae
              </a>
            </div>

            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight" data-testid="text-hero-title">
              VIN Check in
              <span className="block text-yellow-400 transform rotate-[-1deg] -mt-2">
                Africa
              </span>
            </h1>
            
            <p className="md:text-2xl mb-8 font-normal text-[20px]" data-testid="text-hero-description">
              Get the best free car history check for European cars in Africa. Run a VIN check with detailed vehicle information, chassis number verification, and comprehensive accident history.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-yellow-400" />
                <span className="font-bold">100% Free Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                <span className="font-bold">Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                <span className="font-bold">Accurate Data</span>
              </div>
            </div>

            <button
              onClick={onScrollToSearch}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xl px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 uppercase"
              data-testid="button-decode-vin-hero"
            >
              Check VIN in Africa Now
            </button>
          </div>

          {/* Right Content - Africa Features Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* White - European Cars */}
            <div className="bg-white text-black p-6 border-4 border-black shadow-[4px_4px_0px_0px_#000] transform rotate-[-1deg]">
              <div className="transform rotate-[1deg]">
                <h3 className="font-black text-lg mb-2 uppercase">European Cars</h3>
                <p className="font-bold text-sm">Specialized checks for European vehicles in Africa</p>
              </div>
            </div>
            {/* Red - Theft Records */}
            <div className="bg-red-500 text-white p-6 border-4 border-black shadow-[4px_4px_0px_0px_#000] transform rotate-[1deg]">
              <div className="transform rotate-[-1deg]">
                <h3 className="font-black text-lg mb-2 uppercase">Theft Records</h3>
                <p className="font-bold text-sm">Cross-border theft and recovery database</p>
              </div>
            </div>
            {/* Yellow - Import History */}
            <div className="bg-yellow-400 text-black p-6 border-4 border-black shadow-[4px_4px_0px_0px_#000] transform rotate-[1deg]">
              <div className="transform rotate-[-1deg]">
                <h3 className="font-black text-lg mb-2 uppercase">Import History</h3>
                <p className="font-bold text-sm">Track vehicle imports and customs clearance</p>
              </div>
            </div>
            {/* Green - Accident Reports */}
            <div className="bg-green-400 text-black p-6 border-4 border-black shadow-[4px_4px_0px_0px_#000] transform rotate-[-1deg]">
              <div className="transform rotate-[1deg]">
                <h3 className="font-black text-lg mb-2 uppercase">Accident Reports</h3>
                <p className="font-bold text-sm">Comprehensive accident and damage history</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}