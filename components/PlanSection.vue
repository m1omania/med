<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-calming-200 p-6">
      <h2 class="text-lg font-semibold text-calming-800 mb-3">Ваш план</h2>
      <template v-if="lastResult">
        <div class="mb-4">
          <p class="text-sm font-medium text-calming-700 mb-1">Прогресс маршрута</p>
          <div class="h-2 bg-calming-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-calming-600 transition-all duration-300"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
          <p class="text-xs text-calming-500 mt-1">{{ routeProgressText }}</p>
        </div>
        <div v-if="urgentSteps.length" class="mb-4">
          <p class="text-sm font-medium text-calming-700 mb-2">Срочно</p>
          <ul class="space-y-1 text-sm text-calming-700">
            <li v-for="(s, i) in urgentSteps" :key="i" class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full bg-calming-200 shrink-0" />
              {{ s }}
            </li>
          </ul>
        </div>
        <div v-if="routeStages.length">
          <p class="text-sm font-medium text-calming-700 mb-2">Этапы</p>
          <ul class="space-y-2 text-sm">
            <li
              v-for="(stage, i) in routeStages"
              :key="i"
              class="flex items-center gap-2"
            >
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                :class="stage.done ? 'bg-calming-600' : 'bg-calming-200'"
              >
                {{ i + 1 }}
              </span>
              <span :class="stage.done ? 'text-calming-600 line-through' : 'text-calming-800'">{{ stage.title }}</span>
            </li>
          </ul>
        </div>
        <NuxtLink
          v-if="lastResultId"
          :to="`/results/${lastResultId}`"
          class="mt-4 inline-block text-sm text-calming-600 hover:underline"
        >
          Открыть полный план →
        </NuxtLink>
      </template>
      <p v-else class="text-sm text-calming-500">
        Пройдите опрос, чтобы увидеть персональный план.
        <NuxtLink to="/quiz" class="text-calming-600 hover:underline">Начать</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

const lastResultId = computed(() => patientStore.lastResultId)
const lastResult = computed(() => {
  const id = lastResultId.value
  if (!id) return null
  return patientStore.getResultById(id) ?? null
})

const userType = computed((): 'TYPE1' | 'TYPE2' => {
  const r = lastResult.value
  if (!r) return 'TYPE2'
  const knowsStage = !!r.stage && r.stage !== 'unknown' && r.stage !== 'Нет'
  const knowsPlan = !!(r.plan && r.plan.length > 0)
  return knowsStage && knowsPlan ? 'TYPE1' : 'TYPE2'
})

const { data: branchingData } = await useFetch<{
  type1: { urgent: string[]; route: { title: string }[] }
  type2: { urgent: string[]; route: { title: string }[] }
}>('/data/branching.json')

const urgentSteps = computed(() => {
  const data = branchingData.value
  const type = userType.value
  if (type === 'TYPE1' && Array.isArray(data?.type1?.urgent)) return data.type1.urgent.slice(0, 3)
  if (type === 'TYPE2' && Array.isArray(data?.type2?.urgent)) return data.type2.urgent.slice(0, 3)
  const rec = lastResult.value?.recommendations
  return Array.isArray(rec) ? rec.slice(0, 3) : []
})

const routeStages = computed(() => {
  const data = branchingData.value
  const type = userType.value
  const stages = type === 'TYPE1' ? data?.type1?.route : data?.type2?.route
  if (!Array.isArray(stages) || !stages.length) return []
  const reminders = Array.isArray(patientStore.reminders) ? patientStore.reminders : []
  const completedCount = Math.min(reminders.filter((r) => r.done).length, stages.length)
  return stages.map((s, i) => ({
    title: s.title,
    done: i < completedCount,
  }))
})

const progressPercent = computed(() => {
  const total = routeStages.value.length
  if (!total) return 0
  const done = routeStages.value.filter((s) => s.done).length
  return Math.round((done / total) * 100)
})

const routeProgressText = computed(() => {
  const total = routeStages.value.length
  if (!total) return '0 из 0 этапов'
  const done = routeStages.value.filter((s) => s.done).length
  return `${done} из ${total} этапов`
})
</script>
