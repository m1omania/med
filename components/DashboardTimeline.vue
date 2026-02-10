<template>
  <div class="bg-white rounded-xl border border-calming-200 p-6">
    <h2 class="text-lg font-semibold text-calming-800 mb-4">Ваш путь</h2>
    <ul class="space-y-4">
      <li
        v-for="(item, i) in timelineItems"
        :key="i"
        class="flex gap-4"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
          :class="item.done ? 'bg-calming-600' : 'bg-calming-200'"
        >
          {{ i + 1 }}
        </div>
        <div>
          <p class="font-medium text-calming-900">{{ item.title }}</p>
          <p class="text-sm text-calming-600">{{ item.desc }}</p>
          <NuxtLink
            v-if="item.link"
            :to="item.link"
            class="text-sm text-calming-600 hover:underline mt-1 inline-block"
          >
            {{ item.linkText }}
          </NuxtLink>
        </div>
      </li>
    </ul>
    <p v-if="!timelineItems.length" class="text-calming-500 text-sm">
      Пройдите опрос, чтобы увидеть персональный план.
    </p>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

const timelineItems = computed(() => {
  const items: { title: string; desc: string; link?: string; linkText?: string; done: boolean }[] = []
  const hasQuiz = !!patientStore.quizData?.age
  const hasResult = !!patientStore.lastResultId || patientStore.results.length > 0

  items.push({
    title: 'Опрос',
    desc: hasQuiz ? 'Пройден' : 'Пройдите 7 шагов',
    link: '/quiz',
    linkText: hasQuiz ? 'Пройти снова' : 'Начать',
    done: hasQuiz,
  })
  items.push({
    title: 'Результаты',
    desc: hasResult ? 'Оценка рисков готова' : 'Появятся после опроса',
    link: hasResult ? '/clinics' : '/quiz',
    linkText: hasResult ? 'Подобрать клиники' : 'Сначала опрос',
    done: hasResult,
  })
  items.push({
    title: 'УЗИ / Обследование',
    desc: 'Запись в клинику (мок)',
    link: '/clinics/pechen',
    linkText: 'Клиники',
    done: false,
  })
  items.push({
    title: 'Терапия',
    desc: 'По назначению врача',
    link: '/methods',
    linkText: 'Методы',
    done: false,
  })
  return items
})
</script>
