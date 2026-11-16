<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const tones = TONE_KEYS.map(k => ({ value: k, label: TONES[k]!.label }))
const fields: any[] = [
  { key: 'name', label: 'Nama konsol', type: 'text', placeholder: 'mis. PlayStation 5' },
  { key: 'badge', label: 'Label kecil', type: 'text', placeholder: 'mis. TERBARU', half: true },
  { key: 'ghost', label: 'Tulisan besar samar di kartu', type: 'text', placeholder: 'mis. PS5', half: true, hint: 'Hanya tampil kalau belum ada foto.' },
  { key: 'platform', label: 'Game yang tampil di halaman ini', type: 'select', half: true,
    options: [{ value: '', label: 'Tidak ada' }, ...PLATFORMS.map(p => ({ value: p, label: `Game ${p}` }))] },
  { key: 'tone', label: 'Warna kartu (tanpa foto)', type: 'select', half: true, options: tones },
  { key: 'summary', label: 'Keterangan singkat', type: 'text', placeholder: 'mis. Cocok untuk mabar santai' },
  { key: 'description', label: 'Deskripsi lengkap', type: 'textarea' },
  { key: 'features', label: 'Spesifikasi', type: 'lines', placeholder: 'Satu spesifikasi per baris' },
  { key: 'photos', label: 'Foto', type: 'photos' },
  { key: 'sort_order', label: 'Urutan tampil', type: 'number', half: true, hint: 'Angka kecil tampil lebih dulu.' }
]
</script>

<template>
  <AdminCrud title="Konsol" resource="items" list-url="/api/items/konsol" title-key="name" :fixed="{ kind: 'konsol' }" :fields="fields" :sub="r => r.summary || r.badge" />
</template>
