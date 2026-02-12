<template>
  <div class="py-8 px-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-2">Мои методы</h1>
    <p class="text-calming-600 text-sm mb-8">Избранные методы лечения</p>

    <div v-if="favoriteMethods.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <MethodCard
        v-for="m in favoriteMethods"
        :key="m.slug"
        :method="m"
        :clinic="getClinicForMethod(m)"
      />
    </div>
    <div v-else class="space-y-4">
      <p class="text-calming-600">
        Пока нет избранных методов. Добавляйте методы в избранное на странице метода.
      </p>
      <NuxtLink
        to="/methods"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-calming-600 text-white font-medium hover:bg-calming-700 transition"
      >
        Методы лечения
        <AppIcon name="arrow-right" size="sm" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Method {
  slug: string
  title: string
  date: string
  topic: string
  clinicId?: number
  clinicIds?: number[]
}

interface Clinic {
  id: number
  name: string
  city: string
}

const patientStore = usePatientStore()
const { data: methodsData } = await useFetch<{ methods: Method[] }>('/api/articles')
const { data: clinicsData } = await useFetch<{ clinics: Clinic[] }>('/api/clinics')

const clinicsMap = computed(() => {
  const list = clinicsData.value?.clinics ?? []
  return Object.fromEntries(list.map((c) => [c.id, c]))
})

function getClinicForMethod(method: Method): Clinic | undefined {
  const id = (method.clinicIds && method.clinicIds[0]) ?? method.clinicId
  if (id == null) return undefined
  return clinicsMap.value[id]
}

const allMethods = computed(() => methodsData.value?.methods ?? [])
const favoriteMethods = computed(() => {
  const slugs = patientStore.favoriteMethodSlugs
  const bySlug = Object.fromEntries(allMethods.value.map((m) => [m.slug, m]))
  return slugs.map((s) => bySlug[s]).filter(Boolean)
})

useHead({
  title: 'Мои методы — AntiOnko',
})
</script>
