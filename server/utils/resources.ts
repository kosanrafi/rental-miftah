/**
 * CRUD generik untuk tabel items (konsol & ruangan), games, dan promos.
 * Hanya kolom yang terdaftar di bawah yang boleh ditulis dari admin.
 */
export const PLATFORMS = ['PS3', 'PS4', 'PS5']
export const KINDS = ['konsol', 'ruangan']

type Col = 'text' | 'int' | 'bool' | 'json'
interface Resource { table: string; required: string; cols: Record<string, Col> }

const RESOURCES: Record<string, Resource> = {
  items: {
    table: 'items',
    required: 'name',
    cols: {
      kind: 'text', slug: 'text', name: 'text', badge: 'text', ghost: 'text', tone: 'text', platform: 'text',
      summary: 'text', description: 'text', extra: 'text', features: 'json', photos: 'json', sort_order: 'int'
    }
  },
  games: {
    table: 'games',
    required: 'title',
    cols: { title: 'text', genre: 'text', description: 'text', platforms: 'json', featured: 'bool', photos: 'json', sort_order: 'int' }
  },
  promos: {
    table: 'promos',
    required: 'title',
    cols: { label: 'text', title: 'text', body: 'text', tone: 'text', link_label: 'text', link_url: 'text', photos: 'json', sort_order: 'int' }
  }
}

const list = (v: unknown): any[] => (Array.isArray(v) ? v : [])
const CLEAN: Record<string, (v: unknown) => unknown[]> = {
  photos: v => list(v).map(Number).filter(Number.isInteger).slice(0, 30),
  features: v => list(v).map(x => String(x).trim()).filter(Boolean).slice(0, 40),
  platforms: v => list(v).filter(p => PLATFORMS.includes(p))
}

function coerce(type: Col, key: string, v: unknown) {
  if (type === 'int') return Number.parseInt(String(v), 10) || 0
  if (type === 'bool') return Boolean(v)
  if (type === 'json') return JSON.stringify((CLEAN[key] ?? list)(v))
  return String(v ?? '').trim()
}

const placeholder = (r: Resource, key: string, i: number) => (r.cols[key] === 'json' ? `$${i}::jsonb` : `$${i}`)

function pick(r: Resource, body: Record<string, unknown>, skip: string[] = []) {
  const keys: string[] = []
  const vals: unknown[] = []
  for (const [k, type] of Object.entries(r.cols)) {
    if (skip.includes(k) || !(k in body)) continue
    keys.push(k)
    vals.push(coerce(type, k, body[k]))
  }
  return { keys, vals }
}

export function getResource(name?: string) {
  const r = name ? RESOURCES[name] : undefined
  if (!r) throw createError({ statusCode: 404, statusMessage: 'Resource tidak dikenal' })
  return r
}

export function slugify(text: string) {
  return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

/** Hapus file media dari DB (dipanggil saat foto dilepas dari data atau datanya dihapus). */
export async function dropMedia(ids: number[]) {
  if (!ids.length) return
  const sql = await useDb()
  await sql.query('delete from media where id in (select jsonb_array_elements_text($1::jsonb)::int)', [JSON.stringify(ids)])
}

/** Bersihkan foto yang terupload tapi tidak pernah disimpan ke data mana pun (umur > 1 hari). */
export async function sweepMedia() {
  const sql = await useDb()
  await sql`delete from media m where m.created_at < now() - interval '1 day' and not exists (
    select 1 from (
      select jsonb_array_elements_text(photos) as v from items
      union all select jsonb_array_elements_text(photos) from games
      union all select jsonb_array_elements_text(photos) from promos
    ) u where u.v::int = m.id)`
}

export async function createRow(name: string, body: Record<string, unknown>) {
  const r = getResource(name)
  const sql = await useDb()
  if (!String(body?.[r.required] ?? '').trim()) {
    throw createError({ statusCode: 400, statusMessage: `Kolom "${r.required}" wajib diisi` })
  }
  const { keys, vals } = pick(r, body)

  if (name === 'items') {
    const kind = String(body.kind)
    if (!KINDS.includes(kind)) throw createError({ statusCode: 400, statusMessage: 'kind harus konsol atau ruangan' })
    const base = slugify(String(body.name)) || 'item'
    let slug = base
    for (let n = 2; (await sql`select 1 from items where kind = ${kind} and slug = ${slug}`).length; n++) slug = `${base}-${n}`
    keys.push('slug')
    vals.push(slug)
  }

  const rows = await sql.query(
    `insert into ${r.table} (${keys.join(', ')}) values (${keys.map((k, i) => placeholder(r, k, i + 1)).join(', ')}) returning *`,
    vals
  )
  await sweepMedia()
  return rows[0]
}

export async function updateRow(name: string, id: number, body: Record<string, unknown>) {
  const r = getResource(name)
  const sql = await useDb()
  if (r.required in body && !String(body[r.required] ?? '').trim()) {
    throw createError({ statusCode: 400, statusMessage: `Kolom "${r.required}" wajib diisi` })
  }
  const old = await sql.query(`select photos from ${r.table} where id = $1`, [id])
  if (!old[0]) throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' })

  const { keys, vals } = pick(r, body, ['kind', 'slug'])
  if (!keys.length) throw createError({ statusCode: 400, statusMessage: 'Tidak ada data untuk diubah' })

  const rows = await sql.query(
    `update ${r.table} set ${keys.map((k, i) => `${k} = ${placeholder(r, k, i + 1)}`).join(', ')}${name === 'items' ? ', updated_at = now()' : ''} where id = $${keys.length + 1} returning *`,
    [...vals, id]
  )
  const now: number[] = rows[0].photos ?? []
  await dropMedia((old[0].photos as number[]).filter(m => !now.includes(m)))
  await sweepMedia()
  return rows[0]
}

export async function deleteRow(name: string, id: number) {
  const r = getResource(name)
  const sql = await useDb()
  const rows = await sql.query(`delete from ${r.table} where id = $1 returning photos`, [id])
  if (!rows[0]) throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan' })
  await dropMedia(rows[0].photos ?? [])
  return { ok: true }
}

export const SETTING_KEYS = [
  'site_name', 'hero_text', 'wa_number', 'open_hours', 'address', 'maps_url',
  'instagram_url', 'instagram_handle', 'tiktok_url', 'tiktok_handle', 'about_text', 'about_points'
]
