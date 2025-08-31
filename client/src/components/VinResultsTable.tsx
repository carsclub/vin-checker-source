import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { VinCheck } from "@shared/schema";

interface VinResultsTableProps {
  result: VinCheck;
  vin: string;
}

export default function VinResultsTable({ result, vin }: VinResultsTableProps) {
    return (
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] transform rotate-[0.5deg]" data-testid="table-vin-results">
            <div className="transform rotate-[-0.5deg] p-6">
                
                {/* Vehicle Details Header Section */}
                <div className="mb-6">
                    <div className="bg-yellow-400 border-4 border-black p-4 mb-4">
                        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                            ⚡ VEHICLE DETAILS
                        </h2>
                    </div>
                    
                    {/* Colorful Info Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Year - Black */}
                        <div className="bg-black text-white border-4 border-black p-4">
                            <div className="text-sm font-bold uppercase">YEAR</div>
                            <div className="text-2xl font-black">{result?.year || "2014"}</div>
                        </div>
                        
                        {/* Model - Blue */}
                        <div className="bg-blue-500 text-white border-4 border-black p-4">
                            <div className="text-sm font-bold uppercase">MODEL</div>
                            <div className="text-2xl font-black">{result?.model || "Unknown"}</div>
                        </div>
                        
                        {/* Make - Pink/Red */}
                        <div className="bg-pink-500 text-white border-4 border-black p-4">
                            <div className="text-sm font-bold uppercase">MAKE</div>
                            <div className="text-2xl font-black">{result?.make || "Unknown"}</div>
                        </div>
                        
                        {/* Manufacturer - Green */}
                        <div className="bg-green-500 text-white border-4 border-black p-4">
                            <div className="text-sm font-bold uppercase">MANUFACTURER</div>
                            <div className="text-xl font-black">{result?.manufacturer || "Unknown"}</div>
                        </div>
                    </div>
                </div>

                {/* VIN Decoded Section */}
                <div className="bg-green-500 border-4 border-black p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight text-white" data-testid="text-vin-decoded">
                                VIN DECODED!
                            </h3>
                            <p className="text-lg font-bold text-white">VEHICLE DATA EXTRACTED</p>
                        </div>
                    </div>
                </div>

                {/* Detailed Data Table */}
                <div className="overflow-x-auto mb-6">
                    <Table className="w-full border-4 border-black">
                        <TableHeader>
                            <TableRow className="border-b-4 border-black bg-gray-200">
                                <TableHead className="font-black text-black uppercase text-lg py-4 border-r-4 border-black">
                                    DATA FIELD
                                </TableHead>
                                <TableHead className="font-black text-black uppercase text-lg py-4">
                                    VALUE
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-b-4 border-black bg-white hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🔢</span>
                                        <span className="uppercase tracking-wide">VIN NUMBER</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    {vin}
                                </TableCell>
                            </TableRow>
                            
                            <TableRow className="border-b-4 border-black bg-gray-50 hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🚙</span>
                                        <span className="uppercase tracking-wide">BODY STYLE</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    {result?.style || result?.body_style || "UNKNOWN"}
                                </TableCell>
                            </TableRow>
                            
                            <TableRow className="border-b-4 border-black bg-white hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">✨</span>
                                        <span className="uppercase tracking-wide">TRIM</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    {result?.trim || "UNKNOWN"}
                                </TableCell>
                            </TableRow>
                            
                            <TableRow className="border-b-4 border-black bg-gray-50 hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🚗</span>
                                        <span className="uppercase tracking-wide">VEHICLE TYPE</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    {result?.type || "UNKNOWN"}
                                </TableCell>
                            </TableRow>
                            
                            <TableRow className="border-b-4 border-black bg-white hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🌍</span>
                                        <span className="uppercase tracking-wide">ORIGIN COUNTRY</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    {result?.origin || result?.country || "UNKNOWN"}
                                </TableCell>
                            </TableRow>
                            
                            <TableRow className="border-b-4 border-black bg-gray-50 hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🏭</span>
                                        <span className="uppercase tracking-wide">WMI</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    {result?.wmi || "UNKNOWN"}
                                </TableCell>
                            </TableRow>
                            
                            <TableRow className="border-b-4 border-black bg-white hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">⚙️</span>
                                        <span className="uppercase tracking-wide">ENGINE</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    {result?.engine || "UNKNOWN"}
                                </TableCell>
                            </TableRow>
                            
                            <TableRow className="border-b-4 border-black bg-gray-50 hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🔧</span>
                                        <span className="uppercase tracking-wide">TRANSMISSION</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    {result?.transmission || "UNKNOWN"}
                                </TableCell>
                            </TableRow>
                            
                            <TableRow className="border-b-4 border-black bg-white hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">⛽</span>
                                        <span className="uppercase tracking-wide">FUEL TYPE</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    {result?.fuel_type || "UNKNOWN"}
                                </TableCell>
                            </TableRow>
                            
                            <TableRow className="border-b-4 border-black bg-gray-50 hover:bg-yellow-100">
                                <TableCell className="font-bold text-black py-4 border-r-4 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">✅</span>
                                        <span className="uppercase tracking-wide">CHECKSUM VALID</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono font-bold text-lg py-4 text-black">
                                    <span className={`px-3 py-1 border-2 border-black font-black ${
                                        result?.checksum ? 'bg-green-400 text-black' : 'bg-red-400 text-white'
                                    }`}>
                                        {result?.checksum ? 'VALID' : 'INVALID'}
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-blue-500 border-4 border-black shadow-[6px_6px_0px_0px_#000]">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-white" />
                        <p className="font-black text-white uppercase">
                            DATA ACCURACY DISCLAIMER: VERIFY WITH OFFICIAL SOURCES
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}