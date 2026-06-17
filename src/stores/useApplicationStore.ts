import { create } from 'zustand'
import type { Application, ApplicationStatus } from '@/types'
import { mockApplications } from '@/data/mockData'

interface ApplicationState {
  applications: Application[]
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void
  getApplicationsByPosition: (positionId: string) => Application[]
  getApplicationsByStudent: (studentId: string) => Application[]
  getApplicationsByCompany: (positionIds: string[]) => Application[]
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: mockApplications,
  addApplication: (application) => {
    const newApp: Application = {
      ...application,
      id: `app-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    set((state) => ({ applications: [...state.applications, newApp] }))
  },
  updateApplicationStatus: (id, status) => {
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, status, updatedAt: new Date().toISOString().split('T')[0] } : a
      ),
    }))
  },
  getApplicationsByPosition: (positionId) => get().applications.filter((a) => a.positionId === positionId),
  getApplicationsByStudent: (studentId) => get().applications.filter((a) => a.studentId === studentId),
  getApplicationsByCompany: (positionIds: string[]) => get().applications.filter((a) => positionIds.includes(a.positionId)),
}))
