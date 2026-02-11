import data from '../data/articles.json'

interface Method {
  slug: string
  title: string
  date: string
  topic: string
  source: { name: string; url: string }
  tags: string[]
  body: string
  treatmentMethod?: boolean
  clinicId?: number
  clinicIds?: number[]
  doctorId?: number
  [key: string]: unknown
}

function getMethodClinicIds(a: Method): number[] {
  if (Array.isArray(a.clinicIds) && a.clinicIds.length) return a.clinicIds
  if (a.clinicId != null && a.clinicId > 0) return [a.clinicId]
  return []
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const topic = (query.topic as string)?.trim()
  const clinicId = query.clinicId != null ? Number(query.clinicId) : undefined
  const doctorId = query.doctorId != null ? Number(query.doctorId) : undefined
  let methods: Method[] = (data.articles || []).filter((a: Method) => a.treatmentMethod === true)
  if (topic) {
    methods = methods.filter((a) => a.topic?.toLowerCase() === topic.toLowerCase())
  }
  if (clinicId != null && !Number.isNaN(clinicId)) {
    methods = methods.filter((a) => getMethodClinicIds(a).includes(clinicId))
  }
  if (doctorId != null && !Number.isNaN(doctorId)) {
    methods = methods.filter((a) => a.doctorId === doctorId)
  }
  return { methods }
})
