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
        <p><strong>{news.title} - {news.sentiment}</strong></p>
      ))}
    </div>
  );
};

export default ListNews;
