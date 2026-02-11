<template>
  <div class="min-h-screen flex flex-col bg-calming-50">
    <header
      class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-calming-100 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16 gap-4">
          <NuxtLink to="/" class="flex items-center gap-2 text-calming-700 font-bold text-xl shrink-0">
            <AppIcon name="logo" size="lg" class="w-8 h-8 text-calming-600" />
            AntiOnko
          </NuxtLink>
          <nav class="hidden md:flex flex-1 justify-center items-center gap-6 text-sm">
            <NuxtLink
              v-for="link in centerNavLinks"
              :key="link.to"
              :to="link.to"
              class="text-calming-600 hover:text-calming-800 font-medium"
              active-class="text-calming-800 underline"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
          <div class="hidden md:flex items-center gap-3 shrink-0">
            <NuxtLink
              v-if="!patientStore.isLoggedIn"
              to="/login"
              class="text-calming-600 hover:text-calming-800 font-medium text-sm"
            >
              Личный кабинет
            </NuxtLink>
            <template v-else>
              <NuxtLink
                to="/subscribe"
                class="p-2 rounded-lg text-calming-600 hover:text-calming-800 hover:bg-calming-100"
                aria-label="Уведомления"
              >
                <AppIcon name="bell" size="md" />
              </NuxtLink>
              <div ref="userMenuRef" class="relative">
                <button
                  type="button"
                  class="flex items-center justify-center w-9 h-9 rounded-full bg-calming-600 text-white text-sm font-semibold hover:bg-calming-700 focus:outline-none focus:ring-2 focus:ring-calming-500 focus:ring-offset-2"
                  aria-label="Меню пользователя"
                  @click="userMenuOpen = !userMenuOpen"
                >
                  {{ userInitial }}
                </button>
                <div
                  v-show="userMenuOpen"
                  class="absolute right-0 mt-2 w-48 py-1 bg-white rounded-lg border border-neutral-200 shadow-lg z-50"
                >
                  <NuxtLink
                    to="/settings"
                    class="block px-4 py-2 text-sm text-calming-700 hover:bg-calming-50"
                    @click="userMenuOpen = false"
                  >
                    Настройки
                  </NuxtLink>
                  <button
                    type="button"
                    class="block w-full text-left px-4 py-2 text-sm text-calming-700 hover:bg-calming-50"
                    @click="onLogout"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </template>
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
              Онко-платформа для оценки рисков и подбора клиник.
            </p>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-2">Навигация</h3>
            <ul class="space-y-1 text-sm">
              <li><NuxtLink to="/quiz" class="hover:underline">Опрос</NuxtLink></li>
              <li><NuxtLink to="/clinics" class="hover:underline">Клиники</NuxtLink></li>
              <li><NuxtLink to="/methods" class="hover:underline">Методы лечения</NuxtLink></li>
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

function onLogout() {
  patientStore.logout()
  navigateTo('/')
}

const centerNavLinks = computed(() => {
  if (patientStore.isLoggedIn) {
    return [
      { to: '/dashboard', label: 'Дашборд' },
      { to: '/methods', label: 'Методы лечения' },
      { to: '/clinics', label: 'Клиники' },
    ]
  }
  return [
    { to: '/methods', label: 'Методы лечения' },
    { to: '/clinics', label: 'Клиники' },
  ]
})

const username = computed(() => {
  const email = patientStore.user?.email
  if (!email) return ''
  const part = email.split('@')[0]
  return part || email
})

const userInitial = computed(() => {
  const name = patientStore.user?.name ?? username.value
  const str = typeof name === 'string' ? name : ''
  if (!str) return '?'
  return str.slice(0, 1).toUpperCase()
})

const userMenuRef = ref<HTMLElement | null>(null)
const userMenuOpen = ref(false)
onClickOutside(userMenuRef, () => {
  userMenuOpen.value = false
})
</script>
