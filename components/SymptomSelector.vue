<template>
  <div class="space-y-3">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="s in symptomOptions"
        :key="s"
        type="button"
        class="px-4 py-2 rounded-xl border-2 text-sm font-medium transition"
        :class="modelValue?.includes(s) ? 'border-calming-600 bg-calming-50 text-calming-800' : 'border-calming-200 hover:border-calming-300 hover:bg-calming-50/50 text-calming-700'"
        @click="toggle(s)"
      >
        {{ s }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string[]
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const symptomOptions = [
  'Усталость',
  'Боль',
  'Потливость',
  'Уплотнение',
  'Потеря веса',
  'Кашель',
  'Тошнота',
  'Другое',
]

function toggle(s: string) {
  const current = [...(props.modelValue || [])]
  const idx = current.indexOf(s)
  if (idx >= 0) current.splice(idx, 1)
  else current.push(s)
  emit('update:modelValue', current)
}
</script>
