import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler(() => {
  try {
    const path = join(process.cwd(), 'public', 'data', 'disease-types.json')
    const raw = readFileSync(path, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { categories: [] }
  }
})
