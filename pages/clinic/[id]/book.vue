<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-calming-900 mb-2">Запись на приём</h1>
      <p v-if="clinic" class="text-calming-600 text-sm mb-6">{{ clinic.name }}, {{ clinic.city }}</p>
      <div class="space-y-3">
        <a
          href="https://gosuslugi.ru"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-calming-200 hover:border-calming-400 hover:bg-calming-50/50 transition text-left"
        >
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-calming-100 text-calming-600">
            <AppIcon name="clipboard" size="lg" />
          </span>
          <div>
            <span class="font-semibold text-calming-900">Через Госуслуги</span>
            <p class="text-sm text-calming-600 mt-0.5">Запись к врачу на gosuslugi.ru</p>
          </div>
          <span class="ml-auto text-calming-400 shrink-0">
            <AppIcon name="arrow-right" size="sm" />
          </span>
        </a>
        <a
          :href="`tel:${displayPhone}`"
          class="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-calming-200 hover:border-calming-400 hover:bg-calming-50/50 transition text-left"
        >
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-calming-100 text-calming-600 text-xl" aria-hidden="true">📞</span>
          <div>
            <span class="font-semibold text-calming-900">По телефону</span>
            <p class="text-sm text-calming-600 mt-0.5">{{ displayPhone }}</p>
          </div>
          <span class="ml-auto text-calming-400 shrink-0">
            <AppIcon name="arrow-right" size="sm" />
          </span>
        </a>
        <a
          :href="displayWebsite"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-calming-200 hover:border-calming-400 hover:bg-calming-50/50 transition text-left"
        >
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-calming-100 text-calming-600 text-xl" aria-hidden="true">🌐</span>
          <div>
            <span class="font-semibold text-calming-900">На сайте клиники</span>
            <p class="text-sm text-calming-600 mt-0.5">Перейти на сайт</p>
          </div>
          <span class="ml-auto text-calming-400 shrink-0">
            <AppIcon name="arrow-right" size="sm" />
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: clinic } = await useFetch<{ name: string; city: string; phone?: string; website?: string } | null>(
  () => `/api/clinics/${id.value}`,
  { default: () => null }
)

const MOCK_PHONE = '+7 (8142) 76-54-32'
const MOCK_WEBSITE = 'https://example-clinic.ru'

const displayPhone = computed(() => clinic.value?.phone || MOCK_PHONE)
const displayWebsite = computed(() => clinic.value?.website || MOCK_WEBSITE)

useHead({
  title: clinic.value ? `Запись — ${clinic.value.name} — AntiOnko` : 'Запись на приём — AntiOnko',
})
</script>
