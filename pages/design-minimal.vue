<template>
  <div class="minimal-design min-h-screen bg-white text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
    <!-- Clean Header (Embedded for this version) -->
    <header class="py-12 px-6 max-w-7xl mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="text-2xl font-bold tracking-tight">AntiOnko<span class="text-emerald-500">.</span></NuxtLink>
      <div class="flex gap-8 text-sm font-medium text-zinc-500">
        <NuxtLink to="/methods" class="hover:text-zinc-900 transition-colors">Методы</NuxtLink>
        <NuxtLink to="/clinics" class="hover:text-zinc-900 transition-colors">Клиники</NuxtLink>
        <NuxtLink to="/community" class="hover:text-zinc-900 transition-colors">Сообщество</NuxtLink>
      </div>
    </header>

    <!-- Hero: Centered and Empathetic -->
    <section class="pt-20 pb-40 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h1 ref="titleRef" class="text-5xl md:text-7xl font-bold tracking-tight mb-8">
           Спокойствие через <br/>
           <span class="text-emerald-600">понимание</span>
        </h1>
        <p ref="descRef" class="text-xl text-zinc-500 mb-12 leading-relaxed">
          Простой и анонимный способ получить проверенную информацию о методах лечения и ведущих специалистах. Мы поможем сориентироваться.
        </p>
        <div class="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-100/50">
          <img src="/images/minimal_hero.png" alt="Minimal Hero" class="w-full h-64 md:h-96 object-cover" />
        </div>
        <div ref="ctaRef" class="flex flex-col items-center gap-6">
          <NuxtLink
            to="/quiz"
            class="px-12 py-5 bg-emerald-600 text-white font-bold text-lg rounded-2xl hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-200 transition-all transform hover:-translate-y-1"
            @click="startQuizFromScratch"
          >
            Начать бесплатный опрос
          </NuxtLink>
          <p class="text-sm text-zinc-400">Занимает всего 3-5 минут</p>
        </div>
      </div>
    </section>

    <!-- Minimal Cards -->
    <section class="py-32 bg-zinc-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-3 gap-16">
          <div v-for="feature in minimalFeatures" :key="feature.title" class="text-center md:text-left">
            <div class="w-12 h-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mb-6 shadow-sm mx-auto md:mx-0">
               <AppIcon :name="feature.icon" class="text-emerald-500 w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold mb-4">{{ feature.title }}</h3>
            <p class="text-zinc-500 leading-relaxed text-sm">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats: Barebone -->
    <section class="py-32 border-b border-zinc-100">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-wrap justify-between gap-12">
           <div v-for="stat in minimalStats" :key="stat.label">
             <p class="text-4xl font-bold mb-1">{{ stat.value }}</p>
             <p class="text-zinc-400 text-sm font-medium">{{ stat.label }}</p>
           </div>
        </div>
      </div>
    </section>

    <!-- Latest Publications: Clean List -->
    <section class="py-32 max-w-4xl mx-auto px-6">
      <div class="flex items-center justify-between mb-16">
        <h2 class="text-2xl font-bold">Актуальные методы</h2>
        <NuxtLink to="/methods" class="text-emerald-600 font-bold text-sm hover:underline">См. все</NuxtLink>
      </div>
      
      <div class="divide-y divide-zinc-100">
        <div v-for="item in latestMethods" :key="item.slug" class="py-8 group cursor-pointer">
           <div class="flex justify-between items-center">
             <div>
               <p class="text-xs text-zinc-400 mb-2 font-medium">{{ new Date(item.date).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', year: 'numeric' }) }}</p>
               <h4 class="text-xl font-bold group-hover:text-emerald-600 transition-colors">{{ item.title }}</h4>
             </div>
             <AppIcon name="arrow-right" class="text-zinc-200 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
           </div>
        </div>
      </div>
    </section>

    <!-- Specialized Help: Focus on Person -->
    <section class="py-32 bg-zinc-900 text-white rounded-[4rem] mx-4 mb-4 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-20 items-center">
           <div>
              <h2 class="text-3xl md:text-5xl font-bold mb-8 leading-tight">Ведущие специалисты на связи</h2>
              <p class="text-zinc-400 text-lg mb-12">Мы отобрали лучших врачей, готовых помочь вам на основе результатов вашего скрининга.</p>
              
              <div v-if="carouselDoctor" class="p-8 bg-zinc-800 rounded-3xl border border-zinc-700">
                 <div class="flex items-center gap-6 mb-8">
                   <div class="w-20 h-20 rounded-2xl bg-zinc-700 overflow-hidden shrink-0">
                     <img v-if="carouselDoctor.photo" :src="carouselDoctor.photo" :alt="carouselDoctor.name" class="w-full h-full object-cover" />
                     <div v-else class="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-500">
                       {{ doctorInitials(carouselDoctor) }}
                     </div>
                   </div>
                   <div>
                     <p class="text-emerald-400 text-xs font-bold uppercase mb-1">{{ carouselDoctor.specialty }}</p>
                     <h4 class="text-2xl font-bold">{{ carouselDoctor.name }}</h4>
                   </div>
                 </div>
                 <p class="text-zinc-400 italic mb-8">"{{ doctorEducationText(carouselDoctor) }}"</p>
                 <div class="flex gap-4">
                    <button @click="prevDoctor" class="p-3 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-all">
                      <AppIcon name="arrow-left" size="sm" />
                    </button>
                    <button @click="nextDoctor" class="p-3 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-all text-emerald-400">
                      <AppIcon name="arrow-right" size="sm" />
                    </button>
                 </div>
              </div>
           </div>
           
           <div class="relative hidden lg:block">
              <div class="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full"></div>
              <div class="relative aspect-square bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center p-20">
                 <div class="text-center">
                    <p class="text-6xl font-bold mb-4">{{ stats?.doctors || '24' }}</p>
                    <p class="text-zinc-500 uppercase font-bold tracking-widest text-sm">Проверенных <br/> специалистов</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>

    <!-- Simple Footer -->
    <footer class="py-20 text-center border-t border-zinc-100">
        <p class="text-zinc-400 text-sm mb-4">© 2026 AntiOnko. С заботой о вашем времени.</p>
        <NuxtLink to="/about" class="text-zinc-600 font-medium hover:text-emerald-600 transition-colors">О проекте</NuxtLink>
    </footer>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

function startQuizFromScratch() {
  patientStore.resetQuiz()
}

// Data fetching
const { data: stats } = await useFetch<{ requests: number; methods: number; clinics: number; doctors: number }>('/api/stats')
const { data: methodsData } = await useFetch<{ methods: any[] }>('/api/articles')
const { data: doctorsData } = await useFetch<{ doctors: any[] }>('/api/doctors')

// State
const carouselDoctorIndex = ref(0)
const titleRef = ref(null)
const descRef = ref(null)
const ctaRef = ref(null)

// Static Data
const minimalFeatures = [
  { icon: 'search', title: 'Умный опрос', desc: 'Алгоритм адаптируется под ваши ответы, исключая лишние вопросы.' },
  { icon: 'search', title: 'База клиник', desc: 'Мы собрали информацию о лучших онкоцентрах и их специализации.' },
  { icon: 'search', title: 'Всегда анонимно', desc: 'Ваши данные используются только для формирования рекомендаций.' }
]

const minimalStats = computed(() => [
  { label: 'Пациентов прошли скрининг', value: stats.value?.requests.toLocaleString() || '1200' },
  { label: 'Актуальных методик', value: stats.value?.methods || '0' },
  { label: 'Медицинских центров', value: stats.value?.clinics || '0' }
])

// Computed
const latestMethods = computed(() => {
  const list = methodsData.value?.methods ?? []
  return list.sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5)
})

const carouselDoctor = computed(() => {
  const list = doctorsData.value?.doctors ?? []
  return list[carouselDoctorIndex.value] ?? null
})

// Navigation
function nextDoctor() {
  const count = doctorsData.value?.doctors?.length ?? 1
  carouselDoctorIndex.value = (carouselDoctorIndex.value + 1) % count
}

function prevDoctor() {
  const count = doctorsData.value?.doctors?.length ?? 1
  carouselDoctorIndex.value = (carouselDoctorIndex.value - 1 + count) % count
}

function doctorEducationText(doctor: any) {
  const bio = doctor?.bio
  if (!Array.isArray(bio) || !bio.length) return 'Ведущий онколог-практик'
  return bio[0].title
}

function doctorInitials(doctor: any) {
  const name = doctor?.name ?? ''
  const parts = String(name).split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

onMounted(() => {
  const gsap = useGsap()
  gsap.from(titleRef.value, { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out' })
  gsap.from(descRef.value, { opacity: 0, y: 20, duration: 1, delay: 0.3, ease: 'power3.out' })
  gsap.from(ctaRef.value, { opacity: 0, y: 15, duration: 0.8, delay: 0.6, ease: 'power3.out' })
})

useHead({
  title: 'AntiOnko Minimal — Простота и ясность',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap' }
  ]
})
</script>

<style scoped>
.minimal-design {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>
