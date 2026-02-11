<template>
  <div class="py-8 px-4 max-w-3xl mx-auto">
    <NuxtLink to="/methods" class="text-calming-600 hover:underline mb-4 inline-flex items-center gap-1">
      <AppIcon name="arrow-left" size="sm" /> К методам лечения
    </NuxtLink>
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

      <!-- Для кого -->
      <p class="text-calming-800">
        <span class="font-medium text-calming-900">Для кого:</span> {{ method.forWhom || '—' }}
      </p>

      <!-- Эффект -->
      <p class="text-calming-800">
        <span class="font-medium text-calming-900">Эффект:</span> {{ method.effect || '—' }}
      </p>

      <!-- Основной текст -->
      <p class="text-calming-700 leading-relaxed">{{ method.body || '—' }}</p>

      <!-- ГДЕ ПОЛУЧИТЬ — единая структура как у dostarlimab -->
      <section
        class="rounded-xl bg-white p-5 space-y-4"
      >
        <h2 class="text-sm font-semibold text-calming-800 uppercase tracking-wider">
          Где получить{{ method.geographyLabel ? ` (${method.geographyLabel})` : '' }}
        </h2>
        <div class="space-y-3 text-sm text-calming-800">
          <p class="flex items-center gap-2 font-medium">
            <span aria-hidden="true">📍</span>
            <NuxtLink
              v-if="firstClinicId && wherePlaceName"
              :to="`/clinic/${firstClinicId}`"
              class="text-calming-600 hover:underline font-medium"
            >
              {{ wherePlaceName }}
            </NuxtLink>
            <span v-else>{{ wherePlaceName || '—' }}</span>
          </p>
          <p class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span aria-hidden="true">👨‍⚕️</span>
            <NuxtLink
              v-if="method.doctorId && doctor"
              :to="`/doctor/${method.doctorId}`"
              class="text-calming-600 hover:underline font-medium"
            >
              Доктор {{ doctor.name }}{{ (doctor as { specialty?: string }).specialty ? ` (${(doctor as { specialty?: string }).specialty })` : '' }}
            </NuxtLink>
            <template v-else-if="doctor">
              <span>Доктор {{ doctor.name }}{{ (doctor as { specialty?: string }).specialty ? ` (${(doctor as { specialty?: string }).specialty })` : '' }}</span>
            </template>
            <template v-else>
              <span>—</span>
            </template>
            <span v-if="method.phone" class="text-calming-600">| ☎️ {{ method.phone }}</span>
          </p>
          <p class="flex items-center gap-2 text-calming-700">
            <span aria-hidden="true">💰</span>
            <span>Стоимость: {{ method.cost || 'по запросу' }}</span>
          </p>
          <div class="pt-1">
            <span class="font-medium text-calming-900">Что сказать:</span>
            <span class="text-calming-700"> {{ method.whatToSay ? `«${method.whatToSay}»` : '—' }}</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 pt-2">
          <NuxtLink
            v-if="firstClinicId"
            :to="`/clinic/${firstClinicId}`"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-calming-600 text-white text-sm font-medium hover:bg-calming-700 transition"
          >
            Записаться
          </NuxtLink>
          <NuxtLink
            v-else
            to="/clinics"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-calming-600 text-white text-sm font-medium hover:bg-calming-700 transition"
          >
            Подобрать клинику
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-calming-300 text-calming-700 text-sm font-medium hover:bg-calming-100 transition"
          >
            Сохранить
          </NuxtLink>
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

const { data: clinic } = await useFetch(
  () => `/api/clinics/${firstClinicId.value ?? ''}`,
  { default: () => null, watch: [firstClinicId] }
)
const { data: doctor } = await useFetch(
  () => `/api/doctors/${doctorId.value ?? ''}`,
  { default: () => null, watch: [doctorId] }
)

const wherePlaceName = computed(() => {
  const m = method.value
  if (m?.placeName) return m.placeName
  const c = clinic.value
  if (c?.name && c?.city) return `${c.name}, ${c.city}`
  return c?.name ?? ''
})

const { data: forumData } = await useFetch<{ threads: { id: string; title: string; methodSlug?: string }[] }>('/api/forum')
const communityThreads = computed(() => {
  const list = forumData.value?.threads ?? []
  return list.filter((t) => t.methodSlug === slug)
})

useHead({
  title: `${methodTitle.value || 'Метод'} — AntiOnko`,
})
</script>
