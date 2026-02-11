import data from '../data/clinics.json'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const slug = (query.slug as string)?.trim()
  const city = (query.city as string)?.trim()
  const idsParam = (query.ids as string)?.trim()
  const ids = idsParam ? idsParam.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n) && n > 0) : null
  let clinics: Record<string, unknown>[] = data.clinics || []
  if (ids?.length) {
    const set = new Set(ids)
    clinics = clinics.filter((c: { id?: number }) => c.id != null && set.has(c.id))
  } else if (slug && slug !== 'all') {
    if (slug === 'obshiy' || slug === 'kishechnik') {
      clinics = clinics.slice(0, 8)
    } else {
      const bySlug = clinics.filter((c: { tags?: string[] }) =>
        c.tags?.some((t: string) => t.toLowerCase().includes(slug)),
      )
      clinics = bySlug.length ? bySlug : clinics.slice(0, 5)
    }
  }
  if (city) {
    const inCity = clinics.filter((c: { city?: string }) => (c.city as string) === city)
    if (inCity.length > 0) clinics = inCity
  }
  return { clinics }
})
