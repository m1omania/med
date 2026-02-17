<template>
  <div class="bg-calming-50 min-h-full">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 class="text-2xl sm:text-3xl font-bold text-calming-900 mb-2">Новости</h1>
      <p class="text-calming-600 text-sm mb-8">Актуальные материалы о скрининге, профилактике и лечении онкологических заболеваний.</p>
      <ul class="space-y-4">
        <li v-for="item in news" :key="item.slug">
          <NuxtLink
            :to="'/news/' + item.slug"
            class="block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-slate-200 hover:shadow-md transition-all group p-5 sm:p-6"
          >
            <h2 class="font-semibold text-calming-900 text-lg leading-snug group-hover:text-blue-600 transition-colors">{{ item.title }}</h2>
            <p v-if="item.lead" class="mt-2 text-sm text-calming-600 line-clamp-2">{{ item.lead }}</p>
            <div class="flex items-center gap-4 mt-3 text-xs text-calming-500">
              <span>{{ item.timeAgo || formatDate(item.date) }}</span>
              <span>{{ item.commentsCount ?? 0 }} комментариев</span>
            </div>
          </NuxtLink>
        </li>
      </ul>
      <p v-if="news.length === 0" class="text-calming-500 text-sm py-8">Пока нет новостей.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch<{ news: { slug: string; title: string; date?: string; timeAgo?: string; commentsCount?: number; lead?: string; image?: string }[] }>('/api/news', { default: () => ({ news: [] }) })
const news = computed(() => data.value?.news ?? [])

function formatDate(dateStr?: string) {
  return dateStr ? new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
}

useHead({
  title: 'Новости — AntiOnko',
  meta: [{ name: 'description', content: 'Новости о скрининге, профилактике и лечении онкологических заболеваний.' }],
})
</script>
