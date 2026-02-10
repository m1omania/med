<template>
  <div class="bg-white rounded-2xl border border-calming-200 shadow-sm overflow-hidden">
    <div class="px-6 py-4 bg-calming-50 border-b border-calming-100">
      <div class="mb-2">
        <span class="text-sm font-medium text-calming-700">Шаг {{ currentStep + 1 }} из 10</span>
      </div>
      <div class="h-2 bg-calming-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-calming-600 transition-all duration-300"
          :style="{ width: `${((currentStep + 1) / 10) * 100}%` }"
        />
      </div>
    </div>
    <div class="p-6 min-h-[320px]">
      <!-- Step 0: age -->
      <div v-if="currentStep === 0" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Ваш возраст</h2>
        <input
          v-model.number="local.age"
          type="number"
          min="18"
          max="100"
          class="w-full rounded-lg border border-calming-300 px-4 py-2 text-lg"
          placeholder="45"
          @blur="saveStep"
        />
      </div>
      <!-- Step 1: gender -->
      <div v-else-if="currentStep === 1" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Пол</h2>
        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            class="flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition"
            :class="local.gender === 'M' ? 'border-calming-600 bg-calming-50' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/50'"
            @click="local.gender = 'M'; saveStep()"
          >
            <span class="w-14 h-14 rounded-full bg-calming-100 flex items-center justify-center text-calming-600">
              <AppIcon name="user-male" size="lg" />
            </span>
            <span class="font-medium text-calming-800">Мужской</span>
          </button>
          <button
            type="button"
            class="flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition"
            :class="local.gender === 'F' ? 'border-calming-600 bg-calming-50' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/50'"
            @click="local.gender = 'F'; saveStep()"
          >
            <span class="w-14 h-14 rounded-full bg-calming-100 flex items-center justify-center text-calming-600">
              <AppIcon name="user-female" size="lg" />
            </span>
            <span class="font-medium text-calming-800">Женский</span>
          </button>
        </div>
      </div>
      <!-- Step 2: symptoms -->
      <div v-else-if="currentStep === 2" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Симптомы (можно несколько)</h2>
        <SymptomSelector v-model="local.symptoms" @update:model-value="saveStep" />
      </div>
      <!-- Step 3: localization -->
      <div v-else-if="currentStep === 3" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Тип опухоли / локализация</h2>
        <div class="flex flex-col gap-2">
          <button
            v-for="opt in localizationOptions"
            :key="opt.value"
            type="button"
            class="px-4 py-3 rounded-xl border-2 text-sm font-medium transition text-left"
            :class="local.localization === opt.value ? 'border-calming-600 bg-calming-50 text-calming-800' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/50 text-calming-700'"
            @click="local.localization = opt.value; saveStep()"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <!-- Step 4: stage -->
      <div v-else-if="currentStep === 4" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Стадия известна?</h2>
        <div class="flex flex-col gap-2">
          <button
            v-for="opt in stageOptions"
            :key="opt.value"
            type="button"
            class="px-4 py-3 rounded-xl border-2 text-sm font-medium transition text-left"
            :class="local.stage === opt.value ? 'border-calming-600 bg-calming-50 text-calming-800' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/50 text-calming-700'"
            @click="local.stage = opt.value; saveStep()"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <!-- Step 5: treatment plan -->
      <div v-else-if="currentStep === 5" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">План лечения?</h2>
        <p class="text-sm text-calming-600">Можно выбрать несколько</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in treatmentPlanOptions"
            :key="opt"
            type="button"
            class="px-4 py-2 rounded-xl border-2 text-sm font-medium transition"
            :class="local.treatmentPlan?.includes(opt) ? 'border-calming-600 bg-calming-50 text-calming-800' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/50 text-calming-700'"
            @click="toggleTreatmentPlan(opt)"
          >
            {{ opt }}
          </button>
        </div>
      </div>
      <!-- Step 6: family history -->
      <div v-else-if="currentStep === 6" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Семейная история</h2>
        <div class="flex flex-col gap-2">
          <button
            v-for="opt in familyHistoryOptions"
            :key="opt.value"
            type="button"
            class="px-4 py-3 rounded-xl border-2 text-sm font-medium transition text-left"
            :class="local.familyHistory === opt.value ? 'border-calming-600 bg-calming-50 text-calming-800' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/50 text-calming-700'"
            @click="local.familyHistory = opt.value; saveStep()"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <!-- Step 5: lifestyle -->
      <div v-else-if="currentStep === 7" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Образ жизни (можно несколько)</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in lifestyleOptions"
            :key="opt"
            type="button"
            class="px-4 py-2 rounded-xl border-2 text-sm font-medium transition"
            :class="local.lifestyle?.includes(opt) ? 'border-calming-600 bg-calming-50 text-calming-800' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/50 text-calming-700'"
            @click="toggleLifestyle(opt)"
          >
            {{ opt }}
          </button>
        </div>
      </div>
      <!-- Step 6: geography -->
      <div v-else-if="currentStep === 8" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">География</h2>
        <div class="flex flex-col gap-2">
          <button
            v-for="opt in geographyOptions"
            :key="opt.value"
            type="button"
            class="px-4 py-3 rounded-xl border-2 text-sm font-medium transition text-left"
            :class="local.geography === opt.value ? 'border-calming-600 bg-calming-50 text-calming-800' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/50 text-calming-700'"
            @click="local.geography = opt.value; saveStep()"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <!-- Step 9: confirm -->
      <div v-else-if="currentStep === 9" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Проверьте данные</h2>
        <ul class="text-calming-700 space-y-1 text-sm">
          <li>Возраст: {{ local.age || '—' }}</li>
          <li>Пол: {{ local.gender === 'M' ? 'Мужской' : local.gender === 'F' ? 'Женский' : '—' }}</li>
          <li>Симптомы: {{ (local.symptoms || []).join(', ') || '—' }}</li>
          <li>Тип / локализация: {{ local.localization || '—' }}</li>
          <li>Стадия: {{ local.stage || '—' }}</li>
          <li>План лечения: {{ (local.treatmentPlan || []).join(', ') || '—' }}</li>
          <li>География: {{ local.geography || '—' }}</li>
          <li>Семья: {{ local.familyHistory || '—' }}</li>
        </ul>
      </div>
    </div>
    <div class="px-6 py-4 bg-calming-50 border-t border-calming-100 flex justify-between">
      <button
        v-if="currentStep > 0 && currentStep < 9"
        type="button"
        class="px-4 py-2 text-calming-600 hover:text-calming-800 font-medium inline-flex items-center gap-1"
        @click="prev"
      >
        <AppIcon name="arrow-left" size="sm" /> Назад
      </button>
      <button
        v-else-if="currentStep === 9"
        type="button"
        class="px-4 py-2 text-calming-600 hover:text-calming-800 font-medium inline-flex items-center gap-1"
        @click="goToFirstStep"
      >
        Изменить данные
      </button>
      <div v-else />
      <button
        v-if="currentStep < 9"
        type="button"
        class="px-4 py-2 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700 disabled:opacity-50 inline-flex items-center gap-1"
        :disabled="!canNext"
        @click="next"
      >
        Далее <AppIcon name="arrow-right" size="sm" />
      </button>
      <button
        v-else-if="currentStep === 9"
        type="button"
        class="px-4 py-2 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700 disabled:opacity-50 inline-flex items-center gap-1"
        :disabled="submitting"
        @click="submit"
      >
        {{ submitting ? 'Отправка...' : 'Получить результаты' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ complete: [resultId: string] }>()
const { getCurrentStep, setStep, updateAnswers, submitQuiz } = useQuiz()
const patientStore = usePatientStore()

const currentStep = ref(patientStore.quizData?.step ?? 0)
const submitting = ref(false)

const local = reactive({
  age: patientStore.quizData?.age ?? undefined,
  gender: patientStore.quizData?.gender ?? '',
  symptoms: (patientStore.quizData?.symptoms ?? []) as string[],
  localization: patientStore.quizData?.localization ?? '',
  stage: patientStore.quizData?.stage ?? '',
  treatmentPlan: (patientStore.quizData?.treatmentPlan ?? []) as string[],
  geography: patientStore.quizData?.geography ?? '',
  familyHistory: patientStore.quizData?.familyHistory ?? '',
  lifestyle: (patientStore.quizData?.lifestyle ?? []) as string[],
})

const localizationOptions = [
  { value: 'pechen', label: 'Печень' },
  { value: 'grudi', label: 'Молочные железы / грудь' },
  { value: 'legkie', label: 'Лёгкие' },
  { value: 'kishechnik', label: 'Кишечник' },
  { value: 'obshiy', label: 'Общее / профилактика' },
]

const familyHistoryOptions = [
  { value: '', label: 'Нет случаев в семье' },
  { value: 'mother', label: 'У мамы был рак груди' },
  { value: 'father', label: 'У отца был рак' },
  { value: 'other', label: 'Другие случаи в семье' },
]

const stageOptions = [
  { value: 'Нет', label: 'Нет' },
  { value: 'I', label: 'I' },
  { value: 'II', label: 'II' },
  { value: 'III', label: 'III' },
  { value: 'IV', label: 'IV' },
  { value: 'метастазы', label: 'Метастазы' },
]

const treatmentPlanOptions = ['операция', 'химия', 'лучевая', 'таргет', 'иммуно', 'не назначен']

const geographyOptions = [
  { value: 'Петрозаводск', label: 'Петрозаводск' },
  { value: 'Москва', label: 'Москва' },
  { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
]

const lifestyleOptions = ['Курение', 'Алкоголь', 'Спорт', 'ЗОЖ']

function toggleLifestyle(opt: string) {
  const arr = [...(local.lifestyle || [])]
  const idx = arr.indexOf(opt)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(opt)
  local.lifestyle = arr
  saveStep()
}

function toggleTreatmentPlan(opt: string) {
  const arr = [...(local.treatmentPlan || [])]
  const idx = arr.indexOf(opt)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(opt)
  local.treatmentPlan = arr
  saveStep()
}

onMounted(() => {
  patientStore.hydrateFromStorage()
  currentStep.value = patientStore.quizData?.step ?? 0
})

const canNext = computed(() => {
  if (currentStep.value === 0) return !!local.age
  if (currentStep.value === 1) return !!local.gender
  if (currentStep.value === 2) return true
  if (currentStep.value === 3) return !!local.localization
  if (currentStep.value === 4) return !!local.stage
  if (currentStep.value === 8) return !!local.geography
  return true
})

function saveStep() {
  updateAnswers({
    step: currentStep.value,
    age: local.age,
    gender: local.gender,
    symptoms: local.symptoms,
    localization: local.localization,
    stage: local.stage,
    treatmentPlan: local.treatmentPlan,
    geography: local.geography,
    familyHistory: local.familyHistory,
    lifestyle: local.lifestyle,
  })
}

function next() {
  if (currentStep.value >= 9) return
  saveStep()
  currentStep.value++
  setStep(currentStep.value)
}

function prev() {
  if (currentStep.value <= 0) return
  currentStep.value--
  setStep(currentStep.value)
}

function goToFirstStep() {
  currentStep.value = 0
  setStep(0)
}

async function submit() {
  saveStep()
  submitting.value = true
  const payload = {
    age: local.age,
    gender: local.gender,
    symptoms: local.symptoms ?? [],
    localization: local.localization,
    stage: local.stage,
    treatmentPlan: local.treatmentPlan ?? [],
    geography: local.geography,
    familyHistory: local.familyHistory,
    lifestyle: local.lifestyle ?? [],
  }
  try {
    const res = await submitQuiz(payload)
    const resAny = res as {
      geography?: string
      age?: number
      gender?: string
      localization?: string
      diagnosisStatus?: string
      stage?: string
      plan?: string[]
    }
    const resultSummary = {
      id: res.id,
      risks: res.risks,
      recommendations: res.recommendations,
      methods: res.methods,
      clinics: res.clinics,
      primaryRisk: res.primaryRisk,
      geography: resAny.geography,
      age: resAny.age,
      gender: resAny.gender,
      localization: resAny.localization,
      diagnosisStatus: resAny.diagnosisStatus,
      stage: resAny.stage,
      plan: resAny.plan ?? [],
      createdAt: new Date().toISOString(),
    }
    patientStore.addResult(resultSummary)
    emit('complete', res.id)
  } catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'data' in e
      ? String((e as { data?: unknown }).data)
      : e instanceof Error ? e.message : 'Ошибка отправки'
    useToast().showToast(msg, 'error')
  } finally {
    submitting.value = false
  }
}
</script>
