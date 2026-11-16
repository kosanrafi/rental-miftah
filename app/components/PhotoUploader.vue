<script setup lang="ts">
const props = defineProps<{ modelValue: number[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: number[]] }>()

const MAX_PHOTOS = 20
const input = ref<HTMLInputElement | null>(null)
const over = ref(false)
const busy = ref(0)
const error = ref('')
const ids = computed(() => props.modelValue ?? [])

/** Kecilkan foto di browser dulu supaya upload cepat dan hemat penyimpanan database. */
async function shrink(bitmap: ImageBitmap, max: number, quality: number) {
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const toBlob = (type: string) => new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality))
  let blob = await toBlob('image/webp')
  if (!blob || blob.type !== 'image/webp') blob = await toBlob('image/jpeg')
  if (!blob) throw new Error('Gagal memproses foto')
  return blob
}
const toBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
  reader.onerror = reject
  reader.readAsDataURL(blob)
})

async function upload(file: File) {
  const bitmap = await createImageBitmap(file)
  try {
    const full = await shrink(bitmap, 1400, 0.82)
    const thumb = await shrink(bitmap, 480, 0.78)
    const res = await $fetch<{ id: number }>('/api/admin/media', {
      method: 'POST',
      body: { mime: full.type, data: await toBase64(full), thumb: await toBase64(thumb) }
    })
    return res.id
  } finally {
    bitmap.close()
  }
}

async function addFiles(list: FileList | File[]) {
  error.value = ''
  const files = [...list]
  const images = files.filter(f => f.type.startsWith('image/'))
  if (images.length < files.length) error.value = 'Hanya file gambar yang diterima.'
  let next = [...ids.value]
  for (const file of images.slice(0, Math.max(0, MAX_PHOTOS - next.length))) {
    busy.value++
    try {
      next = [...next, await upload(file)]
      emit('update:modelValue', next)
    } catch (e: any) {
      error.value = e?.data?.statusMessage || `Gagal mengunggah ${file.name}. Pastikan formatnya JPG, PNG, atau WebP.`
    } finally {
      busy.value--
    }
  }
}

function onPick(e: Event) {
  const el = e.target as HTMLInputElement
  if (el.files) addFiles(el.files)
  el.value = ''
}
function onDrop(e: DragEvent) {
  over.value = false
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
}
const remove = (id: number) => emit('update:modelValue', ids.value.filter(x => x !== id))
const makeCover = (id: number) => emit('update:modelValue', [id, ...ids.value.filter(x => x !== id)])
</script>

<template>
  <div>
    <div
      class="dropzone flex cursor-pointer flex-col items-center gap-2 px-4 py-7 text-center" :class="{ 'is-over': over }"
      role="button" tabindex="0" aria-label="Pilih atau tarik foto ke sini"
      @click="input?.click()" @keydown.enter.prevent="input?.click()" @keydown.space.prevent="input?.click()"
      @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="onDrop"
    >
      <AppIcon name="upload" class="h-7 w-7 text-brand-300" />
      <p class="text-sm font-semibold text-white">Tarik foto ke sini, atau klik untuk memilih</p>
      <p class="text-xs text-white/60">JPG, PNG, atau WebP. Bisa pilih banyak sekaligus. Foto pertama jadi sampul.</p>
      <p v-if="busy" class="text-xs font-semibold text-brand-300">Mengunggah {{ busy }} foto...</p>
      <input ref="input" type="file" accept="image/*" multiple class="hidden" @change="onPick">
    </div>
    <p v-if="error" class="mt-2 text-xs font-semibold text-red-300">{{ error }}</p>

    <ul v-if="ids.length" class="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
      <li v-for="(id, i) in ids" :key="id" class="relative overflow-hidden rounded-xl border border-white/10 bg-ink-600">
        <img :src="mediaUrl(id, true)" alt="" class="aspect-square w-full object-cover">
        <span v-if="i === 0" class="absolute left-1.5 top-1.5 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">Sampul</span>
        <div class="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/70 p-1.5">
          <button v-if="i !== 0" type="button" class="text-[11px] font-semibold text-white hover:text-brand-300" @click="makeCover(id)">Jadikan sampul</button>
          <span v-else />
          <button type="button" class="text-[11px] font-semibold text-red-300 hover:text-red-200" @click="remove(id)">Hapus</button>
        </div>
      </li>
    </ul>
  </div>
</template>
