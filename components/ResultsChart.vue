<template>
  <div class="h-full flex items-center justify-center">
    <canvas ref="chartRef" class="max-h-64" />
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  risks: Record<string, number>
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: InstanceType<typeof Chart> | null = null

const chartData = computed(() => {
  const entries = Object.entries(props.risks || {}).filter(([, v]) => v > 0)
  return {
    labels: entries.map(([k]) => k),
    datasets: [
      {
        data: entries.map(([, v]) => v),
        backgroundColor: [
          '#3b82f6',
          '#60a5fa',
          '#93c5fd',
          '#bfdbfe',
          '#dbeafe',
        ].slice(0, entries.length),
      },
    ],
  }
})

onMounted(() => {
  if (import.meta.client && chartRef.value && chartData.value.labels.length) {
    chartInstance = new Chart(chartRef.value, {
      type: 'pie',
      data: chartData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
        },
      },
    })
  }
})

watch(
  chartData,
  (data) => {
    if (chartInstance && data.labels.length) {
      chartInstance.data = data
      chartInstance.update()
    }
  },
  { deep: true },
)

onUnmounted(() => {
  chartInstance?.destroy()
})
</script>
