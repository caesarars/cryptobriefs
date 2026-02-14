'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaMinusCircle } from "react-icons/fa";
import Loading from "../loading/Loading";
import "./CryptoSentiment.css";
import SentimentProgress from "./SentimentProgress";

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
    const [coinPrice, setCoinPrice] = useState(null)
    const [lastWeekBullishPct, setLastWeekBullishPct] = useState(null)
    const [compareEnabled, setCompareEnabled] = useState(false)
    const [compareStats, setCompareStats] = useState(null)

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true)

        const fetchSentiment = async () => {
            try {
                const res = await fetch(`https://ces.dbrata.my.id/api/news/newsWithSentiment${coinFilter ? `?coin=${coinFilter}` : ""}&period=${period}`);
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
                const res = await fetch(`https://ces.dbrata.my.id/api/news/newsWithSentiment${coinFilter ? `?coin=${coinFilter}` : ""}&period=week`);
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

        return () => {
            isMounted = false;
        };

    }, [coinFilter, period]);    

    useEffect(() => {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

        let ws;
        let cancelled = false;
        let hasPrice = false;
        let pollInterval;

        const coinCapAsset = getCoinCapAsset(coinFilter);
        const backendCoinFilter = String(coinFilter || "").toLowerCase(); // btc/eth/sol...

        const applyPrice = (value) => {
            const nextPrice = Number(value);
            if (Number.isFinite(nextPrice) && nextPrice > 0) {
                hasPrice = true;
                setCoinPrice(nextPrice);
                return true;
            }
            return false;
        };

        // Prefer backend (Redis-cached) first
        const fetchRedisPrice = async () => {
            try {
                if (!API_BASE) return;
                const res = await fetch(`${API_BASE}/api/crypto-price?coinFilter=${backendCoinFilter}`, { cache: 'no-store' });
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled) {
                    applyPrice(data?.price);
                }
            } catch (error) {
                console.error(`Redis/backend price fetch failed for ${coinFilter}:`, error);
            }
        };

        setCoinPrice(null);
        fetchRedisPrice();

        // Start CoinCap WS for live updates (optional enhancement)
        try {
            ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${coinCapAsset}`);
        } catch (error) {
            console.error(`WebSocket init failed for ${coinFilter}:`, error);
            // If WS cannot init, keep polling backend
            pollInterval = setInterval(fetchRedisPrice, 15000);
            return () => {
                cancelled = true;
                clearInterval(pollInterval);
            };
        }

        // If WS doesn't deliver quickly, poll backend (Redis) as safety net
        pollInterval = setInterval(() => {
            if (!hasPrice) fetchRedisPrice();
        }, 15000);

        ws.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                const priceCandidate = payload?.[coinCapAsset];
                applyPrice(priceCandidate);
            } catch (error) {
                console.error("WebSocket payload parse error:", error);
            }
        };

        ws.onerror = (error) => {
            console.error(`WebSocket error for ${coinFilter}:`, error);
            fetchRedisPrice();
        };

        return () => {
            cancelled = true;
            clearInterval(pollInterval);
            if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
                ws.close();
            }
        };
    }, [coinFilter]);

    useEffect(() => {
        if (!compareEnabled) return;
        let isMounted = true;

        const fetchCompare = async () => {
            try {
                const [btcRes, ethRes] = await Promise.all([
                    fetch(`https://ces.dbrata.my.id/api/news/newsWithSentiment?coin=BTC&period=${period}`),
                    fetch(`https://ces.dbrata.my.id/api/news/newsWithSentiment?coin=ETH&period=${period}`),
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
            default:
                return bitcoinImage;
        }
    }

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

    const getCoinCapAsset = (coin) => {
        const assetMap = {
            "BTC": "bitcoin",
            "ETH": "ethereum",
            "SOL": "solana",
            "DOGE": "dogecoin",
            "BNB": "binance-coin",
            "ADA": "cardano",
            "XRP": "xrp",
            "DOT": "polkadot"
        };
        return assetMap[coin] || "bitcoin";
    }

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

    const formatCoinPrice = (value) => {
        const num = Number(value);
        if (!Number.isFinite(num) || num <= 0) return "$ 0.0000";
        const options =
            num < 1
                ? { minimumFractionDigits: 4, maximumFractionDigits: 4 }
                : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        return `$ ${num.toLocaleString("en-US", options)}`;
    };

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
                <div className="title_sentiment_wrapper">
                    <div>
                        <p className="widget_kicker">Signal Radar</p>
                        <p className="space-title sentiment_title">
                            News Sentiment - {coinFilter}
                        </p>
                    </div>
                    <button type="button" className="read_more sentiment_cta" onClick={() => router.push('/news')}>
                        Explore More News
                    </button>
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
                    className="coin_price_card general-font"
                    onClick={() => router.push(`/${getCoinSlug(coinFilter)}`)}
                >
                    <p className="coin_price_value">
                        <span className="coin_price_amount">{formatCoinPrice(coinPrice)}</span>
                        <Image
                            className="coin_price_icon"
                            src={getCoinPath(coinFilter)}
                            alt={coinFilter}
                            width={40}
                            height={40}
                        />
                    </p>
                    <small className="coin_price_hint">
                        Click to view {coinFilter} page →
                    </small>
                </div>

                <div className="input-group select-option general-font">
                        <div className="input-group-prepand select_label_wrap">
                            <label className="input-group-text" htmlFor="select_period">Period</label>
                        </div>
                        <select id="select_period" className="form-control" onChange={(e) => setPeriod(e.target.value)}>
                            <option value="today">Today</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                </div>
                <div className="input-group mt-3 select-option general-font">
                        <div className="input-group-prepand select_label_wrap">
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
                                <button type="button" className="sentiment_btn" onClick={() => router.push(`/news?coin=${coinFilter}`)}>
                                    Open {coinFilter} sentiment
                                </button>
                                <button type="button" className="sentiment_btn sentiment_btn_outline" onClick={() => setCompareEnabled((prev) => !prev)}>
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
                                    <h3 className="no_data">No Data</h3>
                                )}

                                {news.length > 0 && news.map((data,index)=> {
                                    const iconSentiment = getIconSentiment(data.sentiment)
                                    return (
                                        <div className="news_sentiments" key={`${data.link}-${index}`}>
                                            <div className="link_text">
                                                <a className="some_a_tag" href={data.link} target="_blank" rel="noopener noreferrer">
                                                    <span className="span_link">{data.title}</span>
                                                </a>
                                                <p className="date_published">{formattedDate(data.published)}</p>
                                            </div>
                                            <div className="icon_wrapper">
                                                {iconSentiment}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )}

               { news.length < 3 && 
                <button type="button" className="read_more_2 sentiment_cta" onClick={() => router.push('/news')}>Explore More News</button>

               }
                
            </div>
        </>
    );
}
