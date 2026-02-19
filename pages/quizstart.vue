<template>
  <div class="quizstart min-h-screen relative" style="font-family: 'Manrope', sans-serif;">
    <!-- Шапка из layout (default.vue) -->
    <!-- Фиксированный анимированный фон как в баннере -->
    <div class="quizstart-bg fixed inset-0 z-0 quizstart-blobs">
      <div ref="blob1" class="quizstart-blob quizstart-blob--1" />
      <div ref="blob2" class="quizstart-blob quizstart-blob--2" />
      <div ref="blob3" class="quizstart-blob quizstart-blob--3" />
      <div ref="blob4" class="quizstart-blob quizstart-blob--4" />
      <div ref="blob5" class="quizstart-blob quizstart-blob--5" />
      <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px;" />
    </div>
    <!-- Цифры в столбик — вне contentRef, чтобы fixed не ломался из‑за transform у родителя -->
    <div class="quizstart-stats-fixed fixed bottom-5 left-5 z-20 flex flex-col gap-3">
      <div class="flex flex-col">
        <span class="quizstart-counter-block inline-flex items-baseline overflow-hidden">
          <span
            v-for="(digit, idx) in requestDigits"
            :key="'r-' + idx"
            class="quizstart-digit-roller"
          >
            <span
              class="quizstart-digit-strip text-slate-700"
              :style="{ transform: `translateY(-${digit * quizstartDigitHeightPx}px)` }"
            >
              <span v-for="n in 10" :key="n" class="quizstart-digit-cell">{{ n - 1 }}</span>
            </span>
          </span>
        </span>
        <span class="text-sm text-slate-600 mt-1">Обращения</span>
      </div>
      <div class="flex flex-col">
        <span class="text-2xl md:text-3xl font-bold text-slate-700">{{ stats?.methods ?? '—' }}</span>
        <span class="text-sm text-slate-600 mt-1">Методы</span>
      </div>
      <div class="flex flex-col">
        <span class="text-2xl md:text-3xl font-bold text-slate-700">{{ stats?.clinics ?? '—' }}</span>
        <span class="text-sm text-slate-600 mt-1">Клиники</span>
      </div>
      <div class="flex flex-col">
        <span class="text-2xl md:text-3xl font-bold text-slate-700">{{ stats?.doctors ?? '—' }}</span>
        <span class="text-sm text-slate-600 mt-1">Докторы</span>
      </div>
    </div>
    <!-- Контент поверх фона -->
    <div ref="contentRef" class="relative z-10">
    <!-- Hero -->
    <section class="relative pt-48 pb-36 md:pt-72 md:pb-52">
      <!-- Пиллюли вокруг заголовка, z-index ниже контента (параллакс по скроллу, появляются медленнее) -->
      <div ref="pillsWrapRef" class="absolute inset-0 z-0 pointer-events-none opacity-0">
        <div class="absolute left-[37%] top-[18%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" :style="pillParallax(0.08, 'translate(-50%, -50%)')">
          <img src="/assets/pil.png" alt="" class="w-[5.6rem] h-[5.6rem] md:w-[8.4rem] md:h-[8.4rem] object-contain opacity-90" aria-hidden="true" />
        </div>
        <div class="absolute left-[30%] bottom-[12%] pointer-events-none" :style="pillParallax(0.12)">
          <img src="/assets/pil2.png" alt="" class="w-20 h-20 md:w-28 md:h-28 object-contain opacity-90" aria-hidden="true" />
        </div>
        <div class="absolute left-[62%] top-[28%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" :style="pillParallax(0.1, 'translate(-50%, -50%)')">
          <img src="/assets/pil3.png" alt="" class="w-20 h-20 md:w-28 md:h-28 object-contain opacity-90" aria-hidden="true" />
        </div>
        <div class="absolute left-1/2 bottom-[7%] -translate-x-1/2 translate-y-1/2 pointer-events-none" :style="pillParallax(0.15, 'translate(-50%, 50%)')">
          <img src="/assets/pil4.png" alt="" class="w-12 h-12 md:w-16 md:h-16 object-contain opacity-90" aria-hidden="true" />
        </div>
        <div class="absolute left-[34%] bottom-[6%] pointer-events-none" :style="pillParallax(0.14)">
          <img src="/assets/pilblur1.png" alt="" class="w-20 h-20 md:w-24 md:h-24 object-contain opacity-90" aria-hidden="true" />
        </div>
        <div class="absolute right-[28%] bottom-0 pointer-events-none" :style="pillParallax(0.18)">
          <img src="/assets/pilblur2.png" alt="" class="w-32 h-32 md:w-40 md:h-40 object-contain opacity-90" aria-hidden="true" />
        </div>
      </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-4">
          Подберите проверенный метод лечения онкологии
        </h1>
        <NuxtLink
          to="/quiz"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-calming-600 text-white font-semibold text-lg hover:bg-calming-700 shadow-lg shadow-calming-600/20 transition-all hover:shadow-xl hover:shadow-calming-600/25"
          @click="startQuizFromScratch"
        >
          Подобрать метод
          <AppIcon name="arrow-right" class="w-5 h-5" />
        </NuxtLink>
        <p class="text-sm text-slate-500 mt-3">Анонимно · Бесплатно · Без регистрации</p>
      </div>
    </section>

    <!-- Блок «Зачем»: тёмный фон, заголовок + три абзаца с жирным лидом -->
    <section class="pt-16 md:pt-20 pb-10 md:pb-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <div class="px-0 py-0">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-5 md:mb-6">
            Зачем подбирать метод лечения под свой случай
          </h2>
          <div class="space-y-5 md:space-y-6">
            <p class="leading-relaxed text-slate-800">
              <span class="font-bold text-slate-900 block mb-1">Не все методы подходят под тип опухоли и стадию.</span>
              Таргетная терапия, иммунотерапия и хирургия имеют разные показания. Персональный подбор снижает риск неэффективного лечения и помогает сфокусироваться на вариантах с доказанной пользой для вашей ситуации.
            </p>
            <p class="leading-relaxed text-slate-800">
              <span class="font-bold text-slate-900 block mb-1">Клиники и врачи отличаются по специализации и оснащению.</span>
              Один центр силён в операциях, другой — в лучевой или лекарственной терапии. Короткий опрос помогает получить список учреждений и специалистов, релевантных именно вашему диагнозу и целям.
            </p>
            <p class="leading-relaxed text-slate-800">
              <span class="font-bold text-slate-900 block mb-1">Это экономит время и даёт опору для разговора с врачом.</span>
              Зная заранее проверенные методы и подходящие клиники, вы приходите на приём подготовленными: можно задавать точные вопросы и вместе с доктором выбирать тактику на основе понятных вариантов.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Что вы получите в результате: карточки с наложением при скролле -->
    <section class="py-10 md:py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-5 md:mb-6">
          Что вы получите в результате
        </h2>
        <ul class="relative">
          <li ref="resultCard1Ref" class="result-card flex gap-4 p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-lg sticky z-10 top-6 md:top-8 origin-top transition-transform duration-200 min-h-[14rem]" :style="{ transform: `scale(${resultCardScale1})` }">
            <div class="min-w-0 flex-1">
              <h3 class="font-bold text-slate-900 text-lg mb-2">Передовой метод лечения под ваш тип болезни, проверенный нашими специалистами</h3>
              <p class="text-slate-700 text-sm leading-relaxed">Мы опираемся на клинические рекомендации и данные исследований. Каждый метод в подборке оценён экспертами и соответствует современным стандартам помощи при вашем диагнозе.</p>
            </div>
            <span class="shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl leading-none" aria-hidden="true">+</span>
          </li>
          <li ref="resultCard2Ref" class="result-card flex gap-4 p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-lg sticky z-20 top-14 md:top-16 mt-6 origin-top transition-transform duration-200 min-h-[14rem]" :style="{ transform: `scale(${resultCardScale2})` }">
            <div class="min-w-0 flex-1">
              <h3 class="font-bold text-slate-900 text-lg mb-2">Список клиник в вашем или соседнем регионе с возможностью записи на приём</h3>
              <p class="text-slate-700 text-sm leading-relaxed">Подборка учреждений с учётом географии и профиля: онкоцентры, диспансеры и частные клиники, где доступен нужный метод. Удобная запись на приём прямо из личного кабинета.</p>
            </div>
            <span class="shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl leading-none" aria-hidden="true">+</span>
          </li>
          <li ref="resultCard3Ref" class="result-card flex gap-4 p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-lg sticky z-30 top-20 md:top-24 mt-6 pb-8 origin-top transition-transform duration-200 min-h-[14rem]" :style="{ transform: `scale(${resultCardScale3})` }">
            <div class="min-w-0 flex-1">
              <h3 class="font-bold text-slate-900 text-lg mb-2">Список докторов, практикующих этот метод</h3>
              <p class="text-slate-700 text-sm leading-relaxed">Врачи с опытом в выбранном направлении: хирургия, лучевая или лекарственная терапия. Контакты и возможность записаться к специалисту без лишних поисков.</p>
            </div>
            <span class="shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl leading-none" aria-hidden="true">+</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Эксперты сервиса -->
    <section class="py-10 md:py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Эксперты сервиса
        </h2>
        <p class="text-slate-700 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
          Наши эксперты сверяют методы лечения с клиническими рекомендациями и авторитетными базами, проверяют соответствие методов вашему типу заболевания и стадии, формируют персональную подборку клиник и врачей с учётом географии и специализации.
        </p>
        <div class="grid sm:grid-cols-2 gap-6 md:gap-8">
          <div
            v-for="expert in serviceExperts"
            :key="expert.id"
            class="flex gap-4"
          >
            <div class="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-calming-300 bg-calming-100">
              <img
                v-if="expert.photo"
                :src="expert.photo"
                :alt="expert.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="w-full h-full flex items-center justify-center text-blue-600 text-xl font-semibold">{{ expertInitials(expert) }}</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-slate-900 text-lg mb-1">{{ expert.name }}</h3>
              <p class="text-slate-700 text-sm leading-relaxed">{{ expert.specialty }}.{{ expert.experience ? ' ' + expert.experience : '' }} {{ expertBioLine(expert) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Дисклеймер: наш сервис не заменит врача -->
    <section class="py-10 md:py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Наш сервис не заменит врача
        </h2>
        <p class="text-slate-700 leading-relaxed mb-3">
          Ответственность за ваше здоровье лежит на вас и лечащем враче: мы не медучреждение и даём рекомендации по подбору методов и клиник, а не медицинские консультации. При формировании подборки мы опираемся на клинические рекомендации и оценку наших экспертов.
        </p>
        <p class="text-slate-700 leading-relaxed">
          Если у вас есть сомнения в назначениях, обратитесь за вторым мнением к другому специалисту. Отказываться от лечения без веских причин опасно для жизни.
        </p>
      </div>
    </section>

    <!-- Нижний CTA -->
    <section class="py-10 md:py-12">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Готовы узнать свои варианты?
        </h2>
        <p class="text-slate-700 mb-6">
          Начните с короткого опроса — это бесплатно и займёт несколько минут.
        </p>
        <NuxtLink
          to="/quiz"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-calming-600 text-white font-semibold text-lg hover:bg-calming-700 shadow-lg shadow-calming-600/20 transition-all"
          @click="startQuizFromScratch"
        >
          Подобрать метод
          <AppIcon name="arrow-right" class="w-5 h-5" />
        </NuxtLink>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()
function startQuizFromScratch() {
  patientStore.resetQuiz()
}

const { data: stats } = await useFetch<{ requests: number; methods: number; clinics: number; doctors: number }>('/api/stats', {
  default: () => null,
})

const quizstartDigitHeightPx = 36
const animatedRequestsCount = ref(0)
const requestTargetRef = ref(0)
const requestsCancelId = { current: 0 }

function runSequentialCount(
  current: Ref<number>,
  target: number,
  options: { maxDurationMs?: number; minStepMs?: number; maxStepMs?: number; cancelToken?: { current: number } } = {}
) {
  const { maxDurationMs = 2200, minStepMs = 28, maxStepMs = 120, cancelToken } = options
  if (cancelToken) cancelToken.current += 1
  const myId = cancelToken ? cancelToken.current : 0
  const start = current.value
  if (start === target) return
  const steps = Math.abs(target - start)
  const totalDuration = Math.min(maxDurationMs, steps * 70)
  const stepMs = Math.max(minStepMs, Math.min(maxStepMs, Math.round(totalDuration / steps)))
  const step = target > start ? 1 : -1
  const tick = () => {
    if (cancelToken && myId !== cancelToken.current) return
    const next = current.value + step
    if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
      current.value = target
      return
    }
    current.value = next
    setTimeout(tick, stepMs)
  }
  setTimeout(tick, stepMs)
}

const requestDigits = computed(() =>
  String(animatedRequestsCount.value)
    .split('')
    .map((c) => Number.parseInt(c, 10))
)

watch(
  () => stats.value?.requests,
  (n) => {
    if (n == null || !Number.isFinite(n)) return
    requestTargetRef.value = n
    if (animatedRequestsCount.value === 0) {
      animatedRequestsCount.value = n
      return
    }
    runSequentialCount(animatedRequestsCount, n, { cancelToken: requestsCancelId })
  },
  { immediate: true }
)

const { data: doctorsData } = await useFetch<{ doctors: { id: number; name: string; specialty: string; experience?: string; photo?: string; bio?: { title: string; institution: string }[] }[] }>('/api/doctors', { default: () => ({ doctors: [] }) })
const serviceExperts = computed(() => (doctorsData.value?.doctors ?? []).slice(0, 8))

function expertInitials(expert: { name: string }): string {
  const parts = String(expert.name).trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return ((parts[0][0] ?? '') + (parts[1][0] ?? '')).toUpperCase()
  return String(expert.name).slice(0, 2).toUpperCase()
}

function expertBioLine(expert: { bio?: { title: string; institution: string }[] }): string {
  if (!Array.isArray(expert.bio) || !expert.bio.length) return ''
  const first = expert.bio[0]
  return first ? `${first.title}, ${first.institution}` : ''
}

const contentRef = ref<HTMLElement | null>(null)
const pillsWrapRef = ref<HTMLElement | null>(null)
const blob1 = ref<HTMLElement | null>(null)
const blob2 = ref<HTMLElement | null>(null)
const blob3 = ref<HTMLElement | null>(null)
const blob4 = ref<HTMLElement | null>(null)
const blob5 = ref<HTMLElement | null>(null)

const resultCard1Ref = ref<HTMLElement | null>(null)
const resultCard2Ref = ref<HTMLElement | null>(null)
const resultCard3Ref = ref<HTMLElement | null>(null)
const resultCardScale1 = ref(1)
const resultCardScale2 = ref(1)
const resultCardScale3 = ref(1)

let requestsInterval: ReturnType<typeof setInterval> | null = null

const parallaxScrollY = ref(0)
function pillParallax(factor: number, baseTransform = '') {
  const y = parallaxScrollY.value * factor
  const tailwind = baseTransform ? `${baseTransform} ` : ''
  return { transform: `${tailwind}translateY(${y}px)` }
}

function updateParallax() {
  if (import.meta.client) parallaxScrollY.value = window.scrollY
}

function updateResultCardScales() {
  const c1 = resultCard1Ref.value
  const c2 = resultCard2Ref.value
  const c3 = resultCard3Ref.value
  if (!c1 || !c2 || !c3) return
  const r1 = c1.getBoundingClientRect()
  const r2 = c2.getBoundingClientRect()
  const r3 = c3.getBoundingClientRect()
  const overlap1 = r1.height > 0 ? Math.max(0, Math.min(1, (r1.bottom - r2.top) / r1.height)) : 0
  const overlap2 = r2.height > 0 ? Math.max(0, Math.min(1, (r2.bottom - r3.top) / r2.height)) : 0
  resultCardScale1.value = 1 - 0.08 * overlap1
  resultCardScale2.value = 1 - 0.04 * overlap2
  resultCardScale3.value = 1
}

onMounted(() => {
  const gsap = useGsap()
  if (import.meta.client && contentRef.value) {
    gsap.from(contentRef.value, { opacity: 0, y: 40, duration: 0.7, ease: 'power2.out' })
  }
  if (import.meta.client && pillsWrapRef.value) {
    gsap.fromTo(pillsWrapRef.value, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, delay: 0.25, ease: 'power2.out' })
  }
  const blobs = [blob1, blob2, blob3, blob4, blob5].map((r) => r.value).filter(Boolean) as HTMLElement[]
  if (blobs.length) {
    const duration = 6
    const ease = 'sine.inOut'
    gsap.to(blobs[0], { x: '15%', y: '-10%', scale: 1.15, duration, ease, repeat: -1, yoyo: true })
    gsap.to(blobs[1], { x: '-20%', y: '12%', scale: 1.2, duration: duration * 0.9, ease, repeat: -1, yoyo: true })
    gsap.to(blobs[2], { x: '10%', y: '15%', scale: 1.1, duration: duration * 1.1, ease, repeat: -1, yoyo: true })
    gsap.to(blobs[3], { x: '-15%', y: '-8%', scale: 1.18, duration: duration * 0.95, ease, repeat: -1, yoyo: true })
    gsap.to(blobs[4], { x: '20%', y: '5%', scale: 1.12, duration: duration * 1.05, ease, repeat: -1, yoyo: true })
  }
  if (import.meta.client) {
    requestsInterval = setInterval(() => {
      requestTargetRef.value += 3
      runSequentialCount(animatedRequestsCount, requestTargetRef.value, { cancelToken: requestsCancelId })
    }, 5000)
  }
  updateResultCardScales()
  updateParallax()
  let rafId = 0
  const onScroll = () => {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      updateParallax()
      updateResultCardScales()
      rafId = 0
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId) cancelAnimationFrame(rafId)
    if (requestsInterval) clearInterval(requestsInterval)
  })
})

useHead({
  title: 'Подбор метода лечения | AntiOnko',
  meta: [
    { name: 'description', content: 'Пройдите короткий опрос и получите персональные рекомендации по методам лечения, клиникам и врачам. Анонимно и бесплатно.' },
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap' },
  ],
})
</script>

<style scoped>
.quizstart-bg {
  background: #e0f2fe;
  pointer-events: none;
}

.quizstart-blobs {
  pointer-events: none;
}

.quizstart-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.85;
  will-change: transform;
}

.quizstart-blob--1 {
  width: 55%;
  height: 55%;
  top: -5%;
  right: -5%;
  background: rgba(255, 255, 255, 0.9);
}

.quizstart-blob--2 {
  width: 50%;
  height: 55%;
  bottom: -10%;
  right: -5%;
  background: rgba(134, 239, 172, 0.75);
}

.quizstart-blob--3 {
  width: 45%;
  height: 45%;
  top: 10%;
  left: -5%;
  background: rgba(186, 230, 253, 0.8);
}

.quizstart-blob--4 {
  width: 50%;
  height: 50%;
  bottom: -5%;
  left: 20%;
  background: rgba(94, 234, 212, 0.7);
}

.quizstart-blob--5 {
  width: 45%;
  height: 50%;
  top: 30%;
  right: 10%;
  background: rgba(59, 130, 246, 0.6);
}

.quizstart-stats-fixed {
  position: fixed !important;
  bottom: 1.25rem;
  left: 1.25rem;
  z-index: 20;
}

.quizstart-counter-block {
  min-width: 2rem;
  vertical-align: middle;
  height: 2.25rem;
}
.quizstart-digit-roller {
  display: inline-block;
  overflow: hidden;
  height: 2.25rem;
  vertical-align: top;
}
.quizstart-digit-strip {
  display: flex;
  flex-direction: column;
  transition: transform 0.12s ease-out;
}
.quizstart-digit-cell {
  height: 2.25rem;
  min-height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
}
</style>
