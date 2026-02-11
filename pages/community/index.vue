<template>
  <div class="py-8 px-4 max-w-4xl mx-auto">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-calming-900 mb-1">Сообщество</h1>
        <p class="text-calming-600">
          Обсуждайте методы лечения, делитесь опытом и находите поддержку.
        </p>
      </div>
      <NuxtLink
        to="/community/new"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-calming-600 text-white font-medium hover:bg-calming-700 transition"
      >
        <AppIcon name="plus" size="sm" /> Создать тему
      </NuxtLink>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <span class="h-8 w-8 rounded-full border-2 border-calming-600 border-t-transparent animate-spin" aria-hidden="true" />
    </div>

    <template v-else>
      <section v-for="cat in categories" :key="cat.id" class="mb-10">
        <h2 class="text-lg font-semibold text-calming-900 mb-1">{{ cat.name }}</h2>
        <p class="text-sm text-calming-600 mb-4">{{ cat.description }}</p>
        <ul class="space-y-3">
          <li v-for="thread in threadsByCategory(cat.id)" :key="thread.id">
            <NuxtLink
              :to="`/community/thread/${thread.id}`"
              class="block rounded-xl bg-white border border-calming-100 p-4 transition hover:shadow-md hover:border-calming-200"
            >
              <h3 class="font-medium text-calming-900">{{ thread.title }}</h3>
              <p class="text-sm text-calming-600 mt-1 line-clamp-2">{{ thread.excerpt }}</p>
              <p class="text-xs text-calming-500 mt-2">
                {{ thread.author }} · {{ formatDate(thread.date) }} · {{ getRepliesCount(thread.id) }} ответов
              </p>
            </NuxtLink>
          </li>
        </ul>
        <p v-if="!threadsByCategory(cat.id).length" class="text-sm text-calming-500 py-2">Пока нет обсуждений. <NuxtLink to="/community/new" class="text-calming-600 hover:underline">Создать тему</NuxtLink></p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const {
  categories,
  threadsByCategory,
  getRepliesCount,
  forumData,
} = useForum()

const pending = computed(() => !forumData.value)

function formatDate (d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const mi = parseInt(m || '0', 10) - 1
  return `${day}.${months[mi] ?? m} ${y}`
}

useHead({
  title: 'Сообщество — AntiOnko',
})
</script>
