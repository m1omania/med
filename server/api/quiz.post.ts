import { nanoid } from 'nanoid'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

interface QuizBody {
  age?: number
  gender?: string
  symptoms?: string[]
  localization?: string
  familyHistory?: string
  lifestyle?: string[]
}

// Mock AI: map symptoms + localization to risks and recommendations (Qwen/HF later)
function mockAnalyze(body: QuizBody) {
  const risks: Record<string, number> = {}
  const recommendations: string[] = []
  let primaryRisk: { slug: string; label: string } | undefined

  const hasLiver = body.localization === 'pechen' || (body.symptoms?.includes('Усталость') && body.symptoms?.includes('Боль'))
  const hasBreast = body.localization === 'grudi' || body.symptoms?.includes('Уплотнение') || body.familyHistory === 'mother'
  const general = body.localization === 'obshiy' || (!hasLiver && !hasBreast)

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
  if (general && Object.keys(risks).length === 0) {
    risks['Общий скрининг'] = 30
    primaryRisk = { slug: 'obshiy', label: 'Общий' }
    recommendations.push('Профилактический осмотр', 'Читайте новости о скрининге')
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
  if (methods.length === 0) {
    methods.push({ name: 'Скрининг ОМС', slug: 'screening', type: 'профилактика' })
  }

  const clinics = getClinicsForSlug(primaryRisk?.slug || 'obshiy')

  return {
    id: nanoid(10),
    risks,
    recommendations,
    methods,
    clinics,
    primaryRisk,
  }
}

function getClinicsForSlug(slug: string): { id: number; name: string; city: string; services?: string[] }[] {
  let list: { id: number; name: string; city: string; services?: string[]; tags?: string[] }[] = []
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'clinics.json')
    const raw = readFileSync(filePath, 'utf-8')
    list = JSON.parse(raw).clinics || []
  } catch (_) {
    list = [
      { id: 1, name: 'Респ. больница №1 Петрозаводск', city: 'Петрозаводск', services: ['УЗИ', 'КТ'] },
      { id: 2, name: 'Городская больница', city: 'Петрозаводск', services: ['УЗИ', 'Маммография'] },
    ]
  }
  if (slug === 'obshiy') return list.slice(0, 5)
  const filtered = list.filter((c: { tags?: string[] }) => c.tags?.some((t: string) => t.toLowerCase().includes(slug)))
  return filtered.length ? filtered : list.slice(0, 3)
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as QuizBody
  const result = mockAnalyze(body || {})
  return result
})
