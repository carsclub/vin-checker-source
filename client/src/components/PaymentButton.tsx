import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Camera, FileText, DollarSign as PriceTag, Settings, TrendingUp } from "lucide-react";
import StripeCheckout from "./StripeCheckout";

interface PaymentButtonProps {
  vin: string;
  onPaymentSuccess: (vin: string) => void;
}

export default function PaymentButton({ vin, onPaymentSuccess }: PaymentButtonProps) {
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);

  if (showStripeCheckout) {
    return (
      <StripeCheckout 
        vin={vin} 
        onPaymentSuccess={onPaymentSuccess}
        onCancel={() => setShowStripeCheckout(false)}
      />
    );
  }

  return (
    <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
      <CardHeader className="bg-green-600 text-white border-b-4 border-black">
        <CardTitle className="font-black uppercase flex items-center gap-3 text-[18px]">
          <DollarSign className="w-8 h-8" />
          Get Full Car History Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-6 p-6 bg-yellow-100 border-4 border-yellow-400">
          <h3 className="text-xl font-black text-black mb-3">🔒 What You'll Get:</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 font-bold text-gray-800">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span>Complete auction history with real photos</span>
            </div>
            <div className="flex items-center gap-3 font-bold text-gray-800">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span>Title status and damage reports</span>
            </div>
            <div className="flex items-center gap-3 font-bold text-gray-800">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <PriceTag className="w-4 h-4 text-white" />
              </div>
              <span>Previous sale prices and dates</span>
            </div>
            <div className="flex items-center gap-3 font-bold text-gray-800">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <span>Technical specifications and condition</span>
            </div>
            <div className="flex items-center gap-3 font-bold text-gray-800">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span>Market value analysis</span>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-100 border-4 border-blue-400">
          <p className="text-center font-bold text-blue-800 text-[16px]">
            💳 Secure Payment - Only $16.99 USD
          </p>
        </div>

        <Button
          onClick={() => setShowStripeCheckout(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-6 text-sm md:text-lg border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200"
          data-testid="button-pay-report"
        >
          <CreditCard className="mr-2 h-5 w-5 md:mr-3 md:h-6 md:w-6" />
          <span className="hidden sm:inline">Pay $16.99 - Get Full Report</span>
          <span className="sm:hidden">Pay $16.99</span>
        </Button>

        <p className="text-center text-sm text-gray-600 font-bold mt-4">
          ✅ Secure payment processing by Stripe
        </p>
      </CardContent>
    </Card>
  );
}