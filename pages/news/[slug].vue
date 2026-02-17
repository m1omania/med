<template>
  <div class="bg-calming-50 min-h-full">
    <div v-if="error" class="max-w-4xl mx-auto px-4 py-16 text-center">
      <p class="text-calming-600">Новость не найдена.</p>
      <NuxtLink to="/news" class="mt-4 inline-block text-blue-600 font-medium hover:underline">К списку новостей</NuxtLink>
    </div>

    <article v-else-if="item" class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <header class="mb-8">
        <NuxtLink to="/news" class="inline-flex items-center gap-1 text-sm text-calming-600 hover:text-blue-600 mb-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          Все новости
        </NuxtLink>
        <h1 class="text-2xl sm:text-3xl font-bold text-calming-900 leading-snug">{{ item.title }}</h1>
        <div class="flex items-center gap-4 mt-3 text-sm text-calming-500">
          <time :datetime="item.date">{{ dateFormatted }}</time>
          <span>{{ item.commentsCount ?? 0 }} комментариев</span>
        </div>
      </header>

      <div v-if="item.image" class="rounded-2xl overflow-hidden bg-slate-100 mb-8 aspect-video sm:aspect-[2/1]">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
      </div>

      <p v-if="item.lead" class="text-lg text-calming-700 leading-relaxed mb-6">{{ item.lead }}</p>

      <div class="text-calming-700 leading-relaxed whitespace-pre-line">{{ item.body || '—' }}</div>

      <footer class="mt-12 pt-6 border-t border-slate-200">
        <NuxtLink to="/news" class="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          К списку новостей
        </NuxtLink>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: item, error } = await useFetch(`/api/news/${slug}`, {
  key: `news-${slug}`,
  default: () => null,
})

const dateFormatted = computed(() => {
  const d = item.value?.date
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
})

useHead({
  title: () => (item.value?.title ? `${item.value.title} — AntiOnko` : 'Новость — AntiOnko'),
  meta: () => [{ name: 'description', content: (item.value?.lead || item.value?.title || '').slice(0, 160) }],
})
</script>
