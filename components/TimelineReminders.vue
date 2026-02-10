<template>
  <div class="bg-white rounded-xl border border-calming-200 p-6">
    <h2 class="text-lg font-semibold text-calming-800 mb-4">Напоминания и визиты</h2>
    <ul class="space-y-3">
      <li
        v-for="r in sortedReminders"
        :key="r.id"
        class="flex items-center gap-3 py-2 border-b border-calming-100 last:border-0"
      >
        <button
          type="button"
          class="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition"
          :class="r.done ? 'bg-calming-600 border-calming-600 text-white' : 'border-calming-300 hover:border-calming-500'"
          @click="patientStore.toggleReminder(r.id)"
        >
          <span v-if="r.done" class="text-xs">✓</span>
        </button>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-calming-800" :class="{ 'line-through text-calming-500': r.done }">
            {{ r.title }}
          </p>
          <p class="text-xs text-calming-500">{{ formatDate(r.date) }}</p>
        </div>
      </li>
      <li
        v-for="v in sortedVisits"
        :key="v.id"
        class="flex items-center gap-3 py-2 border-b border-calming-100 last:border-0"
      >
        <span class="w-5 h-5 rounded bg-calming-200 flex-shrink-0 flex items-center justify-center text-xs text-calming-600">
          <AppIcon name="building" size="sm" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-calming-800">{{ v.title }}</p>
          <p class="text-xs text-calming-500">{{ formatDate(v.date) }}{{ v.place ? ` · ${v.place}` : '' }}</p>
        </div>
      </li>
    </ul>
    <p v-if="!hasItems" class="text-sm text-calming-500">
      Нет напоминаний. Добавьте из плана или после визита к врачу.
    </p>
    <button
      type="button"
      class="mt-3 text-sm text-calming-600 hover:underline"
      @click="addDemoReminder"
    >
      + Добавить напоминание (пример)
    </button>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

onMounted(() => {
  patientStore.hydrateFromStorage()
})

const sortedReminders = computed(() => {
  const list = Array.isArray(patientStore.reminders) ? patientStore.reminders : []
  return [...list].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
})

const sortedVisits = computed(() => {
  const list = Array.isArray(patientStore.visits) ? patientStore.visits : []
  return [...list].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
})

const hasItems = computed(() => sortedReminders.value.length > 0 || sortedVisits.value.length > 0)

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function addDemoReminder() {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  patientStore.addReminder({
    title: 'Контрольный анализ крови',
    date: d.toISOString().slice(0, 10),
    done: false,
  })
}
</script>
