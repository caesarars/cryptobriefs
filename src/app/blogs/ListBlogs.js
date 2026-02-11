// src/components/ListBlogs.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import "./ListBlogs.css";

const ListBlogs = ({ blogs, featured }) => {
  const parseJsonContent = (jsonString) => {
    try {
      const jsonContent = JSON.parse(jsonString);
      const contentSource = Array.isArray(jsonContent.section)
        ? jsonContent.section
        : Array.isArray(jsonContent.sections)
        ? jsonContent.sections
        : [];
  
      const text = contentSource.length > 0 ? contentSource[0].text : "";
      return cleanPreviewText(text);
    } catch (error) {
      // Fallback: bersihkan langsung dari string biasa
      return cleanPreviewText(jsonString);
    }
  };
  
  const cleanPreviewText = (rawText) => {
    const cleanText = rawText
      .replace(/<\/?[^>]+(>|$)/g, '')        // remove HTML
      .replace(/[#*_`~>\[\]\(\)]/g, '')      // remove markdown symbols
      .replace(/\\n|\\r|\n|\r/g, ' ')        // remove newline
      .replace(/\s+/g, ' ')                  // normalize spaces
      .trim();
  
    const words = cleanText.split(' ');
    const preview = words.slice(0, 60).join(' ');
    return words.length > 60 ? preview + '...' : preview;
  };
  

  if (!blogs || blogs.length === 0) return null;

  const featuredItem = featured || blogs[0];
  const rest = blogs.filter((b) => b._id !== featuredItem?._id);

  return (
    <div className="container">
      {featuredItem ? (
        <div className="featured-blog">
          <Link href={`/blog/${featuredItem.slug}`}>
            <img
              loading="lazy"
              src={featuredItem.imageUrl || "https://via.placeholder.com/800x450"}
              alt={featuredItem.title?.replace(/<[^>]*>/g, "")}
              className="featured-image"
            />
          </Link>
          <div className="featured-content">
            <Link href={`/blog/${featuredItem.slug}`}>
              <h2 className="featured-title">
                {featuredItem.title?.replace(/<[^>]*>/g, "")}
              </h2>
            </Link>
            <p className="featured-snippet">
              {parseJsonContent(featuredItem.content) ?? ""}
            </p>
            <Link href={`/blog/${featuredItem.slug}`}>
              <button className="btn btn-glow read-more">Read More</button>
            </Link>
          </div>
        </div>
      ) : null}

      <div className="blogs-container">
        {rest.map((item) => {
        const content = parseJsonContent(item.content) ?? "";
        const imageUrl = item.imageUrl || "https://via.placeholder.com/400";
        const cleanTitle = item.title.replace(/<[^>]*>/g, "");

        return (
          <div key={item._id} className="blog-card">
            <Link href={`/blog/${item.slug}`}>
                    <img
                        loading="lazy"
                            src={item.imageUrl || "https://via.placeholder.com/400"} 
                            alt={item.title.replace(/<[^>]*>/g, "")} 
                            className="blog-image"
                        />
            </Link>

            <div className="blog-content">
              <Link href={`/blog/${item.slug}`}>
                <p className="blog-title">{cleanTitle}</p>
              </Link>
              <p
                className="blog-snippet"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              <Link href={`/blog/${item.slug}`}>
                <button className="btn btn-glow read-more">Read More</button>
              </Link>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default ListBlogs;
