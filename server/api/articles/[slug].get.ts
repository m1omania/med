import data from '../../data/articles.json'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null
  const list = (data.articles || []).filter((a: { treatmentMethod?: boolean }) => a.treatmentMethod === true)
  const method = list.find((a: { slug: string }) => a.slug === slug)
  return method || null
})
