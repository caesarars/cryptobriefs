'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './Blogs.css';

const isJSONContent = (content) => {
  try {
    const parsed = JSON.parse(content);
    return parsed && (parsed.section || parsed.sections);
  } catch (e) {
    return false;
  }
};

const getContentText = (parsedContent) => {
  const contentSource = parsedContent.section?.length
    ? parsedContent.section
    : parsedContent.sections?.length
    ? parsedContent.sections
    : [];

  const text = contentSource.length > 0 ? contentSource[0].text : '';

  const plainText = text
    .replace(/<\/?[^>]+(>|$)/g, '')           // remove HTML tags
    .replace(/[#*_`~>\[\]\(\)]/g, '')         // remove markdown symbols
    .replace(/\\n|\\r|\n|\r/g, ' ')           // remove newlines
    .replace(/\s+/g, ' ')                     // normalize extra spaces
    .trim();                                  // trim leading/trailing spaces

  const words = plainText.split(' ');
  const preview = words.slice(0, 60).join(' ');

  return words.length > 60 ? preview + '...' : preview;
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'Unknown date';
  return new Date(dateValue).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getBlogs = async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams({
      order: 'desc',
      page: 1,
      limit: 5,
    }).toString();

    try {
      const response = await fetch(
        `https://ces.dbrata.my.id/api/getBlog?${queryParams}`
      );
      const data = await response.json();
      setBlogs(data.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const LoadingSkeleton = () => {
    return (
      <section className="articles_section_wrap">
        <div className="container">
          <div className="articles_widget_card">
            <div className="articles_top_bar">
              <div>
                <p className="articles_eyebrow">Editorial Picks</p>
                <h2 className="space-title text-start mb-2 articles_title">Articles</h2>
                <p className="articles_subtitle">Fresh reads from the latest crypto stories.</p>
              </div>
            </div>

            <div className="main_container">
              <div className="main_card skeletonCard">
                <div className="skeletonImageMain"></div>
                <div className="skeletonContent">
                  <div className="skeletonLineWide"></div>
                  <div className="skeletonLine"></div>
                  <div className="skeletonLineShort"></div>
                </div>
              </div>
              <div className="secondary_blog">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div className="d-flex container_second_blog skeletonCard" key={i}>
                    <div className="skeletonThumb"></div>
                    <div className="skeletonTextGroup">
                      <div className="skeletonLineWide"></div>
                      <div className="skeletonLineShort"></div>
                    </div>
                  </div>
                ))}
                <div className="skeletonButton"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="articles_section_wrap">
        <div className="container">
          <div className="articles_widget_card">
            <div className="articles_top_bar">
              <div>
                <p className="articles_eyebrow">Editorial Picks</p>
                <h2 className="space-title text-start mb-2 articles_title">Articles</h2>
                <p className="articles_subtitle">Fresh reads from the latest crypto stories.</p>
              </div>
            </div>
            <div className="p-4 rounded-4 articles_empty_state">
              <p className="mb-0 articles_empty_text">
                No articles yet.
              </p>
              <div className="mt-3">
                <a className="btn btn-glow articles_cta" href="/blogs">
                  Go to blog &nbsp; <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="articles_section_wrap">
      <div className="container">
        <div className="articles_widget_card">
          <div className="articles_top_bar">
            <div>
              <p className="articles_eyebrow">Editorial Picks</p>
              <h2 className="space-title text-start mb-2 articles_title">Articles</h2>
              <p className="articles_subtitle">Fresh reads from the latest crypto stories.</p>
            </div>
          </div>

          <div className="main_container">
            <div className="main_card">
              {blogs.slice(0, 1).map((item, index) => {
                const isJSON = isJSONContent(item.content);
                const parsedContent = isJSON
                  ? JSON.parse(item.content)
                  : {
                      plain_title: item.title,
                      section: [{ text: item.content }],
                    };
                const getFirstSection = getContentText(parsedContent);

                return (
                  <div key={index}>
                    <Link href={`/blog/${item.slug}`} aria-label={`Read more about ${item.title}`} passHref>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={800}
                        height={220}
                        className="image_main_card"
                        style={{ objectFit: 'cover', borderRadius: '16px' }}
                        loading="lazy"
                      />
                    </Link>
                    <div className="content_custom">
                      <div className="article_meta_row">
                        <span className="article_meta_chip">Featured Story</span>
                        <span className="date_custom">{formatDate(item.created_at)}</span>
                      </div>
                      <h3 className="newsTitle">
                        <Link
                          href={`/blog/${item.slug}`}
                          className="link-clean"
                          aria-label={`Read more about ${parsedContent.plain_title || parsedContent.title}`}
                        >
                          {(parsedContent.plain_title || parsedContent.title || '').replace(/<\/?[^>]+(>|$)/g, '')}
                        </Link>
                      </h3>
                      <p className="article_excerpt">{getFirstSection}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="secondary_blog">
              {blogs.slice(1, 5).map((item, index) => {
                const isJSON = isJSONContent(item.content);
                const parsedContent = isJSON
                  ? JSON.parse(item.content)
                  : {
                      plain_title: item.title,
                      section: [{ text: item.content }],
                    };

                return (
                  <div className="d-flex container_second_blog" key={index}>
                    <div className="d-flex align-items-center article_thumb_wrap">
                      <Link href={`/blog/${item.slug}`} passHref>
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={120}
                          height={72}
                          className="image_non_main"
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                          loading="lazy"
                        />
                      </Link>
                    </div>
                    <div className="article_list_content">
                      <Link
                        href={`/blog/${item.slug}`}
                        className="link_element"
                        aria-label={`Read more about ${item.title}`}
                      >
                        {(parsedContent.plain_title || parsedContent.title || '').replace(/<\/?[^>]+(>|$)/g, '')}
                      </Link>
                      <span className="article_list_date">{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                );
              })}
              <a className="btn btn-glow articles_cta" href="/blogs">
                Find more articles &nbsp; <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
