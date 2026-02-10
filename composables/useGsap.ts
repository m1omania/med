export function useGsap() {
  const { $gsap } = useNuxtApp()
  return $gsap as typeof import('gsap')
}
