import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AfricaHeroSection from "@/components/AfricaHeroSection";
import VinSearchSection from "@/components/VinSearchSection";
import AfricaWhyChooseSection from "@/components/AfricaWhyChooseSection";
import AfricaVinInfoSection from "@/components/AfricaVinInfoSection";
import AfricaArticleSection from "@/components/AfricaArticleSection";
import VinResultsTable from "@/components/VinResultsTable";
import PaymentButton from "@/components/PaymentButton";
import GoogleAd from "@/components/GoogleAd";
import { Link, useLocation } from "wouter";
import { FileText } from "lucide-react";
import type { VinCheck } from "@shared/schema";

export default function VinCheckAfrica() {
    const [searchResult, setSearchResult] = useState<VinCheck | null>(null);
    const [currentVin, setCurrentVin] = useState("");
    const [error, setError] = useState<string | null>(null);
    const searchSectionRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const [, setLocation] = useLocation();

    // Set meta tags for SEO
    useEffect(() => {
        document.title = "Best Free Car History Check for European Cars in Africa | VIN & Chassis Lookup";
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Get the best free car history check for European cars in Africa. Run a VIN check free Europe, chassis number check online free, and even a free VIN check with pictures to uncover accident history, mileage, theft records, and more.');

        // Add Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        ogTitle.setAttribute('content', 'Best Free Car History Check for European Cars in Africa | VIN & Chassis Lookup');
        if (!document.querySelector('meta[property="og:title"]')) document.head.appendChild(ogTitle);

        const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        ogDescription.setAttribute('content', 'Get the best free car history check for European cars in Africa. Run a VIN check free Europe, chassis number check online free, and even a free VIN check with pictures to uncover accident history, mileage, theft records, and more.');
        if (!document.querySelector('meta[property="og:description"]')) document.head.appendChild(ogDescription);

        // Cleanup function to reset title when component unmounts
        return () => {
            document.title = "Free VIN Decoder & Car History Check - CarsHistoryCheck.com";
        };
    }, []);

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
        },
        onError: (error: Error) => {
            setError("Failed to decode VIN for African check. Please check the VIN number and try again.");
            if (process.env.NODE_ENV === 'development') {
                console.error("Africa VIN decoding error:", error);
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
            {/* Africa Hero Section */}
            <AfricaHeroSection onScrollToSearch={scrollToSearch} />

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
                                    CHECKING VIN FOR AFRICA...
                                </p>
                                <p className="text-white font-bold mt-2">
                                    FETCHING AFRICAN VEHICLE DATA
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Africa Why Choose Section */}
            <AfricaWhyChooseSection />

            {/* Africa VIN Info Section */}
            <AfricaVinInfoSection />

            {/* Africa Article Section */}
            <AfricaArticleSection />

            {/* Google Ad */}
            <GoogleAd />
            
        </div>
    );
}