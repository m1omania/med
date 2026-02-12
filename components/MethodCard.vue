<template>
  <NuxtLink
    :to="`/methods/${method.slug}`"
    class="block p-5 rounded-xl bg-white transition min-h-[15rem] hover:shadow-lg hover:scale-[1.02] flex flex-col"
  >
    <h2 class="font-bold text-calming-900">{{ displayTitle }}</h2>
    <p v-if="method.date" class="text-sm text-calming-600 mt-2">{{ formatMethodDate(method.date) }}</p>
    <div class="mt-auto pt-5 text-sm text-calming-500">
      <template v-if="clinic">
        <p class="inline-flex items-center gap-1.5">
          <AppIcon name="map-pin" size="sm" class="shrink-0" />
          {{ clinic.city }}
        </p>
        <p class="mt-0.5 inline-flex items-center gap-1.5">
          <AppIcon name="hospital" size="sm" class="shrink-0" />
          {{ clinic.name }}
        </p>
      </template>
      <span v-else class="inline-flex items-center gap-1 font-medium text-calming-600">
        К методу
        <AppIcon name="arrow-right" size="sm" class="inline" />
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  method: { slug: string; title: string; date?: string; clinicId?: number; clinicIds?: number[] }
  clinic?: { name: string; city: string } | null
}>()

const { stripEmojis } = useStripEmojis()
const { formatMethodDate } = useFormatMethodDate()

const displayTitle = computed(() => stripEmojis(props.method?.title ?? ''))
</script>
