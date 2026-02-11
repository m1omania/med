<template>
  <div class="flex flex-col min-h-0 h-full">
    <!-- Прокручиваемая область: шаги/прогресс фиксированы, вопрос и ответы выезжают -->
    <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
      <!-- Шаг и прогресс-бар — зафиксированы, не участвуют в анимации -->
      <div class="shrink-0 bg-white px-6 pt-6 pb-2 lg:px-8 lg:pt-8 lg:pb-2">
        <p class="text-sm font-medium text-calming-600 mb-2">Шаг {{ currentStep + 1 }} из 6</p>
        <div class="h-2 bg-calming-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-calming-600 transition-all duration-300 rounded-full"
            :style="{ width: `${((currentStep + 1) / 6) * 100}%` }"
          />
        </div>
      </div>

      <div class="flex-1 min-h-0 relative">
        <Transition :name="'slide-' + slideDirection">
          <div
            :key="currentStep"
            class="absolute inset-0 overflow-auto flex flex-col w-full bg-white slide-panel"
          >
          <!-- Вопрос и подсказка — выезжают -->
          <div class="sticky top-0 z-10 bg-white px-6 pt-2 pb-4 lg:px-8 lg:pt-4 lg:pb-6 shrink-0">
            <h2 class="text-xl font-bold text-calming-900 mb-1">{{ stepTitle }}</h2>
            <p class="text-sm text-calming-600 mb-0">{{ stepInstruction }}</p>
          </div>

          <!-- Ответы на белом фоне -->
          <div class="bg-white px-6 pt-4 pb-6 lg:px-8 lg:pt-6 lg:pb-6 flex flex-col flex-1">
      <!-- Step 0: age -->
      <div v-if="currentStep === 0" class="space-y-4 flex-1">
        <input
          v-model.number="local.age"
          type="number"
          min="18"
          max="100"
          class="w-full max-w-xs rounded-xl border-2 border-calming-200 px-4 py-3 text-lg focus:border-calming-500 focus:outline-none focus:ring-2 focus:ring-calming-200"
          placeholder="45"
          @blur="saveStep"
        />
      </div>
      <!-- Step 1: gender -->
      <div v-else-if="currentStep === 1" class="flex flex-col gap-3 flex-1">
        <label
          v-for="opt in genderOptions"
          :key="opt.value"
          class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition"
          :class="local.gender === opt.value ? 'border-calming-600 bg-calming-50' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/30'"
        >
          <input
            v-model="local.gender"
            type="radio"
            :value="opt.value"
            name="gender"
            class="w-5 h-5 text-calming-600 border-calming-300 focus:ring-calming-500"
            @change="saveStep"
          >
          <span class="w-12 h-12 rounded-full bg-calming-100 flex items-center justify-center text-calming-600 shrink-0">
            <AppIcon :name="opt.icon" size="lg" />
          </span>
          <span class="font-medium text-calming-800">{{ opt.label }}</span>
        </label>
      </div>
      <!-- Step 2: localization — теги как на странице Методы -->
      <div v-else-if="currentStep === 2" class="flex flex-wrap gap-x-3 gap-y-2 content-start flex-1">
        <button
          v-for="opt in localizationOptions"
          :key="opt.value"
          type="button"
          class="inline-flex items-center justify-center h-9 px-4 rounded-full text-sm font-medium transition shrink-0"
          :class="local.localization === opt.value
            ? 'bg-calming-600 text-white border-2 border-calming-600'
            : 'bg-white text-calming-800 border-2 border-calming-200 hover:bg-calming-50'"
          @click="local.localization = opt.value; saveStep()"
        >
          {{ opt.label }}
        </button>
      </div>
      <!-- Step 3: stage — теги как на странице Методы -->
      <div v-else-if="currentStep === 3" class="flex flex-wrap gap-x-3 gap-y-2 content-start flex-1">
        <button
          v-for="opt in stageOptions"
          :key="opt.value"
          type="button"
          class="inline-flex items-center justify-center h-9 px-4 rounded-full text-sm font-medium transition shrink-0"
          :class="local.stage === opt.value
            ? 'bg-calming-600 text-white border-2 border-calming-600'
            : 'bg-white text-calming-800 border-2 border-calming-200 hover:bg-calming-50'"
          @click="local.stage = opt.value; saveStep()"
        >
          {{ opt.label }}
        </button>
      </div>
      <!-- Step 4: geography -->
      <div v-else-if="currentStep === 4" class="flex flex-col gap-3 flex-1">
        <label
          v-for="opt in geographyOptions"
          :key="opt.value"
          class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition"
          :class="local.geography === opt.value ? 'border-calming-600 bg-calming-50' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/30'"
        >
          <input
            v-model="local.geography"
            type="radio"
            :value="opt.value"
            name="geography"
            class="w-5 h-5 text-calming-600 border-calming-300 focus:ring-calming-500"
            @change="saveStep"
          >
          <span class="font-medium text-calming-800">{{ opt.label }}</span>
        </label>
      </div>
      <!-- Step 5: confirm -->
      <div v-else-if="currentStep === 5" class="flex-1">
        <ul class="text-calming-700 space-y-2 text-sm">
          <li><span class="text-calming-500">Возраст:</span> {{ local.age || '—' }}</li>
          <li><span class="text-calming-500">Пол:</span> {{ local.gender === 'M' ? 'Мужской' : local.gender === 'F' ? 'Женский' : '—' }}</li>
          <li><span class="text-calming-500">Тип / локализация:</span> {{ localizationLabel }}</li>
          <li><span class="text-calming-500">Стадия:</span> {{ local.stage || '—' }}</li>
          <li><span class="text-calming-500">География:</span> {{ local.geography || '—' }}</li>
        </ul>
      </div>
          </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Кнопки навигации — зафиксированы внизу -->
    <div class="shrink-0 min-h-[3.5rem] bg-white px-6 pb-6 pt-4 lg:px-8 lg:pb-8 lg:pt-6 border-t border-calming-100 flex justify-between items-center">
        <div class="min-w-[8rem] flex justify-start">
          <button
            v-if="currentStep < 5"
            type="button"
            class="px-4 py-2.5 rounded-xl border-2 border-calming-200 text-calming-700 font-medium hover:bg-calming-50 inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentStep === 0"
            @click="prev"
          >
            <AppIcon name="arrow-left" size="sm" /> Назад
          </button>
          <button
            v-else-if="currentStep === 5"
            type="button"
            class="px-4 py-2.5 rounded-xl border-2 border-calming-200 text-calming-700 font-medium hover:bg-calming-50 inline-flex items-center gap-1"
            @click="goToFirstStep"
          >
            Изменить данные
          </button>
        </div>
        <button
          v-if="currentStep < 5"
          type="button"
          class="px-5 py-2.5 rounded-xl bg-calming-600 text-white font-medium hover:bg-calming-700 disabled:opacity-50 inline-flex items-center gap-1"
          :disabled="!canNext"
          @click="next"
        >
          Далее <AppIcon name="arrow-right" size="sm" />
        </button>
        <button
          v-else-if="currentStep === 5"
          type="button"
          class="px-5 py-2.5 rounded-xl bg-calming-600 text-white font-medium hover:bg-calming-700 disabled:opacity-50 inline-flex items-center gap-1"
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
/** Направление смены шага: для анимации выезда справа/слева */
const slideDirection = ref<'next' | 'prev'>('next')

const local = reactive({
  age: patientStore.quizData?.age ?? 45,
  gender: patientStore.quizData?.gender ?? 'M',
  symptoms: (patientStore.quizData?.symptoms ?? []) as string[],
  localization: patientStore.quizData?.localization ?? '',
  stage: patientStore.quizData?.stage ?? '',
  geography: patientStore.quizData?.geography ?? 'Москва',
})

const stepTitles: Record<number, string> = {
  0: 'Ваш возраст',
  1: 'Пол',
  2: 'Тип опухоли / локализация',
  3: 'Стадия заболевания',
  4: 'География',
  5: 'Проверьте данные',
}
const stepInstructions: Record<number, string> = {
  0: 'Укажите возраст',
  1: 'Выберите один ответ',
  2: 'Выберите один ответ',
  3: 'Выберите один ответ',
  4: 'Выберите город',
  5: 'При необходимости нажмите «Изменить данные»',
}
const stepTitle = computed(() => stepTitles[currentStep.value] ?? '')
const stepInstruction = computed(() => stepInstructions[currentStep.value] ?? '')

const genderOptions = [
  { value: 'M', label: 'Мужской', icon: 'user-male' as const },
  { value: 'F', label: 'Женский', icon: 'user-female' as const },
]

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
  { value: 'Москва', label: 'Москва' },
  { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
  { value: 'Петрозаводск', label: 'Петрозаводск' },
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
  slideDirection.value = 'next'
  saveStep()
  currentStep.value++
  setStep(currentStep.value)
}

function prev() {
  if (currentStep.value <= 0) return
  slideDirection.value = 'prev'
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

<style scoped>
/* Панель слайда: фиксированная область, только горизонтальное смещение */
.slide-panel {
  will-change: transform;
}

/* Вперёд: новый вопрос выезжает справа, старый уезжает влево */
.slide-next-enter-active,
.slide-next-leave-active {
  transition: transform 0.28s ease-out;
}
.slide-next-enter-from {
  transform: translateX(100%);
}
.slide-next-enter-to,
.slide-next-leave-from {
  transform: translateX(0);
}
.slide-next-leave-to {
  transform: translateX(-100%);
}

/* Назад: новый вопрос выезжает слева, старый уезжает вправо */
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.28s ease-out;
}
.slide-prev-enter-from {
  transform: translateX(-100%);
}
.slide-prev-enter-to,
.slide-prev-leave-from {
  transform: translateX(0);
}
.slide-prev-leave-to {
  transform: translateX(100%);
}
</style>
