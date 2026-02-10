<template>
  <div class="bg-white rounded-xl border border-calming-200 p-6">
    <h2 class="text-lg font-semibold text-calming-800 mb-4">Методы лечения по вашему направлению</h2>
    <ul class="space-y-3">
      <li v-for="m in methods" :key="m.slug">
        <NuxtLink
          :to="`/methods/${m.slug}`"
          class="block p-3 rounded-lg border border-calming-100 hover:border-calming-300 hover:bg-calming-50/50 transition"
        >
          <p class="text-sm font-medium text-calming-800 line-clamp-2">{{ m.title }}</p>
          <p class="text-xs text-calming-500 mt-0.5">{{ m.date }}</p>
        </NuxtLink>
      </li>
    </ul>
    <p v-if="!methods.length" class="text-sm text-calming-500">
      Пройдите опрос — подберём методы по вашему направлению.
    </p>
    <NuxtLink v-if="methods.length" to="/methods" class="mt-3 inline-block text-sm text-calming-600 hover:underline">
      Все методы →
    </NuxtLink>
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

const keywords = computed(() => {
  const map: Record<string, string[]> = {
    pechen: ['печень', 'pechen'],
    grudi: ['грудь', 'маммография', 'молочн', 'grudi'],
    legkie: ['лёгкие', 'легкие', 'кт', 'курение', 'legkie'],
    kishechnik: ['кишечник', 'колоноскопия', 'колоректаль', 'kishechnik'],
    obshiy: ['скрининг', 'профилактика', 'обследование'],
  }
  return map[tumorType.value] || map.obshiy
})

const { data: methodsData } = await useFetch<{ methods: { slug: string; title: string; date: string; topic: string; tags?: string[] }[] }>('/api/articles')
const allMethods = computed(() => methodsData.value?.methods ?? [])

const methods = computed(() => {
  const list = Array.isArray(allMethods.value) ? allMethods.value : []
  const kw = keywords.value
  if (!kw.length) return list.slice(0, 3)
  const filtered = list.filter((m) => {
    const topic = (m.topic || '').toLowerCase()
    const tags = Array.isArray(m.tags) ? m.tags.join(' ').toLowerCase() : ''
    return kw.some((k) => topic.includes(k.toLowerCase()) || tags.includes(k.toLowerCase()))
  })
  return filtered.slice(0, 3)
})
</script>
