<script setup lang="ts">
const props = defineProps<{ name: string }>()
const PATHS: Record<string, string[]> = {
  arrowRight: ['M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'],
  arrowLeft: ['M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'],
  search: ['m21 21-4.35-4.35M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z'],
  menu: ['M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5'],
  close: ['M6 18 18 6M6 6l12 12'],
  chevL: ['m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5'],
  chevR: ['m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5'],
  send: ['M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'],
  phone: ['M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97a1.125 1.125 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z'],
  pin: ['M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z'],
  upload: ['M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5']
}
const paths = computed(() => PATHS[props.name] ?? [])
</script>

<template>
  <svg v-if="name === 'tiktok'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.5 2h-3v13.2a2.8 2.8 0 1 1-2-2.68V9.4a5.8 5.8 0 1 0 5 5.75V8.1a6.9 6.9 0 0 0 4 1.28V6.4a3.9 3.9 0 0 1-4-4.4z" />
  </svg>
  <svg v-else-if="name === 'instagram'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path v-for="d in paths" :key="d" :d="d" />
  </svg>
</template>
