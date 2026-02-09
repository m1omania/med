import { defineStore } from 'pinia'

export interface QuizData {
  step: number
  age?: number
  gender?: string
  symptoms?: string[]
  localization?: string
  familyHistory?: string
  lifestyle?: string[]
  extra?: Record<string, unknown>
}

export interface ResultSummary {
  id: string
  risks: Record<string, number>
  recommendations: string[]
  methods: { name: string; slug?: string; type: string }[]
  clinics: { id: number; name: string; city: string; services?: string[] }[]
  primaryRisk?: { slug: string; label: string }
  createdAt: string
}

export const usePatientStore = defineStore('patient', {
  state: () => ({
    quizData: null as QuizData | null,
    results: [] as ResultSummary[],
    lastResultId: null as string | null,
    user: null as { email: string } | null,
  }),

  getters: {
    isLoggedIn(): boolean {
      return !!this.user
    },
    getResultById: (state) => (id: string) => {
      return state.results.find((r) => r.id === id)
    },
  },

  actions: {
    setQuizData(data: Partial<QuizData>) {
      if (!this.quizData) this.quizData = { step: 0 }
      this.quizData = { ...this.quizData, ...data }
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_quiz', JSON.stringify(this.quizData))
        } catch (_) {}
      }
    },

    setLastResultId(id: string) {
      this.lastResultId = id
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_last_result', id)
        } catch (_) {}
      }
    },

    addResult(result: ResultSummary) {
      if (!this.results.find((r) => r.id === result.id)) {
        this.results.push(result)
      }
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_results', JSON.stringify(this.results))
        } catch (_) {}
      }
    },

    login(credentials: { email: string; password?: string }) {
      this.user = { email: credentials.email }
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_user', JSON.stringify(this.user))
        } catch (_) {}
      }
    },

    logout() {
      this.user = null
      if (import.meta.client) {
        try {
          localStorage.removeItem('antionko_user')
        } catch (_) {}
      }
    },

    hydrateFromStorage() {
      if (import.meta.client) {
        try {
          const quiz = localStorage.getItem('antionko_quiz')
          if (quiz) this.quizData = JSON.parse(quiz)
          const last = localStorage.getItem('antionko_last_result')
          if (last) this.lastResultId = last
          const res = localStorage.getItem('antionko_results')
          if (res) this.results = JSON.parse(res)
          const user = localStorage.getItem('antionko_user')
          if (user) this.user = JSON.parse(user)
        } catch (_) {}
      }
    },
  },
})
