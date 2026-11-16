<script setup lang="ts">
const props = defineProps<{ games: any[] }>()
const cards = computed(() => props.games.slice(0, 5))
const active = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const pos = (i: number) => (i - active.value + cards.value.length) % cards.value.length
const next = () => { active.value = (active.value + 1) % cards.value.length }
const stop = () => { if (timer) clearInterval(timer); timer = null }
const start = () => {
  stop()
  if (cards.value.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(next, 3200)
}
const pick = (i: number) => { active.value = i; start() }
const onVisibility = () => (document.hidden ? stop() : start())

onMounted(() => { start(); document.addEventListener('visibilitychange', onVisibility) })
onBeforeUnmount(() => { stop(); document.removeEventListener('visibilitychange', onVisibility) })
</script>

<template>
  <div class="stack" aria-hidden="true" @mouseenter="stop" @mouseleave="start">
    <div
      v-for="(g, i) in cards" :key="g.id" class="stack-card" :data-pos="pos(i)"
      :style="{ background: g.photos?.[0] ? '#0b0b0b' : toneOf('', g.title).poster }"
      @click="pick(i)"
    >
      <img v-if="g.photos?.[0]" :src="mediaUrl(g.photos[0])" alt="" class="absolute inset-0 h-full w-full object-cover">
      <div class="poster-fx" />
      <div class="relative flex h-full flex-col justify-between p-5">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-semibold tracking-[0.2em] text-white/80">{{ g.genre }}</span>
          <span class="flex gap-1"><span v-for="p in g.platforms" :key="p" class="plat">{{ p }}</span></span>
        </div>
        <div>
          <p class="font-black leading-[0.95] tracking-tight text-white" :class="g.photos?.[0] ? 'text-xl' : 'text-[2.2rem]'">{{ g.title }}</p>
          <p v-if="g.description && !g.photos?.[0]" class="mt-2 line-clamp-2 text-xs font-medium text-white/80">{{ g.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
