<template>
  <div class="py-8 px-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-2">Мои врачи</h1>
    <p class="text-calming-600 text-sm mb-8">Избранные врачи</p>

    <div v-if="favoriteDoctors.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DoctorClinicCard
        v-for="d in favoriteDoctors"
        :key="d.id"
        :doctor="d"
        :address="doctorAddress(d)"
      />
    </div>
    <div v-else class="space-y-4">
      <p class="text-calming-600">
        Пока нет избранных врачей. Добавляйте врачей в избранное на странице врача.
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
interface Doctor {
  id: number
  name: string
  specialty: string
  photo?: string
  clinicId?: number
}

interface Clinic {
  id: number
  name: string
  city?: string
}

const patientStore = usePatientStore()
const ids = computed(() => patientStore.favoriteDoctorIds)
const idsParam = computed(() => ids.value.length ? ids.value.join(',') : '0')

const { data: doctorsData } = await useFetch<{ doctors: Doctor[] }>(
  () => `/api/doctors?ids=${idsParam.value}`,
  { default: () => ({ doctors: [] }), watch: [idsParam] }
)

const clinicIds = computed(() => {
  const doctors = doctorsData.value?.doctors ?? []
  return [...new Set(doctors.map((d) => d.clinicId).filter((id): id is number => id != null))]
})
const clinicIdsParam = computed(() => clinicIds.value.length ? clinicIds.value.join(',') : '')

const { data: clinicsData } = await useFetch<{ clinics: Clinic[] }>(
  () => (clinicIdsParam.value ? `/api/clinics?ids=${clinicIdsParam.value}` : null),
  { default: () => ({ clinics: [] }), watch: [clinicIdsParam] }
)

const clinicsMap = computed(() => {
  const list = clinicsData.value?.clinics ?? []
  return Object.fromEntries(list.map((c) => [c.id, c]))
})

const favoriteDoctors = computed(() => doctorsData.value?.doctors ?? [])

function doctorAddress(d: Doctor): string {
  if (d.clinicId == null) return '—'
  const c = clinicsMap.value[d.clinicId]
  if (!c) return '—'
  return c.city ? `${c.name}, ${c.city}` : c.name
}

useHead({
  title: 'Мои врачи — AntiOnko',
})
</script>
