<template>
  <div class="py-8 px-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-6">Новости</h1>
    <ul class="space-y-4">
      <li v-for="item in articles" :key="item.slug">
        <NuxtLink
          :to="`/news/${item.slug}`"
          class="block p-4 rounded-xl border border-calming-200 hover:bg-calming-50"
        >
          <h2 class="font-semibold text-calming-800">{{ item.title }}</h2>
          <p class="text-sm text-calming-600">{{ item.date }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const articles = [
  { slug: 'screening', title: 'Профилактика и скрининг в Карелии', date: '2024-01-15' },
  { slug: 'default', title: 'Новости онкологии', date: '2024-01-01' },
]

useHead({
  title: 'Новости — AntiOnko',
})
</script>
