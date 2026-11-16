<script setup lang="ts">
const { data: promos } = await useFetch<any[]>('/api/promos', { default: () => [] })
useHead({ title: 'Info & Promo' })
</script>

<template>
  <section class="pt-12 lg:pt-16">
    <PromoFlow :promos="promos">
      <h1 class="text-[2rem] font-bold text-white sm:text-[2.4rem]">Info &amp; Promo</h1>
      <p class="mt-2 text-sm font-medium text-white/85">Jam buka, paket hemat, dan aturan main.</p>
    </PromoFlow>
  </section>
</template>
