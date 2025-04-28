'use client'

import ListAirdrops from "./ListAirdrops";

export async function generateMetadata() { 
    return {
    title: "CryptoBriefs - Latest Airdrops Coin",
    description: "Stay updated with CryptoBriefs – your go-to source for airdrops, cryptocurrency news, education, and trending market insights.",
    keywords: ["Crypto News", "Cryptocurrency Updates", "Bitcoin", "Ethereum", "Web3", "Crypto Trends", "Blockchain News"],
    openGraph: {
      title: "CryptoBriefs - Latest Airdrops Coin",
      description: "Explore the latest crypto news, education, and market trends on CryptoBriefs.",
      url: "https://cryptobriefs.net/airdrops",
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
      canonical: "https://cryptobriefs.net/airdrops",
    },
  }
}

const Airdrops = () => {
    return (
        <>
           <h1 className="m-4 text-center space-title">Latest Airdrops</h1>
            <div className="general-font" style={{width:"50%" , margin: "0 auto", textAlign:"center"}}>
                Airdrops are free crypto giveaways straight to your wallet! 🚀 Projects use them to reward early supporters, build hype, and grow their community — sometimes all you need to do is sign up or complete simple tasks.
            </div>
            <ListAirdrops/>
        </>
    )
}

export default Airdrops;