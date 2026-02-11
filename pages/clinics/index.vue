<template>
  <div class="py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-calming-900 mb-6">Клиники</h1>
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <select
          v-model="city"
          class="rounded-lg border border-calming-300 px-3 py-2 text-sm"
        >
          <option value="">Все города</option>
          <option value="Петрозаводск">Петрозаводск</option>
          <option value="Москва">Москва</option>
          <option value="Санкт-Петербург">Санкт-Петербург</option>
        </select>
        <select
          v-model="service"
          class="rounded-lg border border-calming-300 px-3 py-2 text-sm"
        >
          <option value="">Все услуги</option>
          <option value="УЗИ">УЗИ</option>
          <option value="КТ">КТ</option>
          <option value="МРТ">МРТ</option>
          <option value="Маммография">Маммография</option>
        </select>
        <div class="ml-auto flex rounded-lg border border-calming-300 p-0.5 bg-calming-100">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-md transition"
            :class="viewMode === 'list' ? 'bg-white text-calming-900 shadow-sm' : 'text-calming-600 hover:text-calming-900'"
            @click="viewMode = 'list'"
          >
            Список
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-md transition"
            :class="viewMode === 'map' ? 'bg-white text-calming-900 shadow-sm' : 'text-calming-600 hover:text-calming-900'"
            @click="viewMode = 'map'"
          >
            Карта
          </button>
        </div>
      </div>
      <div v-if="viewMode === 'list'" class="grid md:grid-cols-2 gap-6">
        <ClinicCard
          v-for="c in filteredClinics"
          :key="c.id"
          :clinic="c"
          slug="all"
        />
      </div>
      <div v-else class="h-[28rem] rounded-xl overflow-hidden border border-neutral-200 bg-calming-50">
        <ClientOnly>
          <ClinicsMap :key="mapKey" :clinics="filteredClinics" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const city = ref('')
const service = ref('')
const viewMode = ref<'list' | 'map'>('list')

const { data: clinics } = await useFetch<ClinicsResponse>('/api/clinics', {
  default: () => ({ clinics: [] }),
})

const filteredClinics = computed(() => {
  const list = clinics.value?.clinics ?? []
  return list.filter((c) => {
    if (city.value && c.city !== city.value) return false
    if (service.value && !c.services?.includes(service.value)) return false
    return true
  })
})

const mapKey = computed(() => filteredClinics.value.map((c) => c.id).join(','))


useHead({
  title: 'Клиники — AntiOnko',
})

interface ClinicsResponse {
  clinics: Clinic[]
}

interface Clinic {
  id: number
  name: string
  city: string
  lat?: number
  lng?: number
  services?: string[]
  doctor?: string
}
</script>
