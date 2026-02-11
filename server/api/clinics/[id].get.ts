import data from '../../data/clinics.json'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) return null
  const clinics = data.clinics || []
  const clinic = clinics.find((c: { id: number }) => c.id === id)
  return clinic || null
})
