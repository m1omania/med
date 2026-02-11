<template>
  <div class="py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-calming-900 mb-2">Пожертвования</h1>
      <p class="text-lg text-calming-600 mb-8">
        Поддержите развитие платформы AntiOnko
      </p>

      <div class="space-y-8 text-calming-700">
        <section class="rounded-xl bg-white border border-calming-100 p-6">
          <p class="mb-4">
            AntiOnko — некоммерческий проект. Мы не показываем рекламу и не продаём приоритет клиникам.
            Ваши пожертвования идут на поддержку серверов, доработку опроса и контента, доступность сервиса для всех.
          </p>
          <p>
            Любая сумма важна. Спасибо, что думаете о проекте.
          </p>
        </section>

        <section class="rounded-xl bg-white border border-calming-100 p-6">
          <h2 class="text-xl font-semibold text-calming-900 mb-4">Способы поддержать проект</h2>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <span class="text-calming-600 font-medium shrink-0">Банковский перевод (РФ)</span>
              <span class="text-sm">Реквизиты по запросу на <a href="mailto:donate@antionko.ru" class="text-calming-600 hover:underline">donate@antionko.ru</a></span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-calming-600 font-medium shrink-0">ЮMoney (Яндекс.Деньги)</span>
              <span class="text-sm">Скоро будет доступно</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-calming-600 font-medium shrink-0">Патреон / Boosty</span>
              <span class="text-sm">Ссылка будет добавлена</span>
            </li>
          </ul>
        </section>

        <section class="rounded-xl bg-calming-50 border border-calming-100 p-6">
          <h2 class="text-lg font-semibold text-calming-900 mb-2">Куда идут средства</h2>
          <ul class="list-disc pl-6 space-y-1 text-sm text-calming-700">
            <li>Хостинг и инфраструктура</li>
            <li>Разработка и обновление опроса и рекомендаций</li>
            <li>Модерация сообщества и контент</li>
            <li>Юридическая и консультационная поддержка проекта</li>
          </ul>
        </section>
      </div>

      <div class="mt-10 flex flex-wrap gap-4">
        <a href="mailto:donate@antionko.ru" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700">
          Написать в поддержку
        </a>
        <NuxtLink to="/about" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-calming-300 text-calming-700 font-medium hover:bg-calming-50">
          О проекте
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Пожертвования — AntiOnko',
  meta: [{ name: 'description', content: 'Поддержать проект AntiOnko: способы пожертвований и цели использования средств.' }],
})
</script>
