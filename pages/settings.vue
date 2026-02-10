<template>
  <div class="py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-calming-900 mb-8">Настройки</h1>

      <!-- Профиль -->
      <section class="bg-white rounded-xl border border-calming-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-calming-900 mb-4">Профиль</h2>
        <form class="space-y-4" @submit.prevent="saveProfile">
          <div>
            <label for="profile-name" class="block text-sm font-medium text-calming-700 mb-1">Имя</label>
            <input
              id="profile-name"
              v-model="profile.name"
              type="text"
              class="w-full rounded-lg border border-calming-300 px-3 py-2 text-calming-800 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
              placeholder="Как к вам обращаться"
            />
          </div>
          <div>
            <label for="profile-email" class="block text-sm font-medium text-calming-700 mb-1">Email</label>
            <input
              id="profile-email"
              v-model="profile.email"
              type="email"
              class="w-full rounded-lg border border-calming-300 px-3 py-2 text-calming-800 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
              placeholder="email@example.com"
            />
          </div>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg bg-calming-600 text-white text-sm font-medium hover:bg-calming-700"
          >
            Сохранить
          </button>
        </form>
      </section>

      <!-- Пароль -->
      <section class="bg-white rounded-xl border border-calming-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-calming-900 mb-4">Пароль</h2>
        <form class="space-y-4" @submit.prevent="savePassword">
          <div>
            <label for="current-password" class="block text-sm font-medium text-calming-700 mb-1">Текущий пароль</label>
            <input
              id="current-password"
              v-model="password.current"
              type="password"
              autocomplete="current-password"
              class="w-full rounded-lg border border-calming-300 px-3 py-2 text-calming-800 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label for="new-password" class="block text-sm font-medium text-calming-700 mb-1">Новый пароль</label>
            <input
              id="new-password"
              v-model="password.new"
              type="password"
              autocomplete="new-password"
              class="w-full rounded-lg border border-calming-300 px-3 py-2 text-calming-800 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-calming-700 mb-1">Повторите новый пароль</label>
            <input
              id="confirm-password"
              v-model="password.confirm"
              type="password"
              autocomplete="new-password"
              class="w-full rounded-lg border border-calming-300 px-3 py-2 text-calming-800 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg bg-calming-600 text-white text-sm font-medium hover:bg-calming-700"
          >
            Сменить пароль
          </button>
        </form>
      </section>

      <!-- Уведомления -->
      <section class="bg-white rounded-xl border border-calming-200 p-6">
        <h2 class="text-lg font-semibold text-calming-900 mb-4">Уведомления</h2>
        <div class="space-y-4">
          <label class="flex items-center justify-between gap-4 cursor-pointer">
            <span class="text-calming-700">Письма на email</span>
            <input
              v-model="notify.email"
              type="checkbox"
              class="w-5 h-5 rounded border-calming-300 text-calming-600 focus:ring-calming-500"
              @change="saveNotifications"
            />
          </label>
          <label class="flex items-center justify-between gap-4 cursor-pointer">
            <span class="text-calming-700">Напоминания о скрининге</span>
            <input
              v-model="notify.reminders"
              type="checkbox"
              class="w-5 h-5 rounded border-calming-300 text-calming-600 focus:ring-calming-500"
              @change="saveNotifications"
            />
          </label>
          <label class="flex items-center justify-between gap-4 cursor-pointer">
            <span class="text-calming-700">Методы лечения</span>
            <input
              v-model="notify.news"
              type="checkbox"
              class="w-5 h-5 rounded border-calming-300 text-calming-600 focus:ring-calming-500"
              @change="saveNotifications"
            />
          </label>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()
const { showToast } = useToast()

const profile = ref({
  name: '',
  email: '',
})
const password = ref({
  current: '',
  new: '',
  confirm: '',
})
const notify = ref({
  email: true,
  reminders: true,
  news: false,
})

onMounted(() => {
  profile.value = {
    name: patientStore.user?.name ?? '',
    email: patientStore.user?.email ?? '',
  }
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem('antionko_notify')
      if (saved) {
        const data = JSON.parse(saved)
        notify.value = { ...notify.value, ...data }
      }
    } catch (_) {}
  }
})

function saveProfile() {
  patientStore.updateUser({ email: profile.value.email, name: profile.value.name || undefined })
  showToast('Профиль сохранён.')
}

function savePassword() {
  if (password.value.new !== password.value.confirm) {
    showToast('Пароли не совпадают.', 'error')
    return
  }
  if (password.value.new.length < 6) {
    showToast('Пароль должен быть не короче 6 символов.', 'error')
    return
  }
  // Мок: реальная смена пароля через API
  showToast('Пароль изменён.')
  password.value = { current: '', new: '', confirm: '' }
}

function saveNotifications() {
  if (import.meta.client) {
    try {
      localStorage.setItem('antionko_notify', JSON.stringify(notify.value))
      showToast('Настройки уведомлений сохранены.')
    } catch (_) {}
  }
}

useHead({
  title: 'Настройки — AntiOnko',
})
</script>
