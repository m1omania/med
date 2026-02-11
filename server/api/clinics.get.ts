import data from '../data/clinics.json'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const slug = query.slug as string | undefined
  const idsParam = (query.ids as string)?.trim()
  const ids = idsParam ? idsParam.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n) && n > 0) : null
  let clinics: Record<string, unknown>[] = data.clinics || []
  if (ids?.length) {
    const set = new Set(ids)
    clinics = clinics.filter((c: { id?: number }) => c.id != null && set.has(c.id))
  } else if (slug && slug !== 'all') {
    clinics = clinics.filter((c: { tags?: string[] }) =>
      c.tags?.some((t: string) => t.toLowerCase().includes(slug)),
    )
  }
  return { clinics }
})
