import gsap from 'gsap'

export function useGsap() {
  const nuxtApp = useNuxtApp()
  const injected = nuxtApp.$gsap as typeof gsap | undefined
  return injected ?? gsap
}
