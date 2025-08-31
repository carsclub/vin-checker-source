import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Navigation Links Section */}
      <div className="bg-gray-900 border-t-2 border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
            <Link href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">
              Terms & Conditions
            </Link>
            <Link href="/sample-report" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">
              Sample Report
            </Link>
            <Link href="/faq" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">
              FAQ
            </Link>
            <Link href="/vindecoder-europe" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">
              VIN Decoder Europe
            </Link>
            <Link href="/vincheck-africa" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">
              VIN Check Africa
            </Link>

          </div>
        </div>
      </div>
      {/* Simple Bottom Footer Bar - Like in Image */}
      <div className="bg-black border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Yellow Banner */}
            <div className="bg-yellow-400 text-black px-6 py-2 font-black uppercase tracking-wide border-2 border-black shadow-[4px_4px_0px_0px_#000] text-[12px]">
              FREE VIN DECODER • INSTANT RESULTS • PRIVACY-FIRST
            </div>
            
            {/* Copyright and Email */}
            <div className="text-white text-sm text-center md:text-right">
              <p>2025 all rights reserved by carshistorycheck.com • Email: 
                <span className="bg-gray-700 text-white px-2 py-1 ml-1 font-mono text-[14px]">
                  info@carshistorycheck.com
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}