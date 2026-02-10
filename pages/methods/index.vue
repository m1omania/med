<template>
  <div class="py-8 px-4 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-2">Методы лечения</h1>
    <p class="text-calming-600 text-sm mb-8">Диагностика, скрининг и лечение по типу заболевания</p>

    <!-- Лента фильтров: тип заболевания (10 категорий по дорожной карте) -->
    <section class="mb-8">
      <h2 class="text-sm font-semibold text-calming-700 uppercase tracking-wider mb-3">Тип заболевания</h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in diseaseCategories"
          :key="cat.slug"
          type="button"
          class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition shrink-0"
          :class="selectedDisease === cat.slug
            ? 'bg-calming-600 text-white ring-2 ring-calming-200 ring-offset-2'
            : 'bg-white border-2 border-calming-200 text-calming-800 hover:border-calming-400 hover:bg-calming-50'"
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

    <!-- Режим "по моему диагнозу" для авторизованных -->
    <div v-if="patientStore.isLoggedIn" class="mb-4 flex items-center gap-2">
      <span class="text-sm font-medium text-calming-700">Показать:</span>
      <button
        type="button"
        class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
        :class="newsMode === 'all' ? 'bg-calming-600 text-white' : 'bg-calming-100 text-calming-700 hover:bg-calming-200'"
        @click="newsMode = 'all'"
      >
        Все методы
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
        :class="newsMode === 'diagnosis' ? 'bg-calming-600 text-white' : 'bg-calming-100 text-calming-700 hover:bg-calming-200'"
        @click="newsMode = 'diagnosis'"
      >
        По моему диагнозу
      </button>
    </div>

    <!-- Список методов -->
    <section>
      <h2 class="sr-only">Список методов</h2>
      <div v-if="filteredMethods.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="item in filteredMethods"
          :key="item.slug"
          :to="`/methods/${item.slug}`"
          class="block p-4 rounded-xl border-2 border-calming-200 bg-white hover:border-calming-300 hover:shadow-md transition min-h-0"
        >
          <h2 class="font-semibold text-calming-800 line-clamp-2">{{ stripEmojis(item.title) }}</h2>
          <p class="text-sm text-calming-600 mt-2">{{ item.date }}</p>
          <p class="text-sm text-calming-500 mt-1">
            <span class="font-medium">Тема:</span> {{ item.topic }}
          </p>
          <p v-if="item.source?.name" class="text-sm text-calming-500 mt-0.5">
            <span class="font-medium">Источник:</span> {{ item.source.name }}
          </p>
        </NuxtLink>
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
}

interface DiseaseCategory {
  slug: string
  title: string
  titleEn?: string
  keywords: string[]
}

const { stripEmojis } = useStripEmojis()
const { data: methodsData } = await useFetch<{ methods: Method[] }>('/api/articles')
const { data: diseaseData } = await useFetch<{ categories: DiseaseCategory[] }>('/api/disease-types')

const methods = computed(() => methodsData.value?.methods ?? [])

const diseaseCategories = computed(() => diseaseData.value?.categories ?? [])

const patientStore = usePatientStore()
const newsMode = ref<'all' | 'diagnosis'>('all')
const selectedDisease = ref('')

function toggleDisease(slug: string) {
  selectedDisease.value = selectedDisease.value === slug ? '' : slug
}

const diagnosisKeywords = computed(() => {
  const lastResult = patientStore.lastResultId
    ? patientStore.getResultById(patientStore.lastResultId)
    : null
  const slug = lastResult?.primaryRisk?.slug || patientStore.quizData?.localization || ''
  const map: Record<string, string[]> = {
    pechen: ['печень', 'pechen'],
    grudi: ['грудь', 'маммография', 'молочн', 'grudi', 'гормонотерапия'],
    legkie: ['лёгкие', 'легкие', 'кт', 'курение', 'legkie'],
    kishechnik: ['кишечник', 'колоноскопия', 'kishechnik'],
    obshiy: [],
  }
  return map[slug] || []
})

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
  if (patientStore.isLoggedIn && newsMode.value === 'diagnosis') {
    const keywords = diagnosisKeywords.value
    if (keywords.length) {
      list = list.filter((m) => methodMatchesDisease(m, keywords))
    }
  }
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
