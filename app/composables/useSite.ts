/** Pengaturan situs dari database (nama, nomor WhatsApp, alamat, dll). */
export function useSite() {
  const { data } = useFetch<Record<string, string>>('/api/settings', { key: 'site-settings', default: () => ({}) })
  const s = computed(() => data.value ?? {})
  const name = computed(() => s.value.site_name || 'Rental PS')
  const waDigits = computed(() => (s.value.wa_number || '').replace(/\D/g, ''))
  const wa = (message: string) =>
    waDigits.value ? `https://wa.me/${waDigits.value}?text=${encodeURIComponent(message)}` : '/kontak'
  return { s, name, waDigits, wa }
}
