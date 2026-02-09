<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div v-if="loading" class="text-center py-12 text-calming-600">Загрузка результатов...</div>
      <template v-else-if="result">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 class="text-2xl font-bold text-calming-900">Ваши результаты</h1>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-calming-300 text-calming-700 hover:bg-calming-50 text-sm"
              @click="downloadPdf"
            >
              Скачать PDF
            </button>
            <a
              :href="telegramShareUrl"
              target="_blank"
              rel="noopener"
              class="px-4 py-2 rounded-lg bg-[#0088cc] text-white hover:opacity-90 text-sm inline-flex items-center gap-1"
            >
              Поделиться в Telegram
            </a>
            <NuxtLink
              to="/dashboard"
              class="px-4 py-2 rounded-lg bg-calming-600 text-white hover:bg-calming-700 text-sm"
            >
              Сохранить в дашборд
            </NuxtLink>
          </div>
        </div>
        <ResultsCard :result="result" />
        <div class="mt-8">
          <h2 class="text-lg font-semibold text-calming-800 mb-4">Рекомендуемые клиники</h2>
          <div class="grid gap-4">
            <ClinicCard
              v-for="clinic in result.clinics"
              :key="clinic.id"
              :clinic="clinic"
              :slug="result.primaryRisk?.slug || 'pechen'"
            />
          </div>
          <NuxtLink
            :to="`/clinics/${result.primaryRisk?.slug || 'pechen'}`"
            class="mt-4 inline-block text-calming-600 hover:text-calming-800 font-medium"
          >
            Все клиники по направлению →
          </NuxtLink>
        </div>
      </template>
      <div v-else class="text-center py-12 text-calming-600">
        Результаты не найдены. <NuxtLink to="/quiz" class="underline">Пройти опрос</NuxtLink>.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)
const patientStore = usePatientStore()

const { data: resultFromApi, pending: loading } = await useFetch(`/api/results/${id.value}`, {
  default: () => null,
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
})

const result = computed(() => {
  if (resultFromApi.value) return resultFromApi.value
  return patientStore.getResultById(id.value) ?? null
})

const telegramShareUrl = computed(() => {
  if (!result.value) return '#'
  const text = encodeURIComponent(
    `Результаты AntiOnko: риски ${Object.entries(result.value.risks || {})
      .map(([k, v]) => `${k} ${v}%`)
      .join(', ')}. ${import.meta.client ? window.location.href : ''}`,
  )
  return `https://t.me/share/url?url=${encodeURIComponent(
    (import.meta.client ? window.location.href : '') || '',
  )}&text=${text}`
})

function downloadPdf() {
  // Mock: open print dialog (real PDF via html2canvas + jspdf can be added)
  if (import.meta.client) window.print()
}

useHead({
  title: 'Результаты — AntiOnko',
})
</script>
