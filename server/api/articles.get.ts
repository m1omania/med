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
  doctorId?: number
  [key: string]: unknown
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
    methods = methods.filter((a) => a.clinicId === clinicId)
  }
  if (doctorId != null && !Number.isNaN(doctorId)) {
    methods = methods.filter((a) => a.doctorId === doctorId)
  }
  return { methods }
})
