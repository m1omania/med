import { defineStore } from 'pinia'

export interface QuizData {
  step: number
  age?: number
  gender?: string
  symptoms?: string[]
  localization?: string
  geography?: string
  familyHistory?: string
  lifestyle?: string[]
  stage?: string
  treatmentPlan?: string[]
  extra?: Record<string, unknown>
}

export interface ResultSummary {
  id: string
  risks: Record<string, number>
  recommendations: string[]
  methods: { name: string; slug?: string; type: string }[]
  clinics: { id: number; name: string; city: string; services?: string[] }[]
  primaryRisk?: { slug: string; label: string }
  geography?: string
  age?: number
  gender?: string
  localization?: string
  diagnosisStatus?: string
  stage?: string
  plan?: string[]
  createdAt: string
}

export interface SymptomEntry {
  date: string
  weight?: number
  painLevel?: number
  note?: string
}

export interface ReminderEntry {
  id: string
  title: string
  date: string
  done: boolean
}

export interface VisitEntry {
  id: string
  title: string
  date: string
  place?: string
}

export const usePatientStore = defineStore('patient', {
  state: () => ({
    quizData: null as QuizData | null,
    results: [] as ResultSummary[],
    lastResultId: null as string | null,
    user: null as { email: string; name?: string; id?: string } | null,
    symptoms: [] as SymptomEntry[],
    reminders: [] as ReminderEntry[],
    visits: [] as VisitEntry[],
    myDoctorId: null as number | null,
  }),

  getters: {
    isLoggedIn(): boolean {
      return !!this.user
    },
    getResultById: (state) => (id: string) => {
      return state.results.find((r) => r.id === id)
    },
    knowsStage(state): boolean {
      const r = state.results.find((r) => r.id === state.lastResultId)
      if (!r?.stage) return false
      return r.stage !== 'unknown' && r.stage !== 'Нет'
    },
    knowsPlan(state): boolean {
      const r = state.results.find((r) => r.id === state.lastResultId)
      return !!(r?.plan && r.plan.length > 0)
    },
    userType(state): 'TYPE1' | 'TYPE2' {
      const r = state.results.find((r) => r.id === state.lastResultId)
      if (!r) return 'TYPE2'
      const knowsStage = !!r.stage && r.stage !== 'unknown' && r.stage !== 'Нет'
      const knowsPlan = !!(r.plan && r.plan.length > 0)
      return knowsStage && knowsPlan ? 'TYPE1' : 'TYPE2'
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

    addSymptom(entry: SymptomEntry) {
      this.symptoms.push(entry)
      this.symptoms.sort((a, b) => a.date.localeCompare(b.date))
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_symptoms', JSON.stringify(this.symptoms))
        } catch (_) {}
      }
    },

    setReminders(reminders: ReminderEntry[]) {
      this.reminders = reminders
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_reminders', JSON.stringify(this.reminders))
        } catch (_) {}
      }
    },

    toggleReminder(id: string) {
      const r = this.reminders.find((x) => x.id === id)
      if (r) {
        r.done = !r.done
        if (import.meta.client) {
          try {
            localStorage.setItem('antionko_reminders', JSON.stringify(this.reminders))
          } catch (_) {}
        }
      }
    },

    addReminder(entry: Omit<ReminderEntry, 'id'>) {
      const id = `rem-${Date.now()}`
      this.reminders.push({ ...entry, id })
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_reminders', JSON.stringify(this.reminders))
        } catch (_) {}
      }
    },

    setVisits(visits: VisitEntry[]) {
      this.visits = visits
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_visits', JSON.stringify(this.visits))
        } catch (_) {}
      }
    },

    addVisit(entry: Omit<VisitEntry, 'id'>) {
      const id = `vis-${Date.now()}`
      this.visits.push({ ...entry, id })
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_visits', JSON.stringify(this.visits))
        } catch (_) {}
      }
    },

    setMyDoctorId(id: number | null) {
      this.myDoctorId = id
      if (import.meta.client) {
        try {
          if (id === null) localStorage.removeItem('antionko_my_doctor_id')
          else localStorage.setItem('antionko_my_doctor_id', String(id))
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

    updateUser(data: { email?: string; name?: string }) {
      if (!this.user) return
      this.user = { ...this.user, ...data }
      if (import.meta.client) {
        try {
          localStorage.setItem('antionko_user', JSON.stringify(this.user))
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
          if (res) {
            const parsed = JSON.parse(res)
            this.results = Array.isArray(parsed) ? parsed : []
          }
          const user = localStorage.getItem('antionko_user')
          if (user) this.user = JSON.parse(user)
          const symptoms = localStorage.getItem('antionko_symptoms')
          if (symptoms) {
            const parsed = JSON.parse(symptoms)
            this.symptoms = Array.isArray(parsed) ? parsed : []
          }
          const reminders = localStorage.getItem('antionko_reminders')
          if (reminders) {
            const parsed = JSON.parse(reminders)
            this.reminders = Array.isArray(parsed) ? parsed : []
          }
          const visits = localStorage.getItem('antionko_visits')
          if (visits) {
            const parsed = JSON.parse(visits)
            this.visits = Array.isArray(parsed) ? parsed : []
          }
          const myDoc = localStorage.getItem('antionko_my_doctor_id')
          if (myDoc) {
            const n = parseInt(myDoc, 10)
            if (!Number.isNaN(n)) this.myDoctorId = n
          }
        } catch (_) {}
      }
    },
  },
})
