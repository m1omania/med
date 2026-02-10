<template>
  <div class="bg-white rounded-xl border border-calming-200 p-6">
    <h2 class="text-lg font-semibold text-calming-800 mb-4">Ваш доктор</h2>
    <template v-if="doctor">
      <div class="flex items-start gap-4">
        <div class="w-14 h-14 rounded-full overflow-hidden bg-calming-100 flex items-center justify-center text-lg font-semibold text-calming-600 shrink-0">
          <img
            v-if="doctor.photo"
            :src="doctor.photo"
            :alt="doctor.name"
            class="w-full h-full object-cover"
          >
          <span v-else>{{ initials }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-medium text-calming-900">{{ doctor.name }}</p>
          <p class="text-sm text-calming-600 mt-0.5">{{ doctor.specialty }}</p>
          <p v-if="doctor.experience" class="text-xs text-calming-500 mt-1">{{ doctor.experience }}</p>
          <NuxtLink
            :to="`/doctor/${doctor.id}`"
            class="mt-3 inline-flex items-center gap-1 text-sm text-calming-600 hover:underline font-medium"
          >
            Карточка врача
            <AppIcon name="arrow-right" size="sm" class="inline" />
          </NuxtLink>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="text-sm text-calming-600 mb-4">
        Здесь будет ваш лечащий врач. Подберите специалиста по направлению — контакты и запись на приём в одной карточке.
      </p>
      <NuxtLink
        to="/clinics"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-calming-100 text-calming-700 text-sm font-medium hover:bg-calming-200 transition"
      >
        Подобрать врача
        <AppIcon name="arrow-right" size="sm" />
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

const doctorId = computed(() => patientStore.myDoctorId ?? null)

const { data: doctorData } = await useAsyncData(
  () => `dashboard-doctor-${doctorId.value}`,
  async () => {
    const id = patientStore.myDoctorId
    if (id == null) return null
    return $fetch<{ id: number; name: string; specialty: string; experience?: string; photo?: string }>(`/api/doctors/${id}`)
  },
  { watch: [doctorId] }
)

const doctor = computed(() => doctorData.value ?? null)

const initials = computed(() => {
  const name = doctor.value?.name ?? ''
  const parts = String(name).split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] ?? '') + (parts[1][0] ?? '')
  return String(name).slice(0, 2).toUpperCase() || '—'
})
</script>
