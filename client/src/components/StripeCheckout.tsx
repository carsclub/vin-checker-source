import { useState, useEffect } from "react";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2, Camera, FileText, DollarSign as PriceTag, Settings, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Force live Stripe public key for production deployment
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY_LIVE;
const stripePromise = loadStripe(stripePublicKey);

// Verify live key is being used
if (!stripePublicKey?.startsWith('pk_live_')) {
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR: Live Stripe public key not configured properly!');
  }
}
if (process.env.NODE_ENV === 'development') {
  console.log('Stripe frontend initialized with LIVE key');
}

interface StripeCheckoutProps {
  vin: string;
  onPaymentSuccess: (vin: string) => void;
  onCancel?: () => void;
}

function CheckoutForm({ vin, onPaymentSuccess }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?vin=${vin}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: "tabs"
        }}
      />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200 text-[12px] sm:text-[14px]"
        data-testid="stripe-pay-button"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Pay $16.99 USD - Get Full Report</span>
            <span className="sm:hidden">Pay $16.99 - Get Report</span>
          </>
        )}
      </Button>
    </form>
  );
}

export default function StripeCheckout({ vin, onPaymentSuccess, onCancel }: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!vin) return;

    // Create PaymentIntent when component mounts
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vin }),
    })
      .then(async (res) => {
        // Check if response is ok before parsing JSON
        if (!res.ok) {
          const errorText = await res.text();
          
          // Handle rate limiting specially
          if (res.status === 429) {
            try {
              const errorData = JSON.parse(errorText);
              throw new Error(`Payment temporarily disabled: ${errorData.message}`);
            } catch {
              throw new Error("Payment temporarily disabled: Too many requests. Please try again later.");
            }
          }
          
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await res.text();
          throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}`);
        }
        
        return res.json();
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.message || "Failed to initialize payment");
          toast({
            title: "Payment Setup Failed", 
            description: data.message || "Could not initialize payment. Please try again.",
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          console.error("Payment initialization error:", err);
        }
        
        let errorMessage = err.message;
        let errorTitle = "Connection Error";
        
        if (err.message.includes('Payment temporarily disabled')) {
          errorMessage = err.message.replace('Payment temporarily disabled: ', '');
          errorTitle = "PAYMENT UNAVAILABLE";
        } else if (err.message.includes('JSON.parse')) {
          errorMessage = 'Server returned invalid response. Please try again.';
        } else if (err.message.includes('HTTP 429')) {
          errorMessage = 'Network error occurred: HTTP 429: Too many requests, please try again later.';
          errorTitle = "PAYMENT UNAVAILABLE";
        }
        
        setError(errorMessage);
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive", 
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [vin, toast]);

  if (isLoading) {
    return (
      <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
        <CardHeader className="bg-blue-600 text-white border-b-4 border-black">
          <CardTitle className="font-black uppercase flex items-center gap-3 text-[18px]">
            <CreditCard className="w-8 h-8" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span className="text-lg font-bold">Loading Payment Form...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
        <CardHeader className="bg-red-600 text-white border-b-4 border-black">
          <CardTitle className="text-2xl font-black uppercase">
            Payment Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-8">
            <p className="text-lg font-bold text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_#000]"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <Card className="border-8 border-black shadow-[16px_16px_0px_0px_#000] bg-white">
      <CardHeader className="bg-blue-600 text-white border-b-4 border-black">
        <CardTitle className="font-black uppercase flex items-center gap-3 text-[18px]">
          <CreditCard className="w-8 h-8" />
          Secure Payment - $16.99 USD
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

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Complete Your Payment</h3>
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-2 border-black font-bold"
              data-testid="button-cancel-payment"
            >
              Cancel
            </Button>
          )}
        </div>
        
        <div className="mb-6 p-4 bg-blue-100 border-4 border-blue-400">
          <p className="text-center font-bold text-blue-800 text-[16px]">
            💳 Pay with Credit/Debit Card, Apple Pay, or Google Pay
          </p>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#3b82f6',
                borderRadius: '0px',
              }
            }
          }}
        >
          <CheckoutForm vin={vin} onPaymentSuccess={onPaymentSuccess} />
        </Elements>
      </CardContent>
    </Card>
  );
}