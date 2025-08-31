import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Global gtag function declaration
declare global {
  function gtag(...args: any[]): void;
}
import { Search, Info } from "lucide-react";

interface VinSearchSectionProps {
  onSearch: (vin: string, email: string) => void;
  isLoading: boolean;
}

export default function VinSearchSection({ onSearch, isLoading }: VinSearchSectionProps) {
    const [vin, setVin] = useState("");
    const [email, setEmail] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (vin.trim().length === 17 && email.trim().includes('@')) {
            // Track VIN search event in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'vin_search', {
                    'event_category': 'VIN Decoder',
                    'event_label': 'VIN Search Submitted'
                });
            }
            onSearch(vin.trim().toUpperCase(), email.trim());
        }
    };

    return (
        <div className="bg-white py-16 md:py-24" id="vin-search">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black" data-testid="text-search-title">
                        Enter Your VIN Number
                    </h2>
                    <p className="text-xl text-gray-700 font-bold mb-8" data-testid="text-search-description">
                        Simply enter your 17-character Vehicle Identification Number below to get started
                    </p>
                </div>

                <div className="bg-gray-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] transform rotate-[-0.5deg] mb-12">
                    <div className="transform rotate-[0.5deg]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-lg font-black uppercase mb-4 text-black">
                                    Your Email Address
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="text-lg md:text-2xl border-4 border-black h-14 md:h-16 bg-white focus:bg-yellow-50 shadow-[4px_4px_0px_0px_#000] focus:shadow-[6px_6px_0px_0px_#000] transition-all duration-150"
                                    required
                                    data-testid="input-email"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-black uppercase mb-4 text-black">
                                    VIN Number (17 characters)
                                </label>
                                <div className="relative">
                                    <Input
                                        value={vin}
                                        onChange={(e) => setVin(e.target.value.toUpperCase())}
                                        placeholder="1HGBH41JXMN109186"
                                        className="text-xl md:text-3xl font-mono uppercase border-4 border-black h-16 md:h-18 bg-white focus:bg-yellow-50 shadow-[4px_4px_0px_0px_#000] focus:shadow-[6px_6px_0px_0px_#000] transition-all duration-150 pr-20"
                                        maxLength={17}
                                        required
                                        data-testid="input-vin"
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <span className="text-sm font-bold bg-yellow-400 px-2 py-1 border-2 border-black" data-testid="text-vin-counter">
                                            {vin.length}/17
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <Button
                                type="submit"
                                disabled={vin.length !== 17 || !email.includes('@') || isLoading}
                                className="w-full h-16 text-xl font-black uppercase bg-blue-600 hover:bg-blue-700 text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                data-testid="button-decode-vin"
                            >
                                <Search className="w-6 h-6 mr-3" />
                                {isLoading ? "DECODING VIN..." : "GET VIN REPORT"}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="bg-blue-100 border-4 border-black p-6 shadow-[4px_4px_0px_0px_#000] transform rotate-[0.5deg]">
                    <div className="transform rotate-[-0.5deg] flex items-start gap-4">
                        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-black text-lg uppercase mb-2">Where to find your VIN?</h3>
                            <p className="font-bold text-gray-700">
                                Your VIN can be found on the driver's side dashboard (visible through the windshield), 
                                driver's side door jamb, vehicle registration, or insurance documents.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}