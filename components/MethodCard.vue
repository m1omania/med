<template>
  <NuxtLink
    :to="`/methods/${method.slug}`"
    class="block p-5 rounded-xl bg-white transition min-h-[15rem] hover:shadow-lg hover:scale-[1.02] flex flex-col"
  >
    <h2 class="font-semibold text-calming-800">{{ displayTitle }}</h2>
    <p v-if="method.date" class="text-sm text-calming-600 mt-2">{{ formatMethodDate(method.date) }}</p>
    <div v-if="clinic" class="mt-auto pt-4">
      <p class="text-sm text-calming-500">
        <span class="font-medium">Город:</span> {{ clinic.city }}
      </p>
      <p class="text-sm text-calming-500 mt-0.5">
        <span class="font-medium">Клиника:</span> {{ clinic.name }}
      </p>
    </div>
    <span v-else class="mt-auto pt-4 inline-flex items-center gap-1 text-sm text-calming-600 font-medium">
      К методу
      <AppIcon name="arrow-right" size="sm" class="inline" />
    </span>
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
