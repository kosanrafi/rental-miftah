<script setup lang="ts">
const { s, name, wa } = useSite()
const points = computed(() => (s.value.about_points || '').split('\n').map(x => x.trim()).filter(Boolean))
</script>

<template>
  <section class="px-4 sm:px-6">
    <div class="mx-auto max-w-7xl">
      <div class="about-card grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_16rem] lg:gap-8 lg:p-14">
        <div>
          <h2 class="text-[1.9rem] font-bold text-white">Tentang {{ name }}</h2>
          <p class="mt-3 max-w-sm whitespace-pre-line text-sm font-medium leading-relaxed text-white/90">
            {{ s.about_text || 'Tempat rental PlayStation untuk nongkrong dan mabar bareng teman.' }}
          </p>
          <a :href="wa(`Halo ${name}, saya mau tanya soal rental PS.`)" target="_blank" rel="noopener" class="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-white/90">
            Booking via WhatsApp <AppIcon name="arrowRight" class="h-3.5 w-3.5" />
          </a>
        </div>

        <ul class="space-y-3">
          <li v-for="p in points" :key="p" class="about-chip"><span class="text-base font-bold text-white/80" aria-hidden="true">#</span>{{ p }}</li>
        </ul>

        <div class="hidden lg:block" aria-hidden="true" />
        <PadArt class="pointer-events-none absolute -bottom-3 right-8 hidden w-68 -rotate-10 lg:block" />
      </div>
      <div class="about-line mx-auto mt-2 w-[94%]" aria-hidden="true" />
    </div>
  </section>
</template>
