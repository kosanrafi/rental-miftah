export default defineEventHandler(async (event) => {
  const body = (await readBody<Record<string, unknown>>(event)) ?? {}
  const entries = SETTING_KEYS.filter(k => k in body).map(k => [k, String(body[k] ?? '').trim()] as const)
  if (entries.length) {
    const sql = await useDb()
    await sql.transaction(entries.map(([k, v]) =>
      sql`insert into settings (key, value) values (${k}, ${v}) on conflict (key) do update set value = excluded.value`))
  }
  return { ok: true }
})
