<template>
  <NuxtLink
    :to="`/doctor/${doctor.id}`"
    class="block bg-white rounded-xl shadow-sm overflow-hidden transition hover:shadow-lg hover:scale-[1.02]"
    :class="selected ? 'ring-2 ring-neutral-400' : ''"
  >
    <div class="p-4 flex flex-col items-center text-center">
      <div class="relative w-full flex justify-end mb-2">
        <button
          type="button"
          class="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-calming-500 hover:bg-neutral-50"
          aria-label="Добавить"
          @click.prevent="$emit('add')"
        >
          <AppIcon name="plus" size="sm" class="w-4 h-4" />
        </button>
      </div>

      <div class="relative inline-block mb-3">
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
        <div
          class="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-medium"
        >
          <AppIcon name="star" size="sm" class="w-3.5 h-3.5" />
          {{ ratingText }}
        </div>
      </div>

      <div class="w-full min-w-0">
        <p class="font-bold text-calming-900 truncate flex items-center justify-center gap-1">
          {{ doctor.name }}
          <span v-if="showBookIcon" class="shrink-0 text-emerald-500" aria-hidden="true">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </span>
        </p>
        <p class="text-xs text-calming-500 uppercase tracking-wide mt-0.5">
          {{ doctor.specialty }}
        </p>
        <p v-if="address" class="text-sm text-calming-700 mt-2 text-left line-clamp-2">
          {{ address }}
        </p>
      </div>

      <div class="mt-4 pt-3 border-t border-calming-100 w-full flex items-center justify-center gap-4 text-xs text-calming-500">
        <span v-if="distance" class="inline-flex items-center gap-1">
          <AppIcon name="map-pin" size="sm" class="w-4 h-4 text-calming-400" />
          {{ distance }}
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="text-calming-400" aria-hidden="true">😊</span>
          ВЕЖЛИВЫЙ
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    doctor: { id: number; name: string; specialty: string; rating?: number; photo?: string }
    address?: string
    distance?: string
    selected?: boolean
    showBookIcon?: boolean
  }>(),
  { selected: false, showBookIcon: false },
)

defineEmits<{ add: [] }>()

const initials = computed(() => {
  const name = props.doctor?.name ?? ''
  const parts = String(name).split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] ?? '') + (parts[1][0] ?? '')
  return String(name).slice(0, 2).toUpperCase()
})

const ratingText = computed(() => {
  const r = props.doctor.rating
  if (r == null) return '—'
  return Number(r) === Math.floor(Number(r)) ? String(Math.floor(Number(r))) : Number(r).toFixed(1)
})
</script>
