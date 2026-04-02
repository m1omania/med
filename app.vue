<template>
  <NuxtLayout>
    <NuxtPage />
    <NotificationToast />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Global layout wrapper — NotificationToast from components
</script>

<style>
/* Убираем голубую обводку при фокусе у всех элементов */
*:focus {
  outline: none;
  box-shadow: none;
}
*:focus-visible {
  outline: none;
  box-shadow: none;
}
</style>
