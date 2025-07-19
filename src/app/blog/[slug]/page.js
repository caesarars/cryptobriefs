// app/blog/[slug]/page.js

import { notFound } from 'next/navigation';
import Image from 'next/image';
import './BlogDetail.css';
import SuggestedBlog from './SuggestedBlog.js';
import AffiliateBanner from "./AffiliateBanner.js";
import ReactMarkdown from "react-markdown";
import StructuredData from "./StructuredData";

export async function generateMetadata({params}) {
  const slug = params.slug;
  const blog = await getBlog(slug);
  blog.formattedDate = new Date(blog.created_at).toUTCString()
  if (!blog) {
    return {
      title: 'Blog Not Found | CryptoBriefs',
      description: 'This blog post could not be found.',
    };
  }

  const cleanTitle = blog.title.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 60);
  const canonicalUrl = `https://www.cryptobriefs.net/blog/${slug}`;

  const isJSONContent = (content) => {
    try {
      const parsed = JSON.parse(content);
      return parsed && (parsed.section || parsed.sections);
    } catch (e) {
      return false;
    }
  };

  // 🔍 Helper untuk mengambil deskripsi awal
  const getContentText = (parsedContent) => {
    const contentSource = parsedContent?.section?.length
      ? parsedContent.section
      : parsedContent?.sections?.length
      ? parsedContent.sections
      : [];
    const text = contentSource.length > 0 ? contentSource[0].text : "";
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  };

  let cleanContent = "";
  if (isJSONContent(blog.content)) {
    cleanContent = getContentText(JSON.parse(blog.content));
  } else {
    cleanContent = blog.content.replace(/\\n/g, '\n').slice(0, 200); // take markdown and make it readable
  }

  return {
    title: `${cleanTitle} | CryptoBriefs`,
    description: cleanContent.slice(0, 100) || 'Read the latest insights on CryptoBriefs.',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cleanTitle} | CryptoBriefs`,
      description: cleanContent.slice(0, 100),
      url: canonicalUrl,
      images: [
        {
          url: blog.imageUrl || '/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cleanTitle} | CryptoBriefs`,
      description: cleanContent.slice(0, 100),
      images: [blog.imageUrl || '/default-og-image.jpg'],
    },
  };
}

const getBlog = async (slug) => {
  try {
    const response = await fetch(`https://crypto-blog-backend.vercel.app/api/getBlogBySlug?slug=${slug}`, {
      next: { revalidate: 3600 }
    });
    const data = await response.json();
    if (data.error) return null;
    return data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
};

const getSuggestedBlogs = async (title) => {
  try {
    const response = await fetch(`https://crypto-blog-backend.vercel.app/suggestedBlog?currentTitle=${encodeURIComponent(title)}`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching suggested blogs:", error);
    return [];
  }
};

const isJSONContent = (content) => {
  try {
    const parsed = JSON.parse(content);
    return parsed && (parsed.section || parsed.sections);
  } catch (e) {
    return false;
  }
};

const BlogDetail = async (props) => {
  const { slug } = await props.params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const isJSON = isJSONContent(blog.content);
  const parsedContent = isJSON ? JSON.parse(blog.content) : null;

  const suggestedBlogs = await getSuggestedBlogs(blog.title);

  return (
    <div className="wrapper-blog-content">
      <AffiliateBanner />
      <div className="blog-detail-container">
        <div className="main-content">
          <div className="blog-header">
            <Image
              className="image_cover"
              src={blog.imageUrl}
              alt={blog.title.replace(/<\/?[^>]+(>|$)/g, "")}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw, 800px"
              style={{
                objectFit: "cover",
                borderRadius: "12px"
              }}
            />
          </div>

          <article itemScope itemType="https://schema.org/Article" className="blog-content">
            <header className="mb-4">
              <h1 className="blog-title-2">{blog.title.replace(/<\/?[^>]+(>|$)/g, "")}</h1>
              <time className="blog-meta-2">
                Published on {blog.created_at && blog.created_at.split('T')[0]}
              </time>
            </header>
          </article>

          <section itemProp="articleBody" className="general-font p-2">
            {isJSON && parsedContent?.section?.length ? (
              parsedContent.section.map((section, index) => {
                if (section.type === "subhead") {
                  return (
                    <h2 key={index} className="blog-subhead">
                      {section.text.replace(/<[^>]*>/g, "")}
                    </h2>
                  );
                } else if (section.type === "numbered-list") {
                  const listOfText = section.text.split("\n").filter(text => text.trim());
                  return (
                    <div key={index} className="blog-numbered-list">
                      {listOfText.map((text, idx) => {
                        const cleanedText = text.replace(/^\d+\.\s*/, "");
                        return (
                          <div key={idx} className="blog-paragraph-3 mb-2">
                            <ReactMarkdown>{cleanedText}</ReactMarkdown>
                          </div>
                        );
                      })}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="blog-paragraph-2 mb-2">
                      <ReactMarkdown>{section.text}</ReactMarkdown>
                    </div>
                  );
                }
              })
            ) : (
              // Jika bukan JSON, render langsung dengan ReactMarkdown
              <div className="blog-paragraph-2">
                <ReactMarkdown>{blog.content.replace(/\\n/g, '\n')}</ReactMarkdown>
              </div>
            )}
          </section>
        </div>
      </div>
      {suggestedBlogs.length > 0 && (
        <div className="suggested-blogs">
          <SuggestedBlog data={suggestedBlogs} />
        </div>
      )}
      <StructuredData blog={blog} />
    </div>
  );
};

export default BlogDetail;
