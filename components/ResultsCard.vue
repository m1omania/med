<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-calming-200 p-6">
      <h2 class="text-lg font-semibold text-calming-800 mb-4">Оценка рисков</h2>
      <div class="h-64">
        <ClientOnly>
          <ResultsChart :risks="result.risks" />
        </ClientOnly>
      </div>
    </div>
    <div v-if="result.recommendations?.length" class="bg-white rounded-xl border border-calming-200 p-6">
      <h2 class="text-lg font-semibold text-calming-800 mb-4">Рекомендации</h2>
      <ul class="list-disc list-inside text-calming-700 space-y-1">
        <li v-for="(r, i) in result.recommendations" :key="i">{{ r }}</li>
      </ul>
    </div>
    <div v-if="result.methods?.length" class="bg-white rounded-xl border border-calming-200 p-6">
      <h2 class="text-lg font-semibold text-calming-800 mb-4">Методы лечения (по данным onguide.ru)</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-calming-200">
              <th class="text-left py-2">Метод</th>
              <th class="text-left py-2">Тип</th>
              <th class="text-left py-2">Действие</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="m in result.methods"
              :key="m.name"
              class="border-b border-calming-100"
            >
              <td class="py-2">
                <NuxtLink
                  v-if="m.slug"
                  :to="`/methods/${m.slug}`"
                  class="text-calming-600 hover:underline"
                >
                  {{ m.name }}
                </NuxtLink>
                <span v-else>{{ m.name }}</span>
              </td>
              <td class="py-2 text-calming-600">{{ m.type }}</td>
              <td class="py-2">
                <NuxtLink
                  v-if="m.slug"
                  :to="`/methods/${m.slug}`"
                  class="text-calming-600 hover:underline"
                >
                  Подробнее
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResultSummary } from '~/stores/patient'

defineProps<{
  result: ResultSummary
}>()
</script>
