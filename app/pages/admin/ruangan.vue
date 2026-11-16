<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const tones = TONE_KEYS.map(k => ({ value: k, label: TONES[k]!.label }))
const fields: any[] = [
  { key: 'name', label: 'Nama ruangan', type: 'text', placeholder: 'mis. VIP' },
  { key: 'badge', label: 'Label kecil', type: 'text', placeholder: 'mis. POPULER', half: true },
  { key: 'ghost', label: 'Tulisan besar samar di kartu', type: 'text', placeholder: 'mis. VIP', half: true, hint: 'Hanya tampil kalau belum ada foto.' },
  { key: 'tone', label: 'Warna kartu (tanpa foto)', type: 'select', half: true, options: tones },
  { key: 'extra', label: 'Info tarif (opsional)', type: 'text', half: true, hint: 'Kosongkan kalau tidak ingin menampilkan harga.' },
  { key: 'summary', label: 'Kapasitas / keterangan singkat', type: 'text', placeholder: 'mis. Cocok untuk 2–4 pemain' },
  { key: 'description', label: 'Deskripsi lengkap', type: 'textarea' },
  { key: 'features', label: 'Fasilitas', type: 'lines', placeholder: 'Satu fasilitas per baris' },
  { key: 'photos', label: 'Foto', type: 'photos' },
  { key: 'sort_order', label: 'Urutan tampil', type: 'number', half: true, hint: 'Angka kecil tampil lebih dulu.' }
]
</script>

<template>
  <AdminCrud title="Ruangan" resource="items" list-url="/api/items/ruangan" title-key="name" :fixed="{ kind: 'ruangan' }" :fields="fields" :sub="r => r.summary || r.badge" />
</template>
