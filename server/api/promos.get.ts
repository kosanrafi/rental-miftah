export default defineEventHandler(async () => {
  const sql = await useDb()
  return await sql`select * from promos order by sort_order, id`
})
