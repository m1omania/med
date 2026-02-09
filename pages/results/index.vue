<template>
  <div class="py-8 px-4 max-w-2xl mx-auto text-center">
    <h1 class="text-2xl font-bold text-calming-900 mb-4">Мои результаты</h1>
    <p v-if="lastId" class="text-calming-600 mb-4">
      Ваш последний результат готов.
    </p>
    <NuxtLink
      v-if="lastId"
      :to="`/results/${lastId}`"
      class="inline-block px-6 py-3 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700"
    >
      Смотреть результат
    </NuxtLink>
    <template v-else>
      <p class="text-calming-600 mb-4">Пройдите опрос, чтобы получить персональные результаты.</p>
      <NuxtLink
        to="/quiz"
        class="inline-block px-6 py-3 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700"
      >
        Начать опрос
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()
const lastId = computed(() => patientStore.lastResultId || patientStore.results[0]?.id)

useHead({
  title: 'Результаты — AntiOnko',
})
</script>
