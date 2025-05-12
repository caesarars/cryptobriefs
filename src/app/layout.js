// app/layout.js

import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "./component/NavBar";
import { Analytics } from "@vercel/analytics/react";

// Load fonts as CSS variables
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

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
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
