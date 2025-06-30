'use client';

// Anda bisa menghapus file ListNews.css jika semua styling sudah ditangani oleh Bootstrap.
// import "./ListNews.css";

const ListNews = ({ data }) => {

  // Fungsi untuk memformat tanggal, sudah bagus.
  const formattedDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ✅ FUNGSI DIPERBAIKI: Mengembalikan kelas background Bootstrap untuk badge.
  const getSentimentBadgeClass = (sentiment) => {
    switch (sentiment) {
      case "bullish":
        return "bg-success"; // Hijau untuk positif
      case "bearish":
        return "bg-danger";  // Merah untuk negatif
      case "neutral":
      default:
        return "bg-secondary"; // Abu-abu untuk netral
    }
  };

  // Gambar default jika terjadi error, sudah bagus.
  const imageDefault = "https://firebasestorage.googleapis.com/v0/b/image-storing-project.appspot.com/o/cryptocurrency.jpg?alt=media&token=2ba8d0f2-434e-4b27-a702-44e7086e481a";

  return (
    // ✅ LAYOUT BARU: Menggunakan sistem grid Bootstrap untuk membuat baris kartu.
    <div className="row pt-4">
      {data.length > 0 && data.map((news) => (
        // Setiap kartu berita dibungkus dalam kolom.
        // lg-4: 3 kolom di layar besar
        // md-6: 2 kolom di layar sedang
        // 12: 1 kolom di layar kecil (mobile)
        <div key={news.link} className="col-12 col-md-6 col-lg-4 mb-4">
          {/* ✅ KARTU BISA DIKLIK: Seluruh kartu adalah link yang membuka tab baru. */}
          <a href={news.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark h-100">
            <div className="card h-100 shadow-sm">
              <img
                src={news.image || imageDefault}
                className="card-img-top"
                alt={news.title}
                style={{ height: '200px', objectFit: 'cover' }} 
                onError={(e) => {
                  e.target.onerror = null; // Mencegah loop error jika gambar default juga gagal
                  e.target.src = imageDefault;
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{news.title}</h5>
                <p className="card-text text-muted small mt-auto">
                  {/* ✅ METADATA: Menampilkan tanggal yang diformat. */}
                  Published on {formattedDate(news.published)}
                </p>
                {/* ✅ BADGE SENTIMEN: Menampilkan sentimen sebagai badge berwarna. */}
                <span className={`badge ${getSentimentBadgeClass(news.sentiment)} align-self-start`}>
                  {news.sentiment}
                </span>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default ListNews;
