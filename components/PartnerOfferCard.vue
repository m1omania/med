<template>
  <NuxtLink
    v-if="offer.link && !isExternal"
    :to="offer.link"
    class="block p-5 rounded-xl bg-white border border-calming-200 hover:shadow-lg hover:border-calming-300 transition min-h-[14rem] flex flex-col"
  >
    <h3 class="font-bold text-calming-900">{{ offer.title }}</h3>
    <p class="text-sm text-calming-600 mt-2 line-clamp-3 flex-1">{{ offer.description }}</p>
    <span class="mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border-2 border-calming-300 text-sm font-medium text-calming-700 hover:bg-calming-50 transition w-fit">Подробнее <AppIcon name="arrow-right" size="sm" class="inline" /></span>
  </NuxtLink>
  <a
    v-else-if="offer.link && isExternal"
    :href="offer.link"
    target="_blank"
    rel="noopener noreferrer"
    class="block p-5 rounded-xl bg-white border border-calming-200 hover:shadow-lg hover:border-calming-300 transition min-h-[14rem] flex flex-col"
  >
    <h3 class="font-bold text-calming-900">{{ offer.title }}</h3>
    <p class="text-sm text-calming-600 mt-2 line-clamp-3 flex-1">{{ offer.description }}</p>
    <span class="mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border-2 border-calming-300 text-sm font-medium text-calming-700 hover:bg-calming-50 transition w-fit">Подробнее <AppIcon name="arrow-right" size="sm" class="inline" /></span>
  </a>
  <div
    v-else
    class="block p-5 rounded-xl bg-white border border-calming-200 transition min-h-[14rem] flex flex-col"
  >
    <h3 class="font-bold text-calming-900">{{ offer.title }}</h3>
    <p class="text-sm text-calming-600 mt-2 line-clamp-3 flex-1">{{ offer.description }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  offer: {
    id: string
    title: string
    description: string
    tag: string
    partnerName?: string
    link?: string
    badge?: string
  }
  categoryLabel: string
}>()

const isExternal = computed(() => {
  const l = props.offer.link
  if (!l) return false
  return l.startsWith('http') || l.startsWith('//')
})
</script>
