<template>
  <div class="py-8 px-4 max-w-3xl mx-auto">
    <NuxtLink to="/results" class="text-calming-600 hover:underline mb-4 inline-block">
      ← К результатам
    </NuxtLink>
    <div v-if="method" class="bg-white rounded-xl border border-calming-200 p-6">
      <h1 class="text-2xl font-bold text-calming-900">{{ method.name }}</h1>
      <p class="text-calming-600 text-sm">Тип: {{ method.type }}, источник: {{ method.source }}</p>
      <p class="mt-2">Эффективность по данным: {{ method.success }}%</p>
      <p class="mt-2 text-calming-700">{{ method.description || 'Метод применяется в современных протоколах лечения.' }}</p>
    </div>
    <p v-else class="text-calming-600">Метод не найден.</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: methodsData } = await useFetch<{ methods: MethodRecord[] }>('/api/methods', {
  default: () => ({ methods: [] }),
})

const method = computed(() =>
  methodsData.value?.methods?.find((m) => m.slug === slug || m.name.toLowerCase().includes(slug)),
)

useHead({
  title: method.value ? `${method.value.name} — AntiOnko` : 'Метод — AntiOnko',
})

interface MethodRecord {
  slug?: string
  name: string
  type: string
  success: number
  source: string
  description?: string
}
</script>
