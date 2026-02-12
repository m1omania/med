<template>
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div v-if="clinic">
        <div class="bg-white rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-sm mb-10">
          <div class="p-6 lg:w-80 xl:w-96 shrink-0 flex flex-col gap-6">
            <div>
              <h1 class="text-2xl font-bold text-calming-900">{{ clinic.name }}</h1>
              <p class="text-sm text-calming-500 mt-1 inline-flex items-center gap-1.5">
              <AppIcon name="map-pin" size="sm" class="shrink-0" />
              {{ clinic.city }}
            </p>
            </div>

            <div>
              <h2 class="text-xs font-semibold text-calming-500 uppercase tracking-wider mb-2">Режим работы</h2>
              <ul class="text-sm text-calming-700 space-y-1">
                <li>Пн – Чт 9:00 – 19:00</li>
                <li>Пт 9:00 – 18:00</li>
                <li class="text-red-600">Сб – Вс по записи</li>
              </ul>
            </div>

            <div class="flex flex-col gap-2">
              <NuxtLink
                :to="`/clinic/${id}/book`"
                class="inline-flex items-center justify-center py-3 px-6 rounded-xl bg-calming-600 text-white text-sm font-semibold hover:bg-calming-700 transition w-full"
              >
                Записаться на приём
              </NuxtLink>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium transition w-full"
                :class="isFavoriteClinic ? 'bg-calming-100 text-calming-700 hover:bg-calming-200' : 'bg-white border-2 border-calming-300 text-calming-700 hover:border-calming-400'"
                @click="onFavoriteClinicClick"
              >
                <AppIcon name="star" size="sm" :class="{ 'fill-current': isFavoriteClinic }" />
                {{ isFavoriteClinic ? 'Убрать из избранного' : 'Добавить в избранное' }}
              </button>
            </div>
          </div>

          <div
            v-if="clinic.lat != null && clinic.lng != null"
            class="flex-1 min-h-[16rem] lg:min-h-0 lg:min-w-[18rem] border-t lg:border-t-0 lg:border-l border-neutral-200"
          >
            <ClinicMap
              :lat="clinic.lat"
              :lng="clinic.lng"
              :name="clinic.name"
              fill
            />
          </div>
          <div v-else class="flex-1 p-6 flex items-center">
            <p class="text-calming-500 text-sm">Адрес и карта уточняются.</p>
          </div>
        </div>

        <section v-if="clinicMethods.length" class="mb-10">
          <h2 class="text-lg font-semibold text-calming-900 mb-4">Методы лечения</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MethodCard
              v-for="m in clinicMethods"
              :key="m.slug"
              :method="m"
              :clinic="clinic"
            />
          </div>
        </section>

        <RegisterPromptModal v-model="showRegisterPrompt" />

        <div id="doctors">
          <section v-if="doctors.length" class="mb-10">
            <h2 class="text-lg font-semibold text-calming-900 mb-4">Врачи клиники</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DoctorClinicCard
                v-for="d in doctors"
                :key="d.id"
                :doctor="d"
                :address="clinicAddress"
              />
            </div>
          </section>
          <p v-else class="text-calming-500">Список врачей пока не добавлен.</p>
        </div>
      </div>
      <p v-else class="text-calming-600">Клиника не найдена.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)
const patientStore = usePatientStore()
const showRegisterPrompt = ref(false)

const { data: clinic } = await useFetch(() => `/api/clinics/${id.value}`, {
  default: () => null,
})

const clinicIdNum = computed(() => {
  const c = clinic.value as { id?: number } | null
  return c && typeof c.id === 'number' ? c.id : null
})
const isFavoriteClinic = computed(() => clinicIdNum.value != null && patientStore.isFavoriteClinic(clinicIdNum.value))

function onFavoriteClinicClick() {
  if (!patientStore.isLoggedIn) {
    showRegisterPrompt.value = true
    return
  }
  if (clinicIdNum.value != null) patientStore.toggleFavoriteClinic(clinicIdNum.value)
}

const { data: doctorsData } = await useFetch(() => `/api/doctors?clinicId=${id.value}`, {
  default: () => ({ doctors: [] }),
})
const { data: methodsData } = await useFetch(() => `/api/articles?clinicId=${id.value}`, {
  default: () => ({ methods: [] }),
})

const doctors = computed(() => doctorsData.value?.doctors ?? [])
const clinicMethods = computed(() => methodsData.value?.methods ?? [])

const clinicAddress = computed(() => {
  const c = clinic.value
  if (!c) return ''
  return `${c.name}, ${c.city}`
})

useHead({
  title: clinic.value ? `${clinic.value.name} — AntiOnko` : 'Клиника — AntiOnko',
})
</script>
