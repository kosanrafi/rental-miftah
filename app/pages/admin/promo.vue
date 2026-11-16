<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const tones = [...TONE_KEYS.map(k => ({ value: k, label: TONES[k]!.label })), { value: 'light', label: 'Terang' }]
const fields: any[] = [
  { key: 'label', label: 'Label kecil', type: 'text', placeholder: 'mis. JAM OPERASIONAL', half: true },
  { key: 'tone', label: 'Warna (tanpa foto)', type: 'select', half: true, options: tones },
  { key: 'title', label: 'Judul', type: 'text', placeholder: 'mis. Buka Setiap Hari 10.00 – 24.00' },
  { key: 'body', label: 'Isi singkat', type: 'textarea' },
  { key: 'link_label', label: 'Teks tautan (opsional)', type: 'text', placeholder: 'mis. Booking sekarang', half: true },
  { key: 'link_url', label: 'Alamat tautan', type: 'text', placeholder: '/kontak atau https://...', half: true },
  { key: 'photos', label: 'Foto latar (opsional)', type: 'photos' },
  { key: 'sort_order', label: 'Urutan tampil', type: 'number', half: true, hint: 'Angka kecil tampil lebih dulu.' }
]
</script>

<template>
  <AdminCrud title="Promo" resource="promos" list-url="/api/promos" title-key="title" :fields="fields" :sub="r => r.label" />
</template>
