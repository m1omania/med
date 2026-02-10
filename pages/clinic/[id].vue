<template>
  <div class="py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <NuxtLink to="/clinics" class="text-calming-600 hover:underline mb-4 inline-flex items-center gap-1">
        <AppIcon name="arrow-left" size="sm" /> Все клиники
      </NuxtLink>
      <div v-if="clinic" class="space-y-8">
        <div class="bg-white rounded-2xl border border-calming-200 overflow-hidden flex flex-col lg:flex-row">
          <div class="p-6 lg:w-80 xl:w-96 shrink-0 flex flex-col gap-6">
            <div>
              <h1 class="text-2xl font-bold text-calming-900">{{ clinic.name }}</h1>
              <p class="text-calming-600 mt-1">{{ clinic.city }}</p>
              <div v-if="clinic.services?.length" class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="s in clinic.services"
                  :key="s"
                  class="text-sm px-3 py-1 rounded-lg bg-calming-100 text-calming-700"
                >
                  {{ s }}
                </span>
              </div>
            </div>

            <div>
              <h2 class="text-xs font-semibold text-calming-500 uppercase tracking-wider mb-2">Режим работы</h2>
              <ul class="text-sm text-calming-700 space-y-1">
                <li>Пн – Чт 9:00 – 19:00</li>
                <li>Пт 9:00 – 18:00</li>
                <li class="text-red-600">Сб – Вс по записи</li>
              </ul>
            </div>

            <NuxtLink
              to="#doctors"
              class="inline-flex items-center justify-center py-3 px-6 rounded-xl bg-calming-600 text-white text-sm font-semibold hover:bg-calming-700 transition w-full"
            >
              Записаться на приём
            </NuxtLink>
          </div>

          <div
            v-if="clinic.lat != null && clinic.lng != null"
            class="flex-1 min-h-[16rem] lg:min-h-0 lg:min-w-[18rem] border-t lg:border-t-0 lg:border-l border-calming-200"
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

        <section v-if="clinicMethods.length" class="space-y-4">
          <h2 class="text-xl font-bold text-calming-900">Методы лечения</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink
              v-for="m in clinicMethods"
              :key="m.slug"
              :to="`/methods/${m.slug}`"
              class="block rounded-xl border-2 border-calming-200 bg-white p-4 hover:border-calming-400 hover:bg-calming-50/50 transition"
            >
              <p class="font-semibold text-calming-900 line-clamp-2">{{ stripEmojis(m.title) }}</p>
              <p v-if="m.date" class="text-sm text-calming-500 mt-2">{{ m.date }}</p>
              <span class="mt-3 inline-flex items-center gap-1 text-sm text-calming-600 font-medium">
                К методу
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </span>
            </NuxtLink>
          </div>
        </section>
        <div id="doctors">
          <section v-if="doctors.length" class="space-y-4">
            <h2 class="text-xl font-bold text-calming-900">Врачи клиники</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DoctorClinicCard
                v-for="(d, i) in doctors"
                :key="d.id"
                :doctor="d"
                :address="clinicAddress"
                :distance="doctorDistance(i)"
                :selected="selectedDoctorId === d.id"
                :show-book-icon="i === 0"
                @add="onAddDoctor(d)"
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
const { stripEmojis } = useStripEmojis()

const { data: clinic } = await useFetch(() => `/api/clinics/${id.value}`, {
  default: () => null,
})

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

function doctorDistance(index: number) {
  const km = (0.5 + index * 0.2).toFixed(1)
  return `${km} км`
}

const patientStore = usePatientStore()
const selectedDoctorId = computed(() => patientStore.myDoctorId)

function onAddDoctor(doctor: { id: number }) {
  const isSelected = selectedDoctorId.value === doctor.id
  patientStore.setMyDoctorId(isSelected ? null : doctor.id)
}

useHead({
  title: clinic.value ? `${clinic.value.name} — AntiOnko` : 'Клиника — AntiOnko',
})
</script>
