import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(() => {
  let methods: { slug?: string; name: string; type: string; success: number; source: string; description?: string }[] = []
  try {
    const path = join(process.cwd(), 'public', 'data', 'methods.json')
    const raw = readFileSync(path, 'utf-8')
    const data = JSON.parse(raw)
    methods = data.methods || []
  } catch (_) {
    methods = [
      { name: 'Ленватиниб', slug: 'lenvatinib', type: 'печень', success: 70, source: 'onguide.ru' },
      { name: 'Пембролизумаб', slug: 'pembrolizumab', type: 'иммуно', success: 65, source: 'onguide.ru' },
      { name: 'Трастузумаб (Herceptin)', slug: 'herceptin', type: 'грудь', success: 75, source: 'onguide.ru' },
    ]
  }
  return { methods }
})
