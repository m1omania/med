<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-calming-50/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Подбор результатов"
    >
      <div class="max-w-md w-full px-6">
        <h2 class="text-lg font-semibold text-calming-900 mb-6 text-center">Подбор результатов</h2>
        <ul class="space-y-4" aria-label="Прогресс">
          <li
            v-for="(step, i) in visibleSteps"
            :key="i"
            class="flex items-center gap-3 text-left transition-opacity duration-300"
            :class="step.done ? 'opacity-100' : ''"
          >
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300"
              :class="step.done ? 'border-calming-600 bg-calming-600 text-white' : 'border-calming-300 bg-white text-calming-400'"
            >
              <svg
                v-if="step.done"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span
                  v-else
                  class="h-4 w-4 rounded-full border-2 border-calming-600 border-t-transparent animate-spin"
                  aria-hidden="true"
                />
            </span>
            <span
              class="text-calming-800 font-medium"
              :class="step.done ? 'text-calming-900' : ''"
            >
              {{ step.label }}{{ step.countText }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
export interface LoadingCounts {
  methodsFound: number
  methodsTotal: number
  clinicsInRegionFound: number
  clinicsInRegionTotal: number
  clinicsOtherFound: number
  clinicsOtherTotal: number
  planCount: number
}

const props = defineProps<{
  counts?: LoadingCounts | null
  userCity?: string
}>()
const emit = defineEmits<{ done: [] }>()

const stepLabels = computed(() => [
  'Ищем методы лечения',
  props.userCity?.trim() ? `Ищем клиники в ${props.userCity.trim()}` : 'Ищем клиники в локации указанной пользователем',
  'Ищем клиники в соседних регионах',
  'Составляем план лечения',
])

const stepDone = ref<boolean[]>([false, false, false, false])
const visibleCount = ref(1)

function getCountText(stepIndex: number, done: boolean): string {
  if (!done || !props.counts) return ''
  const c = props.counts
  switch (stepIndex) {
    case 0:
      return ` — ${c.methodsFound} из ${c.methodsTotal}`
    case 1:
      return ` — ${c.clinicsInRegionFound} из ${c.clinicsInRegionTotal}`
    case 2:
      return ` — ${c.clinicsOtherFound} из ${c.clinicsOtherTotal}`
    case 3:
      return c.planCount ? ` — ${c.planCount} пунктов` : ''
    default:
      return ''
  }
}

const visibleSteps = computed(() =>
  stepLabels.value.slice(0, visibleCount.value).map((label, i) => ({
    label,
    done: stepDone.value[i] ?? false,
    countText: getCountText(i, stepDone.value[i] ?? false),
  }))
)

const STEP_DURATION_MS = 4000
const timeouts: ReturnType<typeof setTimeout>[] = []

onMounted(() => {
  timeouts.push(
    setTimeout(() => {
      stepDone.value = [true, false, false, false]
      visibleCount.value = 2
    }, STEP_DURATION_MS)
  )
  timeouts.push(
    setTimeout(() => {
      stepDone.value = [true, true, false, false]
      visibleCount.value = 3
    }, STEP_DURATION_MS * 2)
  )
  timeouts.push(
    setTimeout(() => {
      stepDone.value = [true, true, true, false]
      visibleCount.value = 4
    }, STEP_DURATION_MS * 3)
  )
  timeouts.push(
    setTimeout(() => {
      stepDone.value = [true, true, true, true]
    }, STEP_DURATION_MS * 4)
  )
  timeouts.push(
    setTimeout(() => {
      emit('done')
    }, STEP_DURATION_MS * 4 + 400)
  )
})

onUnmounted(() => {
  timeouts.forEach(clearTimeout)
})
</script>
