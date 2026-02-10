<template>
  <div class="py-12 px-4 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-2">Подписка и уведомления</h1>
    <p class="text-calming-600 mb-6">
      Настройте напоминания о скрининге и уведомления о методах лечения.
    </p>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium text-calming-700 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full rounded-lg border border-calming-300 px-3 py-2"
          placeholder="you@example.com"
        />
      </div>
      <label class="flex items-center gap-2">
        <input v-model="reminders" type="checkbox" class="rounded border-calming-300" />
        <span class="text-sm text-calming-700">Напоминания о скрининге</span>
      </label>
      <label class="flex items-center gap-2">
        <input v-model="news" type="checkbox" class="rounded border-calming-300" />
        <span class="text-sm text-calming-700">Методы лечения</span>
      </label>
      <button
        type="submit"
        class="w-full py-3 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700"
      >
        Подписаться
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const reminders = ref(true)
const news = ref(true)
const { showToast } = useToast()

function onSubmit() {
  showToast('Подписка оформлена. Спасибо!')
}

useHead({
  title: 'Подписка — AntiOnko',
})
</script>
