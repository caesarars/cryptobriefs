'use client'; // WAJIB buat pake useRouter dan hooks di Next.js Client Components

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowUp, FaArrowDown, FaMinusCircle } from "react-icons/fa";
import Image from "next/image";
import SentimentProgress from "./SentimentProgress"; // pastikan udah adaptasi
import Loading from "../loading/Loading"; // pastikan udah adaptasi
import "./CryptoSentiment.css";

// Import assets
import bitcoinImage from "../../assets/image/bitcoin.png";
import ethereumImage from "../../assets/image/ethereum.png";
import solanaImage from "../../assets/image/solana.png";
import dogeImage from "../../assets/image/dogecoin.png";
import bnbImage from "../../assets/image/bnb.png";
import adaImage from "../../assets/image/coin.png";
import dotImage from "../../assets/image/polkadot.png";
import xrpImage from "../../assets/image/xrp.png";

export default function CryptoSentiment() {
    const navigate = useRouter()
    const [news, setNews] = useState([]);
    const [coinFilter, setCoinFilter] = useState("BTC");
    const [period, setPeriod] = useState("today")
    const [totalNews, setTotalNews] = useState(1)
    const [totalBullish, setTotalBullish] = useState(0)
    const [totalBearish, setTotalBearish] = useState(0)
    const [totalNeutral, setTotalNeutral] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [coinPrice, setCoinPrice] = useState(0)
    const [coinPath, setCoinPath] = useState(bitcoinImage)

    useEffect(() => {
        setIsLoading(true)
        
        fetch(`https://crypto-blog-backend.vercel.app/api/news/newsWithSentiment${coinFilter ? `?coin=${coinFilter}` : ""}&period=${period}`)
            .then((res) => res.json())
            .then((data) => {
                setNews(data.news)
                setTotalBullish(data.sentimentCounts.bullish)
                setTotalBearish(data.sentimentCounts.bearish)
                setTotalNeutral(data.sentimentCounts.neutral)
                setTotalNews(data.news.length)
                setIsLoading(false)
            })
            .catch((error) => console.error("Error fetching news:", error));
             // Fetch harga Bitcoin dari Binance
            const fetchPrice = async () => {
                try {  
                    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coinFilter}USDT`);
                    //const res = await fetch(`https://crypto-blog-backend.vercel.app/api/crypto-price?coinFilter=${coinFilter}`);
                    const data = await res.json();

                    if (data.price) {
                        setCoinPrice(parseFloat(data.price));
                    }
                } catch (error) {
                    console.error("Error fetching BTC price:", error);
                }
            };

            fetchPrice();
            const priceInterval = setInterval(fetchPrice, 5000); // Update tiap 5 detik

            return () => clearInterval(priceInterval);

            

    }, [coinFilter, period]);    

    const getCoinPath = (coin) => {
        switch (coin) {
            case "BTC" :
                return bitcoinImage;
            case "ETH" :
                return ethereumImage;   
            case "SOL" :
                return solanaImage;     
            case "DOGE":
                return dogeImage;
            case "BNB" :
                return bnbImage;
            case "ADA" :
                return adaImage;
            case "XRP" :
                return xrpImage;
            case "DOT" :
                return dotImage;                    
        }
    }

    const sentimentCount = {
        Bullish: news.filter((n) => n.sentiment === "Bullish").length,
        Bearish: news.filter((n) => n.sentiment === "Bearish").length,
        Neutral: news.filter((n) => n.sentiment === "Neutral").length
    };

    const  getIconSentiment = (sentiment) => {
        if (sentiment === "bearish") {
            return (
                <div className="sentiment_label">
                   <FaArrowDown className="text-danger arrowDown"/>
                </div>
            )
        }

        if (sentiment === "bullish") {
            return (
                <div className="sentiment_label">
                   <FaArrowUp className="text-success arrowUp" />
                </div>
            )
        }

        return(
            <div className="sentiment_label">
                <FaMinusCircle className="text-warning neturalIcon" />
            </div> 
             )
    }

    const formattedDate = (date) => {
        const formattedDate = new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
          
        return formattedDate
          
    }

    return (
        <>
            <div className="container wrapper_analysis">
                <div 
                    className="title_sentiment_wrapper" 
                    style={{ 
                        display: "grid", 
                        gridTemplateColumns: "1fr auto",
                        alignItems: "center"
                    }}
                    >
                    <p style={{ fontSize: "1.3em", fontWeight: "bold" }} className="space-title">
                        News Sentiment - {coinFilter}
                    </p>
                    <p className="read_more btn btn-warning general-font" onClick={() =>navigate('/news')} style={{ justifySelf: "end" }}>Explore More News</p>
                </div>

                <div className="d-flex justify-content-center flex-column align-items-center general-font p-3">
                    <p style={{fontSize:"1.4em"}}>${coinPrice} 
                        <Image 
                            src={getCoinPath(coinFilter)} 
                            alt="Bitcoin" 
                            width={40} 
                            height={40} /></p>
                </div>

                <div className="input-group select-option general-font">
                        <div className="input-group-prepand" style={{width:"72px"}}>
                            <label className="input-group-text" htmlFor="inputGroupSelect01">Period</label>
                        </div>
                        <select id="select_period" className="form-control" onChange={(e) => setPeriod(e.target.value)}>
                            <option value="today">Today</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                </div>
                <div className="input-group mt-3 select-option general-font">
                        <div className="input-group-prepand" style={{width:"72px"}}>
                            <label className="input-group-text" htmlFor="inputGroupSelect01">Coin</label>
                        </div>
                        <select id="inputGroupSelect01" className="form-control mb-3" value={coinFilter} onChange={(e) => setCoinFilter(e.target.value)}>
                            <option value={"BTC"}>BTC</option>
                            <option value={"ETH"}>ETH</option>
                            <option value={"SOL"}>SOL</option>
                            <option value={"DOGE"}>DOGE</option>
                            <option value={"BNB"}>BNB</option>
                            <option value={"ADA"}>ADA</option>
                            <option value={"XRP"}>XRP</option>
                            <option value={"DOT"}>DOT</option>
                        </select>
                </div>
              
                <SentimentProgress 
                                totalBullish={totalBullish} 
                                totalNeutral={totalNeutral}
                                totalBearish={totalBearish}
                                totalNews={totalNews}
                                />
                {isLoading && <Loading />}                
                {!isLoading && (
                    <>
                        <div className="main_container_sentiment general-font">
                            <div className="news_list">

                                {news.length === 0 && (
                                    <>
                                        <h3 className="no_data" style={{textAlign:"center", marginTop:"32px"}}>No Data</h3>
                                    </>
                                )}

                                {news.length > 0 && news.map((data,index)=> {
                                    const classNameSpan = data.sentiment
                                    const iconSentiment = getIconSentiment(data.sentiment)
                                    return (
                                        <>
                                            <div className="news_sentiments">
                                                <div className="link_text">
                                                    <a className="some_a_tag" href={data.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                                                            <span  className="span_link">{data.title}</span>
                                                    </a>
                                                    <p className="date_published">{formattedDate(data.published)}</p>
                                                </div>
                                                <div className="icon_wrapper">
                                                    <span style={{color:"black"}}>{iconSentiment}</span>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )}

               { news.length < 3 && 
                <p className="read_more_2 btn btn-warning general-font" onClick={() =>navigate('/news')} style={{ justifySelf: "end" }}>Explore More News</p>

               }
                
            </div>
        </>
    );
}
