import React from "react";
import { Link, useLocation } from "wouter";
import { Car, FileText, DollarSign, Calculator, BookOpen, Eye } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    {
      label: "Free VIN Decoder",
      href: "/",
      icon: Car,
      isActive: location === "/"
    },
    {
      label: "Car History Check",
      href: "/history-report",
      icon: FileText,
      isActive: location.startsWith("/history")
    },
    {
      label: "Loan Calculator",
      href: "/loan-calculator",
      icon: Calculator,
      isActive: location.startsWith("/loan-calculator")
    },
    {
      label: "Sample Report",
      href: "/sample-report",
      icon: Eye,
      isActive: location === "/sample-report"
    },
    {
      label: "Blog",
      href: "/blog",
      icon: BookOpen,
      isActive: location.startsWith("/blog")
    },
    {
      label: "Sell My Car",
      href: "https://carsclub.ae/",
      icon: DollarSign,
      external: true,
      isActive: false
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b-4 border-black shadow-[0_4px_0px_0px_#000]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group" data-testid="link-logo">
              <img
                src="/logo.webp"
                alt="Logo"
                className="h-10 md:h-12 w-auto border-3 border-black bg-white p-1 shadow-[3px_3px_0px_0px_#000] group-hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-150"
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const content = (
                <div
                  className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 md:py-2.5 border-3 border-black font-black text-xs md:text-sm uppercase transition-all duration-150 ${
                    item.isActive
                      ? "bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000]"
                      : "bg-white text-black hover:bg-blue-100 shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline md:text-sm ml-[0px] mr-[0px] pl-[1px] pr-[1px] pt-[0px] pb-[0px] mt-[0px] mb-[0px] text-[12px]">{item.label}</span>
                </div>
              );

              if (item.external) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={item.label} href={item.href}>
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
