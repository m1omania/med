<template>
  <div>
    <section class="relative py-20 md:py-28 bg-gradient-to-b from-calming-100 to-calming-50">
      <div ref="heroRef" class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-calming-900 mb-4">
          Передовые методы лечения рака
        </h1>
        <p class="text-lg text-calming-700 mb-8 max-w-2xl mx-auto">
          Пройдите короткий опрос — получите рекомендации и список клиник.
        </p>
        <NuxtLink
          to="/quiz"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-calming-600 text-white font-semibold text-lg hover:bg-calming-700 shadow-lg transition"
        >
          Начать опрос
          <AppIcon name="arrow-right" class="w-5 h-5" />
        </NuxtLink>
        <p class="text-sm text-calming-500 mt-3 text-center">Анонимно. Бесплатно. Без регистрации</p>
      </div>
    </section>

    <section class="py-12 bg-white border-y border-calming-100">
      <div class="max-w-5xl mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <p class="text-3xl md:text-4xl font-bold text-calming-600">{{ stats?.requests ?? '—' }}</p>
            <p class="text-sm text-calming-600 mt-1">запросов</p>
          </div>
          <div class="text-center">
            <p class="text-3xl md:text-4xl font-bold text-calming-600">{{ stats?.users ?? '—' }}</p>
            <p class="text-sm text-calming-600 mt-1">пользователей</p>
          </div>
          <div class="text-center">
            <p class="text-3xl md:text-4xl font-bold text-calming-600">{{ stats?.methods ?? '—' }}</p>
            <p class="text-sm text-calming-600 mt-1">методов</p>
          </div>
          <div class="text-center">
            <p class="text-3xl md:text-4xl font-bold text-calming-600">{{ stats?.clinics ?? '—' }}</p>
            <p class="text-sm text-calming-600 mt-1">клиник</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-calming-900 mb-8 text-center">Как это работает</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 rounded-xl bg-calming-50 border border-calming-100">
            <div class="mb-3 flex justify-center"><AppIcon name="clipboard" size="lg" class="w-12 h-12 text-calming-600" /></div>
            <h3 class="font-semibold text-calming-800 mb-2">1. Опрос</h3>
            <p class="text-calming-600 text-sm">7 простых шагов: возраст, симптомы, локализация.</p>
          </div>
          <div class="text-center p-6 rounded-xl bg-calming-50 border border-calming-100">
            <div class="mb-3 flex justify-center"><AppIcon name="chart" size="lg" class="w-12 h-12 text-calming-600" /></div>
            <h3 class="font-semibold text-calming-800 mb-2">2. Результаты</h3>
            <p class="text-calming-600 text-sm">График рисков, методы лечения, клиники рядом.</p>
          </div>
          <div class="text-center p-6 rounded-xl bg-calming-50 border border-calming-100">
            <div class="mb-3 flex justify-center"><AppIcon name="building" size="lg" class="w-12 h-12 text-calming-600" /></div>
            <h3 class="font-semibold text-calming-800 mb-2">3. Клиники</h3>
            <p class="text-calming-600 text-sm">Карта клиник, запись к врачу.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white border-t border-calming-100">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-calming-900 mb-6">Методы лечения</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="item in latestMethods"
            :key="item.slug"
            :to="`/methods/${item.slug}`"
            class="block min-w-0 p-4 rounded-xl bg-white transition hover:shadow-lg hover:scale-[1.02]"
          >
            <p class="font-medium text-calming-800 line-clamp-2">{{ item.title }}</p>
            <p class="text-sm text-calming-500 mt-2">{{ item.date }}</p>
          </NuxtLink>
        </div>
        <div v-if="latestMethods.length" class="mt-6 text-center">
          <NuxtLink
            to="/methods"
            class="inline-block px-6 py-3 rounded-lg border-2 border-calming-500 text-calming-700 font-medium hover:bg-calming-50"
          >
            Показать все
          </NuxtLink>
        </div>
        <p v-if="latestMethods.length === 0" class="text-calming-500 text-sm">Методов пока нет.</p>
      </div>
    </section>

    <section class="py-16 bg-calming-50">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <p class="text-calming-700 mb-4">
          Уже проходили опрос? Сохраните прогресс в дашборде.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/dashboard"
            class="px-6 py-3 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700"
          >
            Дашборд
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: stats } = await useFetch<{ requests: number; users: number; methods: number; clinics: number }>('/api/stats', {
  default: () => null,
})

const { data: methodsData } = await useFetch<{ methods: { slug: string; title: string; date: string }[] }>('/api/articles')
const latestMethods = computed(() => {
  const list = methodsData.value?.methods ?? []
  return list
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 4)
})

const heroRef = ref<HTMLElement | null>(null)
onMounted(() => {
  if (import.meta.client && heroRef.value) {
    const gsap = useGsap()
    gsap.from(heroRef.value, { opacity: 0, y: 24, duration: 0.6, ease: 'power2.out' })
  }
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
