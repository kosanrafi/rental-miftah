/** Sitemap otomatis: halaman tetap + halaman detail konsol/ruangan dari database. */
const PAGES: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/konsol', priority: '0.9', changefreq: 'weekly' },
  { path: '/ruangan', priority: '0.9', changefreq: 'weekly' },
  { path: '/game', priority: '0.9', changefreq: 'weekly' },
  { path: '/promo', priority: '0.7', changefreq: 'weekly' },
  { path: '/kontak', priority: '0.7', changefreq: 'monthly' },
  { path: '/tentang', priority: '0.5', changefreq: 'monthly' }
]

export default defineEventHandler(async (event) => {
  const base = siteBase(event)
  let items: { kind: string; slug: string; updated_at: string }[] = []
  try {
    const sql = await useDb()
    items = (await sql`select kind, slug, updated_at from items order by kind, sort_order, id`) as typeof items
  } catch {
    // Database belum siap: tetap tampilkan halaman tetap
  }

  const entry = (loc: string, priority: string, changefreq: string, lastmod?: string) =>
    `  <url>\n    <loc>${xmlEscape(base + loc)}</loc>\n${lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n` : ''}    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`

  const urls = [
    ...PAGES.map(p => entry(p.path, p.priority, p.changefreq)),
    ...items.map(i => entry(`/${i.kind}/${i.slug}`, '0.8', 'monthly', i.updated_at))
  ]

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
})
