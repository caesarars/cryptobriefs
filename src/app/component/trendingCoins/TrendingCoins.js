'use client';
import {useState, useEffect}from "react";
import axios from "axios";
import "./TrendingCoins.css"
import Loading from "../loading/Loading";

const TrendingCoins = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingCoins = async () => {
            try {
                // Ambil daftar trending coins
                const { data } = await axios.get(
                    "https://api.coingecko.com/api/v3/search/trending"
                );

                // Ambil ID semua coin trending
                const coinIds = data.coins.map((coin) => coin.item.id).join(",");

                // Ambil harga terbaru + 24h % + sparkline
                const marketData = await axios.get(
                    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&sparkline=true&price_change_percentage=24h`
                );

                const marketById = new Map(
                    marketData.data.map((coin) => [coin.id, coin])
                );

                // Gabungkan data coin dengan harga
                const updatedCoins = data.coins.map((coin) => ({
                    id: coin.item.id,
                    name: coin.item.name,
                    symbol: coin.item.symbol.toUpperCase(),
                    image: marketById.get(coin.item.id)?.image || coin.item.small,
                    price: marketById.get(coin.item.id)?.current_price || "N/A",
                    change24h: marketById.get(coin.item.id)?.price_change_percentage_24h ?? null,
                    sparkline: marketById.get(coin.item.id)?.sparkline_in_7d?.price || [],
                }));

                setCoins(updatedCoins);
            } catch (error) {
                console.error("Error fetching trending coins:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingCoins();
    }, []);

    const formatPrice = (price) => {
        const num = Number(price);
        if (!Number.isFinite(num)) return "N/A";
        if (num < 0.01) return num.toFixed(8);
        if (num < 1) return num.toFixed(4);
        return num.toFixed(2);
    };

    const formatChange = (change) => {
        if (change === null || change === undefined) return "N/A";
        const sign = change > 0 ? "+" : "";
        return `${sign}${change.toFixed(2)}%`;
    };

    const getChangeClass = (change) => {
        if (change === null || change === undefined) return "change_neutral";
        return change >= 0 ? "change_positive" : "change_negative";
    };

    const Sparkline = ({ prices, isUp }) => {
        if (!prices || prices.length < 2) return null;
        const width = 90;
        const height = 30;
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min || 1;
        const points = prices
            .map((price, index) => {
                const x = (index / (prices.length - 1)) * width;
                const y = height - ((price - min) / range) * height;
                return `${x},${y}`;
            })
            .join(" ");

        return (
            <svg
                className="sparkline"
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                aria-hidden="true"
            >
                <polyline
                    fill="none"
                    stroke={isUp ? "#22c55e" : "#ef4444"}
                    strokeWidth="2"
                    points={points}
                />
            </svg>
        );
    };

    return (
        <div className="container_tranding_coins">
            <div className="trending_header">
                <div>
                    <p className="widget_kicker">Momentum Radar</p>
                    <p className="wording_trending_coins space-title">Trending Coins</p>
                </div>
                <span className="trending_badge">{coins.length || 10} coins</span>
            </div>
            {loading ? (
                <Loading/>
            ) : (
                <div className="subwrapper general-font">
                    <div className="coin_header">
                        <span>#</span>
                        <span>Coin</span>
                        <span className="coin_header_right">Price</span>
                        <span className="coin_header_right">7D</span>
                        <span className="coin_header_right">24h</span>
                    </div>
                    {coins.map((coin, index) => (
                        <a
                            key={coin.id}
                            className="coin_row"
                            href={`https://www.coingecko.com/en/coins/${coin.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="container_list_coin">
                                <span className="coin_rank">{index + 1}</span>
                                <div className="coin_meta">
                                    <img loading="lazy" src={coin.image} alt={coin.id} width={"28px"} height={"28px"}/>
                                    <div className="coin_text">
                                        <span className="coin_symbol">{coin.symbol}</span>
                                        <span className="coin_name">{coin.name}</span>
                                    </div>
                                </div>
                                <p className="coin_price">${formatPrice(coin.price)}</p>
                                <Sparkline prices={coin.sparkline} isUp={coin.change24h >= 0} />
                                <p className={getChangeClass(coin.change24h)}>
                                    {formatChange(coin.change24h)}
                                </p>
                            </div>
                        </a>
                    ))}
                    <div className="coin_header_mobile">
                        <span>#</span>
                        <span>Coin</span>
                        <span className="coin_header_right">Price</span>
                    </div>
                    {coins.map((coin, index) => (
                        <a
                            key={`${coin.id}-mobile`}
                            className="coin_row_mobile"
                            href={`https://www.coingecko.com/en/coins/${coin.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="container_list_coin_mobile">
                                <span className="coin_rank">{index + 1}</span>
                                <div className="coin_meta">
                                    <img loading="lazy" src={coin.image} alt={coin.id} width={"24px"} height={"24px"}/>
                                    <div className="coin_text">
                                        <span className="coin_symbol">{coin.symbol}</span>
                                        <span className="coin_name">{coin.name}</span>
                                    </div>
                                </div>
                                <p className={coin.change24h >= 0 ? "price_positive" : coin.change24h < 0 ? "price_negative" : "price_neutral"}>
                                    ${formatPrice(coin.price)}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TrendingCoins
