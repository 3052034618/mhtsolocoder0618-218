import { create } from 'zustand'
import type { InternshipLog } from '@/types'
import { mockLogs } from '@/data/mockData'

interface LogState {
  logs: InternshipLog[]
  addLog: (log: Omit<InternshipLog, 'id' | 'createdAt'>) => void
  updateLog: (id: string, data: Partial<InternshipLog>) => void
  deleteLog: (id: string) => void
  getLogById: (id: string) => InternshipLog | undefined
  getLogsByStudent: (studentId: string) => InternshipLog[]
  getLogsByAgreement: (agreementId: string) => InternshipLog[]
}

export const useLogStore = create<LogState>((set, get) => ({
  logs: mockLogs,
  addLog: (log) => {
    const newLog: InternshipLog = {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    set((state) => ({ logs: [...state.logs, newLog] }))
  },
  updateLog: (id, data) => {
    set((state) => ({
      logs: state.logs.map((l) =>
        l.id === id ? { ...l, ...data } : l
      ),
    }))
  },
  deleteLog: (id) => {
    set((state) => ({ logs: state.logs.filter((l) => l.id !== id) }))
  },
  getLogById: (id) => get().logs.find((l) => l.id === id),
  getLogsByStudent: (studentId) => get().logs.filter((l) => l.studentId === studentId),
  getLogsByAgreement: (agreementId) => get().logs.filter((l) => l.agreementId === agreementId),
}))
