<template>
  <div class="py-8 px-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-2">Поиск</h1>
    <p v-if="query" class="text-calming-600 text-sm mb-8">
      По запросу «{{ query }}» найдено: методы — {{ methods.length }}, клиники — {{ clinics.length }}
    </p>
    <p v-else class="text-calming-600 text-sm mb-8">Введите запрос в поле поиска в шапке и нажмите Enter.</p>

    <section v-if="methods.length" class="mb-10">
      <h2 class="text-lg font-semibold text-calming-900 mb-4">Методы лечения</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MethodCard
          v-for="item in methods"
          :key="item.slug"
          :method="item"
          :clinic="getClinicForMethod(item)"
        />
      </div>
    </section>

    <section v-if="clinics.length" class="mb-10">
      <h2 class="text-lg font-semibold text-calming-900 mb-4">Клиники</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ClinicCard
          v-for="c in clinics"
          :key="c.id"
          :clinic="c"
        />
      </div>
    </section>

    <p
      v-if="query && !methods.length && !clinics.length"
      class="text-calming-600"
    >
      Ничего не найдено. Попробуйте другие слова.
    </p>
  </div>
</template>

<script setup lang="ts">
interface Method {
  slug: string
  title: string
  date: string
  topic: string
  clinicId?: number
  clinicIds?: number[]
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

const route = useRoute()
const query = computed(() => (route.query.q as string) || '')

const { data: searchData } = await useFetch(
  () => `/api/search?q=${encodeURIComponent(query.value || '')}`,
  { watch: [query] },
)
const { data: allClinicsData } = await useFetch<{ clinics: Clinic[] }>('/api/clinics')

const methods = computed(() => searchData.value?.methods ?? [])
const clinics = computed(() => searchData.value?.clinics ?? [])

const clinicsMap = computed(() => {
  const list = allClinicsData.value?.clinics ?? []
  return Object.fromEntries(list.map((c) => [c.id, c]))
})

function getClinicForMethod(method: Method): Clinic | undefined {
  const id = (method.clinicIds && method.clinicIds[0]) ?? method.clinicId
  if (id == null) return undefined
  return clinicsMap.value[id]
}

useHead({
  title: query.value ? `Поиск: ${query.value} — AntiOnko` : 'Поиск — AntiOnko',
})
</script>
