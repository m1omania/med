<template>
  <div class="bg-white rounded-xl border border-calming-200 overflow-hidden flex flex-col" style="min-height: 320px; max-height: 420px;">
    <div class="px-4 py-3 border-b border-calming-200 bg-calming-50 flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
      <h2 class="text-lg font-semibold text-calming-800">Чат с ИИ</h2>
      <span class="text-xs text-calming-500">(мок)</span>
    </div>
    <div ref="messagesRef" class="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="flex"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[85%] rounded-2xl px-3 py-2"
          :class="msg.role === 'user' ? 'bg-calming-600 text-white' : 'bg-calming-100 text-calming-800'"
        >
          <p class="whitespace-pre-wrap">{{ msg.text }}</p>
        </div>
      </div>
      <div v-if="loading" class="flex justify-start">
        <div class="rounded-2xl px-3 py-2 bg-calming-100 text-calming-600">
          <span class="inline-flex gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-calming-400 animate-pulse" />
            <span class="w-1.5 h-1.5 rounded-full bg-calming-400 animate-pulse" style="animation-delay: 0.2s" />
            <span class="w-1.5 h-1.5 rounded-full bg-calming-400 animate-pulse" style="animation-delay: 0.4s" />
          </span>
        </div>
      </div>
    </div>
    <form class="p-3 border-t border-calming-200" @submit.prevent="send">
      <div class="flex gap-2">
        <input
          v-model="inputText"
          type="text"
          placeholder="Напишите сообщение..."
          class="flex-1 rounded-lg border border-calming-300 px-3 py-2 text-sm focus:border-calming-500 focus:outline-none focus:ring-1 focus:ring-calming-500"
          :disabled="loading"
        />
        <button
          type="submit"
          class="px-4 py-2 rounded-lg bg-calming-600 text-white text-sm font-medium hover:bg-calming-700 disabled:opacity-50 shrink-0"
          :disabled="loading || !inputText.trim()"
        >
          Отправить
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const messages = ref<{ role: 'user' | 'assistant'; text: string }[]>([
  {
    role: 'assistant',
    text: 'Привет! Я помощник AntiOnko. Пока я работаю в тестовом режиме. Можете спросить про план действий, анализы или напоминания — отвечу примерным текстом.',
  },
])

const inputText = ref('')
const loading = ref(false)
const messagesRef = ref<HTMLElement | null>(null)

const mockReplies = [
  'Это моковый ответ. Реальный ИИ будет подключён позже — он поможет с вопросами по вашему плану и анализам.',
  'Учитывая ваш план, рекомендую обсудить следующий шаг с лечащим врачом. В дашборде можно отслеживать напоминания и симптомы.',
  'По результатам опроса ваш маршрут уже отображается в блоке «Ваш план». Если нужно, могу подсказать, на что обратить внимание перед визитом.',
  'Запись симптомов и веса в трекере помогает врачу. Продолжайте фиксировать данные — они пригодятся на приёме.',
]

function getMockReply(_userMessage: string): string {
  const i = Math.floor(Math.random() * mockReplies.length)
  return mockReplies[i]
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

function send() {
  const text = inputText.value.trim()
  if (!text || loading.value) return
  messages.value.push({ role: 'user', text })
  inputText.value = ''
  scrollToBottom()
  loading.value = true
  setTimeout(() => {
    messages.value.push({ role: 'assistant', text: getMockReply(text) })
    loading.value = false
    scrollToBottom()
  }, 800 + Math.random() * 700)
}
</script>
