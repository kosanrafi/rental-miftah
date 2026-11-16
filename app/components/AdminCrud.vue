<script setup lang="ts">
export interface Field {
  key: string
  label: string
  type: 'text' | 'textarea' | 'lines' | 'select' | 'platforms' | 'checkbox' | 'number' | 'photos'
  options?: { value: string; label: string }[]
  hint?: string
  placeholder?: string
  half?: boolean
}

const props = defineProps<{
  title: string
  resource: string
  listUrl: string
  titleKey: string
  fields: Field[]
  fixed?: Record<string, unknown>
  sub?: (row: any) => string
}>()

const rows = ref<any[]>([])
const loaded = ref(false)
const loadError = ref('')
const editingId = ref<number | null>(null)
const open = ref(false)
const saving = ref(false)
const error = ref('')
const form = reactive<Record<string, any>>({})

const message = (e: any) => e?.data?.statusMessage || e?.statusMessage || e?.message || 'Terjadi kesalahan'
async function guard(e: any) {
  if (e?.statusCode === 401 || e?.response?.status === 401) await navigateTo('/admin/login')
}

async function load() {
  try {
    rows.value = await $fetch<any[]>(props.listUrl)
    loadError.value = ''
  } catch (e: any) {
    loadError.value = message(e)
  } finally {
    loaded.value = true
  }
}
onMounted(load)

function defaults(f: Field) {
  if (f.type === 'photos' || f.type === 'platforms') return []
  if (f.type === 'checkbox') return false
  if (f.type === 'number') return 0
  return ''
}
function fill(row?: any) {
  for (const f of props.fields) {
    const v = row?.[f.key]
    form[f.key] = row === undefined ? defaults(f)
      : f.type === 'lines' ? (v ?? []).join('\n')
        : Array.isArray(v) ? [...v] : (v ?? defaults(f))
  }
}
function openNew() { editingId.value = null; fill(); error.value = ''; open.value = true }
function openEdit(row: any) { editingId.value = row.id; fill(row); error.value = ''; open.value = true }
const close = () => { if (!saving.value) open.value = false }

async function save() {
  saving.value = true
  error.value = ''
  const body: Record<string, unknown> = { ...(props.fixed ?? {}) }
  for (const f of props.fields) {
    const v = form[f.key]
    body[f.key] = f.type === 'lines' ? String(v).split('\n').map(x => x.trim()).filter(Boolean)
      : f.type === 'number' ? Number(v) || 0 : v
  }
  try {
    await $fetch(editingId.value ? `/api/admin/${props.resource}/${editingId.value}` : `/api/admin/${props.resource}`, {
      method: editingId.value ? 'PUT' : 'POST',
      body
    })
    open.value = false
    await load()
  } catch (e: any) {
    error.value = message(e)
    await guard(e)
  } finally {
    saving.value = false
  }
}

async function remove(row: any) {
  if (!confirm(`Hapus "${row[props.titleKey]}"? Foto-fotonya ikut terhapus.`)) return
  try {
    await $fetch(`/api/admin/${props.resource}/${row.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    loadError.value = message(e)
    await guard(e)
  }
}

const togglePlatform = (key: string, p: string) => {
  form[key] = form[key].includes(p) ? form[key].filter((x: string) => x !== p) : [...form[key], p]
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-white">{{ title }}</h1>
      <button class="abtn" @click="openNew">+ Tambah</button>
    </div>

    <p v-if="loadError" class="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{{ loadError }}</p>

    <ul v-if="rows.length" class="mt-6 space-y-3">
      <li v-for="r in rows" :key="r.id" class="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-800 p-3">
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-600">
          <img v-if="r.photos?.[0]" :src="mediaUrl(r.photos[0], true)" alt="" class="h-full w-full object-cover">
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate font-semibold text-white">{{ r[titleKey] }}</p>
          <p v-if="sub" class="truncate text-xs text-white/60">{{ sub(r) }}</p>
        </div>
        <button class="abtn-ghost" @click="openEdit(r)">Edit</button>
        <button class="abtn-danger" @click="remove(r)">Hapus</button>
      </li>
    </ul>
    <p v-else-if="loaded && !loadError" class="mt-6 rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-white/70">
      Belum ada data. Klik "+ Tambah" untuk mulai.
    </p>

    <div v-if="open" class="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4" @mousedown.self="close">
      <form class="mx-auto my-6 max-w-2xl rounded-2xl border border-white/10 bg-ink-800 p-6" @submit.prevent="save">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-lg font-bold text-white">{{ editingId ? 'Edit' : 'Tambah' }} {{ title }}</h2>
          <button type="button" class="p-1 text-white/70 hover:text-white" aria-label="Tutup" @click="close"><AppIcon name="close" class="h-5 w-5" /></button>
        </div>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div v-for="f in fields" :key="f.key" :class="f.half ? '' : 'sm:col-span-2'">
            <label v-if="f.type !== 'checkbox'" :for="`f-${f.key}`" class="mb-1.5 block text-xs font-semibold text-white/80">{{ f.label }}</label>

            <input v-if="f.type === 'text'" :id="`f-${f.key}`" v-model="form[f.key]" class="afield" :placeholder="f.placeholder">
            <input v-else-if="f.type === 'number'" :id="`f-${f.key}`" v-model.number="form[f.key]" type="number" class="afield">
            <textarea v-else-if="f.type === 'textarea'" :id="`f-${f.key}`" v-model="form[f.key]" rows="4" class="afield" :placeholder="f.placeholder" />
            <textarea v-else-if="f.type === 'lines'" :id="`f-${f.key}`" v-model="form[f.key]" rows="5" class="afield" :placeholder="f.placeholder || 'Satu poin per baris'" />
            <select v-else-if="f.type === 'select'" :id="`f-${f.key}`" v-model="form[f.key]" class="afield">
              <option v-for="o in f.options" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <div v-else-if="f.type === 'platforms'" class="flex flex-wrap gap-2">
              <button
                v-for="p in PLATFORMS" :key="p" type="button" class="chip" :aria-pressed="form[f.key].includes(p)"
                @click="togglePlatform(f.key, p)"
              >{{ p }}</button>
            </div>
            <label v-else-if="f.type === 'checkbox'" class="flex items-center gap-2 text-sm text-white/90">
              <input v-model="form[f.key]" type="checkbox" class="h-4 w-4 accent-brand-500"> {{ f.label }}
            </label>
            <PhotoUploader v-else-if="f.type === 'photos'" v-model="form[f.key]" />

            <p v-if="f.hint" class="mt-1 text-[11px] text-white/50">{{ f.hint }}</p>
          </div>
        </div>

        <p v-if="error" class="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{{ error }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="abtn-ghost" :disabled="saving" @click="close">Batal</button>
          <button type="submit" class="abtn" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
