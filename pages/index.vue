<template>
  <div>
    <section class="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-calming-100 to-calming-50">
      <div ref="heroRef" class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-calming-900 mb-4">
          Передовые методы лечения рака
        </h1>
        <p class="text-lg text-calming-700 mb-8 max-w-2xl mx-auto">
          Пройдите короткий опрос — получите проверенные методы лечения, список клиник и докторов.
        </p>
        <NuxtLink
          to="/quiz"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-calming-600 text-white font-semibold text-lg hover:bg-calming-700 shadow-lg transition"
          @click="startQuizFromScratch"
        >
          Начать опрос
          <AppIcon name="arrow-right" class="w-5 h-5" />
        </NuxtLink>
        <p class="text-sm text-calming-500 mt-3 text-center">Анонимно. Бесплатно. Без регистрации</p>
      </div>
    </section>

    <section class="py-12 bg-calming-50">
      <div class="max-w-5xl mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-0 md:gap-1">
          <div class="text-center">
            <span class="home-counter-block inline-flex items-baseline overflow-hidden justify-center">
              <span
                v-for="(digit, idx) in requestDigits"
                :key="'r-' + idx"
                class="home-digit-roller"
              >
                <span
                  class="home-digit-strip text-calming-600"
                  :style="{ transform: `translateY(-${digit * homeDigitHeightPx}px)` }"
                >
                  <span v-for="n in 10" :key="n" class="home-digit-cell">{{ n - 1 }}</span>
                </span>
              </span>
            </span>
            <p class="text-sm text-calming-600 mt-1">Обращения</p>
          </div>
          <div class="text-center">
            <p class="text-3xl md:text-4xl font-bold text-calming-600">{{ stats?.methods ?? '—' }}</p>
            <p class="text-sm text-calming-600 mt-1">Методы</p>
          </div>
          <div class="text-center">
            <p class="text-3xl md:text-4xl font-bold text-calming-600">{{ stats?.clinics ?? '—' }}</p>
            <p class="text-sm text-calming-600 mt-1">Клиники</p>
          </div>
          <div class="text-center">
            <p class="text-3xl md:text-4xl font-bold text-calming-600">{{ stats?.doctors ?? '—' }}</p>
            <p class="text-sm text-calming-600 mt-1">Докторы</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-calming-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 class="text-2xl font-bold text-calming-900">Методы лечения</h2>
          <NuxtLink
            v-if="latestMethods.length"
            to="/methods"
            class="text-calming-600 hover:text-calming-800 font-medium hover:underline"
          >
            Показать все
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MethodCard
            v-for="item in latestMethods"
            :key="item.slug"
            :method="item"
            :clinic="getClinicForMethod(item)"
          />
        </div>
        <p v-if="latestMethods.length === 0" class="text-calming-500 text-sm">Методов пока нет.</p>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-calming-900 mb-6">
              Все методы верифицированы специалистами с медицинским образованием
            </h2>
          </div>
          <div class="relative flex items-center gap-3">
            <button
              type="button"
              class="shrink-0 w-10 h-10 rounded-full bg-calming-100 text-calming-700 hover:bg-calming-200 flex items-center justify-center transition"
              aria-label="Предыдущий врач"
              :disabled="carouselDoctorIndex <= 0"
              @click="carouselDoctorIndex = Math.max(0, carouselDoctorIndex - 1)"
            >
              <AppIcon name="arrow-left" size="sm" />
            </button>
            <NuxtLink
              v-if="carouselDoctor"
              :to="`/doctor/${carouselDoctor.id}`"
              class="flex-1 block bg-white rounded-2xl shadow-sm border border-calming-100 p-6 hover:shadow-md transition overflow-hidden"
            >
              <div class="flex gap-6">
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-semibold uppercase tracking-wide text-red-600 mb-1">{{ carouselDoctor.specialty }}</p>
                  <h3 class="text-xl font-bold text-calming-900 mb-2">{{ carouselDoctor.name }}</h3>
                  <p class="text-sm text-calming-700 mb-2">Опыт работы: {{ carouselDoctor.experience || '—' }}</p>
                  <p class="text-sm text-calming-600 line-clamp-3">{{ doctorEducationText(carouselDoctor) }}</p>
                </div>
                <div class="w-24 h-24 rounded-full overflow-hidden shrink-0 bg-calming-100 flex items-center justify-center">
                  <img
                    v-if="carouselDoctor.photo"
                    :src="carouselDoctor.photo"
                    :alt="carouselDoctor.name"
                    class="w-full h-full object-cover"
                  >
                  <span v-else class="text-2xl font-semibold text-calming-500">{{ doctorInitials(carouselDoctor) }}</span>
                </div>
              </div>
            </NuxtLink>
            <button
              type="button"
              class="shrink-0 w-10 h-10 rounded-full bg-calming-100 text-calming-700 hover:bg-calming-200 flex items-center justify-center transition"
              aria-label="Следующий врач"
              :disabled="carouselDoctorIndex >= (doctorsData?.doctors?.length ?? 1) - 1"
              @click="carouselDoctorIndex = Math.min((doctorsData?.doctors?.length ?? 1) - 1, carouselDoctorIndex + 1)"
            >
              <AppIcon name="arrow-right" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-calming-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 class="text-2xl font-bold text-calming-900">Клиники</h2>
          <NuxtLink
            v-if="latestClinics.length"
            to="/clinics"
            class="text-calming-600 hover:text-calming-800 font-medium hover:underline"
          >
            Показать все
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ClinicCard
            v-for="c in latestClinics"
            :key="c.id"
            :clinic="c"
            slug="all"
          />
        </div>
        <p v-if="latestClinics.length === 0" class="text-calming-500 text-sm">Клиник пока нет.</p>
      </div>
    </section>

    <section class="py-16 bg-calming-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 class="text-2xl font-bold text-calming-900">Доктора</h2>
          <NuxtLink
            v-if="latestDoctors.length"
            to="/clinics"
            class="text-calming-600 hover:text-calming-800 font-medium hover:underline"
          >
            Показать все
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DoctorClinicCard
            v-for="d in latestDoctors"
            :key="d.id"
            :doctor="d"
            :address="getDoctorAddress(d)"
          />
        </div>
        <p v-if="latestDoctors.length === 0" class="text-calming-500 text-sm">Докторов пока нет.</p>
      </div>
    </section>

    <section class="py-16 bg-calming-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 class="text-2xl font-bold text-calming-900">Последние сообщения в сообществе</h2>
          <NuxtLink
            v-if="latestThreads.length"
            to="/community"
            class="text-calming-600 hover:text-calming-800 font-medium hover:underline"
          >
            Показать все
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="thread in latestThreads"
            :key="thread.id"
            :to="`/community/thread/${thread.id}`"
            class="block p-5 rounded-xl bg-white transition min-h-[15rem] hover:shadow-lg hover:scale-[1.02] flex flex-col"
          >
            <h2 class="font-semibold text-calming-800">{{ thread.title }}</h2>
            <p v-if="thread.date" class="text-sm text-calming-600 mt-2">{{ formatThreadDate(thread.date) }}</p>
            <div class="mt-auto pt-4">
              <p class="text-sm text-calming-500">
                <span class="font-medium">Автор:</span> {{ thread.author }}
              </p>
              <p class="text-sm text-calming-500 mt-0.5">
                {{ getRepliesCount(thread.id) }} ответов
              </p>
            </div>
          </NuxtLink>
        </div>
        <p v-if="latestThreads.length === 0" class="text-calming-500 text-sm">Пока нет обсуждений.</p>
      </div>
    </section>

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

/** Счётчик запросов: анимация прокрутки и +3 каждые 5 сек (размер как у соседних: text-4xl = 36px) */
const homeDigitHeightPx = 36
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

const { data: methodsData } = await useFetch<{
  methods: { slug: string; title: string; date: string; clinicId?: number; clinicIds?: number[] }[]
}>('/api/articles')
const { data: clinicsData } = await useFetch<{ clinics: { id: number; name: string; city: string }[] }>('/api/clinics')
const { data: doctorsData } = await useFetch<{
  doctors: { id: number; name: string; specialty: string; photo?: string; clinicId?: number; experience?: string; bio?: { title: string; institution: string; years?: string }[] }[]
}>('/api/doctors')
const { data: forumData } = await useFetch<{ threads: { id: string; title: string; author?: string; date?: string }[]; posts?: Record<string, unknown[]> }>('/api/forum')

const clinicsMap = computed(() => {
  const list = clinicsData.value?.clinics ?? []
  return Object.fromEntries(list.map((c) => [c.id, c]))
})

function getClinicForMethod(method: { clinicId?: number; clinicIds?: number[] }) {
  const id = (method.clinicIds && method.clinicIds[0]) ?? method.clinicId
  if (id == null) return undefined
  return clinicsMap.value[id]
}

const latestMethods = computed(() => {
  const list = methodsData.value?.methods ?? []
  return list
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 4)
})

const latestClinics = computed(() => {
  const list = clinicsData.value?.clinics ?? []
  return list.slice(0, 3)
})

const latestDoctors = computed(() => {
  const list = doctorsData.value?.doctors ?? []
  return list.slice(0, 4)
})

const carouselDoctorIndex = ref(0)
const carouselDoctor = computed(() => {
  const list = doctorsData.value?.doctors ?? []
  return list[carouselDoctorIndex.value] ?? null
})

function doctorEducationText(doctor: { bio?: { title: string; institution: string; years?: string }[] }) {
  const bio = doctor.bio
  if (!Array.isArray(bio) || !bio.length) return '—'
  const first = bio[0]
  const parts = [first.title, first.institution].filter(Boolean)
  return parts.length ? `Образование: ${parts.join(', ')}.` : '—'
}

function doctorInitials(doctor: { name?: string }) {
  const name = doctor?.name ?? ''
  const parts = String(name).split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return ((parts[0][0] ?? '') + (parts[1][0] ?? '')).toUpperCase()
  return String(name).slice(0, 2).toUpperCase()
}

function getDoctorAddress(doctor: { clinicId?: number }) {
  const clinic = doctor.clinicId != null ? clinicsMap.value[doctor.clinicId] : undefined
  if (!clinic) return '—'
  return `${clinic.name}, ${clinic.city}`
}

const latestThreads = computed(() => {
  const list = forumData.value?.threads ?? []
  return [...list]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 4)
})

function formatThreadDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
  const mi = Number.parseInt(m || '0', 10) - 1
  if (mi < 0 || mi >= 12) return d
  return `${months[mi]} ${y || ''}`
}

function getRepliesCount(threadId: string) {
  const posts = forumData.value?.posts as Record<string, unknown[]> | undefined
  const arr = posts?.[threadId]
  return Array.isArray(arr) ? arr.length : 0
}

const heroRef = ref<HTMLElement | null>(null)
let requestsInterval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  if (import.meta.client && heroRef.value) {
    const gsap = useGsap()
    gsap.from(heroRef.value, { opacity: 0, y: 24, duration: 0.6, ease: 'power2.out' })
  }
  if (import.meta.client) {
    requestsInterval = setInterval(() => {
      requestTargetRef.value += 3
      runSequentialCount(animatedRequestsCount, requestTargetRef.value, { cancelToken: requestsCancelId })
    }, 5000)
  }
})
onUnmounted(() => {
  if (requestsInterval) clearInterval(requestsInterval)
})

useHead({
  title: 'AntiOnko — онко-скрининг и рекомендации',
  meta: [
    {
      name: 'description',
      content:
        'Онко-платформа: оценка рисков, рекомендации и подбор клиник. Персональный скрининг.',
    },
  ],
})
</script>

<style scoped>
.home-counter-block {
  min-width: 2rem;
  vertical-align: middle;
  height: 2.25rem;
}
.home-digit-roller {
  display: inline-block;
  overflow: hidden;
  height: 2.25rem;
  vertical-align: top;
}
.home-digit-strip {
  display: flex;
  flex-direction: column;
  transition: transform 0.12s ease-out;
}
.home-digit-cell {
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
