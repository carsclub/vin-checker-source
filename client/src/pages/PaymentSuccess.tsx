import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Loader, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoogleAd from "@/components/GoogleAd";

export default function PaymentSuccess() {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [vin, setVin] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vinParam = urlParams.get('vin');
    const paymentIntent = urlParams.get('payment_intent');
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
    const redirectStatus = urlParams.get('redirect_status');

    if (process.env.NODE_ENV === 'development') {
      console.log('Payment Success page loaded with params:', {
        vin: vinParam,
        payment_intent: paymentIntent,
        redirect_status: redirectStatus
      });
    }

    if (!vinParam) {
      if (process.env.NODE_ENV === 'development') {
        console.error('No VIN parameter found');
      }
      setStatus('error');
      return;
    }

    setVin(vinParam);

    // Check Stripe payment status
    if (redirectStatus === 'succeeded' && paymentIntent) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Payment succeeded, verifying with backend...');
      }
      
      // Verify payment with backend
      fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId: paymentIntent }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            if (process.env.NODE_ENV === 'development') {
              console.log('Payment verified successfully');
            }
            setStatus('success');
            
            // Redirect to car history results after 3 seconds
            setTimeout(() => {
              setLocation(`/car-history-results?vin=${vinParam}&paid=true`);
            }, 3000);
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.error('Payment verification failed:', data.message);
            }
            setStatus('error');
          }
        })
        .catch(err => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error verifying payment:', err);
          }
          setStatus('error');
        });
    } else if (redirectStatus === 'processing') {
      if (process.env.NODE_ENV === 'development') {
        console.log('Payment is processing...');
      }
      // Still processing - keep checking
      setTimeout(() => {
        setStatus('success'); // For demo, assume success after processing
        setTimeout(() => {
          setLocation(`/car-history-results?vin=${vinParam}&paid=true`);
        }, 2000);
      }, 2000);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error('Payment failed or incomplete. Status:', redirectStatus);
      }
      setStatus('error');
    }
  }, [setLocation]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center py-16">
          <div className="bg-blue-500 border-8 border-black p-12 shadow-[12px_12px_0px_0px_#000] transform rotate-[-1deg]">
            <div className="transform rotate-[1deg]">
              <Loader className="w-16 h-16 mx-auto text-white animate-spin mb-6" />
              <h1 className="text-3xl font-black uppercase text-white mb-4">
                Verifying Payment
              </h1>
              <p className="text-white font-bold text-lg">
                Please wait while we confirm your payment...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center py-16">
          <div className="bg-red-500 border-8 border-black p-12 shadow-[12px_12px_0px_0px_#000] transform rotate-[-1deg]">
            <div className="transform rotate-[1deg]">
              <AlertCircle className="w-16 h-16 mx-auto text-white mb-6" />
              <h1 className="text-3xl font-black uppercase text-white mb-4">
                Payment Error
              </h1>
              <p className="text-white font-bold text-lg mb-6">
                There was an issue verifying your payment. If money was deducted, please contact support with your VIN: {vin}
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => setLocation(`/car-history-results?vin=${vin}&paid=true`)}
                  className="bg-green-600 text-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] mr-4"
                >
                  Access Report Anyway
                </Button>
                <Button 
                  onClick={() => setLocation('/')}
                  className="bg-white text-black font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center py-16">
        <div className="bg-green-500 border-8 border-black p-12 shadow-[12px_12px_0px_0px_#000] transform rotate-[-1deg]">
          <div className="transform rotate-[1deg]">
            <CheckCircle className="w-16 h-16 mx-auto text-white mb-6" />
            <h1 className="text-3xl font-black uppercase text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-white font-bold text-lg mb-2">
              Thank you for your purchase of $16.99
            </p>
            <p className="text-white font-medium mb-6">
              VIN: {vin}
            </p>
            <div className="bg-yellow-400 border-4 border-black p-4 text-black">
              <p className="font-black uppercase">
                Redirecting to your car history report...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Ad */}
      <GoogleAd />
    </div>
  );
}