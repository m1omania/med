<template>
  <div class="premium-design bg-[#fdfcf7] min-h-screen text-[#0d2e27] font-sans">
    <!-- Navigation (Inspired by Healink) -->
    <nav class="fixed top-0 left-0 right-0 z-[1200] px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-[#e5e7eb]">
      <div class="flex items-center gap-12">
        <NuxtLink to="/" class="text-2xl font-bold tracking-tight text-[#0d2e27]">
          AntiOnko<span class="text-[#054a3e]">.</span>
        </NuxtLink>
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-[#4b5563]">
          <NuxtLink to="/methods" class="hover:text-[#054a3e] transition-colors">Методы</NuxtLink>
          <NuxtLink to="/clinics" class="hover:text-[#054a3e] transition-colors">Клиники</NuxtLink>
          <NuxtLink to="/community" class="hover:text-[#054a3e] transition-colors">Сообщество</NuxtLink>
          <NuxtLink to="/about" class="hover:text-[#054a3e] transition-colors">О проекте</NuxtLink>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink to="/login" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-black text-sm font-medium rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
          <AppIcon name="user-male" class="w-5 h-5 text-blue-600 shrink-0" />
          Войти
        </NuxtLink>
        <NuxtLink to="/quiz" class="px-6 py-2 text-sm font-semibold rounded-full bg-[#111827] text-white hover:bg-[#1f2937] transition-all">
          Начать опрос
        </NuxtLink>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-32 pb-20 px-6">
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto mb-32">
        <div class="relative rounded-[40px] bg-[#054a3e] overflow-hidden min-h-[700px] flex items-center">
          <!-- Background Pattern / Noise -->
          <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"></div>
          
          <div class="container mx-auto px-12 grid lg:grid-cols-2 items-center gap-12 py-20">
            <div class="z-10 text-white">
              <div class="flex items-center gap-3 mb-6">
                <!-- Mini Avatars -->
                <div class="flex -space-x-2">
                  <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-2 border-[#054a3e] bg-slate-200 overflow-hidden">
                    <img :src="`https://i.pravatar.cc/100?img=${i+10}`" alt="user" />
                  </div>
                  <div class="w-8 h-8 rounded-full border-2 border-[#054a3e] bg-[#111827] flex items-center justify-center text-[10px] font-bold">
                    +
                  </div>
                </div>
              </div>
              
              <h1 class="text-6xl md:text-7xl font-serif leading-[1.1] mb-8">
                Надёжный <span class="italic font-light opacity-80">онко-</span><br />
                скрининг и поддержка
              </h1>
              
              <p class="text-lg opacity-80 mb-12 max-w-lg leading-relaxed">
                Доступ к верифицированным методам лечения, подбору клиник и поддержке экспертов — в одном месте.
              </p>
              
              <NuxtLink 
                to="/quiz" 
                class="inline-flex items-center px-10 py-5 bg-[#054a3e] border border-white/20 rounded-full text-white font-bold hover:bg-white hover:text-[#054a3e] transition-all duration-300 shadow-xl"
              >
                Пройти опрос
              </NuxtLink>

              <!-- Features list floating -->
              <div class="mt-16 space-y-6">
                <div v-for="feat in ['Верифицированные методы', 'Клиники по вашему региону', 'Только проверенные специалисты']" :key="feat" class="flex items-center gap-4 group">
                  <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <div class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span class="font-medium tracking-wide opacity-90">{{ feat }}</span>
                </div>
              </div>
            </div>

            <!-- Hero Image Panel -->
            <div class="relative z-10 flex justify-center lg:justify-end">
              <div class="relative w-full max-w-md aspect-[4/5] bg-white/5 backdrop-blur-sm rounded-[3rem] overflow-hidden border border-white/10 p-2 shadow-2xl">
                <div class="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-100 flex items-center justify-center">
                   <!-- This will be the generated doctor image -->
                   <img src="/images/premium_hero.png" alt="Doctor" class="w-full h-full object-cover" @error="(e) => (e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop')" />
                </div>
                <!-- Mini Floating Thumbnails -->
                <div class="absolute bottom-6 left-6 right-6 flex items-center gap-3">
                   <div v-for="j in 4" :key="j" class="w-16 h-20 rounded-xl bg-white/10 backdrop-blur-md overflow-hidden border border-white/20">
                     <img :src="`https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=200&auto=format&fit=crop`" class="w-full h-full object-cover grayscale opacity-60" />
                   </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Waveform overlay (Visual Decor) -->
          <div class="absolute bottom-0 left-0 right-0 p-12 pointer-events-none opacity-40">
             <div class="flex items-end justify-center gap-1 h-12">
               <div v-for="b in 40" :key="b" class="w-1 bg-white/30 rounded-full" :style="{ height: `${Math.random() * 100}%` }"></div>
             </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-40">
        <div v-for="stat in stats" :key="stat.label" class="p-10 rounded-[32px] bg-white border border-[#f3f4f6] shadow-sm hover:shadow-xl transition-all group">
          <p class="text-5xl font-serif text-[#054a3e] mb-2 group-hover:scale-110 transition-transform origin-left">{{ stat.value }}</p>
          <p class="text-sm font-bold text-[#6b7280] uppercase tracking-widest">{{ stat.label }}</p>
        </div>
      </section>

      <!-- Team Section -->
      <section class="max-w-7xl mx-auto mb-40">
        <div class="flex justify-between items-end mb-16">
          <h2 class="text-5xl font-serif max-w-md">Наша команда специалистов</h2>
          <NuxtLink to="/clinics" class="text-[#054a3e] font-bold border-b-2 border-[#054a3e] pb-1 hover:opacity-70 transition-opacity">Все клиники и врачи</NuxtLink>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="doc in team" :key="doc.name" class="space-y-4 group">
            <div class="aspect-[3/4] rounded-[24px] overflow-hidden bg-slate-100 relative shadow-md">
              <img :src="doc.image" :alt="doc.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div>
              <h3 class="font-serif text-xl">{{ doc.name }}</h3>
              <p class="text-sm text-[#6b7280]">{{ doc.role }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="max-w-5xl mx-auto mb-40">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-serif mb-4">Часто задаваемые <span class="italic font-light opacity-60">вопросы</span></h2>
        </div>
        <div class="space-y-4">
          <div v-for="(q, idx) in faqs" :key="idx" class="rounded-3xl border border-[#e5e7eb] overflow-hidden transition-all" :class="activeFaq === idx ? 'bg-[#054a3e] text-white' : 'bg-[#fdfcf7]'">
            <button @click="activeFaq = idx" class="w-full px-8 py-6 flex items-center justify-between text-left">
              <span class="text-lg font-medium">{{ idx + 1 }}. {{ q.question }}</span>
              <span class="text-2xl">{{ activeFaq === idx ? '−' : '+' }}</span>
            </button>
            <div v-if="activeFaq === idx" class="px-8 pb-8 opacity-80 leading-relaxed">
              {{ q.answer }}
            </div>
          </div>
        </div>
      </section>

      <!-- Feedback Section -->
      <section class="max-w-7xl mx-auto mb-20 bg-[#f3f4f6] rounded-[40px] p-20 grid lg:grid-cols-2 gap-20 items-center">
        <div>
           <h2 class="text-5xl font-serif mb-12">Отзывы <span class="italic font-light opacity-60 text-[#054a3e]">пациентов</span></h2>
           <div class="space-y-12">
             <div class="bg-white p-10 rounded-[32px] shadow-sm relative italic text-lg leading-relaxed text-[#0d2e27]">
               «От записи до консультации — всё прошло легко. Подбор методов и клиник по результатам опроса оказался очень понятным. Наконец-то есть ощущение, что можно разобраться в ситуации, не выходя из дома».
               <div class="mt-8 flex items-center gap-4 not-italic">
                 <div class="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                   <img src="https://i.pravatar.cc/100?img=32" alt="Пользователь" />
                 </div>
                 <div>
                   <p class="font-bold">Мария К.</p>
                   <p class="text-sm text-[#6b7280]">Пользователь платформы</p>
                 </div>
               </div>
             </div>
           </div>
        </div>
        <div class="aspect-video rounded-[32px] overflow-hidden bg-slate-300 shadow-xl relative group">
          <img src="/images/premium_feedback.png" class="w-full h-full object-cover" />
          <div class="absolute inset-0 flex items-center justify-center">
             <div class="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#054a3e] shadow-2xl group-hover:scale-110 transition-transform">
               <div class="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-current border-b-[10px] border-b-transparent ml-1"></div>
             </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-[#111827] text-white pt-32 pb-12 px-6">
      <div class="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-32">
        <div class="col-span-2 space-y-8">
          <h3 class="text-3xl font-bold">AntiOnko<span class="text-[#054a3e]">.</span></h3>
          <p class="opacity-60 max-w-sm">
            Удобный подбор методов лечения и клиник по результатам опроса — в один клик.
          </p>
        </div>
        <div v-for="col in footerLinks" :key="col.title" class="space-y-6">
          <h4 class="font-bold text-sm uppercase tracking-widest opacity-40">{{ col.title }}</h4>
          <ul class="space-y-4">
            <li v-for="link in col.links" :key="link.name">
              <NuxtLink v-if="link.to" :to="link.to" class="opacity-80 hover:opacity-100 transition-opacity">{{ link.name }}</NuxtLink>
              <a v-else href="#" class="opacity-80 hover:opacity-100 transition-opacity">{{ link.name }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto pt-12 border-t border-white/10 flex justify-between items-center opacity-40 text-sm">
        <p>© 2026 AntiOnko. Информация не заменяет консультацию врача.</p>
        <div class="flex gap-8">
          <NuxtLink to="/about">О проекте</NuxtLink>
          <NuxtLink to="/partners">Для партнёров</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const stats = [
  { label: 'Точность подбора методов', value: '98%' },
  { label: 'Проверка симптомов', value: '24/7' },
  { label: 'Верифицированные методы', value: 'да' },
  { label: 'Пользователей', value: '+15k' }
]

const team = [
  { name: 'Др. Иван Петров', role: 'Онколог-терапевт', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop' },
  { name: 'Елена Смирнова', role: 'Старшая медсестра', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop' },
  { name: 'Др. Софья Козлова', role: 'Маммолог-онколог', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop' },
  { name: 'Др. Дмитрий Волков', role: 'Химиотерапевт', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop' }
]

const faqs = [
  { question: 'Как работает опрос на платформе?', answer: 'Вы отвечаете на вопросы о возрасте, симптомах, локализации и регионе. На основе ответов формируется подборка верифицированных методов лечения и клиник, релевантных вашему направлению.' },
  { question: 'Какие данные нужно указать?', answer: 'Возраст, пол, симптомы (при наличии), направление (печень, молочные железы, кишечник, лёгкие или общий скрининг), город — по желанию, для подбора клиник в вашем регионе.' },
  { question: 'Результаты заменяют консультацию врача?', answer: 'Нет. Платформа помогает сориентироваться в методах и клиниках. Окончательное решение по обследованию и лечению принимает врач.' },
  { question: 'Безопасны ли мои данные?', answer: 'Да. Данные опроса хранятся локально и анонимно. Мы не передаём вашу личную и медицинскую информацию третьим лицам.' }
]

const footerLinks = [
  { title: 'Навигация', links: [{ name: 'Методы лечения', to: '/methods' }, { name: 'Клиники', to: '/clinics' }, { name: 'Сообщество', to: '/community' }, { name: 'О проекте', to: '/about' }] },
  { title: 'Поддержка', links: [{ name: 'Опрос', to: '/quiz' }, { name: 'Партнёры', to: '/partners-offers' }, { name: 'Подписка', to: '/subscribe' }] }
]

const activeFaq = ref(0)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;600;700&display=swap');

.premium-design {
  font-family: 'Outfit', sans-serif;
}

h1, h2, h3, .font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
