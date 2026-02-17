import data from '../../data/news.json'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
  const list = (data as { news: { slug: string }[] }).news ?? []
  const item = list.find((n) => n.slug === slug)
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'News not found' })
  }
  return item
})
