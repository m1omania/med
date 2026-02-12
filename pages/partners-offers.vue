<template>
  <div class="py-8 px-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-2">Партнёры сервиса</h1>
    <p class="text-calming-600 text-sm mb-8">
      Спецпредложения, скидки и программы от партнёров AntiOnko: фарма, клиники, лаборатории, страховые, медтуризм и другие.
    </p>

    <!-- Фильтр по темам -->
    <section class="mb-8">
      <p class="text-sm font-medium text-calming-700 mb-2">Тема:</p>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition shrink-0"
          :class="selectedTag === null ? 'bg-calming-600 text-white ring-2 ring-calming-200 ring-offset-2' : 'bg-white text-calming-800 border border-calming-200 hover:bg-calming-50'"
          @click="selectedTag = null"
        >
          Все
        </button>
        <button
          v-for="cat in categories"
          :key="cat.slug"
          type="button"
          class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition shrink-0"
          :class="selectedTag === cat.slug ? 'bg-calming-600 text-white ring-2 ring-calming-200 ring-offset-2' : 'bg-white text-calming-800 border border-calming-200 hover:bg-calming-50'"
          @click="selectedTag = cat.slug"
        >
          {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- Сетка предложений -->
    <section>
      <h2 class="sr-only">Предложения партнёров</h2>
      <div v-if="filteredOffers.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PartnerOfferCard
          v-for="offer in filteredOffers"
          :key="offer.id"
          :offer="offer"
          :category-label="categoryLabelBySlug(offer.tag)"
        />
      </div>
      <p v-else class="text-calming-600">Нет предложений по выбранной теме.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Category {
  slug: string
  label: string
}

interface Offer {
  id: string
  title: string
  description: string
  tag: string
  partnerName?: string
  link?: string
  badge?: string
}

const { data } = await useFetch<{ categories: Category[]; offers: Offer[] }>('/api/partner-offers')

const categories = computed(() => data.value?.categories ?? [])
const offers = computed(() => data.value?.offers ?? [])

const selectedTag = ref<string | null>(null)

const filteredOffers = computed(() => {
  const list = offers.value
  if (selectedTag.value == null) return list
  return list.filter((o) => o.tag === selectedTag.value)
})

const categoryLabelBySlug = (slug: string) => {
  const cat = categories.value.find((c) => c.slug === slug)
  return cat?.label ?? slug
}

useHead({
  title: 'Партнёры сервиса — AntiOnko',
  meta: [{ name: 'description', content: 'Спецпредложения и скидки от партнёров: фарма, клиники, лаборатории, страховые, медтуризм.' }],
})
</script>
