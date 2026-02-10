import type { QuizData } from '~/stores/patient'

export function useQuiz() {
  const patientStore = usePatientStore()

  function getCurrentStep(): number {
    return patientStore.quizData?.step ?? 0
  }

  function setStep(step: number) {
    patientStore.setQuizData({ step })
  }

  function updateAnswers(data: Partial<QuizData>) {
    patientStore.setQuizData(data)
  }

  function getPayload() {
    return {
      age: patientStore.quizData?.age,
      gender: patientStore.quizData?.gender,
      symptoms: patientStore.quizData?.symptoms ?? [],
      localization: patientStore.quizData?.localization,
      geography: patientStore.quizData?.geography,
      familyHistory: patientStore.quizData?.familyHistory,
      lifestyle: patientStore.quizData?.lifestyle ?? [],
      ...patientStore.quizData?.extra,
    }
  }

  async function submitQuiz(payloadOverride?: Record<string, unknown>): Promise<{ id: string; risks: Record<string, number>; recommendations: string[]; methods: { name: string; slug?: string; type: string }[]; clinics: { id: number; name: string; city: string; services?: string[] }[]; primaryRisk?: { slug: string; label: string } }> {
    const payload = payloadOverride ?? getPayload()
    const res = await $fetch<{ id: string; risks: Record<string, number>; recommendations: string[]; methods: { name: string; slug?: string; type: string }[]; clinics: { id: number; name: string; city: string; services?: string[] }[]; primaryRisk?: { slug: string; label: string } }>('/api/quiz', {
      method: 'POST',
      body: payload,
    })
    return res
  }

  return {
    getCurrentStep,
    setStep,
    updateAnswers,
    getPayload,
    submitQuiz,
  }
}
