<script setup lang="ts">
const { name } = useSite()
useHead({ title: () => `Admin — ${name.value}`, meta: [{ name: 'robots', content: 'noindex' }] })
const route = useRoute()
const links = [
  { to: '/admin/konsol', label: 'Konsol' },
  { to: '/admin/ruangan', label: 'Ruangan' },
  { to: '/admin/game', label: 'Game' },
  { to: '/admin/promo', label: 'Promo' },
  { to: '/admin/pengaturan', label: 'Pengaturan' }
]
async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen font-sans text-white antialiased">
    <header class="border-b border-white/10 bg-ink-900">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p class="font-extrabold uppercase tracking-wide">Admin <span class="text-brand-400">{{ name }}</span></p>
        <div class="flex items-center gap-2">
          <NuxtLink to="/" target="_blank" class="abtn-ghost">Lihat situs</NuxtLink>
          <button class="abtn-ghost" @click="logout">Keluar</button>
        </div>
      </div>
      <nav class="no-scrollbar mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-3" aria-label="Menu admin">
        <NuxtLink
          v-for="l in links" :key="l.to" :to="l.to"
          class="chip whitespace-nowrap" :aria-pressed="route.path === l.to"
        >{{ l.label }}</NuxtLink>
      </nav>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
