export default defineEventHandler(async (event) => {
  const kind = getRouterParam(event, 'kind') ?? ''
  if (!KINDS.includes(kind)) throw createError({ statusCode: 404, statusMessage: 'Tidak ditemukan' })
  const sql = await useDb()
  return await sql`select * from items where kind = ${kind} order by sort_order, id`
})
