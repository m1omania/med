import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const slug = query.slug as string | undefined
  const idsParam = (query.ids as string)?.trim()
  const ids = idsParam ? idsParam.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n) && n > 0) : null
  let clinics: Record<string, unknown>[] = []
  try {
    const path = join(process.cwd(), 'public', 'data', 'clinics.json')
    const raw = readFileSync(path, 'utf-8')
    const data = JSON.parse(raw)
    clinics = data.clinics || []
  } catch (_) {
    clinics = [
      { id: 1, name: 'Респ. больница №1', city: 'Город А', lat: 61.78, lng: 34.35, services: ['УЗИ', 'КТ'], doctor: 'Иванов И.И.', tags: ['pechen'] },
      { id: 2, name: 'Городская больница', city: 'Город Б', lat: 61.79, lng: 34.36, services: ['УЗИ', 'Маммография'], tags: ['grudi'] },
    ]
  }
  if (ids?.length) {
    const set = new Set(ids)
    clinics = clinics.filter((c: { id?: number }) => c.id != null && set.has(c.id))
  } else if (slug && slug !== 'all') {
    clinics = clinics.filter((c: { tags?: string[] }) =>
      c.tags?.some((t: string) => t.toLowerCase().includes(slug)),
    )
    if (clinics.length === 0) {
      try {
        const path = join(process.cwd(), 'public', 'data', 'clinics.json')
        const raw = readFileSync(path, 'utf-8')
        clinics = JSON.parse(raw).clinics || clinics
      } catch (_) {}
    }
  }
  return { clinics }
})
