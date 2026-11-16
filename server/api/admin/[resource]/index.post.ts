export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await createRow(getRouterParam(event, 'resource') ?? '', body ?? {})
})
