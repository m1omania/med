<template>
  <NuxtLink
    :to="`/community/thread/${thread.id}`"
    class="block p-5 rounded-xl bg-white border border-calming-100 hover:shadow-md hover:border-calming-200 transition min-h-[5rem]"
  >
    <h3 class="font-semibold text-calming-900">{{ thread.title }}</h3>
    <p v-if="thread.excerpt" class="text-sm text-calming-600 mt-1 line-clamp-2">{{ thread.excerpt }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  thread: { id: string; title: string; excerpt?: string }
}>()
</script>
