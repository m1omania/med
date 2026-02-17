<template>
  <div class="min-h-screen flex flex-col bg-calming-50">
    <header
      v-if="route.path !== '/' && !route.path.startsWith('/design-portal') && route.path !== '/quizstart'"
      class="sticky top-0 z-[1100] bg-white/95 backdrop-blur border-b border-calming-100 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16 gap-4">
          <NuxtLink to="/" class="text-calming-700 font-bold text-xl shrink-0">
            AntiOnko
          </NuxtLink>
          <!-- Режим поиска: поле + крестик -->
          <template v-if="searchOpen">
            <div class="flex-1 flex items-center justify-center gap-2">
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                autocomplete="off"
                placeholder="Поиск..."
                class="w-1/2 min-w-0 h-10 px-3 py-2 rounded-lg border border-calming-200 bg-white text-calming-900 placeholder:text-calming-400 focus:outline-none focus:ring-2 focus:ring-calming-500 focus:border-transparent text-sm"
                @keydown.escape="closeSearch"
                @keydown.enter.prevent="submitSearch"
              />
              <button
                type="button"
                class="flex items-center justify-center w-10 h-10 rounded-lg text-calming-600 hover:bg-calming-100 hover:text-calming-800 shrink-0"
                aria-label="Закрыть поиск"
                @click="closeSearch"
              >
                <AppIcon name="close" size="sm" />
              </button>
            </div>
          </template>
          <template v-else>
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
              <button
                type="button"
                class="flex items-center justify-center w-9 h-9 rounded-lg text-calming-600 hover:bg-calming-100 hover:text-calming-800 shrink-0 -mr-1"
                aria-label="Поиск"
                @click="openSearch"
              >
                <AppIcon name="search" size="sm" />
              </button>
            </nav>
          <div class="hidden md:flex items-center gap-3 shrink-0">
            <NuxtLink
              v-if="!patientStore.isLoggedIn"
              :to="loginLink"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 text-neutral-900 text-sm font-medium rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-colors shadow-sm"
            >
              <AppIcon name="user-male" class="w-5 h-5 text-blue-600 shrink-0" />
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
          </template>
        </div>
      </div>
    </header>
    <main class="flex-1 flex flex-col min-h-0">
      <slot />
    </main>
    <footer v-if="route.path !== '/' && !route.path.startsWith('/design-portal')" class="relative z-20 shrink-0 border-t border-neutral-200 mt-auto">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <!-- Верхний блок: компания + соцсети | приложение -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 pb-8">
          <!-- Левая колонка: лого, реквизиты, соцсети -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                <span class="text-white font-bold text-lg">A</span>
              </div>
              <div class="text-sm">
                <p class="text-neutral-700">ООО «AntiOnko»</p>
                <p class="text-neutral-500 text-xs mt-0.5">{{ new Date().getFullYear() }} support@antionko.ru</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a href="mailto:support@antionko.ru" class="w-9 h-9 rounded-lg bg-[#2563eb] flex items-center justify-center text-white hover:opacity-90 transition-opacity" aria-label="Почта">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-lg bg-[#2563eb] flex items-center justify-center text-white hover:opacity-90 transition-opacity" aria-label="Telegram">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-lg bg-[#2563eb] flex items-center justify-center text-white hover:opacity-90 transition-opacity" aria-label="ВКонтакте">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.813.678.863 2.049 2.32 3.84 3.067 3.84.254 0 .372-.102.372-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.254 0 .44-.169.88-.678.44-.508 1.017-1.287 1.627-2.034.271-.338.474-.474.813-.474h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 3.84-2.354 3.84-.186.305-.254.44-.102.745.17.254.724.678 1.086 1.067.593.593 1.04 1.086 1.356 1.44.373.44.644.254.644-.254v-2.644c-.017-.576.034-1.44-.78-1.44-.254 0-.44.034-.66.17-.44.305-1.32 1.253-1.863 1.727-.305.305-.508.44-.813.745-.135.102-.254.203-.474.407-.237.237-.47.407-.203.745.271.338.61.78 1.017 1.22.678.745 1.253 1.355 1.863 2.034.745.847 1.44 1.558 2.39 1.558z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-black hover:opacity-90 transition-opacity" aria-label="X">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-lg bg-[#ef4444] flex items-center justify-center text-white hover:opacity-90 transition-opacity" aria-label="YouTube">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-lg bg-[#ee8208] flex items-center justify-center text-white hover:opacity-90 transition-opacity" aria-label="Одноклассники">
                <span class="text-xs font-bold">OK</span>
              </a>
            </div>
          </div>
          <!-- Правая колонка: приложение в стиле карточки -->
          <div class="relative rounded-[22px] p-6 sm:p-8 max-w-md shadow-sm overflow-hidden" style="background: linear-gradient(180deg, rgba(224, 242, 254, 0.9) 0%, rgba(236, 253, 245, 0.9) 100%);">
            <h3 class="font-bold text-neutral-900 text-lg">AntiOnko</h3>
            <p class="text-neutral-600 text-sm mt-2 leading-relaxed">Проходите опрос, сохраняйте результаты и записываться к врачам без лишних поисков.</p>
          </div>
        </div>
        <!-- Разделитель -->
        <div class="border-t border-neutral-200" />
        <!-- Нижние ссылки -->
        <nav class="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 text-sm">
          <NuxtLink to="/vacancies" class="text-neutral-500 hover:text-neutral-900 transition-colors">Вакансии</NuxtLink>
          <NuxtLink to="/report" class="text-neutral-500 hover:text-neutral-900 transition-colors">Сообщить о проблеме</NuxtLink>
          <NuxtLink to="/about" class="text-neutral-500 hover:text-neutral-900 transition-colors">О проекте</NuxtLink>
          <NuxtLink to="/contacts" class="text-neutral-500 hover:text-neutral-900 transition-colors">Контакты</NuxtLink>
          <NuxtLink to="/privacy" class="text-neutral-500 hover:text-neutral-900 transition-colors">Политика конфиденциальности</NuxtLink>
          <NuxtLink to="/terms" class="text-neutral-500 hover:text-neutral-900 transition-colors">Правила пользования сайтом</NuxtLink>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const patientStore = usePatientStore()

const searchOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

function openSearch() {
  searchOpen.value = true
  searchQuery.value = ''
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

function submitSearch() {
  const q = searchQuery.value?.trim()
  if (q) {
    navigateTo({ path: '/search', query: { q } })
    closeSearch()
  }
}

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
