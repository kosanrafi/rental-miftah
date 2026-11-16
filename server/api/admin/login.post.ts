export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)
  if (!checkPassword(String(body?.password ?? ''))) {
    await new Promise(resolve => setTimeout(resolve, 600))
    throw createError({ statusCode: 401, statusMessage: 'Password salah' })
  }
  startSession(event)
  return { ok: true }
})
