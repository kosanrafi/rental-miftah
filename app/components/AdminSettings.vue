<script setup lang="ts">
const fields = [
  { key: 'site_name', label: 'Nama rental', placeholder: 'mis. Miftah PS' },
  { key: 'hero_text', label: 'Kalimat pembuka di beranda', type: 'textarea' },
  { key: 'wa_number', label: 'Nomor WhatsApp', placeholder: '6281234567890', hint: 'Format internasional tanpa + dan tanpa 0 di depan. Dipakai semua tombol booking.' },
  { key: 'open_hours', label: 'Jam operasional', type: 'textarea', placeholder: 'Setiap hari, 10.00 – 24.00 WIB' },
  { key: 'address', label: 'Alamat lengkap', type: 'textarea' },
  { key: 'maps_url', label: 'Link Google Maps', placeholder: 'https://maps.google.com/...' },
  { key: 'instagram_url', label: 'Link Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'instagram_handle', label: 'Username Instagram', placeholder: '@namarental' },
  { key: 'tiktok_url', label: 'Link TikTok', placeholder: 'https://tiktok.com/@...' },
  { key: 'tiktok_handle', label: 'Username TikTok', placeholder: '@namarental' },
  { key: 'about_text', label: 'Teks "Tentang"', type: 'textarea' },
  { key: 'about_points', label: 'Poin keunggulan', type: 'textarea', hint: 'Satu poin per baris.' }
]
const form = reactive<Record<string, string>>({})
const saving = ref(false)
const message = ref('')
const error = ref('')

onMounted(async () => {
  const data = await $fetch<Record<string, string>>('/api/settings')
  for (const f of fields) form[f.key] = data[f.key] ?? ''
})

async function save() {
  saving.value = true
  message.value = ''
  error.value = ''
  try {
    await $fetch('/api/admin/settings', { method: 'PUT', body: { ...form } })
    await refreshNuxtData('site-settings')
    message.value = 'Pengaturan tersimpan.'
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.message || 'Gagal menyimpan'
    if (e?.statusCode === 401) await navigateTo('/admin/login')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form @submit.prevent="save">
    <h1 class="text-2xl font-bold text-white">Pengaturan</h1>
    <div class="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-ink-800 p-6 sm:grid-cols-2">
      <div v-for="f in fields" :key="f.key" :class="f.type === 'textarea' ? 'sm:col-span-2' : ''">
        <label :for="`s-${f.key}`" class="mb-1.5 block text-xs font-semibold text-white/80">{{ f.label }}</label>
        <textarea v-if="f.type === 'textarea'" :id="`s-${f.key}`" v-model="form[f.key]" rows="3" class="afield" :placeholder="f.placeholder" />
        <input v-else :id="`s-${f.key}`" v-model="form[f.key]" class="afield" :placeholder="f.placeholder">
        <p v-if="f.hint" class="mt-1 text-[11px] text-white/50">{{ f.hint }}</p>
      </div>
    </div>
    <p v-if="error" class="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{{ error }}</p>
    <p v-if="message" class="mt-4 text-sm font-semibold text-emerald-300">{{ message }}</p>
    <button type="submit" class="abtn mt-5" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan pengaturan' }}</button>
  </form>
</template>
