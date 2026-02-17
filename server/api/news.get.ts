import data from '../data/news.json'

export default defineEventHandler(() => {
  const list = (data as { news: unknown[] }).news ?? []
  const sorted = [...list].sort((a: { date?: string }, b: { date?: string }) =>
    (b.date || '').localeCompare(a.date || '')
  )
  return { news: sorted }
})
