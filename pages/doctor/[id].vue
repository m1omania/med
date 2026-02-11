<template>
  <div class="py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <template v-if="doctor">
        <DoctorProfileCard :doctor="doctor" :clinic="clinic ?? undefined" :methods="doctorMethods" />
      </template>
      <p v-else class="text-calming-600">Врач не найден.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)

const { data: doctor } = await useFetch(() => `/api/doctors/${id.value}`, {
  default: () => null,
  getCachedData: () => undefined,
})

const clinicId = computed(() => (doctor.value as { clinicId?: number } | null)?.clinicId)
const doctorIdNum = computed(() => (doctor.value as { id?: number } | null)?.id)

const { data: clinic } = await useFetch(
  () => `/api/clinics/${clinicId.value ?? ''}`,
  {
    default: () => null,
    watch: [clinicId],
  },
)
const { data: methodsData } = await useFetch(
  () => `/api/articles?doctorId=${doctorIdNum.value ?? ''}`,
  { default: () => ({ methods: [] }), watch: [doctorIdNum] }
)
const doctorMethods = computed(() => methodsData.value?.methods ?? [])

useHead({
  title: doctor.value ? `${(doctor.value as { name?: string }).name} — AntiOnko` : 'Врач — AntiOnko',
})
</script>
