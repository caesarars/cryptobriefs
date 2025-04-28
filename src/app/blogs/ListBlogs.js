// src/components/ListBlogs.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import "./ListBlogs.css";

const ListBlogs = ({ blogs }) => {
  const parseJsonContent = (jsonString) => {
    try {
      const jsonContent = JSON.parse(jsonString);
      const section = Array.isArray(jsonContent.section) ? jsonContent.section[0] : null;
      const sections = Array.isArray(jsonContent.sections) ? jsonContent.sections[0] : null;
      return section?.text ?? sections?.text ?? null;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  };

  return (
    <div className="container blogs-container">
      {blogs.map((item) => {
        const content = parseJsonContent(item.content);
        const imageUrl = item.imageUrl || "https://via.placeholder.com/400";
        const cleanTitle = item.title.replace(/<[^>]*>/g, "");

        return (
          <div key={item._id} className="blog-card">
            <Link href={`/blog/${item.slug}`}>
                    <img
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
