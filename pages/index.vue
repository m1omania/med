<template>
  <div>
    <section class="relative py-20 md:py-28 bg-gradient-to-b from-calming-100 to-calming-50">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-calming-900 mb-4">
          Оцените риски. Действуйте вовремя.
        </h1>
        <p class="text-lg text-calming-700 mb-8 max-w-2xl mx-auto">
          Персональный онко-скрининг для жителей Петрозаводска и Карелии. Пройдите короткий опрос —
          получите рекомендации и список клиник.
        </p>
        <NuxtLink
          to="/quiz"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-calming-600 text-white font-semibold text-lg hover:bg-calming-700 shadow-lg transition"
        >
          Начать опрос
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-calming-900 mb-8 text-center">Как это работает</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 rounded-xl bg-calming-50 border border-calming-100">
            <div class="text-3xl mb-3">📋</div>
            <h3 class="font-semibold text-calming-800 mb-2">1. Опрос</h3>
            <p class="text-calming-600 text-sm">7 простых шагов: возраст, симптомы, локализация.</p>
          </div>
          <div class="text-center p-6 rounded-xl bg-calming-50 border border-calming-100">
            <div class="text-3xl mb-3">📊</div>
            <h3 class="font-semibold text-calming-800 mb-2">2. Результаты</h3>
            <p class="text-calming-600 text-sm">График рисков, методы лечения, клиники рядом.</p>
          </div>
          <div class="text-center p-6 rounded-xl bg-calming-50 border border-calming-100">
            <div class="text-3xl mb-3">🏥</div>
            <h3 class="font-semibold text-calming-800 mb-2">3. Клиники</h3>
            <p class="text-calming-600 text-sm">Карта Петрозаводска, запись к врачу.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-calming-50">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <p class="text-calming-700 mb-4">
          Уже проходили опрос? Посмотрите результаты или сохраните их в дашборде.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/results"
            class="px-6 py-3 rounded-lg border-2 border-calming-500 text-calming-700 font-medium hover:bg-calming-100"
          >
            Мои результаты
          </NuxtLink>
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
useHead({
  title: 'AntiOnko — онкология Петрозаводск',
  meta: [
    {
      name: 'description',
      content:
        'Онко-платформа для оценки рисков и подбора клиник в Петрозаводске и Карелии. Персональный скрининг.',
    },
  ],
})
</script>
