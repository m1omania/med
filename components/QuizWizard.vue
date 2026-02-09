<template>
  <div class="bg-white rounded-2xl border border-calming-200 shadow-sm overflow-hidden">
    <div class="px-6 py-4 bg-calming-50 border-b border-calming-100">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-calming-700">Шаг {{ currentStep + 1 }} из 7</span>
        <button
          v-if="currentStep > 0"
          type="button"
          class="text-sm text-calming-600 hover:text-calming-800"
          @click="undo"
        >
          Назад
        </button>
      </div>
      <div class="h-2 bg-calming-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-calming-600 transition-all duration-300"
          :style="{ width: `${((currentStep + 1) / 7) * 100}%` }"
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
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="local.gender" type="radio" value="M" class="rounded-full" @change="saveStep" />
            <span>Мужской</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="local.gender" type="radio" value="F" class="rounded-full" @change="saveStep" />
            <span>Женский</span>
          </label>
        </div>
      </div>
      <!-- Step 2: symptoms -->
      <div v-else-if="currentStep === 2" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Симптомы (можно несколько)</h2>
        <SymptomSelector v-model="local.symptoms" @update:model-value="saveStep" />
      </div>
      <!-- Step 3: localization -->
      <div v-else-if="currentStep === 3" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Локализация беспокойства</h2>
        <select
          v-model="local.localization"
          class="w-full rounded-lg border border-calming-300 px-4 py-2"
          @change="saveStep"
        >
          <option value="">— Выберите —</option>
          <option value="pechen">Печень</option>
          <option value="grudi">Молочные железы / грудь</option>
          <option value="legkie">Лёгкие</option>
          <option value="kishechnik">Кишечник</option>
          <option value="obshiy">Общее / профилактика</option>
        </select>
      </div>
      <!-- Step 4: family history -->
      <div v-else-if="currentStep === 4" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Семейная история</h2>
        <select
          v-model="local.familyHistory"
          class="w-full rounded-lg border border-calming-300 px-4 py-2"
          @change="saveStep"
        >
          <option value="">Нет случаев в семье</option>
          <option value="mother">У мамы был рак груди</option>
          <option value="father">У отца был рак</option>
          <option value="other">Другие случаи в семье</option>
        </select>
      </div>
      <!-- Step 5: lifestyle -->
      <div v-else-if="currentStep === 5" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Образ жизни (можно несколько)</h2>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="opt in ['Курение', 'Алкоголь', 'Спорт', 'ЗОЖ']"
            :key="opt"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer"
            :class="local.lifestyle?.includes(opt) ? 'border-calming-600 bg-calming-50' : 'border-calming-200'"
          >
            <input
              v-model="local.lifestyle"
              type="checkbox"
              :value="opt"
              class="rounded"
              @change="saveStep"
            />
            <span>{{ opt }}</span>
          </label>
        </div>
      </div>
      <!-- Step 6: confirm -->
      <div v-else-if="currentStep === 6" class="space-y-4">
        <h2 class="text-lg font-semibold text-calming-900">Проверьте данные</h2>
        <ul class="text-calming-700 space-y-1 text-sm">
          <li>Возраст: {{ local.age || '—' }}</li>
          <li>Пол: {{ local.gender === 'M' ? 'Мужской' : local.gender === 'F' ? 'Женский' : '—' }}</li>
          <li>Симптомы: {{ (local.symptoms || []).join(', ') || '—' }}</li>
          <li>Локализация: {{ local.localization || '—' }}</li>
          <li>Семья: {{ local.familyHistory || '—' }}</li>
        </ul>
        <button
          type="button"
          class="w-full py-3 rounded-lg bg-calming-600 text-white font-semibold hover:bg-calming-700"
          :disabled="submitting"
          @click="submit"
        >
          {{ submitting ? 'Отправка...' : 'Получить результаты' }}
        </button>
      </div>
    </div>
    <div class="px-6 py-4 bg-calming-50 border-t border-calming-100 flex justify-between">
      <button
        v-if="currentStep > 0 && currentStep < 6"
        type="button"
        class="px-4 py-2 text-calming-600 hover:text-calming-800 font-medium"
        @click="prev"
      >
        ← Назад
      </button>
      <div v-else />
      <button
        v-if="currentStep < 6"
        type="button"
        class="px-4 py-2 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700 disabled:opacity-50"
        :disabled="!canNext"
        @click="next"
      >
        Далее →
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
  familyHistory: patientStore.quizData?.familyHistory ?? '',
  lifestyle: (patientStore.quizData?.lifestyle ?? []) as string[],
})

onMounted(() => {
  patientStore.hydrateFromStorage()
  currentStep.value = patientStore.quizData?.step ?? 0
})

const canNext = computed(() => {
  if (currentStep.value === 0) return !!local.age
  if (currentStep.value === 1) return !!local.gender
  if (currentStep.value === 2) return true
  if (currentStep.value === 3) return !!local.localization
  return true
})

function saveStep() {
  updateAnswers({
    step: currentStep.value,
    age: local.age,
    gender: local.gender,
    symptoms: local.symptoms,
    localization: local.localization,
    familyHistory: local.familyHistory,
    lifestyle: local.lifestyle,
  })
}

function next() {
  if (currentStep.value >= 6) return
  saveStep()
  currentStep.value++
  setStep(currentStep.value)
}

function prev() {
  if (currentStep.value <= 0) return
  currentStep.value--
  setStep(currentStep.value)
}

function undo() {
  prev()
}

async function submit() {
  saveStep()
  submitting.value = true
  const payload = {
    age: local.age,
    gender: local.gender,
    symptoms: local.symptoms ?? [],
    localization: local.localization,
    familyHistory: local.familyHistory,
    lifestyle: local.lifestyle ?? [],
  }
  try {
    const res = await submitQuiz(payload)
    const resultSummary = {
      id: res.id,
      risks: res.risks,
      recommendations: res.recommendations,
      methods: res.methods,
      clinics: res.clinics,
      primaryRisk: res.primaryRisk,
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
