<template>
  <div class="py-12 px-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-6">Регистрация</h1>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium text-calming-700 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full rounded-lg border border-calming-300 px-3 py-2"
          placeholder="you@example.com"
        />
      </div>
      <p class="text-sm text-calming-500">Регистрация по email. Пароль не требуется (мок).</p>
      <button
        type="submit"
        class="w-full py-3 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700 disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? 'Отправка...' : 'Зарегистрироваться' }}
      </button>
    </form>
    <p class="mt-4 text-sm text-calming-600">
      Уже есть аккаунт? <NuxtLink to="/login" class="underline">Войти</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const email = ref('')
const loading = ref(false)
const patientStore = usePatientStore()
const { showToast } = useToast()

async function onSubmit() {
  if (!email.value?.trim()) return
  loading.value = true
  try {
    await $fetch('/api/register', {
      method: 'POST',
      body: { email: email.value.trim() },
    })
    patientStore.login({ email: email.value.trim() })
    showToast('Регистрация успешна. Добро пожаловать!')
    const redirect = route.query.redirect
    const path =
      typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/dashboard'
    await navigateTo(path)
  } catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'data' in e ? String((e as { data?: unknown }).data) : 'Ошибка регистрации'
    showToast(msg, 'error')
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Регистрация — AntiOnko',
})
</script>
