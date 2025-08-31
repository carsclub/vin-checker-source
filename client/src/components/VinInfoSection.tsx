import React from "react";
import { Car, FileText, Search, Wrench } from "lucide-react";

export default function VinInfoSection() {
    return (
        <div className="bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 text-black" data-testid="text-vin-info-title">
                            What is a
                            <span className="block text-red-500 transform rotate-[-1deg] -mt-2">
                                VIN Number?
                            </span>
                        </h2>
                        <div className="space-y-6">
                            <p className="text-lg text-gray-700 font-bold leading-relaxed" data-testid="text-vin-description-1">
                                A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every vehicle 
                                manufactured since 1981. Think of it as your vehicle's fingerprint - no two vehicles share the same VIN.
                            </p>
                            <p className="text-lg text-gray-700 font-bold leading-relaxed" data-testid="text-vin-description-2">
                                Each character in the VIN tells a story about your vehicle: the manufacturer, model year, 
                                engine type, assembly plant, and much more. Our VIN decoder breaks down this code to reveal 
                                comprehensive information about any vehicle.
                            </p>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-2xl font-black uppercase mb-4">VIN Breakdown:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] transform rotate-[-1deg]" data-testid="card-vin-part-1">
                                    <div className="transform rotate-[1deg] text-center">
                                        <span className="font-black text-2xl block">1-3</span>
                                        <span className="font-bold text-sm uppercase">World Manufacturer</span>
                                    </div>
                                </div>
                                <div className="bg-yellow-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] transform rotate-[1deg]" data-testid="card-vin-part-2">
                                    <div className="transform rotate-[-1deg] text-center">
                                        <span className="font-black text-2xl block">4-9</span>
                                        <span className="font-bold text-sm uppercase">Vehicle Descriptor</span>
                                    </div>
                                </div>
                                <div className="bg-green-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] transform rotate-[-1deg]" data-testid="card-vin-part-3">
                                    <div className="transform rotate-[1deg] text-center">
                                        <span className="font-black text-2xl block">10-17</span>
                                        <span className="font-bold text-sm uppercase">Vehicle Identifier</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - What You Get */}
                    <div>
                        <h3 className="text-3xl font-black uppercase mb-8 text-black" data-testid="text-what-you-get-title">
                            What You Get:
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-6 items-start" data-testid="feature-specifications">
                                <div className="w-12 h-12 bg-blue-500 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] flex-shrink-0">
                                    <Car className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xl uppercase mb-2">Vehicle Specifications</h4>
                                    <p className="text-gray-700 font-bold">
                                        Complete technical details including engine, transmission, body style, and more.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start" data-testid="feature-history">
                                <div className="w-12 h-12 bg-red-500 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] flex-shrink-0">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xl uppercase mb-2">Vehicle History</h4>
                                    <p className="text-gray-700 font-bold">
                                        Manufacturing details, recalls, and safety information from official databases.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start" data-testid="feature-market">
                                <div className="w-12 h-12 bg-green-500 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] flex-shrink-0">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xl uppercase mb-2">Market Information</h4>
                                    <p className="text-gray-700 font-bold">
                                        Current market value, pricing trends, and comparable vehicle data.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start" data-testid="feature-safety">
                                <div className="w-12 h-12 bg-purple-500 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] flex-shrink-0">
                                    <Wrench className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xl uppercase mb-2">Safety & Recalls</h4>
                                    <p className="text-gray-700 font-bold">
                                        Safety ratings, recall notices, and service bulletins for your vehicle.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}