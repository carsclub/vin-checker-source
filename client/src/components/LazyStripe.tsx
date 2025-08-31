import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load Stripe component to improve initial page load
const StripeCheckout = lazy(() => import('./StripeCheckout'));

interface LazyStripeProps {
  vin: string;
  onPaymentSuccess: (vin: string) => void;
}

export default function LazyStripe({ vin, onPaymentSuccess }: LazyStripeProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading secure payment...</p>
        </div>
      </div>
    }>
      <StripeCheckout vin={vin} onPaymentSuccess={onPaymentSuccess} />
    </Suspense>
  );
}