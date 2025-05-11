"use client";

const SuggestedBlog = ({ data }) => {
  return (
    <div className="suggested-blog-sidebar">
      <p className="suggested-title">Articles You May Like</p>
      <div className="wrapper_suggested_blog">
        {data.map((val) => {
          return (
            <div key={val._id} className="suggested-blog-card">
              <img
                src={val.imageUrl}
                alt={val.title}
                className="suggested-blog-image"
              />
              <div className="suggested-blog-content">
                <p className="suggested-blog-title">{val.title}</p>
                <p className="suggested-blog-desc">
                  {val.blog.length > 100 ? val.blog.slice(0, 100) + "..." : val.blog}
                </p>
                <a className="btn btn-glow" href={`/blog/${val.slug}`} >Read More</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedBlog;
