<template>
  <div class="py-8 px-4 max-w-2xl mx-auto">
    <NuxtLink to="/community" class="text-calming-600 hover:underline mb-4 inline-flex items-center gap-1">
      <AppIcon name="arrow-left" size="sm" /> К сообществу
    </NuxtLink>

    <h1 class="text-xl font-bold text-calming-900 mb-6">Новая тема</h1>

    <div v-if="pending" class="flex justify-center py-8">
      <span class="h-8 w-8 rounded-full border-2 border-calming-600 border-t-transparent animate-spin" aria-hidden="true" />
    </div>

    <form v-else @submit.prevent="onSubmit" class="space-y-5 rounded-xl bg-white border border-calming-100 p-6">
      <div>
        <label for="new-category" class="block text-sm font-medium text-calming-700 mb-1">Категория</label>
        <select
          id="new-category"
          v-model="categoryId"
          required
          class="w-full rounded-lg border border-calming-200 px-3 py-2 text-calming-900 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
        >
          <option value="">Выберите категорию</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div>
        <label for="new-title" class="block text-sm font-medium text-calming-700 mb-1">Заголовок</label>
        <input
          id="new-title"
          v-model="title"
          type="text"
          required
          maxlength="200"
          placeholder="Кратко о чём тема"
          class="w-full rounded-lg border border-calming-200 px-3 py-2 text-calming-900 placeholder-calming-400 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
        />
        <p class="text-xs text-calming-500 mt-1">{{ title.length }}/200</p>
      </div>
      <div>
        <label for="new-body" class="block text-sm font-medium text-calming-700 mb-1">Сообщение</label>
        <textarea
          id="new-body"
          v-model="body"
          rows="6"
          required
          placeholder="Опишите вопрос или тему обсуждения..."
          class="w-full rounded-lg border border-calming-200 px-3 py-2 text-calming-900 placeholder-calming-400 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500 resize-y min-h-[120px]"
        />
      </div>
      <div>
        <label for="new-author" class="block text-sm font-medium text-calming-700 mb-1">Имя или псевдоним</label>
        <input
          id="new-author"
          v-model="author"
          type="text"
          placeholder="Как к вам обращаться"
          class="w-full rounded-lg border border-calming-200 px-3 py-2 text-calming-900 placeholder-calming-400 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
        />
      </div>
      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="sending"
          class="px-4 py-2.5 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700 disabled:opacity-50 transition"
        >
          {{ sending ? 'Создание...' : 'Создать тему' }}
        </button>
        <NuxtLink
          to="/community"
          class="px-4 py-2.5 rounded-lg border border-calming-200 text-calming-700 font-medium hover:bg-calming-50 transition"
        >
          Отмена
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const patientStore = usePatientStore()

const {
  categories,
  addThread,
  forumData,
} = useForum()

const pending = computed(() => !forumData.value)
const categoryId = ref('')
const title = ref('')
const body = ref('')
const author = ref('')
const sending = ref(false)

onMounted(() => {
  const name = patientStore.user?.name
  const email = patientStore.user?.email
  if (name) author.value = name
  else if (email) author.value = email.split('@')[0] || ''
})

function onSubmit () {
  const cat = categoryId.value
  const t = title.value.trim()
  const b = body.value.trim()
  if (!cat || !t || !b) return
  sending.value = true
  const threadId = addThread(cat, t, b, author.value)
  sending.value = false
  router.push(`/community/thread/${threadId}`)
}

useHead({
  title: 'Новая тема — Сообщество',
})
</script>
