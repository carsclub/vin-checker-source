import { useEffect } from 'react';

export default function GoogleAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID || ""}
        data-ad-slot="6023665401"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}