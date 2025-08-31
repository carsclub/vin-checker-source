import React from "react";

export default function MainPageGuideSection() {
  const createLinkedText = (text: string): JSX.Element => {
    const keywords = [
      'car history check by chassis number',
      'USA car history check',
      'car history check free Europe',
      'car history check by chassis number free',
      'American car chassis number check free'
    ];

    let processedText = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      processedText = processedText.replace(regex, `<a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold">${keyword}</a>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            Complete Guide to American & European Car History Checks by VIN and Chassis Number
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-base md:text-lg">
              {createLinkedText("Buying a used car can be risky—especially when it's imported from another country. Whether you're purchasing in the Middle East, Europe, or the USA, running a car history check by chassis number or a VIN check is essential to avoid scams and costly repairs.")}
            </p>

            <p className="text-base md:text-lg">
              {createLinkedText("With advanced tools, you can now perform everything from a USA car history check to a car history check free Europe in just minutes.")}
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mt-8 mb-4 flex items-center">
              <span className="mr-2">🔍</span>
              Car History Check by Chassis Number
            </h3>

            <p className="text-base md:text-lg">
              {createLinkedText("Every car has a unique chassis number. Running a car history check by chassis number free provides details like:")}
            </p>

            <ul className="list-disc ml-6 space-y-2 text-base md:text-lg">
              <li>Accident records</li>
              <li>Odometer history</li>
              <li>Ownership verification</li>
              <li>Recall notices</li>
            </ul>

            <p className="text-base md:text-lg">
              {createLinkedText("You can even perform an American car chassis number check free if you're dealing with imports from the United States.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}