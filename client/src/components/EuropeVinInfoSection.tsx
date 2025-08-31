import React from "react";

export default function EuropeVinInfoSection() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="bg-orange-500 border-4 border-black p-8 shadow-[12px_12px_0px_0px_#000] transform rotate-[-1deg]">
          <div className="transform rotate-[1deg]">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 text-center uppercase">
              What is a European VIN Number?
            </h2>
            <div className="space-y-4 text-white font-bold text-lg leading-relaxed">
              <p>
                A Vehicle Identification Number (VIN) is a unique code assigned to every motor vehicle in Europe, serving as its digital fingerprint. The VIN provides crucial information about the vehicle's European specifications, compliance status, and history.
              </p>
              <p>
                European VINs follow the same 17-character format but include specific manufacturer codes for European brands like BMW (WBA), Mercedes-Benz (WDB), Audi (WAU), and other EU manufacturers. Each character reveals important details about the vehicle's European origins and specifications.
              </p>
              <p>
                Our European VIN decoder specializes in decoding vehicles manufactured or imported into European markets, providing access to MOT records, emissions data, EU safety ratings, and compliance with European standards like Euro 6 emissions requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}