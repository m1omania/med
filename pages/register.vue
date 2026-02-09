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
      <div>
        <label class="block text-sm font-medium text-calming-700 mb-1">Пароль</label>
        <input
          v-model="password"
          type="password"
          required
          minlength="6"
          class="w-full rounded-lg border border-calming-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        class="w-full py-3 rounded-lg bg-calming-600 text-white font-medium hover:bg-calming-700"
      >
        Зарегистрироваться
      </button>
    </form>
    <p class="mt-4 text-sm text-calming-600">
      Уже есть аккаунт? <NuxtLink to="/login" class="underline">Войти</NuxtLink>
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
  showToast('Регистрация успешна. Добро пожаловать!')
  router.push('/dashboard')
}

useHead({
  title: 'Регистрация — AntiOnko',
})
</script>
