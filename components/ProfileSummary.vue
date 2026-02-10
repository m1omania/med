<template>
  <section class="mb-10">
    <h2 class="text-lg font-semibold text-calming-900 mb-3">Кто вы и с чем вы</h2>
    <div class="p-4 rounded-xl bg-calming-50 border border-calming-200 text-calming-700 text-sm">
      <p class="leading-relaxed">
        {{ summary }}
      </p>
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
}

const props = defineProps<{
  profile: Profile
}>()

const summary = computed(() => {
  const p = props.profile
  const parts: string[] = []
  if (p.age) parts.push(`Возраст ${p.age} лет`)
  if (p.gender) parts.push(p.gender === 'M' ? 'мужской пол' : p.gender === 'F' ? 'женский пол' : '')
  if (p.diagnosisLabel) parts.push(`направление: ${p.diagnosisLabel}`)
  if (p.geography) parts.push(`город: ${p.geography}`)
  if (p.diagnosisStatus) parts.push(p.diagnosisStatus)
  const filtered = parts.filter(Boolean)
  if (!filtered.length) return `Направление: ${p.diagnosisLabel}. Клиники ниже — только в вашем регионе.`
  return filtered.join('. ') + '.'
})
</script>
