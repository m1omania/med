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

.page-enter-active,
.page-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
