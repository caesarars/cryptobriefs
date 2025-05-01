// src/app/news/page.jsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./News.css";
import { useRouter } from "next/navigation";


const News = () => {


const styles = {
    container: {
      width:"90%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Poppins', sans-serif",
    },
    searchInput: {
      width: "100%",
      padding: "10px",
      fontSize: "32px",
      marginBottom: "20px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    title: {
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "bold",
      color: "#333",
    },
    loadingText: {
      textAlign: "center",
      fontSize: "18px",
      color: "#777",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", // 🔥 3 kolom di layar besar
      gap: "32px",
      width: "100%",
      margin: "0 auto",
    },
    card: {
      position: "relative",  // Tambah ini biar button bisa absolute di dalam card
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "15px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.2s",
      textDecoration: "none",
      color: "#333",
    },
    
    cardHover: {
      transform: "scale(1.03)",
    },
    image: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
    },
    content: {
      padding: "15px",
    },
    newsTitle: {
      fontSize: "18px",
      color: "#222",
      marginBottom: "10px",
    },
    date: {
      fontSize: "14px",
      color: "#666",
    },
    loadMore: {
      display: "block",
      margin: "20px auto",
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "linear-gradient(135deg, #7234D9, #9f7aea)",
        color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    loadMoreHover: {
      backgroundColor: "#0056b3",
    },
    saveButton: {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      backgroundColor: "#ffcc00",
      color: "#333",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
      transition: "background 0.3s",
    },
    savedTitle: {
      marginTop: "40px",
      fontSize: "22px",
      color:"black",
      padding:"2px"
    },
    clearButton: {
      backgroundColor: "#ff4d4d",
      color: "white",
      padding: "10px 15px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "10px",
    },
    filterDropdown: {
      padding: "12px",
      fontSize: "16px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    searchBar: {
      width: "100%",  // Biar fleksibel, mengikuti layar
      maxWidth: "", // Biar gak terlalu lebar di layar besar  
      padding: "12px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      marginTop:"12px",
      marginBottom:"32px",
      color:"black"
    },
    trendingContainer: {
      marginBottom: "20px",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    trendingList: { display: "flex", gap: "10px", flexWrap: "wrap" },
    sortDropdown: {
      padding: "12px",
      fontSize: "16px",
      marginBottom: "20px",
      marginRight:"12px"
    },
    trendingItem: {
      background: "#007bff",
      color: "white",
      padding: "5px 10px",
      borderRadius: "5px",
      fontSize: "14px",
    },
    noTrending: { fontSize: "14px", color: "#888" },
  }


    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleNews, setVisibleNews] = useState(6);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 State untuk pencarian
    const [sortOrder, setSortOrder] = useState("newest"); // 📌 Sorting state (default: terbaru)
    const [selectedSource, setSelectedSource] = useState("All"); // Default: Semua berita

    const navigate = useRouter()


  useEffect(() => {
  const fetchNews = async () => {
      try {
        const response = await fetch("https://crypto-blog-backend.vercel.app/api/news/getNews");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

    const imageDefault = "https://firebasestorage.googleapis.com/v0/b/image-storing-project.appspot.com/o/cryptocurrency.jpg?alt=media&token=2ba8d0f2-434e-4b27-a702-44e7086e481a"

    // 🔍 Filter berita berdasarkan searchTerm
    const filteredNews = news.filter((item) =>
      (selectedSource === "All" || item.link.includes(selectedSource)) &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 🔥 Sortir berita berdasarkan tanggal (setelah difilter)
    const sortedNews = [...filteredNews].sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.published) - new Date(a.published) // Terbaru duluan
        : new Date(a.published) - new Date(b.published); // Terlama duluan
    });

    return (
        <div className="container pt-5 pb-3">
            <h1 className="pt-4 pb-3 space-title">Newsletter</h1>
            {isLoading ? (
                <p style={styles.loadingText}>Loading news...</p>
            ) : (
                <div style={styles.grid}>
                {sortedNews.slice(0, visibleNews).map((item, index) => (
                    <div key={index} style={styles.card}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <img
                        src={item.image || imageDefault}
                        alt={item.title}
                        style={styles.image}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = imageDefault;
                        }}
                      />
                    </a>
                    <div style={styles.content}>
                        <h2 style={styles.newsTitle}>{item.title}</h2>
                        <p style={styles.date}>{new Date(item.published).toLocaleString()}</p>
                    </div>
                    </div>
                ))}
                </div>
            )}

                <button onClick={() => navigate("/news")} className="btn-glow" style={styles.loadMore}>
                  See More
                </button>
               
        </div>
    )
}

export default News;