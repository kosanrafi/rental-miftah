<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const fields: any[] = [
  { key: 'title', label: 'Judul game', type: 'text', placeholder: 'mis. Tekken 8' },
  { key: 'genre', label: 'Genre', type: 'text', placeholder: 'mis. Fighting', half: true },
  { key: 'sort_order', label: 'Urutan tampil', type: 'number', half: true, hint: 'Angka kecil tampil lebih dulu.' },
  { key: 'platforms', label: 'Tersedia di konsol', type: 'platforms' },
  { key: 'featured', label: 'Tampilkan sebagai poster di hero beranda', type: 'checkbox' },
  { key: 'description', label: 'Deskripsi singkat (opsional)', type: 'textarea' },
  { key: 'photos', label: 'Cover game', type: 'photos', hint: 'Foto pertama dipakai sebagai cover.' }
]
</script>

<template>
  <AdminCrud title="Game" resource="games" list-url="/api/games" title-key="title" :fields="fields" :sub="r => [r.genre, (r.platforms || []).join(' · ')].filter(Boolean).join(' — ')" />
</template>
