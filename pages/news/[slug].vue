<template>
  <div class="py-8 px-4 max-w-3xl mx-auto">
    <NuxtLink to="/" class="text-calming-600 hover:underline mb-4 inline-block">← Назад</NuxtLink>
    <article v-if="article" class="prose prose-calming max-w-none">
      <h1 class="text-2xl font-bold text-calming-900">{{ article.title }}</h1>
      <p class="text-calming-600 text-sm">{{ article.date }}</p>
      <p>{{ article.body }}</p>
    </article>
    <p v-else class="text-calming-600">Статья не найдена.</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const articles: Record<string, { title: string; date: string; body: string }> = {
  screening: {
    title: 'Профилактика и скрининг в Карелии',
    date: '2024-01-15',
    body: 'Регулярный скрининг помогает выявить онкологию на ранних стадиях. В Петрозаводске доступны УЗИ, маммография и КТ. Рекомендуем проходить обследования по возрасту и факторам риска.',
  },
  default: {
    title: 'Новости онкологии',
    date: '2024-01-01',
    body: 'Актуальные материалы по диагностике и лечению. Следите за обновлениями.',
  },
}
const article = computed(() => articles[slug] || articles.default)

useHead({
  title: `${article.value?.title || 'Новость'} — AntiOnko`,
})
</script>
