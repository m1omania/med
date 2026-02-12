<template>
  <div class="py-8 px-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-2">Методы лечения</h1>
    <p class="text-calming-600 text-sm mb-8">Все методы верифицированы специалистами с медицинским образованием</p>

    <section class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in diseaseCategories"
          :key="cat.slug"
          type="button"
          class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition shrink-0"
          :class="selectedDisease === cat.slug
            ? 'bg-calming-600 text-white ring-2 ring-calming-200 ring-offset-2'
            : 'bg-white text-calming-800 hover:bg-neutral-50'"
          @click="toggleDisease(cat.slug)"
        >
          {{ cat.title }}
        </button>
        <button
          v-if="selectedDisease"
          type="button"
          class="inline-flex items-center px-3 py-2 rounded-full text-sm text-calming-600 hover:underline font-medium shrink-0"
          @click="selectedDisease = ''"
        >
          Сбросить
        </button>
      </div>
    </section>

    <!-- Список методов -->
    <section>
      <h2 class="sr-only">Список методов</h2>
      <div v-if="filteredMethods.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MethodCard
          v-for="item in filteredMethods"
          :key="item.slug"
          :method="item"
          :clinic="getClinicForMethod(item)"
        />
      </div>
      <p v-else class="text-calming-600">Нет методов по выбранному типу заболевания.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Method {
  slug: string
  title: string
  date: string
  topic: string
  source?: { name: string; url: string }
  tags?: string[]
  body?: string
  treatmentMethod?: boolean
  clinicId?: number
  clinicIds?: number[]
}

interface Clinic {
  id: number
  name: string
  city: string
}

interface DiseaseCategory {
  slug: string
  title: string
  titleEn?: string
  keywords: string[]
}

const { data: methodsData } = await useFetch<{ methods: Method[] }>('/api/articles')
const { data: diseaseData } = await useFetch<{ categories: DiseaseCategory[] }>('/api/disease-types')
const { data: clinicsData } = await useFetch<{ clinics: Clinic[] }>('/api/clinics')

const methods = computed(() => methodsData.value?.methods ?? [])
const clinicsMap = computed(() => {
  const list = clinicsData.value?.clinics ?? []
  return Object.fromEntries(list.map((c) => [c.id, c]))
})
function getClinicForMethod(method: Method): Clinic | undefined {
  const id = (method.clinicIds && method.clinicIds[0]) ?? method.clinicId
  if (id == null) return undefined
  return clinicsMap.value[id]
}

const diseaseCategories = computed(() => diseaseData.value?.categories ?? [])

const selectedDisease = ref('')

function toggleDisease(slug: string) {
  selectedDisease.value = selectedDisease.value === slug ? '' : slug
}

function methodMatchesDisease(method: Method, keywords: string[]): boolean {
  if (!keywords.length) return true
  const topic = (method.topic || '').toLowerCase()
  const tags = (method.tags || []).join(' ').toLowerCase()
  const title = (method.title || '').toLowerCase()
  const text = `${topic} ${tags} ${title}`
  return keywords.some((k) => text.includes(k.toLowerCase()))
}

const filteredMethods = computed(() => {
  let list = methods.value
  if (selectedDisease.value) {
    const cat = diseaseCategories.value.find((c) => c.slug === selectedDisease.value)
    if (cat?.keywords?.length) {
      list = list.filter((m) => methodMatchesDisease(m, cat.keywords))
    }
  }
  return list
})

useHead({
  title: 'Методы лечения — AntiOnko',
})
</script>
