<template>
  <Teleport to="body">
    <div
      v-show="modelValue"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
      @click.self="close"
    >
      <div
        class="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-prompt-title"
      >
        <h2 id="register-prompt-title" class="text-lg font-semibold text-calming-900 mb-2">
          Регистрация
        </h2>
        <p class="text-calming-600 text-sm mb-4">
          Чтобы сохранять в избранное, зарегистрируйтесь. Это бесплатно и анонимно.
        </p>
        <div class="flex gap-3">
          <NuxtLink
            :to="registerLink"
            class="flex-1 inline-flex justify-center items-center py-2.5 rounded-lg bg-calming-600 text-white text-sm font-medium hover:bg-calming-700 transition"
            @click="close"
          >
            Регистрация
          </NuxtLink>
          <button
            type="button"
            class="px-4 py-2.5 rounded-lg border border-calming-300 text-calming-700 text-sm font-medium hover:bg-calming-50 transition"
            @click="close"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const route = useRoute()
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const registerLink = computed(() => {
  const path = route.fullPath
  if (path === '/register' || path === '/login') return '/register'
  return `/register?redirect=${encodeURIComponent(path)}`
})

function close() {
  emit('update:modelValue', false)
}
</script>
