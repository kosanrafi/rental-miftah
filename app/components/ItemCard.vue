<script setup lang="ts">
const props = defineProps<{ item: any; kind: 'konsol' | 'ruangan' }>()
const tone = computed(() => toneOf(props.item.tone, props.item.name))
const cover = computed<number | undefined>(() => props.item.photos?.[0])
const ghost = computed(() => props.item.ghost || props.item.platform || props.item.name.slice(0, 3).toUpperCase())
</script>

<template>
  <div class="cons-card">
    <div class="cons-art bg-linear-to-br" :class="tone.card">
      <img v-if="cover" :src="mediaUrl(cover, true)" :alt="item.name" loading="lazy" class="cons-photo">
      <div v-if="cover" class="cons-shade" />
      <span v-else class="cons-ghost" aria-hidden="true">{{ ghost }}</span>
      <span v-if="item.badge" class="cons-badge">{{ item.badge }}</span>
      <span v-else />
      <div class="relative">
        <p class="text-xl font-bold text-white">{{ item.name }}</p>
        <p v-if="item.extra" class="price-big mt-1 text-white">{{ item.extra }}</p>
      </div>
    </div>
    <div class="flex flex-1 flex-col p-4">
      <p v-if="item.summary" class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-brand-300">{{ item.summary }}</p>
      <ul v-if="item.features?.length" class="spec-list">
        <li v-for="f in item.features.slice(0, 4)" :key="f">{{ f }}</li>
      </ul>
      <div class="mt-auto pt-4">
        <NuxtLink :to="`/${kind}/${item.slug}`" class="btn-solid">
          Selengkapnya <AppIcon name="arrowRight" class="h-3.5 w-3.5" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
