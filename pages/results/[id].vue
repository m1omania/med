<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <NuxtLink to="/quiz" class="text-calming-600 hover:underline mb-4 inline-flex items-center gap-1">
        <AppIcon name="arrow-left" size="sm" /> К опросу
      </NuxtLink>
      <template v-if="result">
        <h1 class="text-2xl font-bold text-calming-900 mb-8">Ваши результаты</h1>

        <!-- 1. Кто вы и с чем вы -->
        <ProfileSummary :profile="profile" />

        <!-- 2. Прорывные возможности по вашему типу рака -->
        <section v-if="breakthroughMethods.length" class="mb-10">
          <h2 class="text-lg font-semibold text-calming-900 mb-4">Прорывные возможности по вашему типу рака</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink
              v-for="m in breakthroughMethods"
              :key="m.slug"
              :to="`/methods/${m.slug}`"
              class="block rounded-xl border-2 border-calming-200 p-4 hover:border-calming-400 hover:bg-calming-50/50 transition"
            >
              <p class="font-semibold text-calming-900 line-clamp-2">{{ m.title }}</p>
              <p v-if="m.date" class="text-sm text-calming-500 mt-2">{{ m.date }}</p>
              <span class="mt-3 inline-flex items-center gap-1 text-sm text-calming-600 font-medium">
                К методу
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </span>
            </NuxtLink>
          </div>
        </section>
        <section v-else class="mb-10 p-4 rounded-xl bg-calming-50 border border-calming-200 text-calming-700 text-sm">
          Подборка методов по вашему направлению появится после сохранения ответов. Пока можно посмотреть <NuxtLink to="/methods" class="text-calming-600 hover:underline">все методы лечения</NuxtLink>.
        </section>

        <!-- 3. Клиники по рекомендованным методам -->
        <section class="mb-10">
          <h2 class="text-lg font-semibold text-calming-900 mb-2">Клиники</h2>
          <p class="text-sm text-calming-600 mb-4">
            {{ displayClinics.length ? (result.geography ? `Клиники по направлению и в вашем регионе (${result.geography})` : 'Клиники, связанные с рекомендованными методами и по вашему направлению') : 'Клиники по вашему направлению.' }}
          </p>
          <div v-if="displayClinics.length" class="grid gap-4">
            <ClinicCard
              v-for="clinic in displayClinics"
              :key="clinic.id"
              :clinic="clinic"
              :slug="result.primaryRisk?.slug || 'obshiy'"
            />
            <NuxtLink
              :to="`/clinics/${result.primaryRisk?.slug || 'obshiy'}`"
              class="mt-2 inline-flex items-center gap-1 text-calming-600 hover:text-calming-800 font-medium"
            >
              Все клиники по направлению <AppIcon name="arrow-right" size="sm" class="inline" />
            </NuxtLink>
          </div>
          <div v-else class="p-4 rounded-xl bg-calming-50 border border-calming-200">
            <p class="text-sm text-calming-700 mb-2">В базе пока нет клиник по этому направлению.</p>
            <NuxtLink
              :to="`/clinics/${result.primaryRisk?.slug || 'obshiy'}`"
              class="text-calming-600 hover:underline font-medium"
            >
              Открыть список клиник <AppIcon name="arrow-right" size="sm" class="inline" />
            </NuxtLink>
          </div>
        </section>

        <!-- 4. Инструменты поддержки -->
        <ToolsSection :hide-methods="true" />

        <div v-if="patientStore.isLoggedIn" class="mt-8">
          <NuxtLink
            to="/dashboard"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-calming-600 text-white text-sm font-medium hover:bg-calming-700"
          >
            Сохранить в дашборд
          </NuxtLink>
        </div>
      </template>
      <div v-else class="text-center py-12 text-calming-600">
        <p class="mb-4">Результаты не найдены или устарели.</p>
        <NuxtLink to="/quiz" class="text-calming-600 hover:underline font-medium">Пройти опрос</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const patientStore = usePatientStore()

const id = computed(() => route.params.id as string)

const result = computed(() => patientStore.getResultById(id.value) ?? null)

const diagnosisLabel = computed(() => {
  const r = result.value
  if (!r?.primaryRisk?.label) return 'Общий скрининг'
  return r.primaryRisk.label
})

const profile = computed(() => ({
  age: result.value?.age,
  gender: result.value?.gender,
  diagnosisLabel: diagnosisLabel.value,
  geography: result.value?.geography,
  diagnosisStatus: result.value?.diagnosisStatus,
}))

const diagnosisKeywords = computed(() => {
  const slug = result.value?.primaryRisk?.slug || ''
  const map: Record<string, string[]> = {
    pechen: ['печень', 'pechen'],
    grudi: ['грудь', 'маммография', 'молочн', 'grudi', 'гормонотерапия'],
    legkie: ['лёгкие', 'легкие', 'кт', 'курение', 'legkie'],
    kishechnik: ['кишечник', 'колоноскопия', 'колоректаль', 'kishechnik'],
    obshiy: ['скрининг', 'профилактика', 'обследование'],
  }
  return map[slug] || map.obshiy
})

const { data: methodsData } = await useFetch<{ methods: { slug: string; title: string; date: string; topic: string; tags?: string[]; clinicId?: number }[] }>('/api/articles')
const allMethods = computed(() => methodsData.value?.methods ?? [])

const methodsByDiagnosis = computed(() => {
  const list = Array.isArray(allMethods.value) ? allMethods.value : []
  const keywords = diagnosisKeywords.value
  if (!keywords.length) return list.slice(0, 6)
  return list.filter((m) => {
    const topic = (m.topic || '').toLowerCase()
    const tags = Array.isArray(m.tags) ? m.tags.join(' ').toLowerCase() : ''
    return keywords.some((k) => topic.includes(k.toLowerCase()) || tags.includes(k.toLowerCase()))
  })
})

const breakthroughMethods = computed(() => {
  const list = Array.isArray(methodsByDiagnosis.value) ? methodsByDiagnosis.value : []
  return list.slice(0, 6)
})

const clinicIdsFromMethods = computed(() => {
  const list = breakthroughMethods.value
  const ids = list.map((m: { clinicId?: number }) => m.clinicId).filter((id): id is number => id != null && id > 0)
  return [...new Set(ids)]
})

const { data: clinicsFromMethodsData } = await useAsyncData(
  () => `results-clinics-${clinicIdsFromMethods.value.join(',') || 'none'}`,
  async () => {
    const ids = clinicIdsFromMethods.value
    if (!ids.length) return { clinics: [] }
    return $fetch<{ clinics: unknown[] }>(`/api/clinics?ids=${ids.join(',')}`)
  },
  { watch: [clinicIdsFromMethods] }
)
const clinicsFromMethods = computed(() => clinicsFromMethodsData.value?.clinics ?? [])

const displayClinics = computed(() => {
  const fromMethods = Array.isArray(clinicsFromMethods.value) ? clinicsFromMethods.value : []
  const fromResult = Array.isArray(result.value?.clinics) ? result.value.clinics : []
  const seen = new Set<number>()
  const out: { id: number; name: string; city?: string; [key: string]: unknown }[] = []
  for (const c of fromMethods) {
    const id = (c as { id?: number }).id
    if (id != null && !seen.has(id)) {
      seen.add(id)
      out.push(c as { id: number; name: string; city?: string; [key: string]: unknown })
    }
  }
  for (const c of fromResult) {
    const id = (c as { id?: number }).id
    if (id != null && !seen.has(id)) {
      seen.add(id)
      out.push(c as { id: number; name: string; city?: string; [key: string]: unknown })
    }
  }
  return out
})

onMounted(() => {
  patientStore.hydrateFromStorage()
})

useHead({
  title: result.value ? 'Результаты — AntiOnko' : 'Результаты не найдены — AntiOnko',
})
</script>
