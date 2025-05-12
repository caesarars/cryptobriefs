'use client';

import "./ListNews.css";

const AnalysisSentiment = ({ data }) => {

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
    <div className="container">
        <div className="wrapper_sentiment">
            <p>Bearish</p>
            <p>Total</p>
        </div>
    </div>
  );
};

export default AnalysisSentiment;
