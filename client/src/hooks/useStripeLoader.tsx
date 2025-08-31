import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Lazy load Stripe to improve initial page performance
let stripePromise: Promise<Stripe | null> | null = null;

export const useStripeLoader = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initStripe = async () => {
      if (!stripePromise) {
        const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY_LIVE;
        
        if (!publicKey?.startsWith('pk_live_')) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Live Stripe public key required for production');
          }
          setLoading(false);
          return;
        }
        
        stripePromise = loadStripe(publicKey);
      }
      
      try {
        const stripeInstance = await stripePromise;
        setStripe(stripeInstance);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load Stripe:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    initStripe();
  }, []);

  return { stripe, loading };
};