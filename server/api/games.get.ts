export default defineEventHandler(async () => {
  const sql = await useDb()
  return await sql`select * from games order by sort_order, id`
})
