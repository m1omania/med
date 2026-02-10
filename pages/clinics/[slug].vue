<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <NuxtLink to="/clinics" class="text-calming-600 hover:underline mb-4 inline-flex items-center gap-1">
        <AppIcon name="arrow-left" size="sm" /> Все клиники
      </NuxtLink>
      <h1 class="text-2xl font-bold text-calming-900 mb-2">
        {{ slugLabel }} — клиники
      </h1>
      <p class="text-calming-600 mb-4">
        Подборка клиник по направлению. Выберите город для фильтра.
      </p>
      <div class="mb-6">
        <select
          v-model="cityFilter"
          class="rounded-lg border border-calming-300 px-3 py-2 text-sm"
        >
          <option value="">Все города</option>
          <option value="Петрозаводск">Петрозаводск</option>
          <option value="Москва">Москва</option>
          <option value="Санкт-Петербург">Санкт-Петербург</option>
        </select>
      </div>
      <div class="grid gap-6">
        <ClinicCard
          v-for="c in filteredByCity"
          :key="c.id"
          :clinic="c"
          :slug="slug"
        />
      </div>
      <div class="mt-8">
        <h2 class="text-lg font-semibold text-calming-900 mb-2">На карте</h2>
        <div class="h-80 rounded-xl overflow-hidden border border-calming-200 bg-calming-50">
          <ClientOnly>
            <ClinicsMap :key="mapKey" :clinics="filteredByCity" />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => (route.params.slug as string) || 'pechen')

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

const cityFilter = ref('')

const clinicsBySlug = computed(() => {
  const list = data.value?.clinics ?? []
  if (slug.value === 'obshiy') return list
  return list.filter((c) =>
    c.tags?.some((t: string) => t.toLowerCase().includes(slug.value)),
  )
})

const filteredByCity = computed(() => {
  const list = clinicsBySlug.value
  if (!cityFilter.value) return list
  return list.filter((c) => c.city === cityFilter.value)
})

const mapKey = computed(() => filteredByCity.value.map((c) => c.id).join(','))

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
