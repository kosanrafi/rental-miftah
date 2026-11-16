/** Menyajikan foto dari database. ?t=1 untuk versi thumbnail (kecil). */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 404 })
  const sql = await useDb()
  const rows = getQuery(event).t
    ? await sql`select mime, encode(coalesce(thumb, data), 'base64') as b from media where id = ${id}`
    : await sql`select mime, encode(data, 'base64') as b from media where id = ${id}`
  if (!rows[0]) throw createError({ statusCode: 404, statusMessage: 'Foto tidak ditemukan' })
  setHeader(event, 'Content-Type', rows[0].mime)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  return Buffer.from(rows[0].b, 'base64')
})
