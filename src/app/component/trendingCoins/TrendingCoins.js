'use client'; // ⬅️ wajib kalau pakai useState, useEffect
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

                // Ambil harga terbaru
                const priceData = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
                );

                // Gabungkan data coin dengan harga
                const updatedCoins = data.coins.map((coin) => ({
                    id: coin.item.id,
                    name: coin.item.name,
                    symbol: coin.item.symbol.toUpperCase(),
                    image: coin.item.small,
                    price: priceData.data[coin.item.id]?.usd || "N/A",
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
        if (num < 0.01) return num.toFixed(8);
        if (num < 1) return num.toFixed(4);
        return num.toFixed(2);
      };

    return (
        <div className="container_tranding_coins">
            <p style={{ fontSize: "1.3em" }} className="wording_trending_coins space-title">🔥 Trending Coins 🔥</p>
            {loading ? (
                <Loading/>
            ) : (
                <div className="subwrapper general-font">
                    {coins.map((coin, index) => (
                        <div key={coin.id} className="p-2">
                            <div className="container_list_coin">
                                <span style={{marginRight:"8px"}}>{++index}</span>
                                <img src={coin.image} alt={coin.id} width={"32px"}/>
                                <p>{coin.symbol}</p>
                                <p style={{textAlign:"right"}}>${formatPrice(coin.price)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TrendingCoins
