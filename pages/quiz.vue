<template>
  <div class="min-h-[80vh] py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <QuizWizard @complete="onQuizComplete" />
      <p class="text-sm text-calming-500 mt-6 text-center">Анонимно. Бесплатно. Без регистрации</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()
const { showToast } = useToast()

function onQuizComplete(resultId: string) {
  patientStore.setLastResultId(resultId)
  showToast('Вы на правильном пути! Результаты готовы.')
  navigateTo(`/results/${resultId}`)
}

useHead({
  title: 'Опрос — AntiOnko',
})
</script>
