import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "./component/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'CryptoBriefs - Stay Updated on Crypto',
  description: 'Latest updates on Bitcoin, Ethereum, Altcoins, and Web3 News.',
  icons: {
    icon: '/favicon.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <link rel="icon" href="/favicon.jpg" sizes="any" />

      <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
