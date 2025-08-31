import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, HelpCircle, Search, Shield, Car, FileText, AlertTriangle, CheckCircle2, Globe } from "lucide-react";
import { useState } from "react";

// Helper function to create hyperlinked keywords
const createLinkedText = (text: string) => {
  const keywords = [
    'UAE car history check',
    'Cars History Check',
    'VIN decoder check',
    'car auction history check',
    'vehicle auction history check in Dubai',
    'CarsHistoryCheck.com',
    'international VIN check Dubai',
    'car history check UAE',
    'vehicle history check in Dubai'
  ];

  let processedText = text;
  
  // Sort keywords by length (longest first) to avoid partial replacements
  const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
  
  sortedKeywords.forEach(keyword => {
    // Use a more precise regex that handles word boundaries better
    const regex = new RegExp(`(^|\\s)(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=\\s|$|[.,!?])`, 'gi');
    processedText = processedText.replace(regex, (match, before, keywordMatch) => {
      return `${before}<a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; cursor: pointer;">${keywordMatch}</a>`;
    });
  });
  
  // Also link standalone phrases
  const additionalKeywords = [
    'Free VIN Check',
    'VIN report',
    'Free VIN Check online',
    'VIN History Report'
  ];
  
  additionalKeywords.forEach(keyword => {
    const regex = new RegExp(`(^|\\s)(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=\\s|$|[.,!?])`, 'gi');
    processedText = processedText.replace(regex, (match, before, keywordMatch) => {
      return `${before}<a href="https://www.carshistorycheck.com/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; cursor: pointer;">${keywordMatch}</a>`;
    });
  });

  return processedText;
};

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What is a chassis number (VIN), and why is it essential?",
    answer: "The chassis number, also called the Vehicle Identification Number (VIN), is a unique 17-character code found on the car's registration card (Mulkiya), dashboard, or door frame. It is vital for performing a VIN check in Dubai as it provides access to a vehicle's full history—covering accident records, ownership verification, recalls, mileage, and even auction details.",
    icon: <Car className="w-6 h-6" />,
    category: "VIN Basics"
  },
  {
    id: 2,
    question: "How can I check a vehicle's accident and owner history?",
    answer: "You can easily perform a car history check UAE using the VIN. Cars History Check provides comprehensive reports with accident history, auction records, ownership details, and condition reports. For imported vehicles (such as US or Japanese cars), simply searching the VIN online can sometimes reveal past auction listings or photos.",
    icon: <Search className="w-6 h-6" />,
    category: "History Check"
  },
  {
    id: 3,
    question: "What should I watch out for regarding VIN manipulation?",
    answer: "VIN fraud occurs when a vehicle's identification number is tampered with, falsified, or cloned. This is illegal and can block registration in the UAE. Always cross-check VIN numbers across the registration card, chassis stamp, and vehicle panels. A proper vehicle history check in Dubai helps identify suspicious records or mismatches.",
    icon: <AlertTriangle className="w-6 h-6" />,
    category: "Security"
  },
  {
    id: 4,
    question: "What steps should I take to thoroughly inspect a used car?",
    answer: "A Pre-Purchase Inspection (PPI) is highly recommended before buying a used vehicle. It helps detect hidden issues such as frame damage, repaint jobs, odometer tampering, and underbody wear. Trusted UAE garages like FastTrack Emarat or Autohub offer these inspections. To complement this, always do a UAE car history check for peace of mind.",
    icon: <CheckCircle2 className="w-6 h-6" />,
    category: "Inspection"
  },
  {
    id: 5,
    question: "How to check UAE / GCC cars with VIN internationally?",
    answer: "For a complete view of a car's background, you can use: Cars History Check → Offers GCC-focused reports covering accidents, auction history, mileage, and full specs. RTA Vehicle Status Certificate (Dubai) → Includes ownership transfers, accidents, inspections, and impounds. MOI & EVG portals (Abu Dhabi, Sharjah, other Emirates) → Provide accident and police records. For international VIN check Dubai services, CarsHistoryCheck.com provides comprehensive global vehicle data.",
    icon: <Globe className="w-6 h-6" />,
    category: "International"
  },
  {
    id: 6,
    question: "What can VIN decoders reveal?",
    answer: "A proper VIN decoder check reveals critical details such as: Full car specifications (engine type, trim, transmission, year, factory details), Auction & salvage history (including US auction photos), Mileage verification & odometer rollbacks, Accident & insurance claims, Manufacturer recalls or defects, Flood/fire damage reports, Number of previous owners.",
    icon: <FileText className="w-6 h-6" />,
    category: "VIN Decoder"
  },
  {
    id: 7,
    question: "What is a car auction, and why is it popular?",
    answer: "A car auction is a platform where vehicles are sold to the highest bidder. They are popular in Dubai because they offer access to used cars, salvage cars, and luxury cars at significantly lower prices compared to traditional dealerships. With a car auction history check, buyers can verify the true condition and background of these cars before purchase.",
    icon: <Car className="w-6 h-6" />,
    category: "Auctions"
  },
  {
    id: 8,
    question: "What should I look for in a vehicle listing?",
    answer: "When browsing cars online, always ensure the listing includes: Vehicle make, model, and year of manufacture, Accurate mileage, Service and maintenance records, Accident and ownership history. Running a vehicle auction history check in Dubai guarantees transparency and avoids costly surprises.",
    icon: <Search className="w-6 h-6" />,
    category: "Buying Tips"
  },
  {
    id: 9,
    question: "Tips for Dubai car buyers using international VIN checks",
    answer: "✔ Always use CarsHistoryCheck.com for imports (US, Japanese, or European). ✔ For Japanese imports, request the original auction sheet and verify it. ✔ For Tesla or luxury imports, check warranty and service status with CarsHistoryCheck.com. ✔ Always cross-check with RTA or MOI records before finalizing a deal. For a quick solution, you can run a full international VIN check Dubai to cover auction, accident, and ownership history in one report.",
    icon: <Shield className="w-6 h-6" />,
    category: "Expert Tips"
  },
  {
    id: 10,
    question: "Why should I run a Free VIN Check before buying a used car?",
    answer: "Running a Free VIN Check in Dubai ensures the car's identity matches the documents. It helps avoid fraud, cloned VINs, or mismatched records. Once verified, you can upgrade to a complete VIN report for deeper insights like accident records, service history, and previous owners.",
    icon: <Search className="w-6 h-6" />,
    category: "VIN Basics"
  },
  {
    id: 11,
    question: "Where can I check a VIN number for free?",
    answer: "You can perform a Free VIN Check online by entering the 17-digit VIN. This gives you instant details about the car's identity and build specifications.",
    icon: <Globe className="w-6 h-6" />,
    category: "VIN Basics"
  },
  {
    id: 12,
    question: "What's the difference between a Free VIN Check and a Paid VIN Report?",
    answer: "Free VIN Check → Basic information (make, model, year, engine, trim). Paid VIN History Report → Detailed insights including accidents, ownership history, mileage records, recalls, and auction images.",
    icon: <FileText className="w-6 h-6" />,
    category: "VIN Basics"
  }
];

const categories = ["All", "VIN Basics", "History Check", "Security", "Inspection", "International", "VIN Decoder", "Auctions", "Buying Tips", "Expert Tips"];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 py-16 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-2xl border-8 border-black shadow-[16px_16px_0px_0px_#000]">
              <HelpCircle className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100 font-medium max-w-3xl mx-auto">
            Everything you need to know about VIN checks, car history reports, and vehicle inspections in the UAE
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-black uppercase mb-4 text-black">Filter by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 font-bold uppercase border-4 border-black transition-all duration-150 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-[6px_6px_0px_0px_#000] transform translate-x-[-2px] translate-y-[-2px]"
                    : "bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
                }`}
                data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {filteredFAQs.map((faq) => (
            <Card 
              key={faq.id}
              className="border-8 border-black shadow-[8px_8px_0px_0px_#000] bg-white overflow-hidden"
            >
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-150 p-6"
                onClick={() => toggleItem(faq.id)}
                data-testid={`faq-question-${faq.id}`}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-3 rounded-lg border-4 border-black text-white flex-shrink-0">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-blue-600 uppercase mb-1">
                        {faq.category}
                      </div>
                      <h3 className="text-lg font-black text-black leading-tight">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-6 h-6 text-black transition-transform duration-200 flex-shrink-0 ml-4 ${
                      openItems.includes(faq.id) ? "transform rotate-180" : ""
                    }`}
                  />
                </CardTitle>
              </CardHeader>
              
              {openItems.includes(faq.id) && (
                <CardContent className="px-6 pb-6 pt-0" data-testid={`faq-answer-${faq.id}`}>
                  <div className="bg-gray-50 p-6 border-4 border-black rounded-lg">
                    <div 
                      className="text-gray-800 leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: createLinkedText(faq.answer) }}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-yellow-400">
            <CardContent className="p-8">
              <h2 className="text-2xl font-black uppercase text-black mb-4">
                Still Have Questions?
              </h2>
              <p className="text-black font-medium mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Get instant answers by checking your vehicle's VIN or contact our support team for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-lg px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 uppercase"
                  data-testid="button-check-vin"
                >
                  Check Your VIN Now
                </a>
                <a 
                  href="/contact"
                  className="bg-white hover:bg-gray-100 text-black font-black text-lg px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 uppercase"
                  data-testid="button-contact-support"
                >
                  Contact Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}