import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    adsbygoogle: any[];
  }
}

export function ThirdPartyScripts() {
  useEffect(() => {
    const googleAnalyticsId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    const googleAdsenseClientId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID;

    // Load Google Analytics if ID is provided
    if (googleAnalyticsId) {
      // Create Google Analytics script
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(gtagScript);

      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer!.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', googleAnalyticsId);
    }

    // Load Google AdSense if client ID is provided
    if (googleAdsenseClientId) {
      const adsenseScript = document.createElement('script');
      adsenseScript.async = true;
      adsenseScript.crossOrigin = 'anonymous';
      adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsenseClientId}`;
      document.head.appendChild(adsenseScript);
    }
  }, []);

  return null; // This component doesn't render anything
}

// Analytics tracking helper functions
export const trackEvent = (eventName: string, parameters?: any) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackVinSearch = (vinNumber: string) => {
  trackEvent('vin_search', {
    vin: vinNumber,
    event_category: 'engagement',
    event_label: 'vin_decoder'
  });
};

export const trackReportPurchase = (vinNumber: string, amount: number) => {
  trackEvent('purchase', {
    transaction_id: `vin_${vinNumber}_${Date.now()}`,
    value: amount,
    currency: 'USD',
    item_category: 'vehicle_report',
    item_name: 'Full Vehicle History Report'
  });
};