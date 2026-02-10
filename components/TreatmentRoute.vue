<template>
  <section class="mb-10">
    <h2 class="text-lg font-semibold text-calming-900 mb-4">Пошаговый чек‑лист маршрута</h2>
    <div class="space-y-4">
      <div
        v-for="(stage, idx) in routeStages"
        :key="idx"
        class="rounded-xl border border-calming-200 bg-white overflow-hidden"
      >
        <div class="px-4 py-3 bg-calming-100 border-b border-calming-200 font-medium text-calming-800">
          {{ stage.title }}
        </div>
        <ul class="p-4 space-y-2">
          <li
            v-for="(action, j) in stage.actions"
            :key="j"
            class="flex items-center gap-2 text-sm text-calming-700"
          >
            <span class="w-5 h-5 rounded border-2 border-calming-300 inline-flex shrink-0" aria-hidden="true" />
            {{ action }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'TYPE1' | 'TYPE2'
  branching?: {
    type1: { route: { title: string; actions: string[] }[] }
    type2: { route: { title: string; actions: string[] }[] }
  } | null
}>()

const routeStages = computed(() => {
  const data = props.branching
  if (props.type === 'TYPE1' && data?.type1?.route?.length) {
    return data.type1.route
  }
  if (props.type === 'TYPE2' && data?.type2?.route?.length) {
    return data.type2.route
  }
  if (props.type === 'TYPE1') {
    return [
      { title: 'Лечение', actions: ['Прохождение курса по плану онколога', 'Контроль анализов и визиты', 'Ведение дневника самочувствия'] },
      { title: 'Наблюдение', actions: ['Контрольные осмотры по графику', 'Сохранение результатов в дашборде', 'Повторный скрининг по показаниям'] },
    ]
  }
  return [
    { title: 'Стадирование и уточнение диагноза', actions: ['Пройдите назначенные обследования', 'Соберите выписки и гистологию', 'Запишитесь к профильному специалисту'] },
    { title: 'План лечения', actions: ['Консультация онколога с результатами', 'Обсуждение тактики', 'Второе мнение при необходимости'] },
    { title: 'Лечение', actions: ['Прохождение курса по плану', 'Контроль анализов', 'Дневник самочувствия'] },
    { title: 'Наблюдение', actions: ['Контрольные осмотры по графику', 'Сохранение результатов', 'Повторный скрининг по показаниям'] },
  ]
})
</script>
