<template>
  <section class="mb-10">
    <div class="p-4 rounded-xl bg-white">
      <p
        v-for="(line, i) in summaryLines"
        :key="i"
        class="font-semibold text-calming-900 leading-relaxed"
        :class="i > 0 ? 'mt-1' : ''"
      >
        {{ line }}
      </p>
      <NuxtLink
        to="/quiz"
        class="mt-3 inline-flex items-center px-4 py-2 rounded-lg border border-neutral-200 text-calming-700 text-sm font-medium hover:bg-neutral-50 transition"
      >
        Изменить данные
      </NuxtLink>
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
  return lines
})
</script>
