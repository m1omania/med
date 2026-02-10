<template>
  <div class="bg-white rounded-xl border border-calming-200 p-6">
    <h2 class="text-lg font-semibold text-calming-800 mb-4">Трекер симптомов</h2>
    <template v-if="hasData">
      <div class="h-64 mb-4">
        <ClientOnly>
          <canvas ref="chartRef" class="w-full" />
        </ClientOnly>
      </div>
      <div v-if="redFlags.length" class="rounded-lg bg-red-50 border border-red-200 p-3">
        <p class="text-sm font-medium text-red-800 mb-1">Обратите внимание</p>
        <ul class="text-sm text-red-700 space-y-0.5">
          <li v-for="(f, i) in redFlags" :key="i">{{ f }}</li>
        </ul>
      </div>
      <p v-else class="text-sm text-calming-600">Критических отклонений не отмечено.</p>
      <details class="mt-3 text-sm">
        <summary class="text-calming-600 cursor-pointer hover:underline">Добавить запись</summary>
        <form class="mt-2 space-y-2" @submit.prevent="addEntry">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-calming-600 mb-0.5">Дата</label>
              <input v-model="newDate" type="date" class="w-full rounded border border-calming-300 px-2 py-1" required />
            </div>
            <div>
              <label class="block text-calming-600 mb-0.5">Вес (кг)</label>
              <input v-model.number="newWeight" type="number" step="0.1" class="w-full rounded border border-calming-300 px-2 py-1" placeholder="—" />
            </div>
          </div>
          <div>
            <label class="block text-calming-600 mb-0.5">Боль (0–10)</label>
            <input v-model.number="newPain" type="number" min="0" max="10" class="w-full rounded border border-calming-300 px-2 py-1" placeholder="—" />
          </div>
          <button type="submit" class="px-3 py-1.5 rounded-lg bg-calming-600 text-white text-sm font-medium hover:bg-calming-700">Добавить</button>
        </form>
      </details>
    </template>
    <template v-else>
      <p class="text-sm text-calming-500 mb-4">Добавьте вес и уровень боли по дням — появится график.</p>
      <form class="space-y-3 text-sm" @submit.prevent="addEntry">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-calming-600 mb-0.5">Дата</label>
            <input v-model="newDate" type="date" class="w-full rounded border border-calming-300 px-2 py-1" required />
          </div>
          <div>
            <label class="block text-calming-600 mb-0.5">Вес (кг)</label>
            <input v-model.number="newWeight" type="number" step="0.1" class="w-full rounded border border-calming-300 px-2 py-1" placeholder="—" />
          </div>
        </div>
        <div>
          <label class="block text-calming-600 mb-0.5">Боль (0–10)</label>
          <input v-model.number="newPain" type="number" min="0" max="10" class="w-full rounded border border-calming-300 px-2 py-1" placeholder="—" />
        </div>
        <button type="submit" class="px-3 py-1.5 rounded-lg bg-calming-600 text-white text-sm font-medium hover:bg-calming-700">
          Добавить
        </button>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const patientStore = usePatientStore()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: InstanceType<typeof Chart> | null = null

const newDate = ref('')
const newWeight = ref<number | undefined>()
const newPain = ref<number | undefined>()

onMounted(() => {
  newDate.value = new Date().toISOString().slice(0, 10)
  patientStore.hydrateFromStorage()
})

const symptoms = computed(() => Array.isArray(patientStore.symptoms) ? patientStore.symptoms : [])

const hasData = computed(() => symptoms.value.length > 0)

const chartData = computed(() => {
  const list = symptoms.value.slice(-14)
  const labels = list.map((s) => s.date.slice(0, 10))
  return {
    labels,
    datasets: [
      {
        label: 'Вес (кг)',
        data: list.map((s) => s.weight ?? null),
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
        yAxisID: 'y',
        tension: 0.2,
      },
      {
        label: 'Боль (0–10)',
        data: list.map((s) => s.painLevel ?? null),
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        yAxisID: 'y1',
        tension: 0.2,
      },
    ]
  }
})

const redFlags = computed(() => {
  const list = symptoms.value
  const flags: string[] = []
  const painHigh = list.filter((s) => s.painLevel != null && s.painLevel >= 7)
  if (painHigh.length) flags.push(`Высокий уровень боли (≥7) в ${painHigh.length} записях. Обсудите с врачом.`)
  if (list.length >= 2) {
    const withWeight = list.filter((s) => s.weight != null)
    if (withWeight.length >= 2) {
      const sorted = [...withWeight].sort((a, b) => a.date.localeCompare(b.date))
      const first = sorted[0].weight!
      const last = sorted[sorted.length - 1].weight!
      if (first > 0 && last > 0 && (first - last) / first > 0.05) {
        flags.push('Заметная потеря веса. Рекомендуем сообщить врачу.')
      }
    }
  }
  return flags
})

watch(
  [chartData, hasData],
  () => {
    if (import.meta.client && chartRef.value && hasData.value && chartData.value.labels.length) {
      if (chartInstance) {
        chartInstance.data = chartData.value
        chartInstance.update()
      } else {
        chartInstance = new Chart(chartRef.value, {
          type: 'line',
          data: chartData.value,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
              y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Вес' } },
              y1: { type: 'linear', display: true, position: 'right', min: 0, max: 10, title: { display: true, text: 'Боль' }, grid: { drawOnChartArea: false } },
            },
          },
        })
      }
    }
  },
  { immediate: true }
)

function addEntry() {
  if (!newDate.value) return
  patientStore.addSymptom({
    date: newDate.value,
    weight: newWeight.value,
    painLevel: newPain.value,
  })
  newWeight.value = undefined
  newPain.value = undefined
  newDate.value = new Date().toISOString().slice(0, 10)
}

onBeforeUnmount(() => {
  chartInstance?.destroy()
  chartInstance = null
})
</script>
