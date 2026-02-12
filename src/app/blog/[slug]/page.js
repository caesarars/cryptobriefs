// app/blog/[slug]/page.js
import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import './BlogDetail.css';
import SuggestedBlog from './SuggestedBlog.js';
import ReactMarkdown from "react-markdown";
import StructuredData from "./StructuredData";
import ReadingProgress from "./ReadingProgress";  

export async function generateMetadata({params}) {
  const slug = params.slug;
  const blog = await getBlog(slug);
  if (!blog) {
    return {
      title: 'Blog Not Found | CryptoBriefs',
      description: 'This blog post could not be found.',
    };
  }
  blog.formattedDate = new Date(blog.created_at).toUTCString();

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
    const response = await fetch(`https://ces.dbrata.my.id/api/getBlogBySlug?slug=${slug}`, {
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
    const response = await fetch(`https://ces.dbrata.my.id/suggestedBlog?currentTitle=${encodeURIComponent(title)}`, {
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
  const { slug } = props.params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const isJSON = isJSONContent(blog.content);
  const parsedContent = isJSON ? JSON.parse(blog.content) : null;
  const contentSections = parsedContent?.section?.length
    ? parsedContent.section
    : parsedContent?.sections || [];
  const plainTextContent = isJSON
    ? contentSections.map((section) => section.text).join(" ") || ""
    : blog.content;
  const cleanText = plainTextContent.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const wordCount = plainTextContent
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const publishedDate = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "-";
  const introText = cleanText ? `${cleanText.slice(0, 220)}${cleanText.length > 220 ? "..." : ""}` : "";

  const suggestedBlogs = await getSuggestedBlogs(blog.title);
  const affiliateLink = "https://partner.bybit.com/b/aff_13915_123677";
  const tocItems = isJSON
    ? contentSections
        .filter((section) => section.type === "subhead")
        .map((section) => section.text.replace(/<[^>]*>/g, ""))
    : [];

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const affiliateCallout = (
    <aside className="affiliate-callout" aria-label="Sponsored content">
      <p className="affiliate-label">Sponsored</p>
      <h3 className="affiliate-title">Trade smarter with Bybit</h3>
      <p className="affiliate-text">
        Get low fees, deep liquidity, and pro-grade tools. Use our link to unlock
        rewards and support CryptoBriefs.
      </p>
      <div className="affiliate-actions">
        <a
          className="affiliate-cta"
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          Claim bonus
        </a>
        <a
          className="affiliate-secondary"
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          Learn more
        </a>
      </div>
    </aside>
  );

  return (
    <div className="wrapper-blog-content">
      <ReadingProgress />
      <div className="blog-layout">
        <main className="blog-detail-container">
          <div className="main-content">
            <div className="blog-header">
              <Image
                className="image_cover"
                src={blog.imageUrl || "/default-og-image.jpg"}
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
                <div className="article-chip-row">
                  <span className="article-chip">CryptoBriefs Insight</span>
                  <span className="article-chip article-chip-subtle">{readingTime} min read</span>
                </div>
                <h1 className="blog-title-2">{blog.title.replace(/<\/?[^>]+(>|$)/g, "")}</h1>
                {introText ? <p className="blog-intro">{introText}</p> : null}
                <div className="blog-meta-2">
                  <time className="blog-meta-item">
                    Published on {publishedDate}
                  </time>
                </div>
              </header>
            </article>

            <section itemProp="articleBody" className="blog-article-body general-font">
              {isJSON && contentSections?.length ? (
                contentSections.map((section, index) => {
                if (section.type === "subhead") {
                  return (
                    <React.Fragment key={index}>
                      <h2
                        className="blog-subhead"
                        id={slugify(section.text.replace(/<[^>]*>/g, ""))}
                      >
                        {section.text.replace(/<[^>]*>/g, "")}
                      </h2>
                      {index === 0 && affiliateCallout}
                      {index === 2 && affiliateCallout}
                    </React.Fragment>
                  );
                } else if (section.type === "numbered-list") {
                  const listOfText = section.text.split("\n").filter(text => text.trim());
                  return (
                    <React.Fragment key={index}>
                      <div className="blog-numbered-list">
                        {listOfText.map((text, idx) => {
                          const cleanedText = text.replace(/^\d+\.\s*/, "");
                          return (
                            <div key={idx} className="blog-paragraph-3 mb-2">
                              <ReactMarkdown>{cleanedText}</ReactMarkdown>
                            </div>
                          );
                        })}
                      </div>
                      {index === 0 && affiliateCallout}
                      {index === 2 && affiliateCallout}
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment key={index}>
                      <div className="blog-paragraph-2 mb-2">
                        <ReactMarkdown
                          components={{
                            img: (props) => (
                              <figure className="content-figure">
                                <img
                                  {...props}
                                  className="content-image"
                                  loading="lazy"
                                />
                                {props.title ? (
                                  <figcaption className="content-caption">
                                    {props.title}
                                  </figcaption>
                                ) : null}
                              </figure>
                            ),
                          }}
                        >
                          {section.text}
                        </ReactMarkdown>
                      </div>
                      {index === 0 && affiliateCallout}
                      {index === 2 && affiliateCallout}
                    </React.Fragment>
                  );
                  }
                })
              ) : (
                // Jika bukan JSON, render langsung dengan ReactMarkdown
                <div className="blog-paragraph-2">
                  {affiliateCallout}
                  <ReactMarkdown
                  components={{
                      img: (props) => (
                        <figure className="content-figure">
                          <img
                            {...props}
                            className="content-image"
                            loading="lazy"
                          />
                          {props.title ? (
                            <figcaption className="content-caption">
                              {props.title}
                            </figcaption>
                          ) : null}
                        </figure>
                      ),
                    }}
                  >
                    {blog.content.replace(/\\n/g, '\n')}
                  </ReactMarkdown>
                  {affiliateCallout}
                </div>
              )}
              <aside className="trust-block" aria-label="Trust and disclosure">
                <div>
                  <h3 className="trust-title">About the author</h3>
                  <p className="trust-text">
                    CryptoBriefs Editorial Team covers markets, chains, and on-chain
                    trends with a focus on clear, actionable insights.
                  </p>
                </div>
                <div>
                  <h4 className="trust-subtitle">Sources</h4>
                  <p className="trust-text">
                    We reference public blockchain data, exchange statistics, and
                    official project announcements when available.
                  </p>
                </div>
                <div>
                  <h4 className="trust-subtitle">Disclosure</h4>
                  <p className="trust-text">
                    This article is for informational purposes only and does not
                    constitute financial advice.
                  </p>
                </div>
              </aside>
              <aside className="end-cta" aria-label="Newsletter signup">
                <h3 className="end-cta-title">Stay ahead of the market</h3>
                <p className="end-cta-text">
                  Get weekly crypto briefings, curated signals, and new opportunities
                  in your inbox.
                </p>
                <a className="end-cta-button" href="/subscribe">
                  Join the newsletter
                </a>
              </aside>
            </section>
          </div>
        </main>
        <aside className="blog-sidebar">
          {tocItems.length > 0 && (
            <div className="toc-card" aria-label="Table of contents">
              <p className="toc-title">On this page</p>
              <ul className="toc-list">
                {tocItems.map((item, index) => (
                  <li key={`${item}-${index}`} className="toc-item">
                    <a href={`#${slugify(item)}`} className="toc-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="affiliate-card" aria-label="Affiliate promotion">
            <p className="affiliate-label">Sponsored</p>
            <h3 className="affiliate-title">Get rewards with Bybit</h3>
            <p className="affiliate-text">
              Sign up through our link to access trading perks and support this
              blog at no extra cost.
            </p>
            <a
              className="affiliate-cta"
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              Start earning
            </a>
          </div>
          {suggestedBlogs.length > 0 && (
            <div className="suggested-blogs">
              <SuggestedBlog data={suggestedBlogs} />
            </div>
          )}
        </aside>
      </div>
      <StructuredData blog={blog} />
    </div>
  );
};

export default BlogDetail;
