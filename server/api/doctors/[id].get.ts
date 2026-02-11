import data from '../../data/doctors.json'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) return null
  const doctors = data.doctors || []
  const doctor = doctors.find((d: { id?: number }) => d.id === id)
  return doctor || null
})
