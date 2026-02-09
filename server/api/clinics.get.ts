import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const slug = query.slug as string | undefined
  let clinics: Record<string, unknown>[] = []
  try {
    const path = join(process.cwd(), 'public', 'data', 'clinics.json')
    const raw = readFileSync(path, 'utf-8')
    const data = JSON.parse(raw)
    clinics = data.clinics || []
  } catch (_) {
    clinics = [
      { id: 1, name: 'Респ. больница №1 Петрозаводск', city: 'Петрозаводск', lat: 61.78, lng: 34.35, services: ['УЗИ', 'КТ'], doctor: 'Иванов И.И.', tags: ['pechen'] },
      { id: 2, name: 'Городская больница', city: 'Петрозаводск', lat: 61.79, lng: 34.36, services: ['УЗИ', 'Маммография'], tags: ['grudi'] },
    ]
  }
  if (slug && slug !== 'all') {
    clinics = clinics.filter((c: { tags?: string[] }) =>
      c.tags?.some((t: string) => t.toLowerCase().includes(slug)),
    )
    if (clinics.length === 0) {
      // return all for slug if no tags match
      try {
        const path = join(process.cwd(), 'public', 'data', 'clinics.json')
        const raw = readFileSync(path, 'utf-8')
        clinics = JSON.parse(raw).clinics || clinics
      } catch (_) {}
    }
  }
  return { clinics }
})
