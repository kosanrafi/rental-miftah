export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    'Allow: /api/media/',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    `Sitemap: ${siteBase(event)}/sitemap.xml`,
    ''
  ].join('\n')
})
