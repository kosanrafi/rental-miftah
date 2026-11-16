export default defineEventHandler(async (event) => {
  const kind = getRouterParam(event, 'kind') ?? ''
  const slug = getRouterParam(event, 'slug') ?? ''
  if (!KINDS.includes(kind)) throw createError({ statusCode: 404, statusMessage: 'Tidak ditemukan' })
  const sql = await useDb()
  const rows = await sql`select * from items where kind = ${kind} and slug = ${slug}`
  if (!rows[0]) throw createError({ statusCode: 404, statusMessage: 'Halaman tidak ditemukan' })
  return rows[0]
})
