<script setup lang="ts">
const { s, name } = useSite()
const { data: konsol } = await useFetch<any[]>('/api/items/konsol', { default: () => [] })
const { data: ruangan } = await useFetch<any[]>('/api/items/ruangan', { default: () => [] })
const { data: promos } = await useFetch<any[]>('/api/promos', { default: () => [] })
const { data: games } = await useFetch<any[]>('/api/games', { default: () => [] })

// Poster di hero: game bertanda "featured" dulu, lalu sisanya
const stackGames = computed(() => [...games.value.filter(g => g.featured), ...games.value.filter(g => !g.featured)].slice(0, 5))

const siteUrl = (useRuntimeConfig().public.siteUrl || useRequestURL().origin).replace(/\/+$/, '')
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: name.value,
      url: siteUrl,
      description: 'Rental PS Tasikmalaya: sewa PlayStation 3, PS4, dan PS5.',
      keywords: SEO_KEYWORDS.join(', '),
      areaServed: 'Tasikmalaya',
      ...(s.value.wa_number ? { telephone: `+${s.value.wa_number.replace(/\D/g, '')}` } : {}),
      ...(s.value.address ? { address: { '@type': 'PostalAddress', streetAddress: s.value.address, addressLocality: 'Tasikmalaya', addressRegion: 'Jawa Barat', addressCountry: 'ID' } } : {}),
      ...(s.value.open_hours ? { openingHours: s.value.open_hours } : {})
    })
  }]
})

const q = ref('')
const search = () => navigateTo({ path: '/game', query: q.value.trim() ? { q: q.value.trim() } : {} })
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="relative isolate z-10 overflow-x-clip">
      <div class="pointer-events-none absolute bottom-4 right-[20%] -z-10 hidden h-[360px] w-[540px] opacity-40 lg:block" aria-hidden="true">
        <div class="seats" />
      </div>

      <div class="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:pt-20">
        <div class="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div class="pb-2 lg:pb-24 lg:pl-8">
            <h1 class="text-[2rem] font-bold leading-[1.15] text-white sm:text-[2.5rem] lg:text-[2.75rem]">
              <span class="block font-semibold tracking-[0.14em]">Rental PlayStation</span>
              <span class="block tracking-tight"><span class="text-brand-400">{{ name }}</span> 3 · 4 · 5</span>
            </h1>
            <p class="mt-4 max-w-136 text-[15px] font-medium leading-relaxed text-white/85">
              {{ s.hero_text || 'Main PS3, PS4, dan PS5 bareng teman di ruangan yang nyaman.' }}
            </p>
            <div class="mt-5 h-px max-w-136 bg-linear-to-r from-white/70 via-white/35 to-transparent" />

            <form role="search" class="search-pill mt-5 flex max-w-136 items-center gap-3 rounded-full py-2 pl-6 pr-2" @submit.prevent="search">
              <label for="cari" class="sr-only">Cari game</label>
              <input id="cari" v-model="q" type="search" placeholder="Cari game (mis. Tekken, EA FC)..." autocomplete="off" class="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/55">
              <button type="submit" class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90 text-neutral-500 transition-colors hover:bg-white" aria-label="Cari">
                <AppIcon name="search" class="h-4 w-4" />
              </button>
            </form>

            <div v-if="s.instagram_url || s.tiktok_url" class="mt-7 flex flex-wrap items-center gap-3">
              <span class="text-xs font-semibold text-white">Ikuti kami di :</span>
              <a v-if="s.instagram_url" :href="s.instagram_url" target="_blank" rel="noopener" class="social-badge" aria-label="Instagram">
                <AppIcon name="instagram" class="h-5 w-5" />
                <span><small>Follow di</small><b>Instagram</b></span>
              </a>
              <a v-if="s.tiktok_url" :href="s.tiktok_url" target="_blank" rel="noopener" class="social-badge" aria-label="TikTok">
                <AppIcon name="tiktok" class="h-5 w-5" />
                <span><small>Follow di</small><b>TikTok</b></span>
              </a>
            </div>
          </div>

          <div class="relative z-20 -mb-2 flex justify-center lg:justify-end lg:pr-14">
            <GameStack v-if="stackGames.length" :games="stackGames" />
            <PadArt v-else class="mb-6 w-72 -rotate-6" />
          </div>
        </div>
      </div>
    </section>

    <ItemPanel kind="konsol" :items="konsol" />
    <ItemPanel kind="ruangan" :items="ruangan" />

    <section class="pt-24">
      <PromoFlow :promos="promos">
        <h2 class="text-[1.75rem] font-bold text-white sm:text-[2rem]">Info &amp; Promo</h2>
        <p class="mt-2 text-sm font-medium text-white/85">Jam buka, paket hemat, dan aturan main.</p>
      </PromoFlow>
    </section>

    <div class="pt-32"><AboutCard /></div>
  </div>
</template>
