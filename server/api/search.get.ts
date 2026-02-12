import articlesData from '../data/articles.json'
import clinicsData from '../data/clinics.json'

interface Method {
  slug: string
  title: string
  date: string
  topic: string
  tags?: string[]
  body?: string
  treatmentMethod?: boolean
  clinicId?: number
  clinicIds?: number[]
  [key: string]: unknown
}

interface Clinic {
  id: number
  name: string
  city: string
  lat?: number
  lng?: number
  services?: string[]
  tags?: string[]
  [key: string]: unknown
}

function matchQuery(text: string, q: string): boolean {
  if (!text || !q) return false
  const lower = text.toLowerCase()
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return terms.every((term) => lower.includes(term))
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const q = (query.q as string)?.trim()
  if (!q) {
    return { methods: [], clinics: [] }
  }

  const methods: Method[] = (articlesData.articles || []).filter(
    (a: Method) => a.treatmentMethod === true,
  )
  const clinics: Clinic[] = clinicsData.clinics || []

  const methodResults = methods.filter((m: Method) => {
    const title = (m.title || '').toString()
    const topic = (m.topic || '').toString()
    const body = (m.body || '').toString()
    const tags = (m.tags || []).join(' ')
    return matchQuery(`${title} ${topic} ${body} ${tags}`, q)
  })

  const clinicResults = clinics.filter((c: Clinic) => {
    const name = (c.name || '').toString()
    const city = (c.city || '').toString()
    const services = (c.services || []).join(' ')
    const tags = (c.tags || []).join(' ')
    return matchQuery(`${name} ${city} ${services} ${tags}`, q)
  })

  return { methods: methodResults, clinics: clinicResults }
})
