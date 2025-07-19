// app/layout.js

import { Space_Grotesk } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "./component/NavBar";
import { Analytics } from "@vercel/analytics/react";

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
      <body suppressHydrationWarning={true}
        className="layout-body">
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
