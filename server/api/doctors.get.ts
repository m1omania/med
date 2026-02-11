import data from '../data/doctors.json'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const clinicId = query.clinicId != null ? Number(query.clinicId) : undefined
  const clinicIdsRaw = (query.clinicIds as string)?.trim()
  const clinicIds = clinicIdsRaw
    ? clinicIdsRaw.split(',').map((id) => Number(id.trim())).filter((n) => !Number.isNaN(n) && n > 0)
    : undefined
  let doctors: Record<string, unknown>[] = data.doctors || []
  if (clinicIds?.length) {
    const set = new Set(clinicIds)
    doctors = doctors.filter((d: { clinicId?: number }) => d.clinicId != null && set.has(d.clinicId))
  } else if (clinicId != null && !Number.isNaN(clinicId)) {
    doctors = doctors.filter((d: { clinicId?: number }) => d.clinicId === clinicId)
  }
  return { doctors }
})
