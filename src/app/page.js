import Blogs from "./component/blogs/Blogs";
import CryptoEducationCorner from "./component/cryptoEdu/CryptoEducationCorner";
import HeroSection from "./component/heroSection/HeroSection";
import News from "./component/newsFeeds/News";
import CryptoSentiment from "./component/sentimentCoins/CryptoSentiment";
import TrendingCoins from "./component/trendingCoins/TrendingCoins";
import BriefSummary from "./component/brief/BriefSummary";
import "./page.css"

export const metadata = {
  title: "CryptoBriefs - Latest Crypto News, Insights, and Trends",
  description: "Stay updated with CryptoBriefs – your go-to source for cryptocurrency news, education, and trending market insights. Discover Bitcoin, Ethereum, and the latest Web3 projects.",
  keywords: ["Crypto News", "Cryptocurrency Updates", "Bitcoin", "Ethereum", "Web3", "Crypto Trends", "Blockchain News"],
  openGraph: {
    title: "CryptoBriefs - Latest Crypto News and Insights",
    description: "Explore the latest crypto news, education, and market trends on CryptoBriefs.",
    url: "https://cryptobriefs.net",
    siteName: "CryptoBriefs",
    images: [
      {
        url: "https://cryptobriefs.net/og-image.jpg", // Ganti ke image OG kamu
        width: 1200,
        height: 630,
        alt: "CryptoBriefs OG Image",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://cryptobriefs.net",
  },
};


export default function Home({  }) {
  return (
    <>
      <div className="bg-dark pb-5 background_image_banner">
       <HeroSection/>
       <div className="wrapper pb-5">
         <TrendingCoins/>
         <CryptoSentiment/>
         <CryptoEducationCorner/>
       </div>
      </div>
      <div className="">
        <BriefSummary/>
        <Blogs/>
        <News/>
      </div>
    </>
   
  );
}
