<template>
  <NuxtLink
    :to="`/doctor/${doctor.id}`"
    class="block bg-white rounded-xl shadow-sm overflow-hidden transition hover:shadow-lg hover:scale-[1.02]"
  >
    <div class="p-4 flex flex-col items-center text-center">
      <div class="flex flex-col items-center mb-3">
        <div
          class="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-2xl font-semibold text-calming-600 bg-calming-100 shrink-0"
        >
          <img
            v-if="doctor.photo"
            :src="doctor.photo"
            :alt="doctor.name"
            class="w-full h-full object-cover"
          >
          <span v-else>{{ initials }}</span>
        </div>
      </div>

      <div class="w-full min-w-0">
        <p class="font-bold text-calming-900 truncate">
          {{ displayName }}
        </p>
        <p class="text-xs text-calming-500 uppercase tracking-wide mt-0.5">
          {{ doctor.specialty }}
        </p>
        <p class="text-sm text-calming-700 mt-2 line-clamp-2">
          {{ address || '—' }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  doctor: { id: number; name: string; specialty: string; photo?: string }
  address?: string
}>()


/** Имя и фамилия без отчества, чтобы влезало в карточку */
const displayName = computed(() => {
  const name = props.doctor?.name ?? ''
  const parts = String(name).split(/\s+/).filter(Boolean)
  if (parts.length >= 3) return `${parts[0]} ${parts[1]}`
  return name
})

const initials = computed(() => {
  const name = props.doctor?.name ?? ''
  const parts = String(name).split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] ?? '') + (parts[1][0] ?? '')
  return String(name).slice(0, 2).toUpperCase()
})

</script>
