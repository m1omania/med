<template>
  <div class="min-h-[80vh] py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <QuizWizard @complete="onQuizComplete" />
      <div class="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
        <span class="text-calming-700">
          <span class="font-medium text-calming-900">Подходящие методы:</span>
          {{ matchingMethodsCount ?? '—' }}
        </span>
        <span class="text-calming-700">
          <span class="font-medium text-calming-900">Клиники:</span>
          {{ matchingClinicsCount ?? '—' }}
        </span>
      </div>
      <p class="text-sm text-calming-500 mt-4 text-center">Анонимно. Бесплатно. Без регистрации</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()
const { showToast } = useToast()

const quizData = computed(() => patientStore.quizData)
const quizLocalization = computed(() => quizData.value?.localization ?? '')
const quizGeography = computed(() => quizData.value?.geography ?? '')

const filledAnswersCount = computed(() => {
  const d = quizData.value
  let n = 0
  if (d?.age != null && d.age > 0) n++
  if (d?.gender) n++
  if (d?.localization) n++
  if (d?.stage) n++
  if (d?.geography) n++
  return n
})

const diagnosisKeywords = computed(() => {
  const slug = quizLocalization.value || ''
  const map: Record<string, string[]> = {
    pechen: ['печень', 'pechen'],
    grudi: ['грудь', 'маммография', 'молочн', 'grudi', 'гормонотерапия'],
    legkie: ['лёгкие', 'легкие', 'кт', 'курение', 'legkie'],
    kishechnik: ['кишечник', 'колоноскопия', 'колоректаль', 'kishechnik'],
    obshiy: ['скрининг', 'профилактика', 'обследование'],
  }
  return map[slug] || []
})

const { data: methodsData } = await useFetch<{
  methods: { slug: string; topic: string; tags?: string[]; clinicId?: number }[]
}>('/api/articles')
const allMethods = computed(() => methodsData.value?.methods ?? [])

const methodsByRelevance = computed(() => {
  const list = Array.isArray(allMethods.value) ? allMethods.value : []
  const keywords = diagnosisKeywords.value
  if (!keywords.length) return list
  return list.filter((m) => {
    const topic = (m.topic || '').toLowerCase()
    const tags = Array.isArray(m.tags) ? m.tags.join(' ').toLowerCase() : ''
    return keywords.some((k) => topic.includes(k.toLowerCase()) || tags.includes(k.toLowerCase()))
  })
})

const hasDirection = computed(() => !!quizLocalization.value)
const baseMethodsCount = computed(() => methodsByRelevance.value.length)
const matchingMethodsCount = computed(() => {
  if (!hasDirection.value) return null
  const base = baseMethodsCount.value
  const n = filledAnswersCount.value
  if (n === 0) return base
  const factor = Math.max(0.4, 1 - n * 0.12)
  return Math.max(1, Math.round(base * factor))
})

const clinicIdsFromMethods = computed(() => {
  const list = methodsByRelevance.value.slice(0, 12)
  const ids = list.map((m: { clinicId?: number }) => m.clinicId).filter((id): id is number => id != null && id > 0)
  return [...new Set(ids)]
})

const { data: clinicsData } = await useAsyncData(
  () => `quiz-count-clinics-${clinicIdsFromMethods.value.join(',') || 'x'}-${quizGeography.value}`,
  async () => {
    const ids = clinicIdsFromMethods.value
    if (!ids.length) return { clinics: [] as { id: number; city?: string }[] }
    const res = await $fetch<{ clinics: { id: number; city?: string }[] }>(`/api/clinics?ids=${ids.join(',')}`)
    return res
  },
  { watch: [clinicIdsFromMethods, quizGeography] }
)

const baseClinicsCount = computed(() => {
  const clinics = clinicsData.value?.clinics ?? []
  const geo = quizGeography.value
  if (!geo) return clinics.length
  const inCity = clinics.filter((c) => c.city === geo).length
  return inCity || clinics.length
})
const matchingClinicsCount = computed(() => {
  if (!hasDirection.value) return null
  const base = baseClinicsCount.value
  const n = filledAnswersCount.value
  if (n === 0) return base
  const factor = Math.max(0.4, 1 - n * 0.12)
  return Math.max(0, Math.round(base * factor))
})

async function onQuizComplete(resultId: string) {
  if (!resultId) return
  patientStore.setLastResultId(resultId)
  showToast('Вы на правильном пути! Результаты готовы.')
  await navigateTo(`/results/${resultId}`)
}

useHead({
  title: 'Опрос — AntiOnko',
})
</script>
