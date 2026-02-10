<template>
  <section class="mb-10">
    <h2 class="text-lg font-semibold text-calming-900 mb-3">Что важно сделать сейчас</h2>
    <ul class="space-y-2">
      <li
        v-for="(step, i) in steps"
        :key="i"
        class="flex items-start gap-3 p-3 rounded-lg bg-white border border-calming-200"
      >
        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-calming-600 text-white flex items-center justify-center text-xs font-semibold">{{ i + 1 }}</span>
        <span class="text-calming-800">{{ step }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'TYPE1' | 'TYPE2'
  branching?: { type1: { urgent: string[] }; type2: { urgent: string[] } } | null
}>()

const steps = computed(() => {
  const data = props.branching
  if (props.type === 'TYPE1' && data?.type1?.urgent?.length) {
    return data.type1.urgent
  }
  if (props.type === 'TYPE2' && data?.type2?.urgent?.length) {
    return data.type2.urgent
  }
  if (props.type === 'TYPE1') {
    return ['Запись на операцию или химиотерапию по назначению', 'Уточнить дату и место лечения', 'Собрать документы для госпитализации']
  }
  return [
    'Собрать документы: паспорт, полис, выписки',
    'Записаться на приём к онкологу',
    'Пройдите дообследование (УЗИ, анализы при показаниях)',
    'Уточнить стадию и план на консультации',
    'Записать вопросы к врачу',
  ]
})
</script>
