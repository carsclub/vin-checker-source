import React, { useEffect } from "react";

interface PayPalButtonProps {
  amount?: string;
  description?: string;
  vin?: string;
}

export default function PayPalButton({ amount = "9.99", description = "Full Vehicle History Report", vin = "" }: PayPalButtonProps) {
  useEffect(() => {
    // Load PayPal SDK if not already loaded
    if (!(window as any).paypal) {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=BAA98deFx-yk5I_PpWSujiNcjLYZc1uHUcPgUvCzMQzK0UP5uFwaxCdZ0geolMQISCjS4veBtH3RENaXqc&components=hosted-buttons&disable-funding=venmo&currency=USD";
      script.crossOrigin = "anonymous";
      script.async = true;
      script.onload = () => {
        initializePayPal();
      };
      document.head.appendChild(script);
    } else {
      initializePayPal();
    }

    function initializePayPal() {
      if ((window as any).paypal && (window as any).paypal.HostedButtons) {
        // Add VIN parameter to success URL
        const successUrl = vin ? 
          `${window.location.origin}/payment-success?vin=${vin}` : 
          `${window.location.origin}/payment-success`;
        
        (window as any).paypal.HostedButtons({
          hostedButtonId: "DJ98CQNWELYYC",
          custom: vin, // Pass VIN as custom parameter
          return: successUrl,
          cancel_return: `${window.location.origin}/`
        }).render("#paypal-container-DJ98CQNWELYYC");
      }
    }

    // Cleanup function
    return () => {
      const container = document.getElementById("paypal-container-DJ98CQNWELYYC");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-black uppercase mb-2 text-black">
          Get Full History Report
        </h3>
        <p className="text-black font-bold mb-2">
          {description}
        </p>
        <p className="text-2xl font-black text-blue-600 mb-2">
          ${amount}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          Pay with PayPal, Apple Pay or Debit/Credit Cards
        </p>
      </div>
      <div id="paypal-container-DJ98CQNWELYYC" className="w-full"></div>
    </div>
  );
}