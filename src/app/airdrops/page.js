import ListAirdrops from "./ListAirdrops";
import "./AirdropsPage.css";

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
        <section className="airdrops-page">
            <div className="container">
                <div className="airdrops-hero">
                    <p className="airdrops-kicker">Opportunity Feed</p>
                    <h1 className="space-title airdrops-title">Latest Airdrops</h1>
                    <p className="airdrops-subtitle general-font">
                        Discover active crypto airdrops, track project momentum, and quickly see what actions are required before you join.
                    </p>
                </div>
            </div>
            <ListAirdrops/>
        </section>
    )
}

export default Airdrops;
