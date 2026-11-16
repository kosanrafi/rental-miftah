<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Masuk Admin', meta: [{ name: 'robots', content: 'noindex' }] })

const password = ref('')
const error = ref('')
const busy = ref(false)

async function login() {
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    await navigateTo('/admin/konsol')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.message || 'Gagal masuk'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="grid min-h-screen place-items-center px-4 font-sans text-white antialiased">
    <form class="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-800 p-7" @submit.prevent="login">
      <h1 class="text-xl font-bold">Masuk Admin</h1>
      <p class="mt-1 text-sm text-white/60">Masukkan password untuk mengelola website.</p>
      <label for="pw" class="mt-6 mb-1.5 block text-xs font-semibold text-white/80">Password</label>
      <input id="pw" v-model="password" type="password" required autofocus autocomplete="current-password" class="afield">
      <p v-if="error" class="mt-3 text-sm font-semibold text-red-300">{{ error }}</p>
      <button type="submit" class="abtn mt-5 w-full" :disabled="busy">{{ busy ? 'Memeriksa...' : 'Masuk' }}</button>
    </form>
  </div>
</template>
