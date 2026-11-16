<script setup lang="ts">
const props = defineProps<{ kind: 'konsol' | 'ruangan'; items: any[] }>()

const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
const update = () => {
  const t = track.value
  if (!t) return
  atStart.value = t.scrollLeft <= 4
  atEnd.value = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4
}
const go = (dir: number) => track.value?.scrollBy({ left: dir * track.value.clientWidth * 0.8, behavior: 'smooth' })

onMounted(() => { update(); window.addEventListener('resize', update) })
onBeforeUnmount(() => window.removeEventListener('resize', update))
watch(() => props.items, () => nextTick(update))
</script>

<template>
  <!-- KONSOL: panel biru dengan tab judul -->
  <section v-if="kind === 'konsol'" class="relative px-4 sm:px-6">
    <div class="mx-auto max-w-7xl">
      <div class="screen-panel">
        <div class="notch">
          <h2 class="text-xl font-bold text-white sm:text-[1.65rem]">Konsol</h2>
        </div>
        <button class="side-arrow left-3 hidden sm:block lg:left-6" :aria-disabled="atStart" aria-label="Geser kiri" @click="go(-1)">
          <AppIcon name="chevL" class="h-6 w-6" />
        </button>
        <button class="side-arrow right-3 hidden sm:block lg:right-6" :aria-disabled="atEnd" aria-label="Geser kanan" @click="go(1)">
          <AppIcon name="chevR" class="h-6 w-6" />
        </button>
        <div
          ref="track" class="no-scrollbar flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-pl-6 px-6 pb-9 pt-16 sm:scroll-pl-14 sm:px-14 lg:scroll-pl-24 lg:gap-12 lg:px-24"
          @scroll.passive="update"
        >
          <article v-for="it in items" :key="it.id" class="cons-w snap-start">
            <ItemCard :item="it" kind="konsol" />
          </article>
          <p v-if="!items.length" class="w-full py-10 text-center text-sm text-white/70">Daftar konsol belum tersedia.</p>
        </div>
      </div>
      <div class="mt-4 text-right">
        <NuxtLink to="/konsol" class="text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-white">Lihat semua konsol</NuxtLink>
      </div>
    </div>
  </section>

  <!-- RUANGAN: panel abu-abu dengan tombol geser -->
  <section v-else class="px-4 pt-16 sm:px-6">
    <div class="mx-auto max-w-7xl">
      <div class="gallery-panel overflow-hidden rounded-[28px] py-8 pl-6 sm:py-12 sm:pl-12">
        <div class="flex items-start justify-between gap-4 pr-6 sm:pr-12">
          <div>
            <h2 class="text-[1.75rem] font-bold text-white sm:text-[2rem]">Kategori Ruangan</h2>
            <p class="mt-1 text-sm font-medium text-white/80">Pilih tempat main sesuai suasana &amp; jumlah pemain.</p>
          </div>
          <div class="hidden gap-3 sm:flex">
            <button class="round-btn" :aria-disabled="atStart" aria-label="Geser kiri" @click="go(-1)"><AppIcon name="arrowLeft" class="h-4 w-4" /></button>
            <button class="round-btn" :aria-disabled="atEnd" aria-label="Geser kanan" @click="go(1)"><AppIcon name="arrowRight" class="h-4 w-4" /></button>
          </div>
        </div>
        <div ref="track" class="no-scrollbar mt-8 flex gap-8 overflow-x-auto pb-2 pr-6 sm:pr-12" @scroll.passive="update">
          <article v-for="it in items" :key="it.id" class="room-w">
            <ItemCard :item="it" kind="ruangan" />
          </article>
          <p v-if="!items.length" class="w-full py-10 text-center text-sm text-white/70">Daftar ruangan belum tersedia.</p>
        </div>
      </div>
      <div class="mt-4 text-right">
        <NuxtLink to="/ruangan" class="text-sm font-semibold text-brand-300 underline underline-offset-4 hover:text-white">Lihat semua ruangan</NuxtLink>
      </div>
    </div>
  </section>
</template>
