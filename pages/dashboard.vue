<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-calming-900 mb-2">Ваш дашборд</h1>
        <p class="text-calming-600 text-sm">
          План, трекер симптомов, напоминания и материалы в одном месте.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <!-- Первая колонка: все блоки -->
        <div class="space-y-4">
          <PlanSection />
          <DashboardDoctorBlock />
          <div class="bg-white rounded-xl border border-calming-200 p-4">
            <h3 class="text-sm font-semibold text-calming-800 mb-2">Загрузить скан анализов</h3>
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm text-calming-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-calming-100 file:text-calming-700 file:text-sm"
              @change="onFileUpload"
            />
            <p class="text-xs text-calming-500 mt-1">Мок: файл сохраняется локально. Распознавание — в разработке.</p>
          </div>
          <SymptomTracker />
          <TimelineReminders />
          <ArticlesFeed />
          <BreakthroughsFeed />
        </div>

        <!-- Вторая колонка: только чат -->
        <div class="lg:sticky lg:top-24 lg:self-start">
          <DashboardChat />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()
const { showToast } = useToast()

onMounted(() => {
  patientStore.hydrateFromStorage()
})

function onFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    showToast('Файл загружен. Анализ в разработке.')
    target.value = ''
  }
}

useHead({
  title: 'Дашборд — AntiOnko',
})
</script>
