<template>
  <div class="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
    <div class="px-6 py-4 bg-calming-50 border-b border-calming-100">
      <div class="mb-2">
        <span class="text-sm font-medium text-calming-700">Шаг {{ currentStep + 1 }} из 6</span>
      </div>
      <div class="h-2 bg-calming-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-calming-600 transition-all duration-300"
          :style="{ width: `${((currentStep + 1) / 6) * 100}%` }"
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
      <!-- Step 2: localization -->
      <div v-else-if="currentStep === 2" class="space-y-4">
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
      <!-- Step 3: stage -->
      <div v-else-if="currentStep === 3" class="space-y-4">
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
      <!-- Step 4: geography -->
      <div v-else-if="currentStep === 4" class="space-y-4">
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
      <!-- Step 5: confirm -->
      <div v-else-if="currentStep === 5" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Проверьте данные</h2>
        <ul class="text-calming-700 space-y-1 text-sm">
          <li>Возраст: {{ local.age || '—' }}</li>
          <li>Пол: {{ local.gender === 'M' ? 'Мужской' : local.gender === 'F' ? 'Женский' : '—' }}</li>
          <li>Тип / локализация: {{ localizationLabel }}</li>
          <li>Стадия: {{ local.stage || '—' }}</li>
          <li>География: {{ local.geography || '—' }}</li>
        </ul>
      </div>
    </div>
    <div class="px-6 py-4 bg-calming-50 border-t border-calming-100 flex justify-between">
      <button
        v-if="currentStep > 0 && currentStep < 5"
        type="button"
        class="px-4 py-2 text-calming-600 hover:text-calming-800 font-medium inline-flex items-center gap-1"
        @click="prev"
      >
        <AppIcon name="arrow-left" size="sm" /> Назад
      </button>
      <button
        v-else-if="currentStep === 5"
        type="button"
        class="px-4 py-2 text-calming-600 hover:text-calming-800 font-medium inline-flex items-center gap-1"
        @click="goToFirstStep"
      >
        Изменить данные
      </button>
      <div v-else />
      <button
        v-if="currentStep < 5"
        type="button"
        class="px-4 py-2 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700 disabled:opacity-50 inline-flex items-center gap-1"
        :disabled="!canNext"
        @click="next"
      >
        Далее <AppIcon name="arrow-right" size="sm" />
      </button>
      <button
        v-else-if="currentStep === 5"
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
  geography: patientStore.quizData?.geography ?? '',
})

const localizationOptions = [
  { value: 'pechen', label: 'Печень' },
  { value: 'grudi', label: 'Молочные железы / грудь' },
  { value: 'legkie', label: 'Лёгкие' },
  { value: 'kishechnik', label: 'Кишечник' },
  { value: 'obshiy', label: 'Общее / профилактика' },
]

const stageOptions = [
  { value: 'Нет', label: 'Нет' },
  { value: 'I', label: 'I' },
  { value: 'II', label: 'II' },
  { value: 'III', label: 'III' },
  { value: 'IV', label: 'IV' },
  { value: 'метастазы', label: 'Метастазы' },
]

const geographyOptions = [
  { value: 'Петрозаводск', label: 'Петрозаводск' },
  { value: 'Москва', label: 'Москва' },
  { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
]

const localizationLabel = computed(() => {
  const v = local.localization
  if (!v) return '—'
  const opt = localizationOptions.find((o) => o.value === v)
  return opt?.label ?? v
})

function syncLocalFromStore() {
  const d = patientStore.quizData
  if (d?.age != null) local.age = Number(d.age)
  if (d?.gender) local.gender = d.gender
  if (d?.localization) local.localization = d.localization
  if (d?.stage) local.stage = d.stage
  if (d?.geography) local.geography = d.geography
  if (Array.isArray(d?.symptoms)) local.symptoms = d.symptoms
}

onMounted(() => {
  patientStore.hydrateFromStorage()
  currentStep.value = Math.min(patientStore.quizData?.step ?? 0, 5)
  syncLocalFromStore()
})

const canNext = computed(() => {
  if (currentStep.value === 0) {
    const age = Number(local.age)
    return Number.isFinite(age) && age >= 18 && age <= 100
  }
  if (currentStep.value === 1) return !!local.gender
  if (currentStep.value === 2) return !!local.localization
  if (currentStep.value === 3) return !!local.stage
  if (currentStep.value === 4) return !!local.geography
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
    treatmentPlan: [],
    geography: local.geography,
    familyHistory: '',
    lifestyle: [],
  })
}

function next() {
  if (currentStep.value >= 5) return
  saveStep()
  currentStep.value++
  setStep(currentStep.value)
}

function prev() {
  if (currentStep.value <= 0) return
  currentStep.value--
  setStep(currentStep.value)
  syncLocalFromStore()
}

function goToFirstStep() {
  currentStep.value = 0
  setStep(0)
  syncLocalFromStore()
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
    treatmentPlan: [],
    geography: local.geography,
    familyHistory: '',
    lifestyle: [],
  }
  try {
    const res = await submitQuiz(payload)
    if (!res?.id) {
      useToast().showToast('Сервер не вернул результат. Попробуйте ещё раз.', 'error')
      return
    }
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
    let msg = 'Ошибка отправки'
    if (e instanceof Error) msg = e.message
    else if (e && typeof e === 'object' && 'data' in e) msg = String((e as { data?: unknown }).data)
    else if (e && typeof e === 'object' && 'message' in e) msg = String((e as { message?: unknown }).message)
    useToast().showToast(msg, 'error')
  } finally {
    submitting.value = false
  }
}
</script>
