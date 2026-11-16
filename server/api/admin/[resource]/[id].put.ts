export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' })
  const body = await readBody(event)
  return await updateRow(getRouterParam(event, 'resource') ?? '', id, body ?? {})
})
