
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

  export default styles;