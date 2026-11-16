<script setup lang="ts">
const { s, name } = useSite()
const explore = [
  { to: '/', label: 'Home' }, { to: '/konsol', label: 'Konsol' }, { to: '/ruangan', label: 'Ruangan' },
  { to: '/promo', label: 'Info & Promo' }, { to: '/tentang', label: 'Tentang' }, { to: '/kontak', label: 'Kontak' }
]
const more = [
  { to: '/game', label: 'List Game' }, { to: '/game?platform=PS5', label: 'Game PS5' },
  { to: '/game?platform=PS4', label: 'Game PS4' }, { to: '/game?platform=PS3', label: 'Game PS3' }
]
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-28 px-4 sm:px-6">
    <div class="footer-panel mx-auto max-w-7xl rounded-t-[28px] px-8 pb-8 pt-12 sm:px-12">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <span class="block text-2xl font-extrabold uppercase tracking-wide text-white">{{ name }}</span>
          <span class="mt-1 block text-[8px] tracking-[0.42em] text-mist-400">RENTAL PLAYSTATION</span>
          <p class="mt-4 max-w-60 text-xs leading-relaxed text-white/85">Rental PlayStation 3, PS4 &amp; PS5. Booking mudah lewat WhatsApp.</p>
        </div>

        <nav aria-label="Jelajahi">
          <ul class="space-y-3">
            <li v-for="l in explore" :key="l.to"><NuxtLink :to="l.to" class="foot-link">{{ l.label }}</NuxtLink></li>
          </ul>
        </nav>

        <nav aria-label="Lainnya">
          <ul class="space-y-3">
            <li v-for="l in more" :key="l.to"><NuxtLink :to="l.to" class="foot-link">{{ l.label }}</NuxtLink></li>
          </ul>
        </nav>

        <div>
          <p class="text-xs font-semibold text-white">Ikuti kami di</p>
          <div class="mt-3 flex gap-3">
            <a v-if="s.instagram_url" :href="s.instagram_url" target="_blank" rel="noopener" aria-label="Instagram" class="text-white transition-colors hover:text-brand-300"><AppIcon name="instagram" class="h-5 w-5" /></a>
            <a v-if="s.tiktok_url" :href="s.tiktok_url" target="_blank" rel="noopener" aria-label="TikTok" class="text-white transition-colors hover:text-brand-300"><AppIcon name="tiktok" class="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      <div class="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/15 pt-5 text-[11px] text-white/80 sm:flex-row">
        <span>© {{ year }} {{ name }} — Rental PlayStation. All Rights Reserved.</span>
        <span>Dibuat dengan Nuxt &amp; Tailwind CSS</span>
      </div>
    </div>
  </footer>
</template>
