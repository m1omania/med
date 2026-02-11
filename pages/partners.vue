<template>
  <div class="py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-calming-900 mb-2">Для партнёров</h1>
      <p class="text-lg text-calming-600 mb-8">
        B2B-сотрудничество: клиники, фонды и организации
      </p>

      <div class="space-y-8 text-calming-700">
        <section class="rounded-xl bg-white border border-calming-100 p-6">
          <h2 class="text-xl font-semibold text-calming-900 mb-3">Клиники и медцентры</h2>
          <p class="mb-4">
            Подключите вашу клинику к каталогу AntiOnko: пациенты из опроса увидят вас в рекомендациях по своему региону и направлению. Условия размещения — по запросу.
          </p>
          <ul class="list-disc pl-6 space-y-1 text-sm">
            <li>Размещение в разделе «Клиники» с фильтром по городу и специализации</li>
            <li>Ссылка на вашу запись со страницы результатов опроса</li>
            <li>Без рекламной модели: мы не продаём приоритет в выдаче</li>
          </ul>
        </section>

        <section class="rounded-xl bg-white border border-calming-100 p-6">
          <h2 class="text-xl font-semibold text-calming-900 mb-3">НКО и фонды</h2>
          <p class="mb-4">
            Интеграция с вашими программами поддержки, совместные информационные кампании, доступ к агрегированной анонимной статистике запросов для отчётности.
          </p>
          <ul class="list-disc pl-6 space-y-1 text-sm">
            <li>Партнёрские материалы и ссылки на ваши ресурсы</li>
            <li>Возможность кастомизации блока рекомендаций под вашу программу</li>
          </ul>
        </section>

        <section class="rounded-xl bg-white border border-calming-100 p-6">
          <h2 class="text-xl font-semibold text-calming-900 mb-3">Фарма и производители</h2>
          <p>
            Мы не размещаем рекламу препаратов. Возможны только просветительские проекты и гранты на развитие платформы — без влияния на контент и рекомендации.
          </p>
        </section>

        <section class="rounded-xl bg-calming-50 border border-calming-100 p-6">
          <h2 class="text-lg font-semibold text-calming-900 mb-2">Связаться с нами</h2>
          <p class="text-calming-700">
            Для обсуждения формата сотрудничества напишите на
            <a href="mailto:partners@antionko.ru" class="text-calming-600 hover:underline font-medium">partners@antionko.ru</a>
            с темой «Партнёрство».
          </p>
        </section>
      </div>

      <div class="mt-10">
        <NuxtLink to="/about" class="text-calming-600 hover:underline font-medium">← О проекте</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Для партнёров — AntiOnko',
  meta: [{ name: 'description', content: 'B2B-сотрудничество: клиники, фонды, организации. Условия партнёрства AntiOnko.' }],
})
</script>
