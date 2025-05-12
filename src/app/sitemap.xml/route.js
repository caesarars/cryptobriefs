export async function GET() {
    const baseUrl = "https://www.cryptobriefs.net";
  
    let blogs = [];
    try {
      const blogRes = await fetch("https://crypto-blog-backend.vercel.app/getAllBlogs", {
        cache: "no-store",
      });
  
      if (!blogRes.ok) {
        throw new Error("Failed to fetch blog slugs");
      }
  
      blogs = await blogRes.json();
    } catch (error) {
      console.error("Sitemap fetch error:", error);
      blogs = []; // fallback agar tidak crash saat build
    }
  
    const staticRoutes = ["", "/about", "/news", "/blog"];
    const blogRoutes = blogs.map((b) => `/blog/${b.slug}`);
    const allRoutes = [...staticRoutes, ...blogRoutes];
  
    const body = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${allRoutes
        .map(
          (route) => `<url>
        <loc>${baseUrl}${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>`
        )
        .join("\n")}
    </urlset>`;
  
    return new Response(body, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
  