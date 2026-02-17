<template>
  <div class="portal-design min-h-screen" style="background-color: #f5f5f5;">
    <!-- Меню: лого + ссылки + кнопка Войти -->
    <div class="px-4 sm:px-6 lg:px-8 pt-4 pb-0">
      <div class="max-w-7xl mx-auto">
        <nav class="bg-white rounded-3xl px-6 h-16 flex items-center justify-between gap-6">
          <NuxtLink to="/" class="text-xl font-bold tracking-tight shrink-0">
            <span class="text-[#0d2e27]">Anti</span><span class="text-blue-600">Onko</span>
          </NuxtLink>
          <div class="flex items-center gap-6 text-sm font-medium text-slate-700">
            <NuxtLink to="/methods" class="border-b-2 border-transparent hover:border-emerald-600 pb-0.5 hover:text-emerald-700 transition-colors">Методы лечения</NuxtLink>
            <NuxtLink to="/clinics" class="border-b-2 border-transparent hover:border-emerald-600 pb-0.5 hover:text-emerald-700 transition-colors">Клиники</NuxtLink>
            <NuxtLink to="/community" class="border-b-2 border-transparent hover:border-emerald-600 pb-0.5 hover:text-emerald-700 transition-colors">Сообщество</NuxtLink>
            <NuxtLink to="/about" class="border-b-2 border-transparent hover:border-emerald-600 pb-0.5 hover:text-emerald-700 transition-colors">О проекте</NuxtLink>
          </div>
          <NuxtLink
            to="/login"
            class="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-transparent border border-white text-black text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
          >
            <AppIcon name="user-male" class="w-5 h-5 text-blue-600 shrink-0" />
            Войти
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Баннер не на всю ширину (контейнер + скруглённый блок) -->
    <section class="px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div class="max-w-7xl mx-auto">
        <div class="relative overflow-hidden rounded-3xl border border-white text-slate-700 banner-spots banner-shadow">
          <!-- Animated gradient blobs (GSAP) -->
          <div class="absolute inset-0 banner-blobs">
            <div ref="blob1" class="banner-blob banner-blob--1" />
            <div ref="blob2" class="banner-blob banner-blob--2" />
            <div ref="blob3" class="banner-blob banner-blob--3" />
            <div ref="blob4" class="banner-blob banner-blob--4" />
            <div ref="blob5" class="banner-blob banner-blob--5" />
          </div>
          <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px;"></div>
          <div class="relative z-10 px-8 sm:px-10 py-6 md:py-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div class="max-w-2xl flex-1">
              <h1 class="text-3xl md:text-4xl font-sans font-normal leading-tight mb-4 text-slate-700">
                Передовые методы лечения онкологических заболеваний
              </h1>
              <p class="text-lg md:text-xl text-slate-700/90 mb-8 leading-relaxed">
                Пройдите короткий опрос — получите проверенные методы лечения, список клиник и докторов.
              </p>
              <NuxtLink
                to="/quiz"
                class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                @click="startQuizFromScratch"
              >
                Пройти опрос
                <AppIcon name="arrow-right" class="ml-2 w-5 h-5 text-white" />
              </NuxtLink>
            </div>
            <div class="shrink-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden bg-slate-200 md:mr-0 md:translate-x-4">
              <img
                v-if="bannerDoctor?.photo"
                :src="bannerDoctor.photo"
                :alt="bannerDoctor.name"
                class="w-full h-full object-cover"
              />
              <img
                v-else
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop"
                alt="Врач"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Четыре блока под баннером -->
    <section class="px-4 sm:px-6 lg:px-8 pt-8 pb-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <NuxtLink
            to="/methods"
            class="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span class="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 text-blue-600">
              <AppIcon name="clipboard" size="lg" class="w-full h-full" />
            </span>
            <span class="font-medium text-sm md:text-base leading-snug">Полезная информация</span>
          </NuxtLink>
          <NuxtLink
            to="/clinics"
            class="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span class="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 text-blue-600">
              <AppIcon name="building" size="lg" class="w-full h-full" />
            </span>
            <span class="font-medium text-sm md:text-base leading-snug">Найти клинику</span>
          </NuxtLink>
          <NuxtLink
            to="/methods"
            class="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span class="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 text-blue-600">
              <AppIcon name="hospital" size="lg" class="w-full h-full" />
            </span>
            <span class="font-medium text-sm md:text-base leading-snug">Методы лечения</span>
          </NuxtLink>
          <NuxtLink
            to="/quiz"
            class="flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            @click="startQuizFromScratch"
          >
            <span class="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 text-blue-600">
              <AppIcon name="chart" size="lg" class="w-full h-full" />
            </span>
            <span class="font-medium text-sm md:text-base leading-snug">Пройти опрос</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Методы — карточки с изображением, горизонтальный скролл (~3.5 карточки до края контейнера + фейд) -->
    <section class="px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 class="text-2xl font-serif text-slate-900">Методы лечения</h2>
          <NuxtLink to="/methods" class="text-slate-600 hover:text-slate-900 text-sm font-medium">Все методы</NuxtLink>
        </div>
        <div class="relative">
          <div
            ref="methodsScrollRef"
            class="flex gap-6 overflow-x-auto pt-1 pb-6 methods-scroll"
            @scroll="onMethodsScroll"
          >
            <NuxtLink
              v-for="item in latestMethods"
              :key="item.slug"
              :to="`/methods/${item.slug}`"
              class="group flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[calc((100%-4.5rem)/3.5)] rounded-2xl overflow-hidden relative"
            >
            <div class="aspect-[4/3] overflow-hidden bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="absolute bottom-4 left-4 right-4 p-5 bg-white rounded-2xl">
              <h3 class="font-semibold text-slate-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {{ item.title }}
              </h3>
              <p class="text-sm text-slate-500">
                {{ item.date ? new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '' }}
              </p>
            </div>
          </NuxtLink>
          </div>
          <div
            class="absolute left-0 top-0 bottom-6 w-20 pointer-events-none methods-fade-left transition-opacity duration-200"
            :class="{ 'opacity-0': methodsScrollAtStart }"
            aria-hidden="true"
          />
          <div class="absolute right-0 top-0 bottom-6 w-20 pointer-events-none methods-fade" aria-hidden="true" />
        </div>
      </div>
    </section>

    <!-- Новости компании -->
    <section class="px-4 sm:px-6 lg:px-8 py-16" style="background-color: #f5f5f5;">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 class="text-2xl font-serif text-slate-900">Новости компании</h2>
          <NuxtLink to="/methods" class="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Показать все
          </NuxtLink>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="item in newsBlockItems"
            :key="item.slug || item.date + item.title"
            :to="item.to || `/methods/${item.slug}`"
            class="block p-6 bg-white rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <p class="text-sm text-slate-500 mb-2">
              {{ item.dateFormatted }}
            </p>
            <p class="text-slate-800 leading-snug line-clamp-3">
              {{ item.title }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services Grid: Bento Style -->
    <section class="px-4 sm:px-6 lg:px-8 py-24">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="md:col-span-2 group relative bg-blue-700 p-10 transition-colors rounded-2xl">
          <div class="absolute top-0 right-0 p-6 text-white/30 group-hover:text-white/50 transition-colors">
            <AppIcon name="search" size="lg" class="w-24 h-24" />
          </div>
          <div class="relative z-10">
            <h4 class="text-2xl font-serif text-white mb-4">Интеллектуальный скрининг</h4>
            <p class="text-blue-100 mb-8 max-w-md">Наша система анализирует тысячи параметров для выявления персональных факторов риска и формирования индивидуальных рекомендаций.</p>
            <NuxtLink to="/quiz" class="inline-flex items-center text-white font-bold hover:gap-2 transition-all border-b-2 border-white/30 hover:border-white w-fit">
              НАЧАТЬ ПРОВЕРКУ <AppIcon name="arrow-right" class="ml-1 w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
        
        <!-- Feature 2 -->
        <div class="bg-white p-10 border border-slate-200 flex flex-col justify-between rounded-2xl">
          <div>
            <h4 class="text-2xl font-serif text-slate-900 mb-4">База знаний</h4>
            <p class="text-slate-600">Более {{ stats?.methods ?? '0' }} верифицированных методик лечения и диагностики.</p>
          </div>
          <NuxtLink to="/methods" class="inline-flex items-center text-blue-700 font-bold hover:gap-2 transition-all w-fit">
            К СПИСКУ МЕТОДОВ <AppIcon name="arrow-right" class="ml-1 w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white p-10 border border-slate-200 rounded-2xl">
          <h4 class="text-xl font-serif text-slate-900 mb-3">Сообщество</h4>
          <p class="text-slate-600 text-sm mb-6">Обмен опытом и поддержка от тех, кто уже прошел этот путь.</p>
          <NuxtLink to="/community" class="text-blue-700 font-bold text-sm">ВСТУПИТЬ</NuxtLink>
        </div>

        <!-- Feature 4 -->
        <div class="bg-white p-10 border border-slate-200 md:col-span-2 flex flex-col md:flex-row gap-8 items-center rounded-2xl">
          <div class="flex-1">
             <h4 class="text-xl font-serif text-slate-900 mb-3">Сеть клиник</h4>
             <p class="text-slate-600 text-sm">Доступ к {{ stats?.clinics ?? '0' }} ведущим медицинским центрам по всей стране с прямым контактом.</p>
          </div>
          <NuxtLink to="/clinics" class="px-6 py-3 bg-slate-900 text-white font-bold text-sm">ПОИСК КЛИНИКИ</NuxtLink>
        </div>
        </div>
      </div>
    </section>

    <!-- Specialists: Modern Carousel -->
    <section class="py-24 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-16 items-center">
          <div class="lg:w-1/3">
             <h2 class="text-sm font-bold text-blue-700 uppercase tracking-[0.2em] mb-4">Экспертиза</h2>
             <h3 class="text-4xl font-serif text-slate-900 mb-8 leading-tight">Ваши вопросы разбирают профессионалы</h3>
             <p class="text-slate-600 leading-relaxed">Все данные на платформе проходят премодерацию и проверку практикующими онкологами с многолетним опытом.</p>
             <div class="flex gap-4">
                <button @click="prevDoctor" class="w-12 h-12 flex items-center justify-center border-2 border-slate-200 text-slate-400 hover:border-blue-700 hover:text-blue-700 transition-all cursor-pointer">
                  <AppIcon name="arrow-left" size="sm" />
                </button>
                <button @click="nextDoctor" class="w-12 h-12 flex items-center justify-center border-2 border-slate-200 text-slate-400 hover:border-blue-700 hover:text-blue-700 transition-all cursor-pointer">
                  <AppIcon name="arrow-right" size="sm" />
                </button>
             </div>
          </div>
          
          <div class="lg:w-2/3 w-full">
            <div class="relative h-[450px]">
              <TransitionGroup name="doctor-fade">
                <div 
                  v-if="carouselDoctor"
                  :key="carouselDoctor.id"
                  class="absolute inset-0 flex flex-col md:flex-row bg-slate-50 border border-slate-100"
                >
                  <div class="md:w-1/2 h-64 md:h-full bg-slate-200 overflow-hidden">
                    <img v-if="carouselDoctor.photo" :src="carouselDoctor.photo" :alt="carouselDoctor.name" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    <div v-else class="w-full h-full flex items-center justify-center text-4xl font-serif text-slate-400 bg-slate-100">
                      {{ doctorInitials(carouselDoctor) }}
                    </div>
                  </div>
                  <div class="md:w-1/2 p-10 flex flex-col justify-center">
                    <p class="text-blue-700 font-bold uppercase tracking-widest text-xs mb-4">{{ carouselDoctor.specialty }}</p>
                    <h4 class="text-2xl font-serif text-slate-900 mb-4">{{ carouselDoctor.name }}</h4>
                    <p class="text-slate-600 text-sm italic mb-8">"{{ doctorEducationText(carouselDoctor) }}"</p>
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Опыт работы</p>
                    <p class="text-xl font-serif text-slate-900">{{ carouselDoctor.experience || '-' }}</p>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer-CTA -->
    <section class="bg-blue-700 py-20 text-center">
       <div class="max-w-4xl mx-auto px-4">
         <h2 class="text-3xl md:text-5xl font-serif text-white mb-8">Своевременная диагностика сохраняет жизнь</h2>
         <NuxtLink
           to="/quiz"
           class="inline-block px-12 py-5 bg-white text-blue-700 font-bold text-lg hover:bg-slate-100 transition-colors shadow-2xl"
           @click="startQuizFromScratch"
         >
           ПРОЙТИ ПЕРСОНАЛЬНЫЙ СКРИНИНГ
         </NuxtLink>
       </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

function startQuizFromScratch() {
  patientStore.resetQuiz()
}

// Data fetching
const { data: stats } = await useFetch<{ requests: number; methods: number; clinics: number; doctors: number }>('/api/stats', {
  default: () => ({ requests: 0, methods: 0, clinics: 0, doctors: 0 }),
})

const { data: methodsData } = await useFetch<{
  methods: { slug: string; title: string; date: string; clinicId?: number; clinicIds?: number[] }[]
}>('/api/articles')

const { data: cliniciansData } = await useFetch<{ clinics: { id: number; name: string; city: string }[] }>('/api/clinics')

const { data: doctorsData } = await useFetch<{
  doctors: { id: number; name: string; specialty: string; photo?: string; clinicId?: number; experience?: string; bio?: { title: string; institution: string; years?: string }[] }[]
}>('/api/doctors')

// Computed & Helpers
const portalStats = computed(() => [
  { label: 'Методик лечения', value: stats.value?.methods || '0+' },
  { label: 'Партнерских клиник', value: stats.value?.clinics || '0' },
  { label: 'Специалистов', value: stats.value?.doctors || '0' },
  { label: 'Городов присутствия', value: '12' }
])

const latestMethods = computed(() => {
  const list = methodsData.value?.methods ?? []
  return list
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 12)
})

const carouselDoctorIndex = ref(0)
const carouselDoctor = computed(() => {
  const list = doctorsData.value?.doctors ?? []
  return list[carouselDoctorIndex.value] ?? null
})

/** Доктор для фото в баннере — первый с фото из списка */
const bannerDoctor = computed(() => {
  const list = doctorsData.value?.doctors ?? []
  return list.find((d: { photo?: string }) => d?.photo) ?? list[0] ?? null
})

const newsItems = [
  { title: 'Новые рекомендации по скринингу: что изменилось в 2026 году', date: '2026-02-13', slug: 'screening-2026' },
  { title: 'Здоровье и профилактика: приоритетные направления для пациентов и врачей', date: '2026-02-12', slug: 'health-priorities' },
  { title: 'Рост обращений: консультации по онкологии и скринингу стали запрашивать в разы чаще', date: '2026-02-09', slug: 'consult-growth' },
]
const newsBlockItems = computed(() =>
  newsItems.map((n) => ({
    ...n,
    dateFormatted: n.date ? new Date(n.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
    to: `/news/${n.slug}`,
  }))
)

function nextDoctor() {
  const count = doctorsData.value?.doctors?.length ?? 1
  carouselDoctorIndex.value = (carouselDoctorIndex.value + 1) % count
}

function prevDoctor() {
  const count = doctorsData.value?.doctors?.length ?? 1
  carouselDoctorIndex.value = (carouselDoctorIndex.value - 1 + count) % count
}

function doctorEducationText(doctor: any) {
  const bio = doctor?.bio
  if (!Array.isArray(bio) || !bio.length) return 'Ведущий специалист центра'
  const first = bio[0]
  return `${first.title}, ${first.institution}`
}

function doctorInitials(doctor: any) {
  const name = doctor?.name ?? ''
  const parts = String(name).split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return ((parts[0][0] ?? '') + (parts[1][0] ?? '')).toUpperCase()
  return String(name).slice(0, 2).toUpperCase()
}

// Counter logic
const animatedRequestsCount = ref(0)
let counterInterval: any = null

const methodsScrollRef = ref<HTMLElement | null>(null)
const methodsScrollAtStart = ref(true)

function onMethodsScroll() {
  const el = methodsScrollRef.value
  if (!el) return
  methodsScrollAtStart.value = el.scrollLeft <= 10
}

// Refs for gradient blobs
const blob1 = ref<HTMLElement | null>(null)
const blob2 = ref<HTMLElement | null>(null)
const blob3 = ref<HTMLElement | null>(null)
const blob4 = ref<HTMLElement | null>(null)
const blob5 = ref<HTMLElement | null>(null)

onMounted(() => {
  animatedRequestsCount.value = stats.value?.requests || 1200
  counterInterval = setInterval(() => {
    animatedRequestsCount.value += Math.floor(Math.random() * 3) + 1
  }, 4000)

  nextTick(() => { onMethodsScroll() })

  const gsap = useGsap()
  gsap.from('.portal-design h1', { opacity: 0, y: 30, duration: 1, ease: 'power4.out' })
  gsap.from('.portal-design p', { opacity: 0, y: 20, duration: 1, delay: 0.2, ease: 'power4.out' })

  // Animated gradient blobs
  const blobs = [blob1, blob2, blob3, blob4, blob5].map((r) => r.value).filter(Boolean) as HTMLElement[]
  if (blobs.length) {
    const duration = 18
    const ease = 'sine.inOut'
    gsap.to(blobs[0], { x: '15%', y: '-10%', scale: 1.15, duration, ease, repeat: -1, yoyo: true })
    gsap.to(blobs[1], { x: '-20%', y: '12%', scale: 1.2, duration: duration * 0.9, ease, repeat: -1, yoyo: true })
    gsap.to(blobs[2], { x: '10%', y: '15%', scale: 1.1, duration: duration * 1.1, ease, repeat: -1, yoyo: true })
    gsap.to(blobs[3], { x: '-15%', y: '-8%', scale: 1.18, duration: duration * 0.95, ease, repeat: -1, yoyo: true })
    gsap.to(blobs[4], { x: '20%', y: '5%', scale: 1.12, duration: duration * 1.05, ease, repeat: -1, yoyo: true })
  }
})

onUnmounted(() => {
  if (counterInterval) clearInterval(counterInterval)
})

useHead({
  title: 'AntiOnko Portal — Профессиональная онкологическая поддержка',
  meta: [{ name: 'description', content: 'Экспертная платформа для борьбы с онкологией.' }],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap' }
  ]
})
</script>

<style scoped>
.portal-design {
  font-family: 'Manrope', sans-serif;
  scroll-behavior: smooth;
}

.font-serif {
  font-family: 'Manrope', sans-serif;
}

.doctor-fade-enter-active,
.doctor-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.doctor-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.doctor-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}


/* Баннер: анимированный градиент (blobs + GSAP) */
.banner-spots {
  background: #e0f2fe;
}

.banner-shadow {
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.08), 0 10px 25px -10px rgba(0, 0, 0, 0.04);
}

.methods-fade {
  background: linear-gradient(to right, transparent, #f5f5f5);
}

.methods-fade-left {
  background: linear-gradient(to left, transparent, #f5f5f5);
}

.banner-blobs {
  pointer-events: none;
}

.banner-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.85;
  will-change: transform;
}

.banner-blob--1 {
  width: 55%;
  height: 55%;
  top: -5%;
  right: -5%;
  background: rgba(255, 255, 255, 0.9);
}

.banner-blob--2 {
  width: 50%;
  height: 55%;
  bottom: -10%;
  right: -5%;
  background: rgba(134, 239, 172, 0.75);
}

.banner-blob--3 {
  width: 45%;
  height: 45%;
  top: 10%;
  left: -5%;
  background: rgba(186, 230, 253, 0.8);
}

.banner-blob--4 {
  width: 50%;
  height: 50%;
  bottom: -5%;
  left: 20%;
  background: rgba(94, 234, 212, 0.7);
}

.banner-blob--5 {
  width: 45%;
  height: 50%;
  top: 30%;
  right: 10%;
  background: rgba(59, 130, 246, 0.6);
}
</style>
