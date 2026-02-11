import articlesData from '../data/articles.json'
import clinicsData from '../data/clinics.json'
import doctorsData from '../data/doctors.json'

export default defineEventHandler(() => {
  const clinicsCount = (clinicsData.clinics || []).length
  const doctorsCount = (doctorsData.doctors || []).length
  const methodsCount = (articlesData.articles || []).filter(
    (a: { treatmentMethod?: boolean }) => a.treatmentMethod === true
  ).length
  const requests = 2847
  const users = 891
  return {
    requests,
    users,
    methods: methodsCount,
    clinics: clinicsCount,
    doctors: doctorsCount,
  }
})
