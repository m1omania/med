<template>
  <div class="py-8 px-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-2">Мои результаты</h1>
    <p class="text-calming-600 text-sm mb-8">Избранные результаты опроса</p>

    <div v-if="favoriteResults.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="r in favoriteResults"
        :key="r.id"
        :to="`/results/${r.id}`"
        class="block p-5 rounded-xl bg-white border border-calming-200 hover:shadow-lg hover:border-calming-300 transition"
      >
        <p class="font-semibold text-calming-900">
          {{ r.primaryRisk?.label || 'Результат опроса' }}
        </p>
        <p class="text-sm text-calming-600 mt-1">
          {{ formatDate(r.createdAt) }}
        </p>
        <span class="mt-3 inline-flex items-center gap-1 text-sm text-calming-600 font-medium">
          Подробнее
          <AppIcon name="arrow-right" size="sm" class="inline" />
        </span>
      </NuxtLink>
    </div>
    <p v-else class="text-calming-600">
      Пока нет избранных результатов. Добавляйте результаты в избранное на странице результата опроса.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ResultSummary } from '~/stores/patient'

const patientStore = usePatientStore()

const favoriteResults = computed(() => {
  const ids = patientStore.favoriteResultIds
  return ids
    .map((id) => patientStore.getResultById(id))
    .filter((r): r is ResultSummary => r != null)
})

function formatDate(createdAt: string) {
  if (!createdAt) return '—'
  try {
    const d = new Date(createdAt)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return createdAt
  }
}

useHead({
  title: 'Мои результаты — AntiOnko',
})
</script>
