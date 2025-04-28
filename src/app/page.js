import Blogs from "./component/blogs/Blogs";
import CryptoEducationCorner from "./component/cryptoEdu/CryptoEducationCorner";
import HeroSection from "./component/heroSection/HeroSection";
import News from "./component/newsFeeds/News";
import CryptoSentiment from "./component/sentimentCoins/CryptoSentiment";
import TrendingCoins from "./component/trendingCoins/TrendingCoins";
import "./page.css"

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
        <Blogs/>
        <News/>
       </div>
    </>
   
  );
}
