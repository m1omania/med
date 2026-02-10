<template>
  <section class="mb-10">
    <h2 class="text-lg font-semibold text-calming-900 mb-4">Прорывные возможности по вашему типу рака</h2>
    <template v-if="type === 'TYPE1' && items.length">
      <div class="grid gap-3 sm:grid-cols-2">
        <div
          v-for="(b, i) in items"
          :key="i"
          class="p-4 rounded-xl border border-calming-200 bg-white"
        >
          <h3 class="font-medium text-calming-800">{{ b.name }}</h3>
          <p class="text-sm text-calming-600 mt-1">Что это: {{ b.what }}</p>
          <p class="text-sm text-calming-600 mt-0.5">Насколько доступно: {{ b.availability }}</p>
        </div>
      </div>
    </template>
    <template v-else-if="type === 'TYPE2'">
      <div class="p-4 rounded-xl bg-calming-50 border border-calming-200 text-calming-700 text-sm">
        После визита к онкологу и уточнения стадии мы покажем актуальные прорывные методы и варианты лечения по вашему направлению.
      </div>
    </template>
    <template v-else-if="items.length">
      <div class="grid gap-3 sm:grid-cols-2">
        <div
          v-for="(b, i) in items"
          :key="i"
          class="p-4 rounded-xl border border-calming-200 bg-white"
        >
          <h3 class="font-medium text-calming-800">{{ b.name }}</h3>
          <p class="text-sm text-calming-600 mt-1">Что это: {{ b.what }}</p>
          <p class="text-sm text-calming-600 mt-0.5">Насколько доступно: {{ b.availability }}</p>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'TYPE1' | 'TYPE2'
  tumor: string
  branching?: {
    breakthroughs: Record<string, { name: string; what: string; availability: string }[]>
  } | null
}>()

const items = computed(() => {
  const data = props.branching?.breakthroughs
  if (!data || typeof data !== 'object') return []
  const key = props.tumor || 'obshiy'
  const list = data[key] ?? data.kishechnik
  const arr = Array.isArray(list) ? list : []
  return arr.slice(0, 4)
})
</script>
