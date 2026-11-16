<script setup lang="ts">
const route = useRoute()
const { data: games } = await useFetch<any[]>('/api/games', { default: () => [] })

const fromQuery = () => ({
  platform: PLATFORMS.includes(String(route.query.platform)) ? String(route.query.platform) : '',
  q: String(route.query.q ?? '')
})
const platform = ref(fromQuery().platform)
const q = ref(fromQuery().q)
watch(() => route.query, () => { platform.value = fromQuery().platform; q.value = fromQuery().q })

const shown = computed(() => {
  const term = q.value.trim().toLowerCase()
  return games.value.filter(g =>
    (!platform.value || g.platforms.includes(platform.value))
    && (!term || `${g.title} ${g.genre}`.toLowerCase().includes(term)))
})
const countOf = (p: string) => games.value.filter(g => g.platforms.includes(p)).length

useHead({ title: 'List Game' })
</script>

<template>
  <section class="px-4 pt-12 sm:px-6 lg:pt-16">
    <div class="mx-auto max-w-7xl">
      <PageHead title="List Game" desc="Semua game yang tersedia, lengkap dengan konsol tempat game itu bisa dimainkan: PS3, PS4, atau PS5." />

      <div class="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap gap-2" role="group" aria-label="Filter konsol">
          <button type="button" class="chip" :aria-pressed="!platform" @click="platform = ''">Semua ({{ games.length }})</button>
          <button v-for="p in PLATFORMS" :key="p" type="button" class="chip" :aria-pressed="platform === p" @click="platform = p">{{ p }} ({{ countOf(p) }})</button>
        </div>
        <form role="search" class="search-pill flex w-full items-center gap-3 rounded-full py-2 pl-6 pr-2 lg:max-w-md" @submit.prevent>
          <label for="cariGame" class="sr-only">Cari game</label>
          <input id="cariGame" v-model="q" type="search" placeholder="Cari judul atau genre..." autocomplete="off" class="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/55">
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90 text-neutral-500"><AppIcon name="search" class="h-4 w-4" /></span>
        </form>
      </div>

      <div v-if="shown.length" class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <GamePoster v-for="g in shown" :key="g.id" :game="g" />
      </div>
      <p v-else class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70">
        {{ games.length ? 'Game yang kamu cari belum ketemu. Coba kata kunci atau konsol lain.' : 'Daftar game belum tersedia.' }}
      </p>
    </div>
  </section>
</template>
