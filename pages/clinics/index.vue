<template>
  <div class="py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-calming-900 mb-6">Клиники Петрозаводска и Карелии</h1>
      <div class="flex flex-wrap gap-4 mb-6">
        <select
          v-model="city"
          class="rounded-lg border border-calming-300 px-3 py-2 text-sm"
        >
          <option value="">Все города</option>
          <option value="Петрозаводск">Петрозаводск</option>
        </select>
        <select
          v-model="service"
          class="rounded-lg border border-calming-300 px-3 py-2 text-sm"
        >
          <option value="">Все услуги</option>
          <option value="УЗИ">УЗИ</option>
          <option value="КТ">КТ</option>
          <option value="МРТ">МРТ</option>
          <option value="Маммография">Маммография</option>
        </select>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <ClinicCard
          v-for="c in filteredClinics"
          :key="c.id"
          :clinic="c"
          slug="all"
        />
      </div>
      <div class="mt-8 h-96 rounded-xl overflow-hidden border border-calming-200 bg-calming-50">
        <ClientOnly>
          <div ref="mapRef" class="w-full h-full" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const city = ref('')
const service = ref('')
const mapRef = ref<HTMLElement | null>(null)

const { data: clinics } = await useFetch<ClinicsResponse>('/api/clinics', {
  default: () => ({ clinics: [] }),
})

const filteredClinics = computed(() => {
  const list = clinics.value?.clinics ?? []
  return list.filter((c) => {
    if (city.value && c.city !== city.value) return false
    if (service.value && !c.services?.includes(service.value)) return false
    return true
  })
})

onMounted(() => {
  if (import.meta.client && mapRef.value && typeof window !== 'undefined') {
    import('leaflet').then((L) => {
      const map = L.map(mapRef.value!).setView([61.78, 34.35], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)
      filteredClinics.value.forEach((c) => {
        if (c.lat && c.lng) {
          L.marker([c.lat, c.lng])
            .addTo(map)
            .bindPopup(c.name)
        }
      })
    })
  }
})

useHead({
  title: 'Клиники — AntiOnko',
})

interface ClinicsResponse {
  clinics: Clinic[]
}

interface Clinic {
  id: number
  name: string
  city: string
  lat?: number
  lng?: number
  services?: string[]
  doctor?: string
}
</script>
