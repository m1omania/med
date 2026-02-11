<template>
  <section class="mb-10">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
      <h2 class="text-lg font-semibold text-calming-900">Данные опроса</h2>
      <NuxtLink
        to="/quiz"
        class="text-sm font-medium text-calming-600 hover:text-calming-800 hover:underline"
      >
        Изменить данные
      </NuxtLink>
    </div>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(line, i) in summaryLines"
        :key="i"
        class="inline-flex items-center h-9 px-4 rounded-full text-sm font-medium bg-white border-2 border-calming-200 text-calming-800"
      >
        {{ line }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface Profile {
  age?: number
  gender?: string
  diagnosisLabel: string
  geography?: string
  diagnosisStatus?: string
  stage?: string
}

const props = defineProps<{
  profile: Profile
}>()

const summaryLines = computed(() => {
  const p = props.profile
  const lines: string[] = []
  if (p.age) lines.push(`Возраст ${p.age} лет`)
  if (p.gender) lines.push(p.gender === 'M' ? 'Мужской пол' : p.gender === 'F' ? 'Женский пол' : '')
  if (p.diagnosisLabel) lines.push(`Направление: ${p.diagnosisLabel}`)
  if (p.stage) lines.push(`Стадия: ${p.stage}`)
  if (p.geography) lines.push(`Город: ${p.geography}`)
  if (!lines.length) return [`Направление: ${p.diagnosisLabel}. Клиники ниже — только в вашем регионе.`]
  return lines.filter(Boolean)
})
</script>
