<template>
  <NuxtLink
    :to="`/clinic/${clinic.id}`"
    class="flex gap-4 bg-white rounded-xl p-6 border border-calming-200 shadow-sm transition hover:shadow-md hover:border-calming-300"
  >
    <div class="min-w-0 flex-1">
      <h3 class="font-bold text-calming-900">{{ clinic.name }}</h3>
      <p class="text-calming-600 mt-1">{{ clinic.city }}</p>
    </div>
    <div
      v-if="clinic.lat != null && clinic.lng != null"
      class="shrink-0 w-32 h-32 rounded-lg overflow-hidden"
    >
      <ClinicMap
        :lat="clinic.lat"
        :lng="clinic.lng"
        :name="clinic.name"
        compact
      />
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
  slug?: string
}>()
</script>
