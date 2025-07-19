// src/components/ListBlogs.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import "./ListBlogs.css";

const ListBlogs = ({ blogs }) => {
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
  

  return (
    <div className="container blogs-container">
      {blogs.map((item) => {
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
                <p className="bold">{cleanTitle}</p>
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
  );
};

export default ListBlogs;
