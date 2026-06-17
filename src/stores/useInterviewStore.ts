import { create } from 'zustand'
import type { Interview, InterviewStatus } from '@/types'
import { mockInterviews } from '@/data/mockData'

interface InterviewState {
  interviews: Interview[]
  addInterview: (interview: Omit<Interview, 'id'>) => void
  updateInterview: (id: string, data: Partial<Interview>) => void
  updateInterviewStatus: (id: string, status: InterviewStatus) => void
  deleteInterview: (id: string) => void
  getInterviewById: (id: string) => Interview | undefined
  getInterviewsByStudent: (studentId: string) => Interview[]
  getInterviewsByPosition: (positionId: string) => Interview[]
  getInterviewsByApplication: (applicationId: string) => Interview[]
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  interviews: mockInterviews,
  addInterview: (interview) => {
    const newInterview: Interview = {
      ...interview,
      id: `int-${Date.now()}`,
    }
    set((state) => ({ interviews: [...state.interviews, newInterview] }))
  },
  updateInterview: (id, data) => {
    set((state) => ({
      interviews: state.interviews.map((i) =>
        i.id === id ? { ...i, ...data } : i
      ),
    }))
  },
  updateInterviewStatus: (id, status) => {
    set((state) => ({
      interviews: state.interviews.map((i) =>
        i.id === id ? { ...i, status } : i
      ),
    }))
  },
  deleteInterview: (id) => {
    set((state) => ({ interviews: state.interviews.filter((i) => i.id !== id) }))
  },
  getInterviewById: (id) => get().interviews.find((i) => i.id === id),
  getInterviewsByStudent: (studentId) => get().interviews.filter((i) => i.studentId === studentId),
  getInterviewsByPosition: (positionId) => get().interviews.filter((i) => i.positionId === positionId),
  getInterviewsByApplication: (applicationId) => get().interviews.filter((i) => i.applicationId === applicationId),
}))
