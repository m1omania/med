import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) return null
  let doctors: Record<string, unknown>[] = []
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'doctors.json')
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    doctors = data.doctors || []
  } catch (_) {
    return null
  }
  const doctor = doctors.find((d: { id?: number }) => d.id === id)
  return doctor || null
})
