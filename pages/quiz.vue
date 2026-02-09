<template>
  <div class="min-h-[80vh] py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-calming-900 mb-2">Персональный онко-скрининг</h1>
      <p class="text-calming-600 mb-6">Ответьте на 7 шагов. Данные сохраняются автоматически.</p>
      <QuizWizard @complete="onQuizComplete" />
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()
const { showToast } = useToast()

async function onQuizComplete(resultId: string) {
  showToast('Вы на правильном пути! Результаты готовы.')
  patientStore.setLastResultId(resultId)
  await navigateTo(`/results/${resultId}`)
}

useHead({
  title: 'Опрос — AntiOnko',
})
</script>
