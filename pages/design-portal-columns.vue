<template>
  <div class="portal-columns min-h-screen" style="background-color: #f5f5f5; font-family: 'Manrope', sans-serif;">
    <!-- Верхнее меню (липкий, при скролле наезжает на баннер и скрывает его) -->
    <header class="sticky top-0 z-50" style="background-color: #f5f5f5;">
      <div class="max-w-[1600px] mx-auto px-6 sm:px-8 h-16 flex items-center justify-between gap-4">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight shrink-0">
          <span class="text-[#0d2e27]">Anti</span><span class="text-blue-600">Onko</span>
        </NuxtLink>
        <div class="hidden sm:flex flex-1 justify-center items-center gap-4 min-w-0">
          <p class="text-slate-800 font-medium text-sm truncate">
            Подберите проверенный метод лечения онкологии
          </p>
          <NuxtLink
            to="/quizstart"
            class="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-calming-600 text-white text-sm font-semibold hover:bg-calming-700 transition-colors"
            @click="startQuizFromScratch"
          >
            Подобрать метод
            <AppIcon name="arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 border border-slate-200 text-slate-700 hover:bg-white transition-colors"
            aria-label="Поиск"
          >
            <AppIcon name="search" class="w-5 h-5 text-slate-600" />
          </button>
          <NuxtLink
            to="/login"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/90 border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:bg-white transition-colors"
          >
            <AppIcon name="user-male" class="w-5 h-5 text-blue-600 shrink-0" />
            Войти
          </NuxtLink>
        </div>
      </div>
      <div class="h-px bg-slate-200 w-full" aria-hidden="true" />
    </header>

    <div class="max-w-[1600px] mx-auto flex lg:ml-56 xl:ml-64">
      <!-- Левая колонка: фиксирована, скролл внутри колонки -->
      <aside class="hidden lg:block fixed left-0 top-16 w-56 xl:w-64 h-[calc(100vh-4rem)] overflow-y-auto z-40 px-6" style="background-color: #f5f5f5;">
        <nav class="py-4 space-y-1 text-base text-slate-700">
          <NuxtLink to="/quizstart" class="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white text-slate-700 font-medium">
            <AppIcon name="clipboard" class="text-blue-600 shrink-0 w-8 h-8" />
            Найти метод
          </NuxtLink>
          <NuxtLink to="/methods" class="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white text-slate-700">
            <AppIcon name="briefcase-medical" class="text-blue-600 shrink-0 w-8 h-8" />
            Все методы
          </NuxtLink>
          <NuxtLink to="/clinics" class="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white text-slate-700">
            <AppIcon name="hospital" class="text-blue-600 shrink-0 w-8 h-8" />
            Клиники
          </NuxtLink>
          <NuxtLink to="/community" class="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white text-slate-700">
            <AppIcon name="message-circle-heart" class="text-blue-600 shrink-0 w-8 h-8" />
            Сообщество
          </NuxtLink>
        </nav>
        <div class="pt-6 border-t border-slate-100">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Типы заболеваний</h3>
          <ul class="space-y-0.5">
            <li v-for="(cat, i) in diseaseCategories" :key="cat.slug">
              <NuxtLink
                :to="`/methods?disease=${cat.slug}`"
                class="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-white text-slate-700 text-base"
              >
                <img
                  :src="getDiseaseTypeImageUrl(i)"
                  alt=""
                  class="shrink-0 w-8 h-8 rounded-full object-cover"
                  loading="lazy"
                />
                {{ cat.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Центр: новости и методы -->
      <main class="flex-1 min-w-0 px-5 sm:px-7 pt-4 pb-8">
        <section class="mb-10">
          <article class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <!-- Шапка: иконка + Новости + стрелка -->
            <NuxtLink to="/news" class="flex items-center gap-2 px-8 pt-5 pb-4 hover:opacity-90 transition-opacity">
              <span class="font-bold text-slate-900 text-base">Новости</span>
              <svg class="w-5 h-5 text-slate-500 shrink-0 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>

            <!-- Главная новость: текст слева, картинка справа -->
            <NuxtLink v-if="featuredNews" :to="featuredNews.to" class="block px-8 pb-4 hover:bg-slate-50/50 transition-colors">
              <div class="flex gap-4">
                <div class="min-w-0 flex-1">
                  <h3 class="font-bold text-slate-900 text-2xl leading-snug mb-2 line-clamp-3">{{ featuredNews.title }}</h3>
                  <div class="flex items-center gap-3 text-lg text-slate-500">
                    <span>{{ featuredNews.timeAgo }}</span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {{ featuredNews.commentsCount }}
                    </span>
                  </div>
                </div>
                <div class="w-48 h-36 sm:w-56 sm:h-40 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                  <img
                    src="/news/image 6.png"
                    alt=""
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </NuxtLink>

            <!-- Разделитель -->
            <div class="border-t border-slate-100 mx-8" />

            <!-- Список остальных новостей -->
            <ul class="px-8 py-3 space-y-3">
              <li v-for="item in otherNews" :key="item.slug">
                <NuxtLink :to="item.to" class="block group py-1">
                  <p class="text-base text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{{ item.title }}</p>
                  <div class="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span>{{ item.timeAgo }}</span>
                    <span class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {{ item.commentsCount }}
                    </span>
                  </div>
                </NuxtLink>
              </li>
            </ul>

            <!-- Показать еще -->
            <NuxtLink to="/news" class="flex items-center justify-start gap-2 px-8 py-4 text-slate-700 font-medium text-sm hover:text-blue-600 transition-colors border-t border-slate-100">
              Показать еще
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </NuxtLink>
          </article>
        </section>

        <section>
          <template v-for="(entry, feedIndex) in mainFeed" :key="feedIndex">
            <!-- Сетка из 4 карточек метода -->
            <div v-if="entry.type === 'method-grid'" class="grid sm:grid-cols-2 gap-4">
              <NuxtLink
                v-for="(item, i) in latestMethods.slice(0, 4)"
                :key="item.slug"
                :to="`/methods/${item.slug}`"
                class="block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-md transition-all group"
              >
                <div class="aspect-video rounded-t-2xl overflow-hidden bg-slate-100">
                  <img
                    :src="getMethodImageUrl(item, i)"
                    :alt="item.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="p-4">
                  <p class="text-xs text-slate-500 mb-2">
                    {{ methodDiseaseLabel(item) }} • {{ item.date ? new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) : '' }}
                  </p>
                  <h3 class="font-semibold text-slate-900 text-lg leading-snug line-clamp-3 mb-4 group-hover:text-blue-600 transition-colors">{{ item.title }}</h3>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 text-xs text-slate-500">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        89
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                        5
                      </span>
                    </div>
                    <button type="button" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Поделиться" @click.prevent="$event.stopPropagation();">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    </button>
                  </div>
                </div>
              </NuxtLink>
            </div>

            <!-- Блок по типу болезни -->
            <article
              v-else-if="entry.type === 'disease' && entry.payload"
              :key="'disease-' + (entry.payload as { slug: string }).slug"
              class="mt-6 sm:mt-10 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div class="px-6 sm:px-8 pt-6 pb-4 flex items-center gap-3">
                <img
                  :src="getDiseaseTypeImageUrl((entry.payload as { categoryIndex: number }).categoryIndex)"
                  alt=""
                  class="shrink-0 w-8 h-8 rounded-full object-cover"
                  loading="lazy"
                />
                <h2 class="font-bold text-slate-900 text-lg sm:text-xl">
                  {{ (entry.payload as { title: string }).title }}
                </h2>
              </div>
              <div class="relative pb-6">
                <div class="flex gap-4 overflow-x-auto px-6 sm:px-8 pb-2 scroll-smooth scrollbar-thin" style="scrollbar-width: thin;">
                  <NuxtLink
                    v-for="(item, i) in (entry.payload as { methods: unknown[] }).methods"
                    :key="(item as { slug: string }).slug"
                    :to="`/methods/${(item as { slug: string }).slug}`"
                    class="shrink-0 w-[280px] sm:w-[300px] block bg-slate-50 rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-md transition-all group"
                  >
                    <div class="aspect-video rounded-t-xl overflow-hidden bg-slate-100">
                      <img
                        :src="getAlternatedImageUrl(20 + i)"
                        :alt="(item as { title: string }).title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div class="p-4">
                      <h3 class="font-semibold text-slate-900 text-base leading-snug line-clamp-3 mb-3 group-hover:text-blue-600 transition-colors">{{ (item as { title: string }).title }}</h3>
                      <div class="flex items-center gap-4 text-xs text-slate-500">
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714.211 1.412.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                          14
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          11
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                          5
                        </span>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
                <div class="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 flex justify-end pointer-events-none">
                  <span class="w-10 h-10 rounded-full bg-white/95 border border-slate-200 flex items-center justify-center shadow-sm">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </article>

            <!-- Баннер опроса (в стиле design-portal, с иконкой вместо фото) -->
            <NuxtLink
              v-else-if="entry.type === 'quiz-banner'"
              to="/quizstart"
              class="mt-6 block relative overflow-hidden rounded-3xl border border-white text-slate-700 feed-banner-spots"
            >
              <div class="absolute inset-0 feed-banner-blobs pointer-events-none">
                <span class="feed-banner-blob feed-banner-blob--1" />
                <span class="feed-banner-blob feed-banner-blob--2" />
                <span class="feed-banner-blob feed-banner-blob--3" />
                <span class="feed-banner-blob feed-banner-blob--4" />
                <span class="feed-banner-blob feed-banner-blob--5" />
              </div>
              <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px;" />
              <div class="relative z-10 px-6 sm:px-8 py-6 md:py-8 flex flex-col md:flex-row items-center gap-6">
                <div class="max-w-xl flex-1">
                  <h2 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-6">
                    Подберите проверенный метод лечения онкологии
                  </h2>
                  <span class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                    Подобрать метод
                    <AppIcon name="arrow-right" class="w-5 h-5 text-white" />
                  </span>
                </div>
                <div class="shrink-0 flex items-end justify-center gap-1 md:gap-2">
                  <img src="/assets/pil.png" alt="" class="w-20 h-20 md:w-28 md:h-28 object-contain" />
                  <img src="/assets/pil2.png" alt="" class="w-20 h-20 md:w-28 md:h-28 object-contain" />
                </div>
              </div>
            </NuxtLink>

            <!-- Один большой блок метода (featured) -->
            <NuxtLink
              v-else-if="entry.type === 'method-featured' && featuredMethodBlock"
              :to="`/methods/${featuredMethodBlock.slug}`"
              class="mt-6 block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-lg transition-all group"
            >
              <div class="p-5 sm:p-6">
                <div class="flex items-start gap-3 mb-3">
                  <span class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <AppIcon name="hospital" class="w-5 h-5 text-blue-600" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-slate-900">Метод лечения</p>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      <span>{{ featuredMethodBlock.date ? new Date(featuredMethodBlock.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) : '' }}</span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        2К
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                        {{ methodDiseaseLabel(featuredMethodBlock) }}
                      </span>
                    </div>
                  </div>
                </div>
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{{ featuredMethodBlock.title }}</h2>
              </div>
              <div class="mx-5 sm:mx-6 mb-5 sm:mb-6">
                <div class="aspect-[2/1] sm:aspect-[2.5/1] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    :src="getMethodImageUrl(featuredMethodBlock, 4)"
                    :alt="featuredMethodBlock.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-slate-100">
                <div class="flex items-center gap-5 text-sm text-slate-500">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    2К
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    16
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    18
                  </span>
                </div>
                <button type="button" class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Поделиться" @click.prevent="$event.stopPropagation();">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
              </div>
            </NuxtLink>

            <!-- Большой блок метода (из moreBigMethodBlocks) -->
            <NuxtLink
              v-else-if="entry.type === 'method-big' && entry.payload"
              :to="`/methods/${(entry.payload as { item: { slug: string } }).item.slug}`"
              class="mt-6 block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-lg transition-all group"
            >
              <div class="p-5 sm:p-6">
                <div class="flex items-start gap-3 mb-3">
                  <span class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <AppIcon name="hospital" class="w-5 h-5 text-blue-600" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-slate-900">Метод лечения</p>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      <span>{{ (entry.payload as { item: { date?: string } }).item.date ? new Date((entry.payload as { item: { date: string } }).item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) : '' }}</span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        2К
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                        {{ methodDiseaseLabel((entry.payload as { item: { tags?: string[]; forWhom?: string; title?: string; topic?: string } }).item) }}
                      </span>
                    </div>
                  </div>
                </div>
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{{ (entry.payload as { item: { title: string } }).item.title }}</h2>
              </div>
              <div class="mx-5 sm:mx-6 mb-5 sm:mb-6">
                <div class="aspect-[2/1] sm:aspect-[2.5/1] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    :src="getAlternatedImageUrl(5 + (entry.payload as { index: number }).index)"
                    :alt="(entry.payload as { item: { title: string } }).item.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-slate-100">
                <div class="flex items-center gap-5 text-sm text-slate-500">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    2К
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    16
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    18
                  </span>
                </div>
                <button type="button" class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Поделиться" @click.prevent="$event.stopPropagation();">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
              </div>
            </NuxtLink>

            <!-- Партнёрский материал -->
            <NuxtLink
              v-else-if="entry.type === 'method-partner'"
              :to="partnerMaterial.to"
              class="mt-6 block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-lg transition-all group"
            >
              <div class="p-5 sm:p-6">
                <div class="flex items-start gap-3 mb-3">
                  <span class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <AppIcon name="star" class="w-5 h-5 text-amber-600" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-slate-900">Партнёрский материал</p>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      <span>{{ partnerMaterial.date }}</span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {{ partnerMaterial.views }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                        {{ partnerMaterial.partnerName }}
                      </span>
                    </div>
                  </div>
                </div>
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{{ partnerMaterial.title }}</h2>
                <span class="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-amber-100 text-amber-800 text-sm font-medium group-hover:bg-amber-200 transition-colors">
                  Перейти
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
              <div class="mx-5 sm:mx-6 mb-5 sm:mb-6">
                <div class="aspect-[4/3] sm:aspect-[3/2] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    :src="partnerMaterial.image"
                    :alt="partnerMaterial.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-slate-100">
                <div class="flex items-center gap-5 text-sm text-slate-500">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    {{ partnerMaterial.views }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    12
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    7
                  </span>
                </div>
                <button type="button" class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Поделиться" @click.prevent="$event.stopPropagation();">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
              </div>
            </NuxtLink>
          </template>
        </section>
      </main>

      <!-- Правая колонка: скроллится вместе с центральной -->
      <aside class="hidden lg:block shrink-0 w-[360px] px-7 py-6" style="background-color: #f5f5f5;">
        <div class="space-y-6">
          <!-- У нас можно -->
          <article class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h3 class="font-semibold text-slate-900 mb-4">У нас можно</h3>
            <ul class="space-y-3 mb-4">
              <li class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <AppIcon name="star" class="w-5 h-5 text-orange-600" />
                </span>
                <span class="text-sm text-slate-800">Высказать мнение</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <AppIcon name="message-circle-plus" class="w-5 h-5 text-blue-600" />
                </span>
                <span class="text-sm text-slate-800">Задать вопрос эксперту</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <AppIcon name="building" class="w-5 h-5 text-slate-600" />
                </span>
                <span class="text-sm text-slate-800">Посоветоваться с читателями</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <AppIcon name="bell" class="w-5 h-5 text-red-600" />
                </span>
                <span class="text-sm text-slate-800">Рассказать, что беспокоит</span>
              </li>
            </ul>
            <NuxtLink to="/community" class="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">
              Все темы для постов →
            </NuxtLink>
          </article>

          <!-- Обсуждаемое -->
          <article class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h3 class="font-semibold text-slate-900 mb-4">Обсуждаемое</h3>
            <ul class="divide-y divide-slate-100">
              <li
                v-for="(thread, ti) in discussedThreads"
                :key="thread.id"
                class="py-3 first:pt-0 last:pb-0"
              >
                <NuxtLink :to="`/community/thread/${thread.id}`" class="block group">
                  <p class="text-sm text-slate-800 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {{ thread.title }}
                  </p>
                  <div class="flex items-center gap-2">
                    <div class="flex -space-x-1.5">
                      <template v-for="(av, ai) in getDiscussAvatars(thread, ti)" :key="ai">
                        <img
                          v-if="av.type === 'photo'"
                          :src="av.url"
                          alt=""
                          class="w-6 h-6 rounded-full object-cover border-2 border-white shrink-0"
                        />
                        <span
                          v-else
                          :class="[av.color, 'text-white text-xs font-semibold flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shrink-0']"
                        >
                          {{ av.letter }}
                        </span>
                      </template>
                    </div>
                    <span class="flex items-center gap-1 text-slate-500 text-sm font-medium">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {{ thread.repliesCount ?? 0 }}
                    </span>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </article>

          <!-- Баннер: диспансеризация (картинка из public/promo) -->
          <a
            href="https://takzdorovo.ru"
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              :src="promoBannerSrc"
              alt="Пройдите диспансеризацию бесплатно в своей поликлинике"
              class="w-full h-auto object-cover"
            />
          </a>

          <!-- Топ: Клиники -->
          <article class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h3 class="font-bold text-slate-900 mb-4">Клиники</h3>
            <ul class="space-y-3 mb-4">
              <li v-for="c in topClinics" :key="c.id" class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <AppIcon name="building" class="w-5 h-5 text-blue-600" />
                </span>
                <div class="min-w-0 flex-1">
                  <NuxtLink :to="`/clinics?highlight=${c.id}`" class="font-semibold text-slate-900 hover:text-blue-600 block truncate">{{ c.name }}</NuxtLink>
                  <p class="text-xs text-slate-500">{{ c.city }}</p>
                </div>
              </li>
            </ul>
            <NuxtLink to="/clinics" class="text-sm font-medium text-blue-600 hover:text-blue-700">Посмотреть все</NuxtLink>
          </article>

          <!-- Топ: Доктора -->
          <article class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h3 class="font-bold text-slate-900 mb-4">Доктора</h3>
            <ul class="space-y-3 mb-4">
              <li v-for="d in topDoctors" :key="d.id" class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                  <img v-if="d.photo" :src="d.photo" :alt="d.name" class="w-full h-full object-cover" />
                  <AppIcon v-else name="user-male" class="w-5 h-5 text-slate-600" />
                </span>
                <div class="min-w-0 flex-1">
                  <NuxtLink :to="`/doctor/${d.id}`" class="font-semibold text-slate-900 hover:text-blue-600 block truncate">{{ d.name }}</NuxtLink>
                  <p class="text-xs text-slate-500">{{ d.specialty }}</p>
                </div>
              </li>
            </ul>
            <NuxtLink to="/clinics" class="text-sm font-medium text-blue-600 hover:text-blue-700">Посмотреть все</NuxtLink>
          </article>

          <!-- Топ: Методы -->
          <article class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h3 class="font-bold text-slate-900 mb-4">Методы</h3>
            <ul class="space-y-3 mb-4">
              <li v-for="m in topMethods" :key="m.slug" class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <AppIcon name="hospital" class="w-5 h-5 text-blue-600" />
                </span>
                <div class="min-w-0 flex-1">
                  <NuxtLink :to="`/methods/${m.slug}`" class="font-semibold text-slate-900 hover:text-blue-600 block line-clamp-2">{{ m.title }}</NuxtLink>
                  <p class="text-xs text-slate-500">{{ methodDiseaseLabel(m) }}</p>
                </div>
              </li>
            </ul>
            <NuxtLink to="/methods" class="text-sm font-medium text-blue-600 hover:text-blue-700">Посмотреть все</NuxtLink>
          </article>

          <!-- Рекламный блок -->
          <article class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm overflow-hidden">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-slate-500 uppercase tracking-wider">Реклама</span>
              <NuxtLink to="/partners" class="text-xs font-medium text-blue-600 hover:text-blue-700">Разместить</NuxtLink>
            </div>
            <div class="flex gap-3 mb-4">
              <div class="w-20 h-20 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=200&auto=format&fit=crop"
                  alt=""
                  class="w-full h-full object-cover"
                />
              </div>
              <p class="text-sm text-slate-800 leading-snug line-clamp-3">
                Какие технологии нужны, чтобы избавиться от инфошума в ленте
              </p>
            </div>
            <NuxtLink
              to="/partners"
              class="block w-full py-2.5 text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              Узнать
            </NuxtLink>
          </article>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const patientStore = usePatientStore()

function startQuizFromScratch() {
  patientStore.resetQuiz()
}

const { data: diseaseData } = await useFetch<{ categories: { slug: string; title: string; keywords?: string[] }[] }>('/api/disease-types', {
  default: () => ({ categories: [] }),
})
const diseaseCategories = computed(() => diseaseData.value?.categories ?? [])

function methodMatchesCategory(
  method: { tags?: string[]; forWhom?: string; title?: string; topic?: string },
  category: { keywords?: string[] },
): boolean {
  const keywords = category.keywords ?? []
  if (!keywords.length) return false
  const searchable = [
    ...(method.tags ?? []),
    method.forWhom ?? '',
    method.title ?? '',
    method.topic ?? '',
  ]
    .join(' ')
    .toLowerCase()
  return keywords.some((kw) => searchable.includes(kw.toLowerCase()))
}

const diseaseTypeBlocks = computed(() => {
  const categories = diseaseData.value?.categories ?? []
  const methods = latestMethods.value
  const withMethods = categories
    .map((cat, index) => ({
      ...cat,
      methods: methods.filter((m) => methodMatchesCategory(m, cat)),
      categoryIndex: index,
    }))
    .filter((b) => b.methods.length > 0)
    .sort((a, b) => b.methods.length - a.methods.length)
  return withMethods.slice(0, 3)
})

const methodScreenshotFilenames = [
  'Screenshot 2026-02-17 at 04.05.52.png',
  'Screenshot 2026-02-17 at 04.06.18.png',
  'Screenshot 2026-02-17 at 04.06.54.png',
  'Screenshot 2026-02-17 at 04.07.08.png',
  'Screenshot 2026-02-17 at 04.07.21.png',
  'Screenshot 2026-02-17 at 04.08.22.png',
  'Screenshot 2026-02-17 at 04.09.03.png',
  'Screenshot 2026-02-17 at 04.09.40.png',
  'Screenshot 2026-02-17 at 04.09.49.png',
]
function getDiseaseTypeImageUrl(index: number) {
  const name = methodScreenshotFilenames[index % methodScreenshotFilenames.length]
  return `/methods/${encodeURIComponent(name)}`
}

const { data: methodsData } = await useFetch<{
  methods: { slug: string; title: string; date: string; forWhom?: string; tags?: string[]; topic?: string }[]
}>('/api/articles', { default: () => ({ methods: [] }) })
const latestMethods = computed(() => {
  const list = methodsData.value?.methods ?? []
  return list.sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 18)
})
const featuredMethodBlock = computed(() => {
  const list = latestMethods.value
  return list[4] ?? list[0] ?? null
})
const moreBigMethodBlocks = computed(() => latestMethods.value.slice(5, 14))

/** Лента: блоки методов чередуются с блоками по типу болезни через каждые 4 метода */
const mainFeed = computed(() => {
  const disease = diseaseTypeBlocks.value
  const feed: { type: 'method-grid' | 'disease' | 'method-featured' | 'method-big' | 'method-partner' | 'quiz-banner'; payload?: unknown }[] = []
  feed.push({ type: 'method-grid' })
  if (disease[0]) feed.push({ type: 'disease', payload: disease[0] })
  feed.push({ type: 'method-featured' })
  const bigBlocks = moreBigMethodBlocks.value
  bigBlocks.forEach((item, idx) => {
    feed.push({ type: 'method-big', payload: { item, index: idx } })
    if (idx === 0) feed.push({ type: 'quiz-banner' })
  })
  if (disease[1]) feed.push({ type: 'disease', payload: disease[1] })
  feed.push({ type: 'method-partner' })
  if (disease[2]) feed.push({ type: 'disease', payload: disease[2] })
  return feed
})

const { data: clinicsData } = await useFetch<{ clinics: { id: number; name: string; city: string }[] }>('/api/clinics', { default: () => ({ clinics: [] }) })
const { data: doctorsData } = await useFetch<{ doctors: { id: number; name: string; specialty: string; photo?: string }[] }>('/api/doctors', { default: () => ({ doctors: [] }) })
const topClinics = computed(() => (clinicsData.value?.clinics ?? []).slice(0, 3))
const topDoctors = computed(() => (doctorsData.value?.doctors ?? []).slice(0, 3))
const topMethods = computed(() => latestMethods.value.slice(0, 3))

const promoBannerSrc = '/promo/promo1.jpeg'

const partnerMaterial = {
  title: 'Современная таргетная терапия: как подобрать лечение под тип опухоли',
  to: '/news/partner-infoshum',
  date: '10.02',
  partnerName: 'Партнёр',
  views: '1,2К',
  image: '/doctors/Man/medium-shot-doctor-posing-studio.jpg',
}

function methodDiseaseLabel(m: { forWhom?: string; tags?: string[]; topic?: string }): string {
  if (m.forWhom?.trim()) return m.forWhom.split(',')[0].trim().split('(')[0].trim()
  if (m.tags?.length) return m.tags[0]
  if (m.topic?.trim()) return m.topic
  return 'Методы'
}
const methodImageFiles = [
  'chemist-doctor-explaining-nurse-vaccine-development-modern-equipped-laboratory-holding-test-tube-with-blood-sample 1.png',
  'colleagues-laboratory-doing-experiments 1.png',
  'medium-shot-female-chemists-wearing-masks 1.png',
  'medium-shot-scientist-holding-tube 1.png',
  'medium-shot-scientists-lab 1.png',
  'side-view-female-scientists-analyzing-substance-lab 1.png',
  'side-view-smiley-female-scientists-working-lab 1.png',
  'image 2.png',
  'image 4.png',
  'image 6.png',
]
function methodImageUrl(index: number): string {
  const name = methodImageFiles[index % methodImageFiles.length]
  return `/methods/${encodeURIComponent(name)}`
}

function getAlternatedImageUrl(index: number): string {
  const i = index >> 1
  return index % 2 === 0 ? methodImageUrl(i) : screenshotImageUrl(i)
}

const immunotherapyImageUrl = '/methods/image 4.png'
function getMethodImageUrl(method: { slug: string } | null, fallbackIndex: number): string {
  if (method?.slug === 'immunotherapy') return immunotherapyImageUrl
  return getAlternatedImageUrl(fallbackIndex)
}

const screenshotImageFiles = [
  'Screenshot 2026-02-17 at 04.05.52.png',
  'Screenshot 2026-02-17 at 04.06.18.png',
  'Screenshot 2026-02-17 at 04.06.54.png',
  'Screenshot 2026-02-17 at 04.07.08.png',
  'Screenshot 2026-02-17 at 04.07.21.png',
  'Screenshot 2026-02-17 at 04.08.22.png',
  'Screenshot 2026-02-17 at 04.09.03.png',
  'Screenshot 2026-02-17 at 04.09.40.png',
  'Screenshot 2026-02-17 at 04.09.49.png',
]
function screenshotImageUrl(index: number): string {
  const name = screenshotImageFiles[index % screenshotImageFiles.length]
  return `/methods/${encodeURIComponent(name)}`
}

const newsItems = [
  { title: 'Новые рекомендации по скринингу: что изменилось в 2026 году', date: '2026-02-13', slug: 'screening-2026', timeAgo: '11 часов назад', commentsCount: 65 },
  { title: 'Здоровье и профилактика: приоритетные направления для пациентов и врачей', date: '2026-02-12', slug: 'health-priorities', timeAgo: '9 часов назад', commentsCount: 3 },
  { title: 'Рост обращений: консультации по онкологии и скринингу стали запрашивать в разы чаще', date: '2026-02-09', slug: 'consult-growth', timeAgo: '9 часов назад', commentsCount: 14 },
  { title: 'В России выросла заболеваемость раком молочной железы: с чем это связано', date: '2026-02-08', slug: 'breast-cancer', timeAgo: '10 часов назад', commentsCount: 9 },
  { title: 'Центральный университет объявил отбор на Международную космическую олимпиаду для школьников', date: '2026-02-07', slug: 'olympiad', timeAgo: '17 часов назад', commentsCount: 3 },
]
const newsBlockItems = computed(() =>
  newsItems.map((n) => ({
    ...n,
    dateFormatted: n.date ? new Date(n.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
    to: `/news/${n.slug}`,
  }))
)
const featuredNews = computed(() => newsBlockItems.value[0])
const otherNews = computed(() => newsBlockItems.value.slice(1, 5))

const { data: forumData } = await useFetch<{
  categories: { id: string; name: string; slug: string }[]
  threads: { id: string; title: string; categoryId?: string; repliesCount?: number }[]
}>('/api/forum', { default: () => ({ categories: [], threads: [] }) })
const forumCategories = computed(() => forumData.value?.categories ?? [])
const recentThreads = computed(() => (forumData.value?.threads ?? []).slice(0, 5))
const discussedThreads = computed(() => {
  const list = (forumData.value?.threads ?? []).filter((t) => (t.repliesCount ?? 0) > 0)
  return [...list].sort((a, b) => (b.repliesCount ?? 0) - (a.repliesCount ?? 0)).slice(0, 4)
})

const avatarInitialColors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500']
function getDiscussAvatars(thread: { title: string }, threadIndex: number) {
  const doctors = doctorsData.value?.doctors ?? []
  const out: ({ type: 'photo'; url: string } | { type: 'initial'; letter: string; color: string })[] = []
  for (let i = 0; i < 3; i++) {
    if (i < 2 && doctors.length > 0) {
      const doc = doctors[(threadIndex * 2 + i) % doctors.length] as { photo?: string } | undefined
      const photo = doc?.photo
      if (photo) {
        out.push({ type: 'photo', url: photo })
        continue
      }
    }
    const letter = (thread.title?.trim()[0] ?? '?').toUpperCase()
    const color = avatarInitialColors[(threadIndex + i) % avatarInitialColors.length]
    out.push({ type: 'initial', letter, color })
  }
  return out
}

useHead({
  title: 'AntiOnko — Портал',
  meta: [{ name: 'description', content: 'Методы лечения, новости и сообщество.' }],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap' },
  ],
})
</script>

<style scoped>
.feed-banner-spots {
  background: #e0f2fe;
}
.feed-banner-shadow {
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.08), 0 10px 25px -10px rgba(0, 0, 0, 0.04);
}
.feed-banner-blobs {
  position: absolute;
  inset: 0;
}
.feed-banner-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.85;
}
.feed-banner-blob--1 {
  width: 55%;
  height: 55%;
  top: -5%;
  right: -5%;
  background: rgba(255, 255, 255, 0.9);
}
.feed-banner-blob--2 {
  width: 50%;
  height: 55%;
  bottom: -10%;
  right: -5%;
  background: rgba(134, 239, 172, 0.75);
}
.feed-banner-blob--3 {
  width: 45%;
  height: 45%;
  top: 10%;
  left: -5%;
  background: rgba(186, 230, 253, 0.8);
}
.feed-banner-blob--4 {
  width: 50%;
  height: 50%;
  bottom: -5%;
  left: 20%;
  background: rgba(94, 234, 212, 0.7);
}
.feed-banner-blob--5 {
  width: 45%;
  height: 50%;
  top: 30%;
  right: 10%;
  background: rgba(59, 130, 246, 0.6);
}
</style>
