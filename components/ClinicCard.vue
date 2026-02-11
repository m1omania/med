<template>
  <NuxtLink
    :to="`/clinic/${clinic.id}`"
    class="block bg-white rounded-xl p-6 transition cursor-pointer hover:shadow-lg hover:scale-[1.02]"
  >
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
    <div class="mt-4">
      <span class="text-sm font-medium text-calming-600">
        Доктора и Методы <AppIcon name="arrow-right" size="sm" class="inline" />
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  clinic: {
    id: number
    name: string
    city: string
    lat?: number
    lng?: number
    services?: string[]
    doctor?: string
  }
  slug: string
}>()
</script>
