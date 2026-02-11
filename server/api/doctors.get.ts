import data from '../data/doctors.json'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const clinicId = query.clinicId ? Number(query.clinicId) : undefined
  let doctors: Record<string, unknown>[] = data.doctors || []
  if (clinicId) {
    doctors = doctors.filter((d: { clinicId?: number }) => d.clinicId === clinicId)
  }
  return { doctors }
})
