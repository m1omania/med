import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null
  try {
    const path = join(process.cwd(), 'public', 'data', 'articles.json')
    const raw = readFileSync(path, 'utf-8')
    const data = JSON.parse(raw)
    const list = (data.articles || []).filter((a: { treatmentMethod?: boolean }) => a.treatmentMethod === true)
    const method = list.find((a: { slug: string }) => a.slug === slug)
    return method || null
  } catch (_) {
    return null
  }
})
