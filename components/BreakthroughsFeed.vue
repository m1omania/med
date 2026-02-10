<template>
  <div class="bg-white rounded-xl border border-calming-200 p-6">
    <h2 class="text-lg font-semibold text-calming-800 mb-4">Прорывы по вашему типу</h2>
    <ul class="space-y-3">
      <li
        v-for="(b, i) in breakthroughs"
        :key="i"
        class="p-3 rounded-lg border border-calming-100"
      >
        <p class="text-sm font-medium text-calming-800">{{ b.name }}</p>
        <p class="text-xs text-calming-600 mt-0.5">{{ b.what }}</p>
        <p class="text-xs text-calming-500 mt-0.5">Доступность: {{ b.availability }}</p>
      </li>
    </ul>
    <p v-if="!breakthroughs.length && tumorType" class="text-sm text-calming-500">
      Нет данных по этому направлению. После визита к онкологу обновим.
    </p>
    <p v-if="!tumorType" class="text-sm text-calming-500">
      Пройдите опрос — покажем прорывные методы по вашему направлению.
    </p>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

const tumorType = computed(() => {
  const id = patientStore.lastResultId
  if (!id) return ''
  const r = patientStore.getResultById(id)
  return r?.primaryRisk?.slug || r?.localization || ''
})

const { data: branchingData } = await useFetch<{
  breakthroughs: Record<string, { name: string; what: string; availability: string }[]>
}>('/data/branching.json')

const breakthroughs = computed(() => {
  const data = branchingData.value?.breakthroughs
  if (!data || typeof data !== 'object') return []
  const key = tumorType.value || 'kishechnik'
  const list = data[key]
  const arr = Array.isArray(list) ? list : []
  return arr.slice(0, 3)
})
</script>
