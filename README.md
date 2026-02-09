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

## Деплой (Vercel)

1. Подключите репозиторий к Vercel.
2. Build: `nuxt build`, Output: `.output/public` (или авто-определение Nuxt).
3. В настройках добавьте env: `HF_API_KEY` (пока можно оставить пустым).

Рекомендуется использовать встроенную поддержку Nuxt в Vercel (авто-определение).

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
