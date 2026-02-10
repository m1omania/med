declare module '#app' {
  interface NuxtApp {
    $gsap: import('gsap').default
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $gsap: import('gsap').default
  }
}

export {}
