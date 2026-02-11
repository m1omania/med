<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <template v-if="doctor">
        <DoctorProfileCard :doctor="doctor" :clinic="clinic ?? undefined" :methods="doctorMethods">
          <template #after-book>
            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium transition"
              :class="isFavoriteDoctor ? 'bg-calming-100 text-calming-700 hover:bg-calming-200' : 'bg-white border-2 border-calming-300 text-calming-700 hover:border-calming-400'"
              @click="onFavoriteDoctorClick"
            >
              <AppIcon name="star" size="sm" :class="{ 'fill-current': isFavoriteDoctor }" />
              {{ isFavoriteDoctor ? 'Убрать из избранного' : 'Добавить в избранное' }}
            </button>
          </template>
        </DoctorProfileCard>
        <RegisterPromptModal v-model="showRegisterPrompt" />
      </template>
      <p v-else class="text-calming-600">Врач не найден.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)
const patientStore = usePatientStore()
const showRegisterPrompt = ref(false)

const { data: doctor } = await useFetch(() => `/api/doctors/${id.value}`, {
  default: () => null,
  getCachedData: () => undefined,
})

const doctorIdNum = computed(() => (doctor.value as { id?: number } | null)?.id ?? null)
const isFavoriteDoctor = computed(() => doctorIdNum.value != null && patientStore.isFavoriteDoctor(doctorIdNum.value))

function onFavoriteDoctorClick() {
  if (!patientStore.isLoggedIn) {
    showRegisterPrompt.value = true
    return
  }
  if (doctorIdNum.value != null) patientStore.toggleFavoriteDoctor(doctorIdNum.value)
}

const clinicId = computed(() => (doctor.value as { clinicId?: number } | null)?.clinicId)

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
