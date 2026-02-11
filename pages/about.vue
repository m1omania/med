<template>
  <div class="py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-calming-900 mb-6">О проекте</h1>

      <div class="prose prose-calming max-w-none space-y-6 text-calming-700">
        <p class="text-lg">
          <strong>AntiOnko</strong> — это некоммерческая онко-платформа для людей, которые хотят понять свои риски,
          получить понятные рекомендации по скринигу и лечению и найти подходящие клиники.
        </p>

        <section>
          <h2 class="text-xl font-semibold text-calming-900 mt-8 mb-3">Наша миссия</h2>
          <p>
            Сделать информацию о профилактике и лечении онкологических заболеваний доступной и понятной.
            Мы не заменяем врача, но помогаем сориентироваться в возможностях и следующих шагах.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-calming-900 mt-8 mb-3">Что мы делаем</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>Короткий анонимный опрос по возрасту, полу, симптомам и локализации</li>
            <li>Персональные рекомендации по методам лечения и скринингу</li>
            <li>Подбор клиник с учётом географии и направления</li>
            <li>Форум сообщества — обмен опытом и поддержка</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-calming-900 mt-8 mb-3">Принципы</h2>
          <p>
            Мы не продаём лечение и не принимаем рекламу от клиник. Данные опроса хранятся анонимно.
            Рекомендации основаны на открытых источниках и клинических практиках.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-calming-900 mt-8 mb-3">Контакты</h2>
          <p>
            По вопросам сотрудничества и обратной связи: <a href="mailto:hello@antionko.ru" class="text-calming-600 hover:underline">hello@antionko.ru</a>
          </p>
        </section>
      </div>

      <div class="mt-10 flex flex-wrap gap-4">
        <NuxtLink to="/quiz" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700">
          Начать опрос
        </NuxtLink>
        <NuxtLink to="/donate" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-calming-300 text-calming-700 font-medium hover:bg-calming-50">
          Поддержать проект
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'О проекте — AntiOnko',
  meta: [{ name: 'description', content: 'О некоммерческой платформе AntiOnko: миссия, принципы, контакты.' }],
})
</script>
