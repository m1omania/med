<template>
  <section class="mb-10">
    <h2 class="text-lg font-semibold text-calming-900 mb-4">{{ hideMethods ? 'Инструменты поддержки' : 'Подборка методов и инструментов поддержки' }}</h2>
    <div class="space-y-4">
      <div v-if="!hideMethods && methods?.length">
        <h3 class="text-sm font-medium text-calming-700 mb-2">Методы по вашему направлению</h3>
        <ul class="space-y-1.5">
          <li v-for="m in methods" :key="m.slug" class="text-sm">
            <NuxtLink :to="`/methods/${m.slug}`" class="text-calming-600 hover:underline">
              {{ m.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <h3 v-if="!hideMethods" class="text-sm font-medium text-calming-700 mb-2">Инструменты</h3>
        <ul class="space-y-2 text-sm text-calming-700">
          <li class="flex items-center gap-2">
            <span class="w-5 h-5 rounded border-2 border-calming-300 inline-flex shrink-0" aria-hidden="true" />
            <NuxtLink to="/dashboard" class="text-calming-600 hover:underline">Чек‑лист и сохранённые результаты</NuxtLink>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-5 h-5 rounded border-2 border-calming-300 inline-flex shrink-0" aria-hidden="true" />
            <NuxtLink to="/dashboard" class="text-calming-600 hover:underline">Вопросы к врачу</NuxtLink>
          </li>
          <li class="flex items-center gap-2">
            <span class="w-5 h-5 rounded border-2 border-calming-300 inline-flex shrink-0" aria-hidden="true" />
            <NuxtLink to="/dashboard" class="text-calming-600 hover:underline">Трекинг симптомов и напоминания</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    methods?: { slug: string; title: string }[]
    hideMethods?: boolean
  }>(),
  { hideMethods: false }
)
</script>
