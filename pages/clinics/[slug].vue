<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <NuxtLink to="/clinics" class="text-calming-600 hover:underline mb-4 inline-block">
        ← Все клиники
      </NuxtLink>
      <h1 class="text-2xl font-bold text-calming-900 mb-2">
        {{ slugLabel }} — клиники в Петрозаводске
      </h1>
      <p class="text-calming-600 mb-6">
        Подборка клиник по направлению. Карта и контакты для записи.
      </p>
      <div class="grid gap-6">
        <ClinicCard
          v-for="c in clinicsBySlug"
          :key="c.id"
          :clinic="c"
          :slug="slug"
        />
      </div>
      <div class="mt-8 h-80 rounded-xl overflow-hidden border border-calming-200 bg-calming-50">
        <ClientOnly>
          <div ref="mapRef" class="w-full h-full" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => (route.params.slug as string) || 'pechen')
const mapRef = ref<HTMLElement | null>(null)

const slugLabels: Record<string, string> = {
  pechen: 'Печень',
  grudi: 'Маммология / Грудь',
  obshiy: 'Общий скрининг',
}
const slugLabel = computed(() => slugLabels[slug.value] || slug.value)

const { data } = await useFetch<{ clinics: Clinic[] }>('/api/clinics', {
  query: { slug: slug.value },
  default: () => ({ clinics: [] }),
})

const clinicsBySlug = computed(() => {
  const list = data.value?.clinics ?? []
  if (slug.value === 'obshiy') return list
  return list.filter((c) =>
    c.tags?.some((t: string) => t.toLowerCase().includes(slug.value)),
  )
})

onMounted(() => {
  if (import.meta.client && mapRef.value) {
    import('leaflet').then((L) => {
      const map = L.map(mapRef.value!).setView([61.78, 34.35], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)
      clinicsBySlug.value.forEach((c) => {
        if (c.lat && c.lng) {
          L.marker([c.lat, c.lng]).addTo(map).bindPopup(c.name)
        }
      })
    })
  }
})

useHead({
  title: `Клиники ${slugLabel.value} — AntiOnko`,
})

interface Clinic {
  id: number
  name: string
  city: string
  lat?: number
  lng?: number
  services?: string[]
  tags?: string[]
}
</script>
