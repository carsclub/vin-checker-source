import React from "react";
import { Shield, FileText, MapPin, Car, AlertTriangle, Wrench } from "lucide-react";

export default function AfricaWhyChooseSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-4 transform rotate-[-1deg] text-black">
          WHY CHOOSE OUR AFRICA VIN CHECK?
        </h2>
        <p className="text-xl text-center mb-12 text-gray-700 font-bold">
          Specialized database access for European cars in Africa with import records, theft checks, and accident history
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-blue-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[1deg] hover:rotate-0 transition-transform">
            <Shield className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">European Car Focus</h3>
            <p className="text-white font-bold">
              Specialized checks for European vehicles imported to African markets with comprehensive history tracking.
            </p>
          </div>

          <div className="bg-green-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[-1deg] hover:rotate-0 transition-transform">
            <FileText className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">Import Documentation</h3>
            <p className="text-white font-bold">
              Access import records, customs clearance, and shipping documentation for vehicles entering Africa.
            </p>
          </div>

          <div className="bg-purple-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[1deg] hover:rotate-0 transition-transform">
            <AlertTriangle className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">Theft & Recovery Database</h3>
            <p className="text-white font-bold">
              Cross-border theft checks and recovery records across African and European databases.
            </p>
          </div>

          <div className="bg-red-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[-1deg] hover:rotate-0 transition-transform">
            <Car className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">Accident History</h3>
            <p className="text-white font-bold">
              Comprehensive accident reports from European origins and African insurance claims.
            </p>
          </div>

          <div className="bg-yellow-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[1deg] hover:rotate-0 transition-transform">
            <MapPin className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">Registration Tracking</h3>
            <p className="text-white font-bold">
              Track registration transfers and ownership changes across African countries and regions.
            </p>
          </div>

          <div className="bg-indigo-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform rotate-[-1deg] hover:rotate-0 transition-transform">
            <Wrench className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-3 uppercase">Service & Maintenance</h3>
            <p className="text-white font-bold">
              Access service history, recalls, and maintenance records for European vehicles in Africa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}