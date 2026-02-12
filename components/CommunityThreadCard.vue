<template>
  <NuxtLink
    :to="`/community/thread/${thread.id}`"
    class="block rounded-xl bg-white border border-calming-100 p-4 transition hover:shadow-md hover:border-calming-200"
  >
    <h3 class="font-medium text-calming-900">{{ thread.title }}</h3>
    <p v-if="thread.excerpt" class="text-sm text-calming-600 mt-1 line-clamp-2">{{ thread.excerpt }}</p>
    <p
      v-if="showMeta && (thread.author || thread.date || repliesCount !== undefined)"
      class="text-xs text-calming-500 mt-2"
    >
      {{ [thread.author, formatDate(thread.date), repliesCount !== undefined ? `${repliesCount} ответов` : null].filter(Boolean).join(' · ') }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    thread: { id: string; title: string; excerpt?: string; author?: string; date?: string }
    repliesCount?: number
    showMeta?: boolean
  }>(),
  { showMeta: true },
)

function formatDate(d?: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const mi = parseInt(m || '0', 10) - 1
  return `${day}.${months[mi] ?? m} ${y}`
}
</script>
