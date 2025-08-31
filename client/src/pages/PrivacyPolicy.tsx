import { Shield, Eye, Database, Lock, UserCheck, Clock } from "lucide-react";
import GoogleAd from "@/components/GoogleAd";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header Section */}
      <div className="bg-green-600 text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 border-4 border-white bg-yellow-400 text-black px-8 py-4 inline-block transform -rotate-2 shadow-[8px_8px_0px_0px_#000]">
            PRIVACY POLICY
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-3xl mx-auto mt-8">
            Your privacy is our priority at Cars History Check
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
            <Shield className="w-8 h-8 text-green-600 mr-4" />
            <h2 className="text-2xl font-black">OUR COMMITMENT TO YOUR PRIVACY</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            At <strong>www.carshistorycheck.com</strong>, we are committed to protecting and respecting your privacy. 
            This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our 
            VIN decoder and vehicle history services.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <Database className="w-8 h-8 text-blue-600 mr-4" />
            <h2 className="text-2xl font-black">INFORMATION WE COLLECT</h2>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-black mb-2">Personal Information</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Email address (required for VIN searches)</li>
                <li>• Name and contact details (when provided)</li>
                <li>• Payment information (processed securely through Stripe)</li>
                <li>• Communication preferences</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-black mb-2">Vehicle Information</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• VIN numbers you search</li>
                <li>• Vehicle history reports generated</li>
                <li>• Search timestamps and frequency</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-xl font-black mb-2">Technical Information</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• IP address and device information</li>
                <li>• Browser type and version</li>
                <li>• Usage analytics and site interactions</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <Eye className="w-8 h-8 text-purple-600 mr-4" />
            <h2 className="text-2xl font-black">HOW WE USE YOUR INFORMATION</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border-2 border-blue-600 p-6">
              <h3 className="font-black text-lg mb-3 text-blue-800">Service Delivery</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Generate vehicle history reports</li>
                <li>• Process payments securely</li>
                <li>• Send report notifications</li>
                <li>• Provide customer support</li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-600 p-6">
              <h3 className="font-black text-lg mb-3 text-green-800">Communication</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Send service updates</li>
                <li>• Respond to inquiries</li>
                <li>• Share important announcements</li>
                <li>• Collect feedback</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-2 border-purple-600 p-6">
              <h3 className="font-black text-lg mb-3 text-purple-800">Improvement</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Analyze usage patterns</li>
                <li>• Enhance user experience</li>
                <li>• Develop new features</li>
                <li>• Optimize performance</li>
              </ul>
            </div>

            <div className="bg-red-50 border-2 border-red-600 p-6">
              <h3 className="font-black text-lg mb-3 text-red-800">Legal Compliance</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Meet regulatory requirements</li>
                <li>• Prevent fraud and abuse</li>
                <li>• Protect user rights</li>
                <li>• Maintain security</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <Lock className="w-8 h-8 text-red-600 mr-4" />
            <h2 className="text-2xl font-black">DATA PROTECTION & SECURITY</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h3 className="font-black mb-2">Encryption & Security</h3>
              <p className="text-gray-700">All data transmission is secured using SSL/TLS encryption. Payment information is processed through PCI-compliant Stripe infrastructure.</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
              <h3 className="font-black mb-2">Access Controls</h3>
              <p className="text-gray-700">Access to personal data is restricted to authorized personnel only and protected by multi-factor authentication.</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-4">
              <h3 className="font-black mb-2">Data Retention</h3>
              <p className="text-gray-700">We retain personal information only as long as necessary to provide services and comply with legal obligations.</p>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <UserCheck className="w-8 h-8 text-orange-600 mr-4" />
            <h2 className="text-2xl font-black">YOUR PRIVACY RIGHTS</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-black text-lg mb-3">Access & Control</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Request access to your personal data</li>
                <li>• Update or correct inaccurate information</li>
                <li>• Delete your personal information</li>
                <li>• Export your data in portable format</li>
              </ul>
            </div>

            <div>
              <h3 className="font-black text-lg mb-3">Communication Preferences</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Opt-out of marketing communications</li>
                <li>• Choose notification preferences</li>
                <li>• Control cookie settings</li>
                <li>• Withdraw consent at any time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="bg-yellow-100 border-4 border-yellow-600 p-8 shadow-[8px_8px_0px_0px_#000] mb-8">
          <div className="flex items-center mb-6">
            <Clock className="w-8 h-8 text-yellow-800 mr-4" />
            <h2 className="text-2xl font-black text-yellow-800">7-DAY REFUND POLICY</h2>
          </div>
          <p className="text-gray-800 text-lg">
            We offer a <strong>7-day money-back guarantee</strong> on all purchased vehicle history reports. 
            If you're not get report or any errors to get report, contact us within 7 days of purchase for a full refund. 
            Contact <strong>support@carshistorycheck.com</strong> to initiate the refund process.
          </p>
        </div>

        
      </div>

      {/* Google Ad */}
      <GoogleAd />
    </div>
  );
}