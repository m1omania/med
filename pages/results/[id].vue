<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <template v-if="result">
        <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
          <h1 class="text-2xl font-bold text-calming-900">Методы лечения и клиники</h1>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition shrink-0"
            :class="isFavorite ? 'bg-calming-100 text-calming-700 hover:bg-calming-200' : 'bg-calming-600 text-white hover:bg-calming-700'"
            @click="onFavoriteClick"
          >
            <AppIcon name="star" size="sm" :class="{ 'fill-current': isFavorite }" />
            {{ isFavorite ? 'Сохранено' : 'Сохранить результат' }}
          </button>
        </div>

        <RegisterPromptModal v-model="showRegisterPrompt" />

        <!-- 1. Блок с данными — показываем сразу -->
        <ProfileSummary :profile="profile" />

        <!-- 2. Методы лечения — загрузка, затем контент с анимацией -->
        <section class="mb-10">
          <h2 class="text-lg font-semibold text-calming-900 mb-4">Методы лечения</h2>
          <div v-if="!sectionReady.methods" class="rounded-xl bg-calming-100 p-8 flex items-center justify-center min-h-[12rem]">
            <span class="h-8 w-8 rounded-full border-2 border-calming-600 border-t-transparent animate-spin" aria-hidden="true" />
          </div>
          <div v-show="sectionReady.methods" ref="methodsBlockRef">
            <div v-if="breakthroughMethods.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MethodCard
                v-for="m in breakthroughMethods"
                :key="m.slug"
                :method="m"
                :clinic="clinicsMapById[(m.clinicIds && m.clinicIds[0]) ?? m.clinicId ?? 0]"
              />
            </div>
            <p v-else class="p-4 rounded-xl bg-calming-50 text-calming-700 text-sm">
              Подборка методов по вашему направлению появится после сохранения ответов.
            </p>
          </div>
        </section>

        <!-- 3. Клиники в вашем регионе — загрузка, затем контент -->
        <section class="mb-10">
          <h2 v-if="result.geography" class="text-lg font-semibold text-calming-900 mb-4">Клиники в вашем регионе ({{ result.geography }})</h2>
          <h2 v-else class="text-lg font-semibold text-calming-900 mb-4">Клиники</h2>
          <div v-if="!sectionReady.clinicsRegion" class="rounded-xl bg-calming-100 p-8 flex items-center justify-center min-h-[10rem]">
            <span class="h-8 w-8 rounded-full border-2 border-calming-600 border-t-transparent animate-spin" aria-hidden="true" />
          </div>
          <div v-show="sectionReady.clinicsRegion" ref="clinicsRegionBlockRef">
            <template v-if="result.geography">
              <div v-if="clinicsInUserLocation.length" class="grid md:grid-cols-2 gap-6">
                <ClinicCard
                  v-for="clinic in clinicsInUserLocation"
                  :key="clinic.id"
                  :clinic="clinic"
                  :slug="result.primaryRisk?.slug || 'obshiy'"
                />
              </div>
              <p v-else class="text-sm text-calming-600 py-2">В вашем регионе клиник по направлению не найдено.</p>
            </template>
            <template v-else>
              <p class="text-sm text-calming-600 mb-4">Клиники, связанные с рекомендованными методами.</p>
              <div v-if="displayClinics.length" class="grid md:grid-cols-2 gap-6">
                <ClinicCard
                  v-for="clinic in displayClinics"
                  :key="clinic.id"
                  :clinic="clinic"
                  :slug="result.primaryRisk?.slug || 'obshiy'"
                />
              </div>
              <p v-else class="text-sm text-calming-600 py-2">В базе пока нет клиник по этому направлению.</p>
            </template>
          </div>
        </section>

        <!-- 4. Клиники в других локациях — загрузка, затем контент -->
        <section v-if="result.geography" class="mb-10">
          <h2 class="text-lg font-semibold text-calming-900 mb-4">Клиники в других локациях</h2>
          <div v-if="!sectionReady.clinicsOther" class="rounded-xl bg-calming-100 p-8 flex items-center justify-center min-h-[8rem]">
            <span class="h-8 w-8 rounded-full border-2 border-calming-600 border-t-transparent animate-spin" aria-hidden="true" />
          </div>
          <div v-show="sectionReady.clinicsOther" ref="clinicsOtherBlockRef">
            <div v-if="clinicsOtherLocations.length" class="grid md:grid-cols-2 gap-6">
              <ClinicCard
                v-for="clinic in clinicsOtherLocations"
                :key="clinic.id"
                :clinic="clinic"
                :slug="result.primaryRisk?.slug || 'obshiy'"
              />
            </div>
            <p v-else class="text-sm text-calming-600 py-2">В других локациях клиник не найдено.</p>
          </div>
        </section>

        <!-- 4.5 Обсуждения в сообществе -->
        <section class="mb-10">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 class="text-lg font-semibold text-calming-900">Обсуждения в сообществе</h2>
            <NuxtLink to="/community" class="inline-flex items-center gap-1 text-sm font-medium text-calming-600 hover:underline">
              Все обсуждения
              <AppIcon name="arrow-right" size="sm" />
            </NuxtLink>
          </div>
          <div v-if="communityThreads.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CommunityThreadCard
              v-for="t in communityThreads"
              :key="t.id"
              :thread="t"
              :replies-count="getRepliesCount(t.id)"
            />
          </div>
          <p v-else class="text-sm text-calming-500 py-2">Пока нет обсуждений по теме.</p>
        </section>

        <!-- 5. Призыв к регистрации / Дашборд — загрузка, затем контент -->
        <section class="mb-10">
          <div v-if="!sectionReady.cta" class="rounded-xl bg-calming-100 p-8 flex items-center justify-center min-h-[6rem]">
            <span class="h-8 w-8 rounded-full border-2 border-calming-600 border-t-transparent animate-spin" aria-hidden="true" />
          </div>
          <div v-show="sectionReady.cta" ref="ctaBlockRef">
            <div v-if="!patientStore.isLoggedIn" class="p-4 rounded-xl bg-calming-600 shadow-sm">
              <p class="font-semibold text-white mb-2">Зарегистрируйтесь, чтобы не потерять результаты.</p>
              <p class="text-sm text-white/90 mb-4">Это полностью анонимно, данные никому не передаются.</p>
              <NuxtLink
                to="/register"
                class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white text-calming-600 text-sm font-medium hover:bg-white/90 transition"
              >
                Регистрация
              </NuxtLink>
            </div>
          </div>
        </section>
      </template>
      <div v-else class="text-center py-12 text-calming-600">
        <p class="mb-4">Результаты не найдены или устарели.</p>
        <NuxtLink to="/quiz" class="text-calming-600 hover:underline font-medium">Пройти опрос</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const patientStore = usePatientStore()

const id = computed(() => route.params.id as string)
const isFavorite = computed(() => patientStore.isFavoriteResult(id.value))
const showRegisterPrompt = ref(false)

function onFavoriteClick() {
  if (!patientStore.isLoggedIn) {
    showRegisterPrompt.value = true
    return
  }
  patientStore.toggleFavoriteResult(id.value)
}

const result = computed(() => patientStore.getResultById(id.value) ?? null)

const diagnosisLabel = computed(() => {
  const r = result.value
  if (!r?.primaryRisk?.label) return 'Общий скрининг'
  return r.primaryRisk.label
})

const profile = computed(() => ({
  age: result.value?.age,
  gender: result.value?.gender,
  diagnosisLabel: diagnosisLabel.value,
  geography: result.value?.geography,
  diagnosisStatus: result.value?.diagnosisStatus,
  stage: result.value?.stage,
}))

const diagnosisKeywords = computed(() => {
  const slug = result.value?.primaryRisk?.slug || ''
  const map: Record<string, string[]> = {
    pechen: ['печень', 'pechen'],
    grudi: ['грудь', 'маммография', 'молочн', 'grudi', 'гормонотерапия'],
    legkie: ['лёгкие', 'легкие', 'кт', 'курение', 'legkie'],
    kishechnik: ['кишечник', 'колоноскопия', 'колоректаль', 'kishechnik'],
    obshiy: ['скрининг', 'профилактика', 'обследование'],
  }
  return map[slug] || map.obshiy
})

const { data: methodsData } = await useFetch<{ methods: { slug: string; title: string; date: string; topic: string; tags?: string[]; clinicId?: number; clinicIds?: number[] }[] }>('/api/articles')
const allMethods = computed(() => methodsData.value?.methods ?? [])

const methodsByDiagnosis = computed(() => {
  const list = Array.isArray(allMethods.value) ? allMethods.value : []
  const keywords = diagnosisKeywords.value
  if (!keywords.length) return list.slice(0, 6)
  return list.filter((m) => {
    const topic = (m.topic || '').toLowerCase()
    const tags = Array.isArray(m.tags) ? m.tags.join(' ').toLowerCase() : ''
    return keywords.some((k) => topic.includes(k.toLowerCase()) || tags.includes(k.toLowerCase()))
  })
})

const breakthroughMethods = computed(() => {
  const list = Array.isArray(methodsByDiagnosis.value) ? methodsByDiagnosis.value : []
  return list.slice(0, 6)
})

const methodSlugs = computed(() => breakthroughMethods.value.map((m: { slug?: string }) => m.slug).filter(Boolean))
const { getRepliesCount } = useForum()
const { data: forumData } = await useFetch<{ threads: { id: string; title: string; excerpt?: string; author?: string; date?: string; methodSlug?: string; categoryId?: string }[] }>('/api/forum')
const communityThreads = computed(() => {
  const list = forumData.value?.threads ?? []
  const slugs = new Set(methodSlugs.value)
  const byMethod = list.filter((t) => t.methodSlug && slugs.has(t.methodSlug))
  const support = list.filter((t) => t.categoryId === 'support').slice(0, 2)
  const seen = new Set(byMethod.map((t) => t.id))
  support.forEach((t) => { if (!seen.has(t.id)) { byMethod.push(t); seen.add(t.id) } })
  return byMethod.slice(0, 5)
})

const clinicIdsFromMethods = computed(() => {
  const list = breakthroughMethods.value
  const ids = list.flatMap((m: { clinicId?: number; clinicIds?: number[] }) =>
    Array.isArray(m.clinicIds) ? m.clinicIds : (m.clinicId != null ? [m.clinicId] : [])
  ).filter((id): id is number => id > 0)
  return [...new Set(ids)]
})

const { data: clinicsFromMethodsData } = await useAsyncData(
  () => `results-clinics-${clinicIdsFromMethods.value.join(',') || 'none'}`,
  async () => {
    const ids = clinicIdsFromMethods.value
    if (!ids.length) return { clinics: [] }
    return $fetch<{ clinics: unknown[] }>(`/api/clinics?ids=${ids.join(',')}`)
  },
  { watch: [clinicIdsFromMethods] }
)
const clinicsFromMethods = computed(() => clinicsFromMethodsData.value?.clinics ?? [])

const clinicsMapById = computed(() => {
  const list = (clinicsFromMethodsData.value?.clinics ?? []) as { id: number; name: string; city: string }[]
  return Object.fromEntries(list.map((c) => [c.id, c]))
})

const displayClinics = computed(() => {
  const fromMethods = Array.isArray(clinicsFromMethods.value) ? clinicsFromMethods.value : []
  const fromResult = Array.isArray(result.value?.clinics) ? result.value.clinics : []
  const seen = new Set<number>()
  const out: { id: number; name: string; city?: string; [key: string]: unknown }[] = []
  for (const c of fromMethods) {
    const id = (c as { id?: number }).id
    if (id != null && !seen.has(id)) {
      seen.add(id)
      out.push(c as { id: number; name: string; city?: string; [key: string]: unknown })
    }
  }
  for (const c of fromResult) {
    const id = (c as { id?: number }).id
    if (id != null && !seen.has(id)) {
      seen.add(id)
      out.push(c as { id: number; name: string; city?: string; [key: string]: unknown })
    }
  }
  return out
})

const userGeography = computed(() => (result.value?.geography as string) || '')

/** Только клиники, в которых есть указанные методы лечения, и только в регионе пользователя */
const clinicsInUserLocation = computed(() => {
  const geo = userGeography.value
  const fromMethods = Array.isArray(clinicsFromMethods.value) ? clinicsFromMethods.value : []
  if (!geo) return fromMethods
  return fromMethods.filter((c) => (c as { city?: string }).city === geo)
})

const clinicsOtherLocations = computed(() => {
  const geo = userGeography.value
  if (!geo) return []
  // Показываем только клиники из других городов, у которых есть те же методы (привязаны к рекомендованным методам)
  const fromMethods = Array.isArray(clinicsFromMethods.value) ? clinicsFromMethods.value : []
  return fromMethods.filter((c) => (c as { city?: string }).city !== geo)
})

const sectionReady = reactive({
  methods: false,
  clinicsRegion: false,
  clinicsOther: false,
  cta: false,
})

const STAGE_DELAY_MS = 1200

const methodsBlockRef = ref<HTMLElement | null>(null)
const clinicsRegionBlockRef = ref<HTMLElement | null>(null)
const clinicsOtherBlockRef = ref<HTMLElement | null>(null)
const ctaBlockRef = ref<HTMLElement | null>(null)

function animateBlock(el: HTMLElement | null) {
  if (!el || !import.meta.client) return
  const gsap = useGsap()
  gsap.from(el, { opacity: 0, y: 24, duration: 0.5, ease: 'power2.out' })
}

onMounted(() => {
  patientStore.hydrateFromStorage()
  if (!import.meta.client || !result.value) return
  setTimeout(() => {
    sectionReady.methods = true
    nextTick(() => animateBlock(methodsBlockRef.value))
  }, STAGE_DELAY_MS)
  setTimeout(() => {
    sectionReady.clinicsRegion = true
    nextTick(() => animateBlock(clinicsRegionBlockRef.value))
  }, STAGE_DELAY_MS * 2)
  setTimeout(() => {
    sectionReady.clinicsOther = true
    nextTick(() => animateBlock(clinicsOtherBlockRef.value))
  }, STAGE_DELAY_MS * 3)
  setTimeout(() => {
    sectionReady.cta = true
    nextTick(() => animateBlock(ctaBlockRef.value))
  }, STAGE_DELAY_MS * 4)
})

useHead({
  title: result.value ? 'Результаты — AntiOnko' : 'Результаты не найдены — AntiOnko',
})
</script>
