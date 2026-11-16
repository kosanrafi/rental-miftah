<script setup lang="ts">
const props = defineProps<{ game: any }>()
const tone = computed(() => toneOf('', props.game.title))
const cover = computed<number | undefined>(() => props.game.photos?.[0])
</script>

<template>
  <article class="poster" :style="{ background: cover ? '#0b0b0b' : tone.poster }">
    <img v-if="cover" :src="mediaUrl(cover, true)" :alt="game.title" loading="lazy" class="absolute inset-0 h-full w-full object-cover">
    <div class="poster-fx" />
    <div class="relative flex h-full flex-col justify-between p-4">
      <div class="flex flex-wrap justify-end gap-1">
        <span v-for="p in game.platforms" :key="p" class="plat">{{ p }}</span>
      </div>
      <div>
        <p v-if="game.genre" class="text-[10px] font-semibold tracking-[0.16em] text-white/75">{{ game.genre }}</p>
        <p class="mt-1 font-black leading-[1.02] tracking-tight text-white" :class="cover ? 'text-base' : 'text-[1.6rem]'">{{ game.title }}</p>
      </div>
    </div>
  </article>
</template>
