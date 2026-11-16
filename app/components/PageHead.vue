<script setup lang="ts">
defineProps<{ title: string; desc?: string }>()
</script>

<template>
  <div>
    <h1 class="text-[2rem] font-bold text-white sm:text-[2.4rem]">{{ title }}</h1>
    <p v-if="desc" class="mt-2 max-w-2xl text-sm font-medium text-white/80">{{ desc }}</p>
  </div>
</template>
