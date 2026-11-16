<script setup lang="ts">
const props = defineProps<{ promos: any[] }>()
const n = computed(() => props.promos.length)
const a = ref(Math.floor(props.promos.length / 2))

const off = (i: number) => {
  let o = i - a.value
  if (o > n.value / 2) o -= n.value
  if (o < -n.value / 2) o += n.value
  return o
}
const go = (d: number) => { a.value = (a.value + d + n.value) % n.value }
const onCard = (e: Event, i: number) => {
  if (off(i) === 0) return
  e.preventDefault()
  e.stopPropagation()
  a.value = i
}

let startX: number | null = null
const down = (e: PointerEvent) => { startX = e.clientX }
const up = (e: PointerEvent) => {
  if (startX === null) return
  const dx = e.clientX - startX
  startX = null
  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
}
</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="flex items-center justify-between gap-4">
        <button class="round-btn" :class="{ invisible: n < 2 }" aria-label="Sebelumnya" @click="go(-1)"><AppIcon name="arrowLeft" class="h-4 w-4" /></button>
        <div class="text-center"><slot /></div>
        <button class="round-btn" :class="{ invisible: n < 2 }" aria-label="Berikutnya" @click="go(1)"><AppIcon name="arrowRight" class="h-4 w-4" /></button>
      </div>
    </div>

    <div v-if="n" class="flow mt-8" @pointerdown="down" @pointerup="up" @pointercancel="startX = null">
      <article
        v-for="(p, i) in promos" :key="p.id" class="deal" :class="{ 'is-active': off(i) === 0 }"
        :style="{ '--o': off(i), '--a': Math.abs(off(i)), zIndex: 10 - Math.abs(off(i)) }"
        @click.capture="onCard($event, i)"
      >
        <div class="deal-card">
          <div
            class="deal-media"
            :class="p.tone === 'light' ? 'bg-mist-300 text-ink-900' : ['bg-linear-to-br text-white', toneOf(p.tone, p.title).card]"
          >
            <img v-if="p.photos?.[0]" :src="mediaUrl(p.photos[0])" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover">
            <div v-if="p.photos?.[0]" class="absolute inset-0 bg-linear-to-t from-black/75 to-black/10" />
            <span v-if="p.label" class="relative text-xs font-semibold tracking-wide" :class="p.photos?.[0] || p.tone !== 'light' ? 'text-brand-300' : 'text-brand-600'">{{ p.label }}</span>
            <p class="relative text-[1.75rem] font-extrabold leading-tight" :class="p.photos?.[0] ? 'text-white' : ''">{{ p.title }}</p>
          </div>
          <div class="px-3 pt-4">
            <p v-if="p.body" class="text-[15px] font-bold leading-snug text-white">{{ p.body }}</p>
            <NuxtLink
              v-if="p.link_url && p.link_label" :to="p.link_url" :tabindex="off(i) === 0 ? 0 : -1"
              class="mt-1 inline-block text-xs font-medium text-white/75 underline underline-offset-2 hover:text-white"
            >{{ p.link_label }}</NuxtLink>
          </div>
        </div>
      </article>
    </div>
    <p v-else class="mt-8 px-4 text-center text-sm text-white/70">Belum ada info atau promo.</p>
  </div>
</template>
