<script setup lang="ts">
const props = defineProps<{ kind: 'konsol' | 'ruangan' }>()
const { data: items } = await useFetch<any[]>(`/api/items/${props.kind}`, { default: () => [] })
const copy = props.kind === 'konsol'
  ? { title: 'Konsol', desc: 'Pilih PlayStation yang kamu mau, lalu buka halaman lengkapnya untuk spesifikasi dan booking.' }
  : { title: 'Ruangan', desc: 'Pilih tempat main sesuai suasana dan jumlah pemain, lalu buka halaman lengkapnya untuk booking.' }
useHead({ title: copy.title })
</script>

<template>
  <section class="px-4 pt-12 sm:px-6 lg:pt-16">
    <div class="mx-auto max-w-7xl">
      <PageHead :title="copy.title" :desc="copy.desc" />
      <div v-if="items.length" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ItemCard v-for="it in items" :key="it.id" :item="it" :kind="kind" />
      </div>
      <p v-else class="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70">
        Belum ada {{ copy.title.toLowerCase() }} yang ditampilkan.
      </p>
    </div>
  </section>
</template>
