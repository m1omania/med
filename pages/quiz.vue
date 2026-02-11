<template>
  <div class="min-h-[80vh] py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <QuizWizard @complete="onQuizComplete" />
      <div class="mt-8 flex flex-wrap items-center justify-center gap-10 text-base">
        <div class="flex items-baseline gap-2">
          <span class="font-medium text-calming-900">Подходящие методы:</span>
          <span class="counter-block inline-flex items-baseline overflow-hidden h-9">
            <span
              v-for="(digit, idx) in methodDigits"
              :key="'m-' + idx"
              class="digit-roller"
            >
              <span
                class="digit-strip text-calming-800"
                :style="{ transform: `translateY(-${digit * digitHeightPx}px)` }"
              >
                <span v-for="n in 10" :key="n" class="digit-cell">{{ n - 1 }}</span>
              </span>
            </span>
          </span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="font-medium text-calming-900">Клиники:</span>
          <span class="counter-block inline-flex items-baseline overflow-hidden h-9">
            <template v-if="displayClinicsCountFormatted === '—'">
              <span class="counter-value text-calming-800">—</span>
            </template>
            <template v-else>
              <span
                v-for="(digit, idx) in clinicDigits"
                :key="'c-' + idx"
                class="digit-roller"
              >
                <span
                  class="digit-strip text-calming-800"
                  :style="{ transform: `translateY(-${digit * digitHeightPx}px)` }"
                >
                  <span v-for="n in 10" :key="n" class="digit-cell">{{ n - 1 }}</span>
                </span>
              </span>
            </template>
          </span>
        </div>
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

const committedStep = computed(() => quizData.value?.step ?? 0)
const effectiveLocalization = computed(() =>
  committedStep.value > 2 ? (quizData.value?.localization ?? '') : ''
)
const effectiveGeography = computed(() =>
  committedStep.value > 4 ? (quizData.value?.geography ?? '') : ''
)

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

const committedFilledCount = computed(() => {
  const s = committedStep.value
  return [s > 0, s > 1, s > 2, s > 3, s > 4].filter(Boolean).length
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

const diagnosisKeywordsForDisplay = computed(() => {
  const slug = effectiveLocalization.value || ''
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
  methods: { slug: string; topic: string; tags?: string[]; clinicId?: number; clinicIds?: number[] }[]
}>('/api/articles')
const allMethods = computed(() => methodsData.value?.methods ?? [])

const { data: stats } = await useFetch<{ methods: number; clinics: number }>('/api/stats', { default: () => null })

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

const methodsByRelevanceForDisplay = computed(() => {
  const list = Array.isArray(allMethods.value) ? allMethods.value : []
  const keywords = diagnosisKeywordsForDisplay.value
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
  const ids = list.flatMap((m: { clinicId?: number; clinicIds?: number[] }) =>
    Array.isArray(m.clinicIds) ? m.clinicIds : (m.clinicId != null ? [m.clinicId] : [])
  ).filter((id): id is number => id > 0)
  return [...new Set(ids)]
})

const clinicIdsFromMethodsForDisplay = computed(() => {
  const list = methodsByRelevanceForDisplay.value.slice(0, 12)
  const ids = list.flatMap((m: { clinicId?: number; clinicIds?: number[] }) =>
    Array.isArray(m.clinicIds) ? m.clinicIds : (m.clinicId != null ? [m.clinicId] : [])
  ).filter((id): id is number => id > 0)
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

/** Slug для клиник: тот же, что в quiz POST (primaryRisk.slug), чтобы счётчик совпадал с результатами */
const effectiveSlugForClinics = computed(() => effectiveLocalization.value || 'obshiy')

/** Клиники для счётчика: та же логика, что и в quiz POST (slug + city с fallback) */
const { data: clinicsDataForDisplay } = await useAsyncData(
  () => `quiz-clinics-by-slug-${effectiveSlugForClinics.value}-${effectiveGeography.value || 'x'}`,
  async () => {
    const slug = effectiveSlugForClinics.value
    const city = effectiveGeography.value || ''
    const params = new URLSearchParams({ slug })
    if (city) params.set('city', city)
    const res = await $fetch<{ clinics: { id: number; city?: string }[] }>(`/api/clinics?${params}`)
    return res
  },
  { watch: [effectiveSlugForClinics, effectiveGeography] }
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

const baseMethodsCountForDisplay = computed(() => methodsByRelevanceForDisplay.value.length)
const baseClinicsCountForDisplay = computed(() =>
  (clinicsDataForDisplay.value?.clinics ?? []).length
)

/** Счётчики как на странице результатов: без коэффициента, методы — до 6 */
const displayMethodsCount = computed(() => {
  if (committedStep.value <= 2) return allMethods.value.length
  return Math.min(6, baseMethodsCountForDisplay.value)
})
const displayClinicsCount = computed(() => {
  if (committedStep.value <= 2) return stats.value?.clinics ?? '—'
  return baseClinicsCountForDisplay.value
})

/** Анимированные значения для пошаговой прокрутки (21 → 20 → … → 6) */
const animatedMethodsCount = ref<number>(0)
const animatedClinicsCount = ref<number>(0)
const methodsCancelId = { current: 0 }
const clinicsCancelId = { current: 0 }

function runSequentialCount(
  current: Ref<number>,
  target: number,
  options: {
    maxDurationMs?: number
    minStepMs?: number
    maxStepMs?: number
    cancelToken?: { current: number }
  } = {}
) {
  const { maxDurationMs = 2200, minStepMs = 28, maxStepMs = 120, cancelToken } = options
  if (cancelToken) cancelToken.current += 1
  const myId = cancelToken ? cancelToken.current : 0
  const start = current.value
  if (start === target) return
  const steps = Math.abs(target - start)
  const totalDuration = Math.min(maxDurationMs, steps * 70)
  const stepMs = Math.max(minStepMs, Math.min(maxStepMs, Math.round(totalDuration / steps)))
  const step = target > start ? 1 : -1
  const tick = () => {
    if (cancelToken && myId !== cancelToken.current) return
    const next = current.value + step
    if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
      current.value = target
      return
    }
    current.value = next
    setTimeout(tick, stepMs)
  }
  setTimeout(tick, stepMs)
}

watch(
  displayMethodsCount,
  (target) => {
    const n = Number(target)
    if (!Number.isFinite(n)) return
    if (animatedMethodsCount.value === 0 && n > 0) {
      animatedMethodsCount.value = n
      return
    }
    runSequentialCount(animatedMethodsCount, n, { cancelToken: methodsCancelId })
  },
  { immediate: true }
)

watch(
  displayClinicsCount,
  (target) => {
    if (target === '—' || target == null) return
    const n = Number(target)
    if (!Number.isFinite(n)) return
    if (animatedClinicsCount.value === 0 && n > 0) {
      animatedClinicsCount.value = n
      return
    }
    runSequentialCount(animatedClinicsCount, n, { cancelToken: clinicsCancelId })
  },
  { immediate: true }
)

/** Для отображения: «—» если клиник ещё не выбрано, иначе анимированное число */
const displayClinicsCountFormatted = computed(() =>
  displayClinicsCount.value === '—' ? '—' : animatedClinicsCount.value
)

/** Высота одной цифры в барабане (px) для translateY */
const digitHeightPx = 36
/** Цифры для барабана: методы */
const methodDigits = computed(() =>
  String(animatedMethodsCount.value)
    .split('')
    .map((c) => Number.parseInt(c, 10))
)
/** Цифры для барабана: клиники (только когда число) */
const clinicDigits = computed(() => {
  const v = displayClinicsCountFormatted.value
  if (typeof v !== 'number') return []
  return String(v)
    .split('')
    .map((c) => Number.parseInt(c, 10))
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

<style scoped>
.counter-block {
  min-width: 2.5rem;
  vertical-align: middle;
}
.counter-value {
  display: inline-block;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 2.25rem;
}

/* Барабан счётчика: одна цифра — колонка 0–9, прокрутка снизу вверх */
.digit-roller {
  display: inline-block;
  overflow: hidden;
  height: 36px;
  vertical-align: top;
}
.digit-strip {
  display: flex;
  flex-direction: column;
  transition: transform 0.12s ease-out;
}
.digit-cell {
  height: 36px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}
</style>
