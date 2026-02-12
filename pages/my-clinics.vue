<template>
  <div class="py-8 px-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-2">Мои клиники</h1>
    <p class="text-calming-600 text-sm mb-8">Избранные клиники</p>

    <div v-if="favoriteClinics.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ClinicCard
        v-for="c in favoriteClinics"
        :key="c.id"
        :clinic="c"
      />
    </div>
    <div v-else class="space-y-4">
      <p class="text-calming-600">
        Пока нет избранных клиник. Добавляйте клиники в избранное на странице клиники.
      </p>
      <NuxtLink
        to="/clinics"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-calming-600 text-white font-medium hover:bg-calming-700 transition"
      >
        Перейти к клиникам
        <AppIcon name="arrow-right" size="sm" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Clinic {
  id: number
  name: string
  city: string
  lat?: number
  lng?: number
  services?: string[]
}

const patientStore = usePatientStore()
const ids = computed(() => patientStore.favoriteClinicIds)
const idsParam = computed(() => ids.value.length ? ids.value.join(',') : '0')

const { data: clinicsData } = await useFetch<{ clinics: Clinic[] }>(
  () => `/api/clinics?ids=${idsParam.value}`,
  { default: () => ({ clinics: [] }), watch: [idsParam] }
)

const favoriteClinics = computed(() => clinicsData.value?.clinics ?? [])

useHead({
  title: 'Мои клиники — AntiOnko',
})
</script>
