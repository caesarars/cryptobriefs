// app/blog/[slug]/StructuredData.js
'use client';

const StructuredData = ({ blog }) => {
  if (!blog) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title.replace(/<\/?[^>]+(>|$)/g, ""),
    "image": blog.imageUrl,
    "datePublished": new Date(blog.created_at).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "CryptoBriefs"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CryptoBriefs",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.cryptobriefs.net/og-image.png" // ganti dengan logo kamu
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.cryptobriefs.net/blog/${blog.slug}`
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default StructuredData;
