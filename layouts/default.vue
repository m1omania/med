<template>
  <div class="min-h-screen flex flex-col bg-calming-50">
    <header
      class="sticky top-0 z-[1100] bg-white/95 backdrop-blur border-b border-calming-100 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16 gap-4">
          <NuxtLink to="/" class="text-calming-700 font-bold text-xl shrink-0">
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
              :to="loginLink"
              class="text-calming-600 hover:text-calming-800 font-medium text-sm"
            >
              Войти
            </NuxtLink>
            <template v-else>
              <div
                ref="userMenuRef"
                class="relative flex items-center gap-3"
                @mouseenter="onUserMenuEnter"
                @mouseleave="onUserMenuLeave"
              >
                <button
                  type="button"
                  class="text-calming-600 text-sm truncate max-w-[12rem] text-left bg-transparent border-none cursor-pointer hover:text-calming-800 p-0"
                  :title="patientStore.user?.email"
                  @click="userMenuOpen = !userMenuOpen"
                >
                  {{ patientStore.user?.email }}
                </button>
                <button
                  type="button"
                  class="flex items-center justify-center w-9 h-9 rounded-full bg-calming-600 text-white text-sm font-semibold hover:bg-calming-700 focus:outline-none focus:ring-2 focus:ring-calming-500 focus:ring-offset-2 shrink-0"
                  aria-label="Меню пользователя"
                  @click="userMenuOpen = !userMenuOpen"
                >
                  {{ userInitial }}
                </button>
                <div
                  v-show="userMenuOpen"
                  class="absolute right-0 top-full pt-2 z-[1100]"
                  @mouseenter="onUserMenuEnter"
                  @mouseleave="onUserMenuLeave"
                >
                  <div class="w-48 py-1 bg-white rounded-lg border border-neutral-200 shadow-lg">
                  <NuxtLink
                    to="/my-results"
                    class="block px-4 py-2 text-sm text-calming-700 hover:bg-calming-50"
                    @click="userMenuOpen = false"
                  >
                    Мои результаты
                  </NuxtLink>
                  <NuxtLink
                    to="/my-methods"
                    class="block px-4 py-2 text-sm text-calming-700 hover:bg-calming-50"
                    @click="userMenuOpen = false"
                  >
                    Мои методы
                  </NuxtLink>
                  <NuxtLink
                    to="/my-clinics"
                    class="block px-4 py-2 text-sm text-calming-700 hover:bg-calming-50"
                    @click="userMenuOpen = false"
                  >
                    Мои клиники
                  </NuxtLink>
                  <NuxtLink
                    to="/my-doctors"
                    class="block px-4 py-2 text-sm text-calming-700 hover:bg-calming-50"
                    @click="userMenuOpen = false"
                  >
                    Мои врачи
                  </NuxtLink>
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
              Онко-платформа для подбора методов лечения и клиник.
            </p>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-2">Навигация</h3>
            <ul class="space-y-1 text-sm">
              <li><NuxtLink to="/quiz" class="hover:underline">Опрос</NuxtLink></li>
              <li><NuxtLink to="/clinics" class="hover:underline">Клиники</NuxtLink></li>
              <li><NuxtLink to="/methods" class="hover:underline">Методы лечения</NuxtLink></li>
              <li><NuxtLink to="/community" class="hover:underline">Сообщество</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-2">Поддержка</h3>
            <ul class="space-y-1 text-sm">
              <li><NuxtLink to="/about" class="hover:underline">О проекте</NuxtLink></li>
              <li><NuxtLink to="/partners" class="hover:underline">Для партнёров</NuxtLink></li>
              <li><NuxtLink to="/donate" class="hover:underline">Пожертвования</NuxtLink></li>
              <li><NuxtLink to="/subscribe" class="hover:underline">Подписка и уведомления</NuxtLink></li>
            </ul>
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
const route = useRoute()
const patientStore = usePatientStore()

const loginLink = computed(() => {
  const path = route.fullPath
  if (path === '/login' || path === '/register') return '/login'
  return `/login?redirect=${encodeURIComponent(path)}`
})

function onLogout() {
  patientStore.logout()
  navigateTo('/')
}

const centerNavLinks = computed(() => {
  if (patientStore.isLoggedIn) {
    return [
      { to: '/methods', label: 'Методы лечения' },
      { to: '/clinics', label: 'Клиники' },
      { to: '/community', label: 'Сообщество' },
    ]
  }
  return [
    { to: '/methods', label: 'Методы лечения' },
    { to: '/clinics', label: 'Клиники' },
    { to: '/community', label: 'Сообщество' },
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
let menuCloseTimeout: ReturnType<typeof setTimeout> | null = null

function onUserMenuEnter() {
  if (menuCloseTimeout) {
    clearTimeout(menuCloseTimeout)
    menuCloseTimeout = null
  }
  userMenuOpen.value = true
}

function onUserMenuLeave() {
  menuCloseTimeout = setTimeout(() => {
    userMenuOpen.value = false
    menuCloseTimeout = null
  }, 150)
}

onClickOutside(userMenuRef, () => {
  userMenuOpen.value = false
})
</script>
