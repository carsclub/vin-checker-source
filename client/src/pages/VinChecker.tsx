import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import HeroSection from "@/components/HeroSection";
import VinSearchSection from "@/components/VinSearchSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import VinInfoSection from "@/components/VinInfoSection";
import MainPageGuideSection from "@/components/MainPageGuideSection";
import VinResultsTable from "@/components/VinResultsTable";
import PaymentButton from "@/components/PaymentButton";
import GoogleAd from "@/components/GoogleAd";
import { Link, useLocation } from "wouter";
import { FileText } from "lucide-react";
import type { VinCheck } from "@shared/schema";

// Global gtag function declaration
declare global {
  function gtag(...args: any[]): void;
}

export default function VinChecker() {
    const [searchResult, setSearchResult] = useState<VinCheck | null>(null);
    const [currentVin, setCurrentVin] = useState("");
    const [error, setError] = useState<string | null>(null);
    const searchSectionRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const [, setLocation] = useLocation();

    const scrollToSearch = () => {
        searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const vinDecodeMutation = useMutation({
        mutationFn: async ({ vin, email }: { vin: string; email: string }) => {
            const response = await apiRequest("POST", "/api/vin/decode", { vin, email });
            return response.json();
        },
        onSuccess: (data: VinCheck) => {
            setSearchResult(data);
            setError(null);
            queryClient.invalidateQueries({ queryKey: ['/api/vin'] });
            
            // Track successful VIN decode in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'vin_decode_success', {
                    'event_category': 'VIN Decoder',
                    'event_label': `${data.make} ${data.model}`,
                    'custom_parameters': {
                        'vin_year': data.year,
                        'vehicle_make': data.make,
                        'vehicle_model': data.model
                    }
                });
            }
        },
        onError: (error: Error) => {
            setError("Failed to decode VIN. Please check the VIN number and try again.");
            if (process.env.NODE_ENV === 'development') {
                console.error("VIN decoding error:", error);
            }
        }
    });

    const handleVinSearch = async (vin: string, email: string) => {
        setCurrentVin(vin);
        setError(null);
        vinDecodeMutation.mutate({ vin, email });
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <HeroSection onScrollToSearch={scrollToSearch} />

            {/* VIN Search Section */}
            <div ref={searchSectionRef}>
                <VinSearchSection onSearch={handleVinSearch} isLoading={vinDecodeMutation.isPending} />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] mb-8 transform rotate-[-0.5deg] max-w-4xl mx-auto">
                    <div className="transform rotate-[0.5deg]">
                        <p className="text-white font-black text-xl uppercase text-center">
                            ❌ ERROR: {error}
                        </p>
                    </div>
                </div>
            )}

            {/* Results */}
            {searchResult && !vinDecodeMutation.isPending && (
                <div className="bg-gray-50 py-16">
                    <div className="max-w-6xl mx-auto px-4 md:px-8">
                        <VinResultsTable result={searchResult} vin={currentVin} />
                        {/* Payment Section */}
                        <div className="mt-8 max-w-2xl mx-auto">
                            <PaymentButton
                                vin={currentVin}
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
                <div className="bg-gray-50 py-16">
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

            {/* Why Choose Section */}
            <WhyChooseSection />

            {/* VIN Info Section */}
            <VinInfoSection />

            {/* Main Page Guide Section */}
            <MainPageGuideSection />

            {/* Google Ad */}
            <GoogleAd />
            
        </div>
    );
}
