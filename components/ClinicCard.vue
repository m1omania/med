<template>
  <div class="bg-white rounded-xl border border-calming-200 p-6 hover:shadow-md transition">
    <h3 class="font-semibold text-calming-900">{{ clinic.name }}</h3>
    <p class="text-sm text-calming-600 mt-1">{{ clinic.city }}</p>
    <div v-if="clinic.services?.length" class="flex flex-wrap gap-1 mt-2">
      <span
        v-for="s in clinic.services"
        :key="s"
        class="text-xs px-2 py-0.5 rounded bg-calming-100 text-calming-700"
      >
        {{ s }}
      </span>
    </div>
    <p v-if="clinic.doctor" class="text-sm text-calming-600 mt-2">Врач: {{ clinic.doctor }}</p>
    <NuxtLink
      :to="`/clinics/${slug}`"
      class="mt-4 inline-block text-sm font-medium text-calming-600 hover:text-calming-800"
    >
      Записаться →
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  clinic: {
    id: number
    name: string
    city: string
    services?: string[]
    doctor?: string
  }
  slug: string
}>()
</script>
