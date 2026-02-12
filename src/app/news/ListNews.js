'use client';

const ListNews = ({ data }) => {

  const formattedDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSentimentBadgeClass = (sentiment) => {
    const normalized = String(sentiment || "").toLowerCase();
    switch (normalized) {
      case "bullish":
        return "sentiment-bullish";
      case "bearish":
        return "sentiment-bearish";
      case "neutral":
      default:
        return "sentiment-neutral";
    }
  };

  const imageDefault = "https://firebasestorage.googleapis.com/v0/b/image-storing-project.appspot.com/o/cryptocurrency.jpg?alt=media&token=2ba8d0f2-434e-4b27-a702-44e7086e481a";
  const getSource = (link) => {
    try {
      return new URL(link).hostname.replace("www.", "");
    } catch {
      return "Source";
    }
  };

  return (
    <div className="news-grid pt-4">
      {data.length > 0 && data.map((news) => (
        <article key={news.link} className="news-card">
          <a href={news.link} target="_blank" rel="noopener noreferrer" className="news-card-link">
            <div className="news-image-wrap">
              <img
                src={news.image || imageDefault}
                className="news-card-image"
                alt={news.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imageDefault;
                }}
              />
              <span className={`news-sentiment ${getSentimentBadgeClass(news.sentiment)}`}>
                {String(news.sentiment || "neutral")}
              </span>
            </div>
            <div className="news-card-body">
              <h3 className="news-card-title">{news.title}</h3>
              <p className="news-card-date">Published on {formattedDate(news.published)}</p>
              <div className="news-card-meta">
                <span className="news-source">{getSource(news.link)}</span>
                <span className="news-readmore">Read story →</span>
              </div>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
};

export default ListNews;
