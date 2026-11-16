import { neon } from '@neondatabase/serverless'

let _sql: ReturnType<typeof neon> | null = null
let _ready: Promise<void> | null = null

function connectionString() {
  return process.env.DATABASE_URL || useRuntimeConfig().databaseUrl || ''
}

/** Membuat tabel kalau belum ada (aman dijalankan berulang, hanya 1x per instance server). */
async function migrate(sql: ReturnType<typeof neon>) {
  await sql.transaction([
    sql`create table if not exists settings (
      key text primary key,
      value text not null default ''
    )`,
    sql`create table if not exists media (
      id serial primary key,
      mime text not null,
      data bytea not null,
      thumb bytea,
      created_at timestamptz not null default now()
    )`,
    sql`create table if not exists items (
      id serial primary key,
      kind text not null,
      slug text not null,
      name text not null,
      badge text not null default '',
      ghost text not null default '',
      tone text not null default 'brand',
      platform text not null default '',
      summary text not null default '',
      description text not null default '',
      extra text not null default '',
      features jsonb not null default '[]',
      photos jsonb not null default '[]',
      sort_order int not null default 0,
      created_at timestamptz not null default now(),
      unique (kind, slug)
    )`,
    sql`alter table items add column if not exists updated_at timestamptz not null default now()`,
    sql`create table if not exists games (
      id serial primary key,
      title text not null,
      genre text not null default '',
      description text not null default '',
      platforms jsonb not null default '[]',
      featured boolean not null default false,
      photos jsonb not null default '[]',
      sort_order int not null default 0,
      created_at timestamptz not null default now()
    )`,
    sql`create table if not exists promos (
      id serial primary key,
      label text not null default '',
      title text not null,
      body text not null default '',
      tone text not null default 'brand',
      link_label text not null default '',
      link_url text not null default '',
      photos jsonb not null default '[]',
      sort_order int not null default 0,
      created_at timestamptz not null default now()
    )`
  ])
}

/** Koneksi Neon yang sudah pasti punya tabel. Panggil di awal setiap handler API. */
export async function useDb() {
  if (!_sql) {
    const url = connectionString()
    if (!url) {
      throw createError({ statusCode: 500, statusMessage: 'DATABASE_URL belum diisi. Salin .env.example menjadi .env lalu isi connection string Neon.' })
    }
    _sql = neon(url)
  }
  const sql = _sql
  _ready ??= migrate(sql).catch((e) => { _ready = null; throw e })
  await _ready
  return sql
}
