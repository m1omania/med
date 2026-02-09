export default defineNuxtPlugin(() => {
  const store = usePatientStore()
  store.hydrateFromStorage()
})
