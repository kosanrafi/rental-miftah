/** Upload foto (sudah dikompres di browser). Body: { mime, data (base64), thumb (base64) } */
const ALLOWED = ['image/webp', 'image/jpeg', 'image/png']

export default defineEventHandler(async (event) => {
  const body = await readBody<{ mime?: string; data?: string; thumb?: string }>(event)
  if (!body?.data || !body.mime || !ALLOWED.includes(body.mime)) {
    throw createError({ statusCode: 400, statusMessage: 'File harus berupa gambar (WebP, JPEG, atau PNG)' })
  }
  if (body.data.length + (body.thumb?.length ?? 0) > 4_000_000) {
    throw createError({ statusCode: 413, statusMessage: 'Foto terlalu besar, coba foto lain' })
  }
  const sql = await useDb()
  const rows = await sql`insert into media (mime, data, thumb)
    values (${body.mime}, decode(${body.data}, 'base64'), decode(${body.thumb || body.data}, 'base64'))
    returning id`
  return { id: rows[0].id }
})
