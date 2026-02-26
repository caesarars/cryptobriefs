// app/layout.js

import { Analytics } from "@vercel/analytics/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import Navbar from "./component/NavBar";
import Footer from "./component/footer/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Metadata
export const metadata = {
  title: {
    default: "CryptoBriefs — Daily crypto brief + sentiment",
    template: "%s | CryptoBriefs",
  },
  description: "Understand crypto in 60 seconds a day. Sentiment, movers, and one clear takeaway.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://cryptobriefs.net",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CryptoBriefs",
    description: "Daily crypto brief + news sentiment. Fast signal without the noise.",
    url: "https://www.cryptobriefs.net",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.png", width: 1200, height: 630, alt: "CryptoBriefs" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoBriefs",
    description: "Daily crypto brief + news sentiment. Fast signal without the noise.",
    images: ["https://www.cryptobriefs.net/og-image.png"],
  },
};

// Layout Component
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <head>
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1176519704673517"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google tag (gtag.js) */}
        <Script
          id="gtag-src"
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-881837141"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-881837141');

            // Optional: set this to enable conversion tracking from app code
            // window.__ADS_CONVERSION_SEND_TO = 'AW-XXXXXXX/XXXXXXXXXXX'
          `}
        </Script>

        <meta
          name="03b6e3310bf81d6f20cedfb004aca9bb874c0bc1"
          content="03b6e3310bf81d6f20cedfb004aca9bb874c0bc1"
        />
      </head>
      <body suppressHydrationWarning={true} className="layout-body">
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
