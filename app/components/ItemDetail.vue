<script setup lang="ts">
const props = defineProps<{ kind: 'konsol' | 'ruangan' }>()
const route = useRoute()
const { data: item } = await useFetch<any>(`/api/items/${props.kind}/${route.params.slug}`)
if (!item.value) throw createError({ statusCode: 404, statusMessage: 'Halaman tidak ditemukan', fatal: true })

const { name: site, wa } = useSite()
const { data: games } = await useFetch<any[]>('/api/games', { default: () => [] })

const label = props.kind === 'konsol' ? 'Konsol' : 'Ruangan'
const idx = ref(0)
const photos = computed<number[]>(() => item.value?.photos ?? [])
const tone = computed(() => toneOf(item.value?.tone, item.value?.name))
const ghost = computed(() => item.value?.ghost || item.value?.platform || item.value?.name.slice(0, 3).toUpperCase())
const booking = computed(() => wa(
  props.kind === 'konsol'
    ? `Halo ${site.value}, saya mau booking ${item.value.name}. Apakah slotnya tersedia?`
    : `Halo ${site.value}, saya mau booking ruangan ${item.value.name}. Apakah tersedia?`
))
const related = computed(() =>
  props.kind === 'konsol' && item.value?.platform
    ? games.value.filter(g => g.platforms?.includes(item.value.platform)).slice(0, 8)
    : [])

useHead({ title: () => item.value?.name })
</script>

<template>
  <section v-if="item" class="px-4 pt-10 sm:px-6 lg:pt-14">
    <div class="mx-auto max-w-7xl">
      <NuxtLink :to="`/${kind}`" class="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white">
        <AppIcon name="arrowLeft" class="h-4 w-4" /> {{ label }}
      </NuxtLink>

      <div class="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <div class="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br" :class="tone.card">
            <img v-if="photos.length" :src="mediaUrl(photos[idx] ?? photos[0])" :alt="item.name" class="h-full w-full object-cover">
            <span v-else class="absolute inset-0 grid place-items-center text-[7rem] font-black leading-none text-white/15" aria-hidden="true">{{ ghost }}</span>
          </div>
          <div v-if="photos.length > 1" class="mt-3 flex gap-3 overflow-x-auto pb-1">
            <button
              v-for="(p, i) in photos" :key="p" type="button" :aria-label="`Foto ${i + 1}`"
              class="h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors"
              :class="i === idx ? 'border-brand-400' : 'border-transparent opacity-70 hover:opacity-100'"
              @click="idx = i"
            >
              <img :src="mediaUrl(p, true)" alt="" loading="lazy" class="h-full w-full object-cover">
            </button>
          </div>
        </div>

        <div>
          <span v-if="item.badge" class="inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold tracking-[0.06em] text-white">{{ item.badge }}</span>
          <h1 class="mt-3 text-[2rem] font-bold leading-tight text-white sm:text-[2.4rem]">{{ item.name }}</h1>
          <p v-if="item.extra" class="mt-2 text-lg font-bold text-brand-300">{{ item.extra }}</p>
          <p v-if="item.summary" class="mt-2 text-sm font-semibold text-brand-300">{{ item.summary }}</p>
          <p v-if="item.description" class="mt-4 max-w-xl whitespace-pre-line text-[15px] leading-relaxed text-white/85">{{ item.description }}</p>

          <h2 v-if="item.features?.length" class="mt-7 text-sm font-bold text-white">{{ kind === 'konsol' ? 'Spesifikasi' : 'Fasilitas' }}</h2>
          <ul v-if="item.features?.length" class="spec-list mt-2 [&_li]:text-sm">
            <li v-for="f in item.features" :key="f">{{ f }}</li>
          </ul>

          <div class="mt-8 flex flex-wrap gap-3">
            <a :href="booking" target="_blank" rel="noopener" class="btn-lg">
              <AppIcon name="phone" class="h-4 w-4" /> Booking via WhatsApp
            </a>
            <NuxtLink :to="`/${kind}`" class="flex items-center justify-center rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Lihat {{ label.toLowerCase() }} lain</NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="related.length" class="mt-16">
        <div class="flex items-end justify-between gap-4">
          <h2 class="text-[1.5rem] font-bold text-white">Game di {{ item.platform }}</h2>
          <NuxtLink :to="`/game?platform=${item.platform}`" class="text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-white">Lihat semua</NuxtLink>
        </div>
        <div class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          <GamePoster v-for="g in related" :key="g.id" :game="g" />
        </div>
      </div>
    </div>
  </section>
</template>
