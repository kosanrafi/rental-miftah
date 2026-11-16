import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const COOKIE = 'ps_admin'
const WEEK = 7 * 24 * 60 * 60

const adminPassword = () => process.env.ADMIN_PASSWORD || useRuntimeConfig().adminPassword || ''
const secret = () => process.env.SESSION_SECRET || useRuntimeConfig().sessionSecret || adminPassword()
const hmac = (key: string, value: string) => createHmac('sha256', key).update(value).digest('hex')
const same = (a: string, b: string) => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export function checkPassword(input: string) {
  const real = adminPassword()
  if (!real) {
    throw createError({ statusCode: 500, statusMessage: 'ADMIN_PASSWORD belum diisi di file .env' })
  }
  return same(hmac('cmp', input), hmac('cmp', real))
}

export function startSession(event: H3Event) {
  const exp = String(Date.now() + WEEK * 1000)
  setCookie(event, COOKIE, `${exp}.${hmac(secret(), exp)}`, {
    httpOnly: true,
    sameSite: 'lax',
    // Secure hanya bila diakses lewat HTTPS (Vercel/Netlify), supaya tetap jalan di http://localhost
    secure: getRequestURL(event, { xForwardedProto: true }).protocol === 'https:',
    path: '/',
    maxAge: WEEK
  })
}

export function endSession(event: H3Event) {
  deleteCookie(event, COOKIE, { path: '/' })
}

export function isAdmin(event: H3Event) {
  const raw = getCookie(event, COOKIE)
  const key = secret()
  if (!raw || !key) return false
  const [exp, sig] = raw.split('.')
  if (!exp || !sig) return false
  return same(sig, hmac(key, exp)) && Number(exp) > Date.now()
}

export function requireAdmin(event: H3Event) {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Belum login' })
  }
}
