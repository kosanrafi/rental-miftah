<script setup lang="ts">
const { s, name, waDigits, wa } = useSite()
const { data: konsol } = await useFetch<any[]>('/api/items/konsol', { default: () => [] })
const { data: ruangan } = await useFetch<any[]>('/api/items/ruangan', { default: () => [] })

const durasi = ['1 jam', '2 jam', '3 jam', '4 jam', '5 jam', 'Paket malam', 'Sewa harian (bawa pulang)']
const f = reactive({ nama: '', konsol: '', ruangan: '', durasi: durasi[0] })

function kirim() {
  const lines = [`Halo ${name.value}, saya mau booking.`, `Nama: ${f.nama}`]
  if (f.konsol) lines.push(`Konsol: ${f.konsol}`)
  if (f.ruangan) lines.push(`Ruangan: ${f.ruangan}`)
  lines.push(`Durasi: ${f.durasi}`, 'Mohon info ketersediaan slotnya ya.')
  window.open(wa(lines.join('\n')), '_blank', 'noopener')
}
useHead({ title: 'Kontak' })
</script>

<template>
  <section class="px-4 pt-12 sm:px-6 lg:pt-16">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <div>
        <h1 class="text-[2.1rem] font-bold text-white">Kontak</h1>

        <p class="mt-7 font-semibold text-white">Booking &amp; Pemesanan <span class="text-xs font-normal text-white/80">(chat admin untuk cek slot)</span></p>
        <div class="mt-3 flex flex-wrap gap-3">
          <a v-if="waDigits" :href="wa(`Halo ${name}, saya mau tanya soal rental PS.`)" target="_blank" rel="noopener" class="contact-pill">
            <AppIcon name="phone" class="h-3.5 w-3.5" /> WhatsApp +{{ waDigits }}
          </a>
          <a v-if="s.instagram_url" :href="s.instagram_url" target="_blank" rel="noopener" class="contact-pill">
            <AppIcon name="instagram" class="h-3.5 w-3.5" /> {{ s.instagram_handle || 'Instagram' }}
          </a>
          <a v-if="s.tiktok_url" :href="s.tiktok_url" target="_blank" rel="noopener" class="contact-pill">
            <AppIcon name="tiktok" class="h-3.5 w-3.5" /> {{ s.tiktok_handle || 'TikTok' }}
          </a>
        </div>

        <template v-if="s.open_hours">
          <h2 class="mt-8 font-semibold text-white">Jam Operasional</h2>
          <p class="mt-2 whitespace-pre-line text-sm text-white/85">{{ s.open_hours }}</p>
        </template>

        <template v-if="s.address">
          <h2 class="mt-8 font-semibold text-white">Lokasi Rental</h2>
          <div class="loc-row mt-3 flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p class="text-[13px] font-bold uppercase text-white">{{ name }}</p>
              <p class="mt-1 flex items-start gap-1.5 text-xs text-white/85">
                <AppIcon name="pin" class="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{{ s.address }}</span>
              </p>
            </div>
          </div>
        </template>
      </div>

      <div class="space-y-5">
        <div class="news-card rounded-3xl p-7 sm:p-8">
          <h2 class="max-w-xs text-[1.65rem] font-bold leading-[1.15] text-white">Booking cepat via WhatsApp</h2>
          <p class="mt-3 max-w-sm text-[13px] font-medium leading-relaxed text-white/90">Isi data singkat, lalu kirim ke admin untuk cek ketersediaan slot.</p>
          <form class="mt-5 space-y-3" @submit.prevent="kirim">
            <div>
              <label for="bNama" class="sr-only">Nama</label>
              <input id="bNama" v-model="f.nama" class="field" type="text" required placeholder="Nama kamu">
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label for="bKonsol" class="sr-only">Konsol</label>
                <select id="bKonsol" v-model="f.konsol" class="field">
                  <option value="">Pilih konsol</option>
                  <option v-for="k in konsol" :key="k.id" :value="k.name">{{ k.name }}</option>
                </select>
              </div>
              <div>
                <label for="bRoom" class="sr-only">Ruangan</label>
                <select id="bRoom" v-model="f.ruangan" class="field">
                  <option value="">Pilih ruangan</option>
                  <option v-for="r in ruangan" :key="r.id" :value="r.name">{{ r.name }}</option>
                </select>
              </div>
            </div>
            <div>
              <label for="bDurasi" class="sr-only">Durasi</label>
              <select id="bDurasi" v-model="f.durasi" class="field">
                <option v-for="d in durasi" :key="d">{{ d }}</option>
              </select>
            </div>
            <button type="submit" class="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
              Kirim ke WhatsApp <AppIcon name="send" class="h-4 w-4" />
            </button>
          </form>
        </div>

        <a v-if="s.maps_url" :href="s.maps_url" target="_blank" rel="noopener" class="group relative block h-52 overflow-hidden rounded-3xl border border-white/10">
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="400" height="210" fill="#E7ECE2" />
            <path d="M0 0h118c-14 30 10 52-6 84s-22 48-4 84l-8 42H0Z" fill="#9FD6E6" />
            <path d="M190 22c30-14 68-8 98 8s56 8 112-10v56c-30 16-62 20-96 8s-60-18-92-2Z" fill="#CFE4C5" />
            <path d="M250 150c26-10 60-6 90 6s44 10 60 4v50H236Z" fill="#D6E8CC" />
            <g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round">
              <path d="M122 0c-8 62 20 96 42 136s30 52 26 74" /><path d="M112 64c62 12 132 4 288-18" />
              <path d="M140 136c72-10 156 4 260-8" /><path d="M236 0c-12 72 6 128 30 210" /><path d="M318 0c2 64 20 116 10 210" />
            </g>
            <g fill="none" stroke="#F3D585" stroke-width="3" stroke-linecap="round">
              <path d="M96 0c12 70 46 110 92 150l40 60" /><path d="M150 210c30-60 100-90 250-96" />
            </g>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <span class="grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-white shadow-lg"><AppIcon name="pin" class="h-5 w-5" /></span>
            <span class="rounded-full bg-black/75 px-4 py-2 text-xs font-semibold text-white backdrop-blur group-hover:underline">Lihat Lokasi di Google Maps</span>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
