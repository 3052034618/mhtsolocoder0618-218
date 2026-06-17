import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Evaluation } from '@/types'
import { mockEvaluations } from '@/data/mockData'

interface EvaluationState {
  evaluations: Evaluation[]
  addEvaluation: (evaluation: Omit<Evaluation, 'id' | 'createdAt'>) => void
  updateEvaluation: (id: string, data: Partial<Evaluation>) => void
  deleteEvaluation: (id: string) => void
  getEvaluationById: (id: string) => Evaluation | undefined
  getEvaluationsByStudent: (studentId: string) => Evaluation[]
  getEvaluationsByAgreement: (agreementId: string) => Evaluation[]
  getEvaluationsByMentor: (mentorId: string) => Evaluation[]
}

export const useEvaluationStore = create<EvaluationState>()(
  persist(
    (set, get) => ({
      evaluations: mockEvaluations,
      addEvaluation: (evaluation) => {
        const newEvaluation: Evaluation = {
          ...evaluation,
          id: `eval-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        }
        set((state) => ({ evaluations: [...state.evaluations, newEvaluation] }))
      },
      updateEvaluation: (id, data) => {
        set((state) => ({
          evaluations: state.evaluations.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        }))
      },
      deleteEvaluation: (id) => {
        set((state) => ({ evaluations: state.evaluations.filter((e) => e.id !== id) }))
      },
      getEvaluationById: (id) => get().evaluations.find((e) => e.id === id),
      getEvaluationsByStudent: (studentId) => get().evaluations.filter((e) => e.studentId === studentId),
      getEvaluationsByAgreement: (agreementId) => get().evaluations.filter((e) => e.agreementId === agreementId),
      getEvaluationsByMentor: (mentorId) => get().evaluations.filter((e) => e.mentorId === mentorId),
    }),
    { name: 'evaluation-store' }
  )
)
