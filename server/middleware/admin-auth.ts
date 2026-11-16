/** Semua /api/admin/* wajib login, kecuali /api/admin/login. */
export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/admin/') || path === '/api/admin/login') return
  requireAdmin(event)
})
