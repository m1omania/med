<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-calming-900 mb-2">Ваш дашборд</h1>
      <p class="text-calming-600 mb-6">
        История опросов, результаты и рекомендации в одном месте.
      </p>
      <DashboardTimeline />
      <section class="mt-8 bg-white rounded-xl border border-calming-200 p-6">
        <h2 class="text-lg font-semibold text-calming-800 mb-4">График симптомов (мок)</h2>
        <div class="h-64 flex items-center justify-center text-calming-500 bg-calming-50 rounded-lg">
          <span>Chart.js: динамика по сохранённым опросам</span>
        </div>
      </section>
      <section class="mt-6 bg-white rounded-xl border border-calming-200 p-6">
        <h2 class="text-lg font-semibold text-calming-800 mb-4">Загрузить скан (мок)</h2>
        <input
          type="file"
          accept="image/*"
          class="block w-full text-sm text-calming-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-calming-100 file:text-calming-700"
          @change="onFileUpload"
        />
        <p class="text-sm text-calming-500 mt-2">Имитация анализа снимка. Реальный ИИ — позже.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()
const { showToast } = useToast()

function onFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    showToast('Файл загружен. Анализ в разработке.')
  }
}

useHead({
  title: 'Дашборд — AntiOnko',
})
</script>
