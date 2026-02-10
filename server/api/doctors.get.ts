import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const clinicId = query.clinicId ? Number(query.clinicId) : undefined
  let doctors: Record<string, unknown>[] = []
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'doctors.json')
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    doctors = data.doctors || []
  } catch (_) {
    return { doctors: [] }
  }
  if (clinicId) {
    doctors = doctors.filter((d: { clinicId?: number }) => d.clinicId === clinicId)
  }
  return { doctors }
})
