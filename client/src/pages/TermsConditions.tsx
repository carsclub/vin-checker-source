import { FileText, Scale, AlertTriangle, DollarSign, Shield, Clock } from "lucide-react";
import GoogleAd from "@/components/GoogleAd";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header Section */}
      <div className="bg-purple-600 text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 border-4 border-white bg-yellow-400 text-black px-8 py-4 inline-block transform -rotate-2 shadow-[8px_8px_0px_0px_#000]">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-3xl mx-auto mt-8">
            Terms of Service for Cars History Check
          </p>
          <p className="text-lg mt-4 opacity-90">
            Last updated: August 21, 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-purple-600 mr-4" />
            <h2 className="text-2xl font-black">AGREEMENT TO TERMS</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            Welcome to <strong>www.carshistorycheck.com</strong>. These Terms and Conditions ("Terms") govern your use of our 
            VIN decoder and vehicle history report services. By accessing or using our services, you agree to be bound by these Terms. 
            If you do not agree to these Terms, please do not use our services.
          </p>
        </div>

        {/* Services Description */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <Scale className="w-8 h-8 text-blue-600 mr-4" />
            <h2 className="text-2xl font-black">OUR SERVICES</h2>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-black mb-2">VIN Decoding Services</h3>
              <p className="text-gray-700">
                We provide Vehicle Identification Number (VIN) decoding services that extract basic vehicle information 
                from official databases and manufacturer records.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-black mb-2">Vehicle History Reports</h3>
              <p className="text-gray-700">
                Our premium service provides comprehensive vehicle history reports including auction records, damage history, 
                previous ownership details, and market valuations for a fee of $16.99 USD (approximately 62 AED).
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-xl font-black mb-2">Data Sources</h3>
              <p className="text-gray-700">
                Our reports compile information from various sources including government databases, auction houses, 
                insurance companies, and automotive industry partners.
              </p>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-600 mr-4" />
            <h2 className="text-2xl font-black">USER RESPONSIBILITIES</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-orange-50 border-2 border-orange-600 p-6">
              <h3 className="font-black text-lg mb-3 text-orange-800">Acceptable Use</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Provide accurate information</li>
                <li>• Use services for legitimate purposes only</li>
                <li>• Respect intellectual property rights</li>
                <li>• Comply with applicable laws</li>
              </ul>
            </div>

            <div className="bg-red-50 border-2 border-red-600 p-6">
              <h3 className="font-black text-lg mb-3 text-red-800">Prohibited Activities</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Automated scraping or data mining</li>
                <li>• Reselling our reports without permission</li>
                <li>• Attempting to circumvent security measures</li>
                <li>• Using false or misleading information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <DollarSign className="w-8 h-8 text-green-600 mr-4" />
            <h2 className="text-2xl font-black">PAYMENT TERMS</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-600 p-4">
              <h3 className="font-black mb-2">Pricing</h3>
              <p className="text-gray-700">Vehicle history reports are priced at $16.99 USD (approximately 62 AED). Prices are subject to change with notice.</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
              <h3 className="font-black mb-2">Payment Processing</h3>
              <p className="text-gray-700">Payments are processed securely through Stripe. We accept major credit cards and digital payment methods.</p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
              <h3 className="font-black mb-2">No Recurring Charges</h3>
              <p className="text-gray-700">All purchases are one-time payments. We do not store payment information or create recurring subscriptions.</p>
            </div>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="bg-yellow-100 border-4 border-yellow-600 p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <Clock className="w-8 h-8 text-yellow-800 mr-4" />
            <h2 className="text-2xl font-black text-yellow-800">7-DAY REFUND POLICY</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-800 text-lg">
              We offer a <strong>7-day money-back guarantee</strong> on all vehicle history report purchases.
            </p>
            
            <div className="bg-white border-2 border-yellow-600 p-4">
              <h3 className="font-black mb-2">Refund Conditions</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Request must be made within 7 days of purchase</li>
                <li>• Contact support@carshistorycheck.com with your order details</li>
                <li>• Refunds are processed within 5-7 business days</li>
                <li>• Original payment method will be credited</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Accuracy */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-indigo-600 mr-4" />
            <h2 className="text-2xl font-black">DATA ACCURACY & DISCLAIMERS</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-black mb-2 text-red-800">Information Accuracy</h3>
              <p className="text-gray-700">
                While we strive to provide accurate information, we cannot guarantee the completeness or accuracy of all data. 
                Information is compiled from third-party sources and may contain errors or omissions.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
              <h3 className="font-black mb-2 text-blue-800">Professional Advice</h3>
              <p className="text-gray-700">
                Our reports are for informational purposes only and should not replace professional vehicle inspections 
                or legal advice when making purchase decisions.
              </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-4">
              <h3 className="font-black mb-2 text-orange-800">Limitation of Liability</h3>
              <p className="text-gray-700">
                Cars History Check's liability is limited to the cost of the report purchased. We are not responsible 
                for decisions made based on our reports.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <h2 className="text-2xl font-black mb-6">PRIVACY & DATA PROTECTION</h2>
          <p className="text-gray-700 text-lg mb-4">
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
            use, and protect your personal information.
          </p>
          <div className="bg-gray-50 border-2 border-gray-300 p-4">
            <p><strong>Data Collection:</strong> We collect email addresses for VIN searches and process payments securely</p>
            <p><strong>Data Protection:</strong> All personal information is encrypted and stored securely</p>
            <p><strong>Data Retention:</strong> We retain data only as long as necessary to provide services</p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <h2 className="text-2xl font-black mb-6">CHANGES TO THESE TERMS</h2>
          <p className="text-gray-700 text-lg">
            We may update these Terms from time to time. When we make changes, we will update the "Last updated" date 
            and notify users through our website or email. Continued use of our services after changes constitutes 
            acceptance of the new Terms.
          </p>
        </div>

        
      </div>

      {/* Google Ad */}
      <GoogleAd />
    </div>
  );
}