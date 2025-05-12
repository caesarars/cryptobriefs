export async function GET() {
    const baseUrl = "https://www.cryptobriefs.net";
  
    const blogRes = await fetch(`https://crypto-blog-backend.vercel.app/getAllBlogs`);
    const blogs = await blogRes.json(); // contoh response: [{ slug: 'ai-trading' }, ...]
  
    const staticRoutes = [
      "",
      "/about",
      "/news",
      "/blog",
    ];
  
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
  