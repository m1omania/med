<template>
  <article class="bg-white rounded-2xl overflow-hidden shadow-sm">
    <div class="flex flex-col lg:flex-row">
      <!-- Левая колонка: фото, контакты, карта, часы, отзывы -->
      <aside class="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-calming-50/50 p-6 flex flex-col gap-6">
        <div class="flex flex-col items-center">
          <div
            class="w-52 h-52 sm:w-64 sm:h-64 rounded-2xl overflow-hidden bg-calming-200 flex items-center justify-center text-5xl font-semibold text-calming-600 shrink-0"
          >
            <img
              v-if="photoSrc"
              :src="photoSrc"
              :alt="doctor.name"
              class="w-full h-full object-cover"
            >
            <span v-else>{{ initials }}</span>
          </div>
        </div>

        <NuxtLink
          v-if="clinic?.id"
          :to="`/clinic/${clinic.id}`"
          class="w-full py-3 rounded-xl bg-calming-600 text-white text-sm font-semibold hover:bg-calming-700 transition text-center"
        >
          Записаться на приём
        </NuxtLink>
        <span
          v-else
          class="w-full py-3 rounded-xl bg-calming-200 text-calming-600 text-sm font-medium text-center block"
        >
          Запись в клинике
        </span>

        <div class="rounded-xl overflow-hidden border border-neutral-200 bg-calming-100 min-h-[8rem]">
          <ClientOnly>
            <ClinicMap
              :lat="mapLat"
              :lng="mapLng"
              :name="mapName"
              compact
            />
            <template #fallback>
              <div class="w-full h-32 flex items-center justify-center text-calming-500 text-sm bg-calming-50">
                Загрузка карты…
              </div>
            </template>
          </ClientOnly>
        </div>

        <div v-if="clinic">
          <h3 class="text-xs font-semibold text-calming-500 uppercase tracking-wider mb-2">Работает в</h3>
          <NuxtLink
            v-if="clinic.id"
            :to="`/clinic/${clinic.id}`"
            class="text-sm font-medium text-calming-700 hover:underline"
          >
            {{ clinic.name }}{{ clinic.city ? `, ${clinic.city}` : '' }}
          </NuxtLink>
          <span v-else class="text-sm text-calming-700">{{ clinic.name }}{{ clinic.city ? `, ${clinic.city}` : '' }}</span>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-calming-500 uppercase tracking-wider mb-2">Режим работы</h3>
          <ul class="text-sm text-calming-700 space-y-1">
            <li>Пн – Чт 9:00 – 19:00</li>
            <li>Пт 9:00 – 18:00</li>
            <li class="text-red-600">Сб – Вс по записи</li>
          </ul>
        </div>
      </aside>

      <!-- Правая колонка: шапка, табы, основная информация -->
      <div class="flex-1 min-w-0 flex flex-col">
        <div class="p-6 flex-1">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-calming-900">{{ doctor.name }}</h1>
            <p class="text-calming-600 mt-0.5">{{ doctor.specialty }}</p>
            <div class="flex items-center gap-1 mt-2" aria-label="Рейтинг {{ doctor.rating }} из 5">
              <span
                v-for="i in 5"
                :key="i"
                class="text-amber-400"
                :class="i <= Math.round(doctor.rating) ? 'opacity-100' : 'opacity-30'"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </span>
              <span class="text-sm text-calming-500 ml-1">{{ doctor.rating }}/5</span>
            </div>
          </div>

          <section class="mb-6">
            <h2 class="text-sm font-semibold text-calming-800 uppercase tracking-wide mb-3">Образование и подготовка</h2>
            <ul class="space-y-3">
              <li
                v-for="(item, i) in doctor.bio"
                :key="i"
                class="flex gap-3 text-calming-700"
              >
                <span class="shrink-0 w-6 h-6 rounded-full bg-calming-100 flex items-center justify-center text-calming-600 mt-0.5">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.996.996 0 011.174.019l1.068 1.069a1 1 0 01.557.31l4.456 1.986a1 1 0 00.738-.084l6.5-2.5a1 1 0 000-1.838l-7-3z" />
                  </svg>
                </span>
                <div>
                  <p class="font-medium text-calming-900">{{ item.title }}</p>
                  <p class="text-sm text-calming-600">{{ item.institution }}</p>
                  <p class="text-xs text-calming-500">{{ item.years }}</p>
                </div>
              </li>
            </ul>
          </section>

          <section class="mb-6">
            <h2 class="text-sm font-semibold text-calming-800 uppercase tracking-wide mb-2">Принимает</h2>
            <p class="text-sm text-calming-700">ОМС, ДМС (уточняйте в регистратуре клиники)</p>
          </section>

          <section class="mb-6">
            <h2 class="text-sm font-semibold text-calming-800 uppercase tracking-wide mb-2">Языки</h2>
            <p class="text-sm text-calming-700">Русский</p>
          </section>

          <section v-if="methods?.length" class="space-y-3">
            <h2 class="text-sm font-semibold text-calming-800 uppercase tracking-wide">Методы лечения</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NuxtLink
                v-for="m in methods"
                :key="m.slug"
                :to="`/methods/${m.slug}`"
                class="block rounded-xl bg-white p-4 transition hover:shadow-lg hover:scale-[1.02]"
              >
                <p class="font-semibold text-calming-900 line-clamp-2 text-sm">{{ stripEmojis(m.title) }}</p>
                <p v-if="m.date" class="text-xs text-calming-500 mt-1.5">{{ m.date }}</p>
                <span class="mt-2 inline-flex items-center gap-1 text-xs text-calming-600 font-medium">
                  К методу
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </span>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const { stripEmojis } = useStripEmojis()
const props = withDefaults(
  defineProps<{
    doctor: {
      id?: number
      name: string
      specialty: string
      experience?: string
      experienceDetail?: string
      rating: number
      photo?: string
      bio: { title: string; institution: string; years: string }[]
    }
    clinic?: {
      id: number
      name: string
      city: string
      lat?: number
      lng?: number
    } | null
    methods?: { slug: string; title: string; date?: string }[]
  }>(),
  { clinic: () => null, methods: () => [] }
)

const photoSrc = computed(() => {
  const p = props.doctor?.photo
  if (!p || typeof p !== 'string') return ''
  try {
    const parts = p.split('/')
    const file = parts.pop()
    if (!file) return p
    const base = parts.join('/')
    return base ? `${base}/${encodeURIComponent(file)}` : encodeURIComponent(file)
  } catch {
    return p
  }
})

const initials = computed(() => {
  const name = props.doctor?.name ?? ''
  const parts = String(name).split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] ?? '') + (parts[1][0] ?? '')
  return String(name).slice(0, 2).toUpperCase()
})

const mapLat = computed(() => props.clinic?.lat ?? 55.751)
const mapLng = computed(() => props.clinic?.lng ?? 37.618)
const mapName = computed(() => props.clinic?.name ?? 'Клиника')
</script>
