export default defineEventHandler(async () => {
  const sql = await useDb()
  const rows = await sql`select key, value from settings`
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
})
