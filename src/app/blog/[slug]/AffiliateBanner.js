'use client';  // Memperbaiki 'use/client' menjadi 'use client'

import "./AffiliateBanner.css";

const AffiliateBanner = () => {
  return (
    <div className="affiliate_banner_wrapper">
      <a 
        href="https://partner.bybit.com/b/aff_13915_123677" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Visit Bybit Affiliate Page"
      >
        <img 
          className="image_affiliate" 
          src="/images/newbybit.png"
          alt="Affiliate Banner for Bybit"
          loading="lazy" 
        />
      </a>
      
    </div>
  );
};

export default AffiliateBanner;
