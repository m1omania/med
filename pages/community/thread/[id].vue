<template>
  <div class="py-8 px-4 max-w-3xl mx-auto">
    <NuxtLink to="/community" class="text-calming-600 hover:underline mb-4 inline-flex items-center gap-1">
      <AppIcon name="arrow-left" size="sm" /> К сообществу
    </NuxtLink>

    <div v-if="pending" class="flex justify-center py-12">
      <span class="h-8 w-8 rounded-full border-2 border-calming-600 border-t-transparent animate-spin" aria-hidden="true" />
    </div>

    <template v-else-if="thread">
      <article class="space-y-6">
        <header class="pb-4 border-b border-calming-200">
          <h1 class="text-xl font-bold text-calming-900">{{ thread.title }}</h1>
          <p class="text-sm text-calming-500 mt-2">
            {{ thread.author }} · {{ formatDate(thread.date) }} · {{ replyCount }} ответов
          </p>
        </header>

        <div class="space-y-6">
          <section
            v-for="(post, idx) in posts"
            :key="post.id"
            class="rounded-xl bg-white border border-calming-100 p-4"
            :class="{ 'ring-1 ring-calming-200': idx === 0 }"
          >
            <p class="text-sm font-medium text-calming-800">{{ post.author }}</p>
            <p class="text-xs text-calming-500 mt-0.5">{{ formatDateTime(post.date) }}</p>
            <p class="text-calming-700 mt-3 leading-relaxed whitespace-pre-wrap">{{ post.body }}</p>
          </section>
        </div>

        <!-- Форма ответа -->
        <section class="rounded-xl bg-white border border-calming-100 p-5 mt-8">
          <h2 class="text-sm font-semibold text-calming-800 uppercase tracking-wider mb-4">Оставить сообщение</h2>
          <form @submit.prevent="onSubmit" class="space-y-4">
            <div>
              <label for="reply-author" class="block text-sm font-medium text-calming-700 mb-1">Имя или псевдоним</label>
              <input
                id="reply-author"
                v-model="replyAuthor"
                type="text"
                placeholder="Как к вам обращаться"
                class="w-full rounded-lg border border-calming-200 px-3 py-2 text-calming-900 placeholder-calming-400 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
              />
            </div>
            <div>
              <label for="reply-body" class="block text-sm font-medium text-calming-700 mb-1">Сообщение</label>
              <textarea
                id="reply-body"
                v-model="replyBody"
                rows="4"
                placeholder="Напишите ваш ответ..."
                required
                class="w-full rounded-lg border border-calming-200 px-3 py-2 text-calming-900 placeholder-calming-400 focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500 resize-y min-h-[100px]"
              />
            </div>
            <button
              type="submit"
              :disabled="sending || !replyBody.trim()"
              class="px-4 py-2.5 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {{ sending ? 'Отправка...' : 'Отправить' }}
            </button>
          </form>
        </section>
      </article>
    </template>

    <p v-else class="text-calming-600">Обсуждение не найдено.</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const patientStore = usePatientStore()

const {
  getThread,
  getPosts,
  getRepliesCount,
  addReply,
  forumData,
} = useForum()

const thread = computed(() => getThread(id))
const posts = computed(() => getPosts(id))
const replyCount = computed(() => getRepliesCount(id))
const pending = computed(() => !forumData.value)

const replyAuthor = ref('')
const replyBody = ref('')
const sending = ref(false)

onMounted(() => {
  const name = patientStore.user?.name
  const email = patientStore.user?.email
  if (name) replyAuthor.value = name
  else if (email) replyAuthor.value = email.split('@')[0] || ''
})

function onSubmit () {
  const body = replyBody.value.trim()
  if (!body || !thread.value) return
  sending.value = true
  addReply(id, replyAuthor.value, body)
  replyBody.value = ''
  sending.value = false
}

function formatDate (d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const mi = parseInt(m || '0', 10) - 1
  return `${day}.${months[mi] ?? m} ${y}`
}

function formatDateTime (iso: string) {
  if (!iso) return ''
  try {
    const date = new Date(iso)
    const d = date.getDate()
    const m = date.getMonth() + 1
    const y = date.getFullYear()
    const h = date.getHours()
    const min = date.getMinutes()
    return `${d}.${m}.${y} ${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
  } catch {
    return iso
  }
}

useHead({
  title: thread.value ? `${thread.value.title} — Сообщество` : 'Обсуждение — AntiOnko',
})
</script>
