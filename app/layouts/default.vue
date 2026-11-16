<script setup lang="ts">
const route = useRoute()
const { s, name } = useSite()
const siteUrl = (useRuntimeConfig().public.siteUrl || useRequestURL().origin).replace(/\/+$/, '')

useHead({
  titleTemplate: title => (title
    ? `${title} — ${name.value} | Rental PS Tasikmalaya`
    : 'Rental PS Tasikmalaya — Rental PS Miftah'),
  link: [{ rel: 'canonical', href: () => `${siteUrl}${route.path === '/' ? '' : route.path}` }]
})

const description = computed(() =>
  `${name.value} — rental PS Tasikmalaya. ${s.value.hero_text || 'Sewa PlayStation 3, PS4, dan PS5 dengan ruangan nyaman dan booking mudah lewat WhatsApp.'}`)
useSeoMeta({
  description,
  keywords: SEO_KEYWORDS.join(', '),
  ogType: 'website',
  ogLocale: 'id_ID',
  ogSiteName: () => name.value,
  ogTitle: () => `Rental PS Tasikmalaya — ${name.value}`,
  ogDescription: description
})
</script>

<template>
  <div class="font-sans text-white antialiased selection:bg-brand-500 selection:text-white">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white">Lompat ke konten</a>
    <SiteHeader />
    <main id="main" class="min-h-[70vh]">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
