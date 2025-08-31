import React from "react";
import { Shield, FileText, Fuel, Car, MapPin, Wrench } from "lucide-react";

export default function EuropeWhyChooseSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-4 transform rotate-[-1deg] text-black">
          WHY CHOOSE OUR EUROPEAN VIN DECODER?
        </h2>
        <p className="text-xl text-center mb-12 text-gray-700 font-bold">
          Specialized European database access with MOT records, emissions data, and EU compliance checks
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-blue-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[1deg] hover:rotate-0 transition-transform">
            <Shield className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">EU Compliance Check</h3>
            <p className="text-white font-bold">
              Verify European emissions standards, safety ratings, and regulatory compliance status for imported and domestic vehicles.
            </p>
          </div>

          <div className="bg-green-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[-1deg] hover:rotate-0 transition-transform">
            <FileText className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">MOT & Inspection History</h3>
            <p className="text-white font-bold">
              Access MOT test results, annual inspection records, and maintenance history from European transport authorities.
            </p>
          </div>

          <div className="bg-purple-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[1deg] hover:rotate-0 transition-transform">
            <Fuel className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">Emissions & Environmental Data</h3>
            <p className="text-white font-bold">
              Check CO2 emissions ratings, Euro emission standards, and environmental impact assessments for European vehicles.
            </p>
          </div>

          <div className="bg-red-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[-1deg] hover:rotate-0 transition-transform">
            <Car className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">European Accident Database</h3>
            <p className="text-white font-bold">
              Cross-reference accident reports, insurance claims, and damage records across European insurance databases.
            </p>
          </div>

          <div className="bg-yellow-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[1deg] hover:rotate-0 transition-transform">
            <MapPin className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">Import & Registration History</h3>
            <p className="text-white font-bold">
              Track vehicle imports, registration transfers, and ownership changes across European Union member states.
            </p>
          </div>

          <div className="bg-indigo-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[-1deg] hover:rotate-0 transition-transform">
            <Wrench className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">Technical Specifications</h3>
            <p className="text-white font-bold">
              Access detailed European technical specifications, recall notices, and manufacturer service bulletins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}