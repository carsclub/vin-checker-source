import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Info, Car } from "lucide-react";

interface CarHistoryVinSearchProps {
  onSearch: (vin: string, email: string) => void;
  isLoading: boolean;
}

export default function CarHistoryVinSearch({ onSearch, isLoading }: CarHistoryVinSearchProps) {
    const [vin, setVin] = useState("");
    const [email, setEmail] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (vin.trim().length === 17 && email.trim().includes('@')) {
            onSearch(vin.trim().toUpperCase(), email.trim());
        }
    };

    return (
        <div className="bg-white py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <Car className="w-16 h-16 text-blue-600" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black" data-testid="text-car-history-title">
                        Get Detailed Car History
                    </h2>
                    <p className="text-xl text-gray-700 font-bold mb-8" data-testid="text-car-history-description">
                        Enter your VIN and email to access comprehensive auction history and vehicle reports
                    </p>
                </div>

                <div className="bg-yellow-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] transform rotate-[-0.5deg] mb-12">
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
                                    className="text-xl border-4 border-black h-14 bg-white focus:bg-yellow-50 shadow-[4px_4px_0px_0px_#000] focus:shadow-[6px_6px_0px_0px_#000] transition-all duration-150 w-full"
                                    required
                                    data-testid="input-history-email"
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
                                        className="text-2xl font-mono uppercase border-4 border-black h-16 bg-white focus:bg-yellow-50 shadow-[4px_4px_0px_0px_#000] focus:shadow-[6px_6px_0px_0px_#000] transition-all duration-150 pr-20 w-full"
                                        maxLength={17}
                                        required
                                        data-testid="input-history-vin"
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <span className="text-sm font-bold bg-yellow-400 px-2 py-1 border-2 border-black" data-testid="text-history-vin-counter">
                                            {vin.length}/17
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <Button
                                type="submit"
                                disabled={vin.length !== 17 || !email.includes('@') || isLoading}
                                className="w-full h-16 text-xl font-black uppercase bg-red-600 hover:bg-red-700 text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                data-testid="button-get-car-history"
                            >
                                <Search className="w-6 h-6 mr-3" />
                                {isLoading ? "GETTING HISTORY..." : "GET VIN REPORT"}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="bg-yellow-100 border-4 border-black p-6 shadow-[4px_4px_0px_0px_#000] transform rotate-[0.5deg]">
                    <div className="transform rotate-[-0.5deg] flex items-start gap-4">
                        <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-black text-lg uppercase mb-2 text-yellow-800">Complete Vehicle History Report</h3>
                            <p className="font-bold text-gray-700">
                                Get detailed auction records, damage history, market values, and comprehensive vehicle images. 
                                Our reports include real auction data from major US auction houses.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}