// app/layout.js

import { Analytics } from "@vercel/analytics/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import Navbar from "./component/NavBar";
import "./globals.css";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Metadata
export const metadata = {
  title: "CryptoBriefs - Stay Updated on Crypto",
  description: "Latest updates on Bitcoin, Ethereum, Altcoins, and Web3 News.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://www.cryptobriefs.net",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Layout Component
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable}`}
    >
      <head>
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1176519704673517"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <meta name="03b6e3310bf81d6f20cedfb004aca9bb874c0bc1" content="03b6e3310bf81d6f20cedfb004aca9bb874c0bc1" />
      </head>
      <body suppressHydrationWarning={true}
        className="layout-body">
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
