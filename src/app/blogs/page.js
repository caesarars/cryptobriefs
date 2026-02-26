import BlogsClient from "./BlogsClient";

export const metadata = {
  title: "Crypto Blog | CryptoBriefs",
  description: "In-depth crypto articles, guides, and market analysis. Explore educational content on Bitcoin, Ethereum, DeFi, Web3, and the broader blockchain ecosystem.",
  keywords: ["crypto blog", "bitcoin articles", "ethereum guide", "defi explained", "web3 education", "blockchain articles", "crypto analysis"],
  alternates: {
    canonical: "https://cryptobriefs.net/blogs",
  },
  openGraph: {
    title: "Crypto Blog | CryptoBriefs",
    description: "In-depth crypto articles, guides, and market analysis. Learn about Bitcoin, Ethereum, DeFi, and Web3.",
    url: "https://cryptobriefs.net/blogs",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.png", width: 1200, height: 630, alt: "CryptoBriefs Blog" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Blog | CryptoBriefs",
    description: "In-depth crypto articles, guides, and market analysis. Learn about Bitcoin, Ethereum, DeFi, and Web3.",
    images: ["https://cryptobriefs.net/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },


  other: {
    "og:logo": "/favicon.png",
  }};

export default function BlogsPage() {
  return <BlogsClient />;
}

