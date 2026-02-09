<template>
  <div class="min-h-screen flex flex-col bg-calming-50">
    <header
      class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-calming-100 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center gap-2 text-calming-700 font-bold text-xl">
            <span class="text-2xl">🩺</span>
            AntiOnko
          </NuxtLink>
          <nav class="hidden md:flex items-center gap-6 text-sm">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="text-calming-600 hover:text-calming-800 font-medium"
              active-class="text-calming-800 underline"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/quiz"
              class="btn-primary px-4 py-2 rounded-lg bg-calming-600 text-white hover:bg-calming-700 text-sm font-medium"
            >
              Начать опрос
            </NuxtLink>
            <NuxtLink
              v-if="!patientStore.isLoggedIn"
              to="/login"
              class="text-calming-600 hover:text-calming-800 text-sm"
            >
              Вход
            </NuxtLink>
            <NuxtLink
              v-else
              to="/dashboard"
              class="text-calming-600 hover:text-calming-800 text-sm font-medium"
            >
              Дашборд
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="bg-calming-800 text-calming-100 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="font-bold text-lg mb-2">AntiOnko</h3>
            <p class="text-calming-200 text-sm">
              Онко-платформа для оценки рисков и подбора клиник в Петрозаводске и Карелии.
            </p>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-2">Навигация</h3>
            <ul class="space-y-1 text-sm">
              <li><NuxtLink to="/quiz" class="hover:underline">Опрос</NuxtLink></li>
              <li><NuxtLink to="/results" class="hover:underline">Результаты</NuxtLink></li>
              <li><NuxtLink to="/clinics" class="hover:underline">Клиники</NuxtLink></li>
              <li><NuxtLink to="/news" class="hover:underline">Новости</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-2">Поддержка</h3>
            <NuxtLink to="/subscribe" class="text-sm hover:underline">Подписка и уведомления</NuxtLink>
            <p class="text-calming-300 text-sm mt-2">Donate: помощь проекту</p>
          </div>
        </div>
        <p class="text-center text-calming-400 text-sm mt-8">
          © {{ new Date().getFullYear() }} AntiOnko. Информация не заменяет консультацию врача.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/quiz', label: 'Опрос' },
  { to: '/results', label: 'Результаты' },
  { to: '/clinics', label: 'Клиники' },
  { to: '/news', label: 'Новости' },
  { to: '/dashboard', label: 'Дашборд' },
]
</script>
