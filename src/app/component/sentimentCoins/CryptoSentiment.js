'use client'; // WAJIB buat pake useRouter dan hooks di Next.js Client Components

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaMinusCircle } from "react-icons/fa";
import Loading from "../loading/Loading"; // pastikan udah adaptasi
import "./CryptoSentiment.css";
import SentimentProgress from "./SentimentProgress"; // pastikan udah adaptasi

// Import assets
import bitcoinImage from "../../assets/image/bitcoin.png";
import bnbImage from "../../assets/image/bnb.png";
import adaImage from "../../assets/image/coin.png";
import dogeImage from "../../assets/image/dogecoin.png";
import ethereumImage from "../../assets/image/ethereum.png";
import dotImage from "../../assets/image/polkadot.png";
import solanaImage from "../../assets/image/solana.png";
import xrpImage from "../../assets/image/xrp.png";

export default function CryptoSentiment() {
    const router = useRouter()
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
    const [lastWeekBullishPct, setLastWeekBullishPct] = useState(null)
    const [compareEnabled, setCompareEnabled] = useState(false)
    const [compareStats, setCompareStats] = useState(null)

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true)

        const fetchSentiment = async () => {
            try {
                const res = await fetch(`https://crypto-blog-backend.vercel.app/api/news/newsWithSentiment${coinFilter ? `?coin=${coinFilter}` : ""}&period=${period}`);
                const data = await res.json();
                if (!isMounted) return;
                setNews(data.news)
                setTotalBullish(data.sentimentCounts.bullish)
                setTotalBearish(data.sentimentCounts.bearish)
                setTotalNeutral(data.sentimentCounts.neutral)
                setTotalNews(data.news.length)
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                if (isMounted) setIsLoading(false)
            }
        };

        const fetchLastWeek = async () => {
            try {
                const res = await fetch(`https://crypto-blog-backend.vercel.app/api/news/newsWithSentiment${coinFilter ? `?coin=${coinFilter}` : ""}&period=week`);
                const data = await res.json();
                const total = data.news.length || 1;
                const pct = Math.round((data.sentimentCounts.bullish / total) * 100);
                if (isMounted) setLastWeekBullishPct(pct);
            } catch (error) {
                console.error("Error fetching last week sentiment:", error);
            }
        };

        fetchSentiment();
        fetchLastWeek();

        // Fetch harga coin dari Binance
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

        return () => {
            isMounted = false;
            clearInterval(priceInterval);
        };

    }, [coinFilter, period]);    

    useEffect(() => {
        if (!compareEnabled) return;
        let isMounted = true;

        const fetchCompare = async () => {
            try {
                const [btcRes, ethRes] = await Promise.all([
                    fetch(`https://crypto-blog-backend.vercel.app/api/news/newsWithSentiment?coin=BTC&period=${period}`),
                    fetch(`https://crypto-blog-backend.vercel.app/api/news/newsWithSentiment?coin=ETH&period=${period}`),
                ]);
                const [btcData, ethData] = await Promise.all([btcRes.json(), ethRes.json()]);
                const btcTotal = btcData.news.length || 1;
                const ethTotal = ethData.news.length || 1;
                const btcPct = Math.round((btcData.sentimentCounts.bullish / btcTotal) * 100);
                const ethPct = Math.round((ethData.sentimentCounts.bullish / ethTotal) * 100);
                if (isMounted) {
                    setCompareStats({
                        BTC: { bullishPct: btcPct, totalNews: btcData.news.length },
                        ETH: { bullishPct: ethPct, totalNews: ethData.news.length },
                    });
                }
            } catch (error) {
                console.error("Error fetching compare sentiment:", error);
            }
        };

        fetchCompare();
        return () => {
            isMounted = false;
        };
    }, [compareEnabled, period]);

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

    // Map coin ticker to page slug
    const getCoinSlug = (coin) => {
        const slugMap = {
            "BTC": "bitcoin",
            "ETH": "ethereum",
            "SOL": "solana",
            "DOGE": "dogecoin",
            "BNB": "binancecoin",
            "ADA": "cardano",
            "XRP": "ripple",
            "DOT": "polkadot"
        };
        return slugMap[coin] || "bitcoin";
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

    const bullishPct = totalNews > 0 ? Math.round((totalBullish / totalNews) * 100) : 0;
    const noSignals = totalBullish === 0 && totalBearish === 0 && totalNeutral === 0;
    const biasLabel = noSignals
        ? "Neutral"
        : bullishPct >= 55
        ? "Bullish"
        : bullishPct <= 45
        ? "Bearish"
        : "Neutral";
    const biasClass = biasLabel === "Bullish" ? "bias_bullish" : biasLabel === "Bearish" ? "bias_bearish" : "bias_neutral";

    const trendDelta = lastWeekBullishPct === null ? 0 : bullishPct - lastWeekBullishPct;
    const trendIcon = trendDelta > 1 ? <FaArrowUp /> : trendDelta < -1 ? <FaArrowDown /> : <FaMinusCircle />;
    const trendText = trendDelta > 1 ? "Sentiment ↑ from last week" : trendDelta < -1 ? "Sentiment ↓ from last week" : "Sentiment flat vs last week";
    const momentumText = trendDelta > 1 ? "Momentum increasing vs last week" : trendDelta < -1 ? "Momentum cooling vs last week" : "Momentum steady vs last week";

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
                    <p className="read_more btn btn-warning general-font" onClick={() => router.push('/news')} style={{ justifySelf: "end" }}>Explore More News</p>
                </div>

                <div className="sentiment_explain">
                    <div className="sentiment_explain_title">
                        <span>Sentiment score</span>
                        <span className="tooltip_badge" title="Sentiment based on 120+ news articles & social mentions">i</span>
                    </div>
                    <p className="sentiment_explain_text">
                        Score reflects the share of bullish vs bearish coverage for {coinFilter} in the selected period.
                    </p>
                </div>

                <div
                    className="d-flex justify-content-center flex-column align-items-center general-font p-3"
                    onClick={() => router.push(`/${getCoinSlug(coinFilter)}`)}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    <p style={{fontSize:"1.4em", margin: 0}}>
                        $ {coinPrice}
                        <Image
                            style={{marginLeft:"12px"}}
                            src={getCoinPath(coinFilter)}
                            alt={coinFilter}
                            width={40}
                            height={40}
                        />
                    </p>
                    <small style={{fontSize:"0.8em", color: "rgba(255,255,255,0.7)", marginTop: "4px"}}>
                        Click to view {coinFilter} page →
                    </small>
                </div>

                <div className="input-group select-option general-font">
                        <div className="input-group-prepand" style={{width:"72px"}}>
                            <label className="input-group-text" htmlFor="select_period">Period</label>
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
                        <div className="sentiment_takeaway general-font">
                            <div className="takeaway_row">
                                <span className={`bias_tag ${biasClass}`}>Bias: {biasLabel} ({bullishPct}%)</span>
                                <span className="momentum_tag">{momentumText}</span>
                            </div>
                            <div className="trend_row">
                                <span className="trend_icon">{trendIcon}</span>
                                <span className="trend_text">{trendText}</span>
                            </div>
                            <div className="sentiment_actions">
                                <button className="sentiment_btn" onClick={() => router.push(`/news?coin=${coinFilter}`)}>
                                    Open {coinFilter} sentiment
                                </button>
                                <button className="sentiment_btn sentiment_btn_outline" onClick={() => setCompareEnabled((prev) => !prev)}>
                                    {compareEnabled ? "Hide BTC vs ETH" : "Compare BTC vs ETH"}
                                </button>
                            </div>
                            {compareEnabled && compareStats && (
                                <div className="compare_panel">
                                    <div className="compare_card">
                                        <span className="compare_symbol">BTC</span>
                                        <span className="compare_value">{compareStats.BTC?.bullishPct ?? "—"}% Bullish</span>
                                        <span className="compare_subtext">{compareStats.BTC?.totalNews ?? 0} articles</span>
                                    </div>
                                    <div className="compare_card">
                                        <span className="compare_symbol">ETH</span>
                                        <span className="compare_value">{compareStats.ETH?.bullishPct ?? "—"}% Bullish</span>
                                        <span className="compare_subtext">{compareStats.ETH?.totalNews ?? 0} articles</span>
                                    </div>
                                </div>
                            )}
                        </div>
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
                <p className="read_more_2 btn btn-warning general-font" onClick={() => router.push('/news')} style={{ justifySelf: "end" }}>Explore More News</p>

               }
                
            </div>
        </>
    );
}
