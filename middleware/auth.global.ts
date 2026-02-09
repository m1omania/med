export default defineNuxtRouteMiddleware((to) => {
  const patientStore = usePatientStore()
  const protectedPaths = ['/dashboard']
  const isProtected = protectedPaths.some((p) => to.path.startsWith(p))
  if (isProtected && !patientStore.isLoggedIn && import.meta.client) {
    return navigateTo('/login')
  }
})
