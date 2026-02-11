<template>
  <div class="py-8 px-4 max-w-3xl mx-auto">
    <article v-if="method" class="space-y-6">
      <!-- Заголовок -->
      <header>
        <h1 class="text-2xl font-bold text-calming-900">
          {{ methodTitle }}
        </h1>
        <p class="mt-2 text-sm text-calming-600">
          <span>Дата: {{ formatMethodDate(method.date) }}</span>
          <span v-if="method.source?.name"> | Источник: {{ method.source.name }}</span>
          <span v-if="method.verifiedDate"> | Верифицировано: {{ method.verifiedDate }}</span>
        </p>
      </header>

      <!-- Основной текст -->
      <p class="text-calming-700 leading-relaxed">{{ method.body || '—' }}</p>

      <!-- Клиники (как на странице результатов) -->
      <section class="mb-10">
        <h2 class="text-lg font-semibold text-calming-900 mb-4">Клиники</h2>
        <div v-if="methodClinics.length" class="grid md:grid-cols-2 gap-6">
          <ClinicCard
            v-for="c in methodClinics"
            :key="c.id"
            :clinic="c"
            :slug="methodTagsSlug"
          />
        </div>
        <p v-else class="text-sm text-calming-600 py-2">Клиник по этому методу не найдено.</p>
      </section>

      <!-- Доктора практикующие этот метод -->
      <section v-if="methodDoctors.length" class="mb-10">
        <h2 class="text-lg font-semibold text-calming-900 mb-4">
          Доктора практикующие этот метод
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DoctorClinicCard
            v-for="d in methodDoctors"
            :key="d.id"
            :doctor="d"
            :address="doctorAddress(d)"
          />
        </div>
      </section>

      <!-- Обсудить в сообществе -->
      <section class="rounded-xl bg-white border border-calming-100 p-5 mt-6">
        <h2 class="text-sm font-semibold text-calming-800 uppercase tracking-wider mb-3">Обсудить в сообществе</h2>
        <p class="text-sm text-calming-700 mb-3">Почитайте опыт других или задайте вопрос в форуме.</p>
        <ul v-if="communityThreads.length" class="space-y-2">
          <li v-for="t in communityThreads" :key="t.id">
            <NuxtLink :to="`/community/thread/${t.id}`" class="text-calming-600 hover:underline font-medium">
              {{ t.title }}
            </NuxtLink>
          </li>
        </ul>
        <NuxtLink
          to="/community"
          class="inline-flex items-center gap-1 text-sm font-medium text-calming-600 hover:underline mt-2"
        >
          Все обсуждения
          <AppIcon name="arrow-right" size="sm" />
        </NuxtLink>
      </section>

      <!-- Теги — всегда одна строка -->
      <div class="flex flex-wrap gap-2 pt-2">
        <template v-if="method.tags?.length">
          <span
            v-for="tag in method.tags"
            :key="tag"
            class="inline-flex rounded-full bg-calming-100 px-3 py-1 text-sm text-calming-700"
          >
            {{ tag }}
          </span>
        </template>
        <span v-else class="text-sm text-calming-500">—</span>
      </div>
    </article>
    <p v-else class="text-calming-600">Метод не найден.</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { stripEmojis } = useStripEmojis()
const { formatMethodDate } = useFormatMethodDate()

const { data: method } = await useFetch<{
  slug: string
  title: string
  date: string
  topic: string
  source?: { name: string; url: string }
  tags?: string[]
  body: string
  clinicId?: number
  clinicIds?: number[]
  doctorId?: number
  verifiedDate?: string
  forWhom?: string
  effect?: string
  geographyLabel?: string
  placeName?: string
  phone?: string
  availability?: string
  cost?: string
  whatToSay?: string
}>(`/api/articles/${slug}`)

const methodTitle = computed(() => stripEmojis(method.value?.title ?? ''))

const firstClinicId = computed(() => {
  const m = method.value
  return (m?.clinicIds && m.clinicIds[0]) ?? m?.clinicId
})
const doctorId = computed(() => method.value?.doctorId)

const clinicIdsFromMethod = computed(() => {
  const m = method.value
  if (!m) return []
  if (Array.isArray(m.clinicIds) && m.clinicIds.length) return m.clinicIds
  if (m.clinicId != null) return [m.clinicId]
  return []
})

const { data: clinic } = await useFetch(
  () => `/api/clinics/${firstClinicId.value ?? ''}`,
  { default: () => null, watch: [firstClinicId] }
)
const { data: doctor } = await useFetch(
  () => `/api/doctors/${doctorId.value ?? ''}`,
  { default: () => null, watch: [doctorId] }
)

const { data: doctorsByClinicsData } = await useFetch(
  () =>
    clinicIdsFromMethod.value.length
      ? `/api/doctors?clinicIds=${clinicIdsFromMethod.value.join(',')}`
      : null,
  { default: () => ({ doctors: [] }), watch: [clinicIdsFromMethod] }
)

const { data: clinicsForDoctorsData } = await useFetch(
  () =>
    clinicIdsFromMethod.value.length
      ? `/api/clinics?ids=${clinicIdsFromMethod.value.join(',')}`
      : null,
  { default: () => ({ clinics: [] }), watch: [clinicIdsFromMethod] }
)

const clinicsMapById = computed(() => {
  const list = (clinicsForDoctorsData.value?.clinics ?? []) as { id: number; name: string; city?: string }[]
  return Object.fromEntries(list.map((c) => [c.id, c]))
})

/** Клиники, где доступен этот метод (для карточек как на странице результатов) */
const methodClinics = computed(() => {
  const list = clinicsForDoctorsData.value?.clinics ?? []
  return list as { id: number; name: string; city: string; services?: string[]; lat?: number; lng?: number; doctor?: string }[]
})

const methodTagsSlug = computed(() => {
  const tags = method.value?.tags
  if (Array.isArray(tags) && tags.length) {
    const first = tags[0]
    if (typeof first === 'string') return first
  }
  return 'obshiy'
})

const methodDoctors = computed(() => {
  const fromClinics = (doctorsByClinicsData.value?.doctors ?? []) as { id: number; name: string; specialty: string; clinicId?: number; rating?: number; photo?: string }[]
  const primaryId = method.value?.doctorId
  const seen = new Set<number>()
  const out: typeof fromClinics = []
  if (primaryId != null && primaryId > 0) {
    const primary = fromClinics.find((d) => d.id === primaryId) ?? doctor.value ?? null
    if (primary) {
      seen.add(primary.id)
      out.push(primary)
    }
  }
  fromClinics.forEach((d) => {
    if (d.id != null && !seen.has(d.id)) {
      seen.add(d.id)
      out.push(d)
    }
  })
  return out
})

function doctorAddress(d: { clinicId?: number }): string {
  const c = d.clinicId != null ? clinicsMapById.value[d.clinicId] : null
  if (!c) return ''
  return c.city ? `${c.name}, ${c.city}` : c.name
}

const wherePlaceName = computed(() => {
  const m = method.value
  if (m?.placeName) return m.placeName
  const c = clinic.value
  if (c?.name && c?.city) return `${c.name}, ${c.city}`
  return c?.name ?? ''
})

const { data: forumData } = await useFetch<{ threads: { id: string; title: string; methodSlug?: string; categoryId?: string }[] }>('/api/forum')
/** Темы, релевантные методу: сначала с methodSlug === slug, если нет — общие темы поддержки */
const communityThreads = computed(() => {
  const list = forumData.value?.threads ?? []
  const forMethod = list.filter((t) => t.methodSlug === slug)
  if (forMethod.length) return forMethod
  return list.filter((t) => t.categoryId === 'support').slice(0, 5)
})

useHead({
  title: `${methodTitle.value || 'Метод'} — AntiOnko`,
})
</script>
