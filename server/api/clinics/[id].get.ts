import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) return null
  let clinics: { id: number; name: string; city: string; lat?: number; lng?: number; services?: string[] }[] = []
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'clinics.json')
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    clinics = data.clinics || []
  } catch (_) {
    return null
  }
  const clinic = clinics.find((c: { id: number }) => c.id === id)
  return clinic || null
})
