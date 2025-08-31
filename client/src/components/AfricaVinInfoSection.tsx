import React from "react";

export default function AfricaVinInfoSection() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="bg-orange-500 border-4 border-black p-8 shadow-[12px_12px_0px_0px_#000] transform rotate-[-1deg]">
          <div className="transform rotate-[1deg]">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 text-center uppercase">
              VIN Check for European Cars in Africa
            </h2>
            <div className="space-y-4 text-white font-bold text-lg leading-relaxed">
              <p>
                Our specialized VIN check service focuses on European vehicles imported to Africa, providing comprehensive history checks including accident records, theft reports, and import documentation. We understand the unique challenges of tracking vehicle history across continents.
              </p>
              <p>
                European cars in Africa often have complex histories involving multiple countries, shipping records, and varying documentation standards. Our database combines European origin data with African registration and insurance records to provide the most complete picture possible.
              </p>
              <p>
                Get detailed reports including chassis number verification, European accident history, theft checks, import customs records, and current registration status. Our service covers major African markets with specialized data for European vehicle imports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}