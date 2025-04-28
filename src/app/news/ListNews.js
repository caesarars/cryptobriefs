'use client';

import "./ListNews.css";

const imageDefault = "https://firebasestorage.googleapis.com/v0/b/image-storing-project.appspot.com/o/cryptocurrency.jpg?alt=media&token=2ba8d0f2-434e-4b27-a702-44e7086e481a";

const ListNews = ({ data }) => {

  const formattedDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "bearish":
        return "text-danger";
      case "bullish":
        return "text-success";
      case "neutral":
        return "text-warning";
      default:
        return "";
    }
  };

  return (
    <div className="container_news_list pt-5 mb-5">
      {data.length > 0 && data.map((news) => (
        <div key={news._id} className="blog-card">
          <a href={news.link} target="_blank" rel="noopener noreferrer">
            <img
              src={news.image || "https://via.placeholder.com/400"}
              alt={news.title.replace(/<[^>]*>/g, "")}
              className="blog-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = imageDefault;
              }}
            />
          </a>
          <div className="blog-content">
            <div>
              <a 
                href={news.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: "black", textDecoration: "none" }}
              >
                <h3 className="blog-title">{news.title.replace(/<[^>]*>/g, "")}</h3>
              </a>
            </div>
            <p 
              style={{ fontSize: "16px", fontWeight: "500" }} 
              className={`blog-snippet ${getSentimentColor(news.sentiment)}`}
            >
              {news.sentiment}
            </p>
            <p className="blog-snippet">{formattedDate(news.published)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListNews;
