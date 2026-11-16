import type { H3Event } from 'h3'

/** Alamat dasar website: SITE_URL kalau diisi, kalau tidak pakai alamat yang sedang diakses. */
export function siteBase(event: H3Event) {
  const fromEnv = process.env.SITE_URL || useRuntimeConfig().public.siteUrl
  const url = fromEnv || getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin
  return String(url).replace(/\/+$/, '')
}

export const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
