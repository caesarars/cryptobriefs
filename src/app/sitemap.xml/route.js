export const revalidate = 3600; // 1 hour

export async function GET() {
  const baseUrl = "https://cryptobriefs.net";

  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

  let blogs = [];
  try {
    const blogRes = await fetch(API_BASE ? `${API_BASE}/getAllBlog` : "https://ces.dbrata.my.id/getAllBlog", {
      // Allow caching so Next can statically optimize this route without warnings.
      next: { revalidate },
    });

    if (!blogRes.ok) {
      throw new Error("Failed to fetch blog slugs");
    }

    blogs = await blogRes.json();
  } catch (error) {
    console.error("Sitemap fetch error:", error);
    blogs = []; // fallback agar tidak crash saat build
  }

  const staticRoutes = [
    "",
    "/brief",
    "/blogs",
    "/news",
    "/airdrops",
    "/subscribe",
    "/lp/brief",
    "/lp/news",
    "/about",
    "/advertise",
    "/contact",
    "/disclosure",
    "/privacy",
    "/terms",
  ];

  const blogRoutes = (blogs || []).map((b) => `/blog/${b.slug}`);
  const allRoutes = [...staticRoutes, ...blogRoutes];

  const now = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${now}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
  