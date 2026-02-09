<template>
  <div class="py-12 px-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-calming-900 mb-6">Вход</h1>
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
      <div>
        <label class="block text-sm font-medium text-calming-700 mb-1">Пароль</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full rounded-lg border border-calming-300 px-3 py-2"
        />
      </div>
      <p class="text-sm text-calming-500">2FA: заглушка (введите любой код при запросе).</p>
      <button
        type="submit"
        class="w-full py-3 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700"
      >
        Войти
      </button>
    </form>
    <p class="mt-4 text-sm text-calming-600">
      Нет аккаунта? <NuxtLink to="/register" class="underline">Регистрация</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const router = useRouter()
const patientStore = usePatientStore()
const { showToast } = useToast()

function onSubmit() {
  patientStore.login({ email: email.value, password: password.value })
  showToast('Вход выполнен.')
  router.push('/dashboard')
}

useHead({
  title: 'Вход — AntiOnko',
})
</script>
