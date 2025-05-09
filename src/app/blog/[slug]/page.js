// app/blog/[slug]/page.js

import { notFound } from 'next/navigation';
import "./BlogDetail.css"
import { Suspense } from 'react';

export async function generateMetadata({ params }) {
    const slug = params.slug;
    const blog = await getBlog(slug);
  
    if (!blog) {
      return {
        title: 'Blog Not Found | CryptoBriefs',
        description: 'This blog post could not be found.',
      };
    }
  
    const cleanTitle = blog.title.replace(/<\/?[^>]+(>|$)/g, "");
    const cleanContent = blog.content ? getContentText(JSON.parse(blog.content)) : "";
  
    return {
      title: `${cleanTitle} | CryptoBriefs`,
      description: cleanContent.slice(0, 160) || 'Read the latest insights on CryptoBriefs.',
      openGraph: {
        title: `${cleanTitle} | CryptoBriefs`,
        description: cleanContent.slice(0, 160),
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
        description: cleanContent.slice(0, 160),
        images: [blog.imageUrl || '/default-og-image.jpg'],
      },
    };
  }
  

const getBlog = async (slug) => {
  try {
    const response = await fetch(`https://crypto-blog-backend.vercel.app/api/getBlogBySlug?slug=${slug}`, {
      cache: "no-store",
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
      cache: "no-store",
    });
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching suggested blogs:", error);
    return [];
  }
};

const getContentText = (parsedContent) => {
  const contentSource = parsedContent?.section?.length
    ? parsedContent.section
    : parsedContent?.sections?.length
    ? parsedContent.sections
    : [];
  const text = contentSource.length > 0 ? contentSource[0].text : "";
  return text.replace(/<\/?[^>]+(>|$)/g, "");
};

const BlogDetail = async (props) => {
  const { slug } = await props.params;
  const blog = await getBlog(slug);

  if (!blog) notFound();
  const content =  blog.content ? JSON.parse(blog.content) : { section: [] };
  const parsedContent = blog.content ? JSON.parse(blog.content) : { section: [] };
  const suggestedBlogs = await getSuggestedBlogs(blog.title);

  return (
    <>

      <div className="">
        <div className="blog-detail-container">
        <div className="main-content">
            <div className="blog-header">
                <img src={blog.imageUrl} alt={blog.title.replace(/<\/?[^>]+(>|$)/g, "")} className="blog-image-2" />
              </div>
          <article itemScope itemType="https://schema.org/Article" className="blog-content">
              <header className="mb-4">
                <h2 className="blog-title-2">{blog.title.replace(/<\/?[^>]+(>|$)/g, "")}</h2>
                <time className="blog-meta-2">Published on {new Date(blog.created_at).toDateString()}</time>
              </header>
           </article>

           <section itemProp="articleBody" className="general-font p-2">
                {(content.section || content.sections) 
                ? (content.section ?? content.sections).map((section, index) => {
                    if (section.type === "subhead") {
                      return (
                        <h2 key={index} className="blog-subhead" style={{marginTop:"41px"}}>
                          {section.text.replace(/<[^>]*>/g, "")}
                        </h2>
                      );
                    } else if (section.type === "numbered-list") {
                      const listOfText = section.text.split("\n").filter(text => text.trim());

                      return (
                        <ul key={index} className="blog-numbered-list">
                        {listOfText.map((text, idx) => {
                          const cleanedText = text.replace(/^\d+\.\s*/, "");
                          return (
                            <li className="blog-list-text" key={idx}>
                              <p dangerouslySetInnerHTML={{ __html: cleanedText }} />
                            </li>
                          );
                        })}
                        </ul>
                      );
                    } else {
                      return (
                        <>
                          <p key={index} className="blog-paragraph-2 mb-2" dangerouslySetInnerHTML={{ __html:  section.text }} />
                        </>
                        
                      );
                    }
                }) 
                : null}   
                </section>
          </div>
        </div>

        {/* Suggested blogs section */}
        {suggestedBlogs.length > 0 && (
          <div className="suggested-blogs">
            {/* Render suggested blogs */}
          </div>
        )}
      </div>

    </>
  );
};

export default BlogDetail;
