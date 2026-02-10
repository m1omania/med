import { nanoid } from 'nanoid'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

interface QuizBody {
  age?: number
  gender?: string
  symptoms?: string[]
  localization?: string
  geography?: string
  familyHistory?: string
  lifestyle?: string[]
  stage?: string
  treatmentPlan?: string[]
}

// Mock AI: map symptoms + localization to risks and recommendations (Qwen/HF later)
function mockAnalyze(body: QuizBody) {
  const risks: Record<string, number> = {}
  const recommendations: string[] = []
  let primaryRisk: { slug: string; label: string } | undefined

  const hasLiver = body.localization === 'pechen' || (body.symptoms?.includes('Усталость') && body.symptoms?.includes('Боль'))
  const hasBreast = body.localization === 'grudi' || body.symptoms?.includes('Уплотнение') || body.familyHistory === 'mother'
  const hasIntestine = body.localization === 'kishechnik'
  const general = body.localization === 'obshiy' || (!hasLiver && !hasBreast && !hasIntestine)

  if (hasLiver) {
    risks['Печень'] = 80
    risks['Общий'] = 20
    primaryRisk = { slug: 'pechen', label: 'Печень' }
    recommendations.push('УЗИ печени и биохимия', 'Консультация онколога-гепатолога', 'Иммунотерапия при показаниях')
  }
  if (hasBreast) {
    risks['Молочные железы'] = 75
    risks['Общий'] = 25
    if (!primaryRisk) primaryRisk = { slug: 'grudi', label: 'Маммология' }
    recommendations.push('Маммография / УЗИ молочных желёз', 'Консультация маммолога', 'Таргетная терапия (Herceptin при показаниях)')
  }
  if (hasIntestine) {
    risks['Кишечник'] = 70
    risks['Общий'] = 30
    if (!primaryRisk) primaryRisk = { slug: 'kishechnik', label: 'Кишечник' }
    recommendations.push('Колоноскопия (скрининг колоректального рака)', 'Консультация гастроэнтеролога или онколога', 'При показаниях — эндоскопия и гистология')
  }
  if (general && Object.keys(risks).length === 0) {
    risks['Общий скрининг'] = 30
    primaryRisk = { slug: 'obshiy', label: 'Общий' }
    recommendations.push('Профилактический осмотр', 'Изучите методы скрининга')
  }
  if (Object.keys(risks).length === 0) {
    risks['Общий'] = 20
    primaryRisk = { slug: 'obshiy', label: 'Общий' }
    recommendations.push('Рекомендуем пройти опрос с указанием симптомов для точной оценки.')
  }

  // Methods from onguide.ru style
  const methods: { name: string; slug: string; type: string }[] = []
  if (hasLiver) {
    methods.push({ name: 'Ленватиниб', slug: 'lenvatinib', type: 'таргет' })
    methods.push({ name: 'Пембролизумаб', slug: 'pembrolizumab', type: 'иммуно' })
  }
  if (hasBreast) {
    methods.push({ name: 'Трастузумаб (Herceptin)', slug: 'herceptin', type: 'таргет' })
    methods.push({ name: 'Маммотест', slug: 'mammotest', type: 'диагностика' })
  }
  if (hasIntestine) {
    methods.push({ name: 'Колоноскопия', slug: 'colonoscopy', type: 'диагностика' })
    methods.push({ name: 'Скрининг колоректального рака', slug: 'screening', type: 'профилактика' })
  }
  if (methods.length === 0) {
    methods.push({ name: 'Скрининг ОМС', slug: 'screening', type: 'профилактика' })
  }

  const clinics = getClinicsForSlug(primaryRisk?.slug || 'obshiy', body.geography)

  return {
    id: nanoid(10),
    risks,
    recommendations,
    methods,
    clinics,
    primaryRisk,
    geography: body.geography || undefined,
    age: body.age,
    gender: body.gender,
    localization: body.localization,
    diagnosisStatus: 'По результатам опроса',
    stage: body.stage,
    plan: body.treatmentPlan ?? [],
  }
}

function getClinicsForSlug(slug: string, city?: string): { id: number; name: string; city: string; services?: string[] }[] {
  let list: { id: number; name: string; city: string; services?: string[]; tags?: string[] }[] = []
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'clinics.json')
    const raw = readFileSync(filePath, 'utf-8')
    list = JSON.parse(raw).clinics || []
  } catch (_) {
    list = [
      { id: 1, name: 'Респ. больница №1', city: 'Город А', services: ['УЗИ', 'КТ'] },
      { id: 2, name: 'Городская больница', city: 'Город Б', services: ['УЗИ', 'Маммография'] },
    ]
  }
  if (city) {
    list = list.filter((c: { city: string }) => c.city === city)
  }
  if (slug === 'obshiy' || slug === 'kishechnik') {
    return list.slice(0, 8)
  }
  const filtered = list.filter((c: { tags?: string[] }) => c.tags?.some((t: string) => t.toLowerCase().includes(slug)))
  return filtered.length ? filtered : list.slice(0, 5)
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as QuizBody
  const result = mockAnalyze(body || {})
  return result
})
