# AntiOnko — онко-платформа (MVP)

Оценка рисков, рекомендации и клиники для жителей Петрозаводска и Карелии.

## Стек

- **Framework:** Nuxt 3 (SSR + API routes)
- **UI:** TailwindCSS, Heroicons-style
- **State:** Pinia + localStorage
- **Charts:** Chart.js
- **Maps:** Leaflet (OpenStreetMap)

## Запуск

```bash
npm i
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Если появляется ошибка `#internal/nuxt/paths is not defined`: очистите кэш и пересоберите типы: `rm -rf .nuxt .output node_modules/.cache && npx nuxi prepare && npm run dev`. В проекте добавлены обходной конфиг (`experimental.payloadExtraction`) и shim в `package.json` для разрешения этого алиаса.

## Деплой

### Vercel

1. Зайдите на [vercel.com](https://vercel.com), войдите через GitHub.
2. **Add New** → **Project** → выберите репозиторий **m1omania/med**.
3. Оставьте авто-определение (Vercel подхватит Nuxt):  
   Build Command: `nuxt build`, Output — по умолчанию.
4. При желании в **Environment Variables** добавьте `HF_API_KEY` (пока можно пустым).
5. Нажмите **Deploy**. После сборки получите ссылку вида `med-xxx.vercel.app`.

### Render

1. Зайдите на [render.com](https://render.com), войдите через GitHub.
2. **New** → **Web Service**.
3. Подключите репозиторий **m1omania/med**.
4. Настройки:
   - **Environment:** Node.
   - **Build Command:** `npm ci && npm run build`.
   - **Start Command:** `node .output/server/index.mjs`.
5. В **Environment** добавьте при необходимости переменную `HF_API_KEY`.
6. **Create Web Service**. После деплоя получите ссылку вида `antionko.onrender.com`.

## Кейсы

- **Кейс 1 — риск рак печени:** Главная → Начать опрос → Quiz (возраст 45, М, симптомы: усталость+боль+пот, локализация: печень) → Результаты (график рисков, методы, клиники) → Клиники → Сохранить в дашборд.
- **Кейс 2 — рак груди:** Симптомы: уплотнение, в семье у мамы → Результаты: маммография, Herceptin, клиники маммологии.
- **Кейс 3 — общий скрининг:** Без симптомов → профилактика + новости.

## Структура

- `pages/` — маршруты (index, quiz, results/[id], clinics, dashboard, login, register, subscribe)
- `components/` — QuizWizard, ResultsCard, ClinicCard, SymptomSelector, DashboardTimeline, NotificationToast
- `stores/patient.ts` — состояние опроса и результатов
- `server/api/` — quiz.post, clinics.get, methods.get
- `public/data/` — clinics.json, methods.json

## SEO

Meta-теги: «онкология Петрозаводск», описание платформы.

---

*Информация не заменяет консультацию врача.*
