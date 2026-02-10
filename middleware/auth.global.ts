export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return
  const patientStore = usePatientStore()
  patientStore.hydrateFromStorage()
  const protectedPaths = ['/dashboard', '/settings']
  const isProtected = protectedPaths.some((p) => to.path.startsWith(p))
  if (isProtected && !patientStore.isLoggedIn) {
    return navigateTo('/login')
  }
})
