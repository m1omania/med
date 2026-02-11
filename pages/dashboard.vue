<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-calming-900 mb-6">Личный кабинет</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

onMounted(() => {
  patientStore.hydrateFromStorage()
})

useHead({
  title: 'Личный кабинет — AntiOnko',
})
</script>
