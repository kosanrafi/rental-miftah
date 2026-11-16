<script setup lang="ts">
const route = useRoute()
const { name } = useSite()
const open = ref(false)

const links = [
  { to: '/', label: 'Home' },
  { to: '/konsol', label: 'Konsol' },
  { to: '/ruangan', label: 'Ruangan' },
  { to: '/promo', label: 'Info & Promo' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/kontak', label: 'Kontak' }
]
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`))
watch(() => route.fullPath, () => { open.value = false })
</script>

<template>
  <header class="sticky top-4 z-50 px-4 sm:px-6">
    <div class="mx-auto max-w-7xl">
      <div class="nav-pill flex items-center justify-between gap-4 rounded-full py-3 pl-6 pr-3 sm:pr-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <NuxtLink to="/" class="flex flex-col leading-none">
          <span class="text-[22px] font-extrabold uppercase tracking-wide text-white">{{ name }}</span>
          <span class="mt-1 text-[8px] tracking-[0.42em] text-mist-400">RENTAL PLAYSTATION</span>
        </NuxtLink>

        <nav class="hidden items-center gap-9 text-[15px] font-semibold lg:flex" aria-label="Navigasi utama">
          <NuxtLink
            v-for="l in links" :key="l.to" :to="l.to"
            :aria-current="isActive(l.to) ? 'page' : undefined"
            :class="isActive(l.to) ? 'nav-active text-white' : 'text-white/90 transition-colors hover:text-white'"
          >{{ l.label }}</NuxtLink>
        </nav>

        <div class="hidden items-center justify-end gap-5 sm:flex">
          <NuxtLink to="/game" class="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">List Game</NuxtLink>
        </div>

        <button class="p-2 text-white lg:hidden" :aria-label="open ? 'Tutup menu' : 'Buka menu'" :aria-expanded="open" aria-controls="mobileMenu" @click="open = !open">
          <AppIcon :name="open ? 'close' : 'menu'" class="h-6 w-6" />
        </button>
      </div>

      <div v-if="open" id="mobileMenu" class="nav-pill mt-2 rounded-3xl px-6 py-5 lg:hidden">
        <nav class="flex flex-col gap-4 text-sm font-semibold" aria-label="Navigasi seluler">
          <NuxtLink v-for="l in links" :key="l.to" :to="l.to" :class="isActive(l.to) ? 'text-white' : 'text-white/85'">{{ l.label }}</NuxtLink>
          <div class="border-t border-white/10 pt-4">
            <NuxtLink to="/game" class="inline-block rounded-full bg-brand-500 px-5 py-2 text-white">List Game</NuxtLink>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>
