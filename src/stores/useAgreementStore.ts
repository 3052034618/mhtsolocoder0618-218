import { create } from 'zustand'
import type { Agreement, AgreementStatus } from '@/types'
import { mockAgreements } from '@/data/mockData'

interface AgreementState {
  agreements: Agreement[]
  addAgreement: (agreement: Omit<Agreement, 'id'>) => void
  updateAgreement: (id: string, data: Partial<Agreement>) => void
  updateAgreementStatus: (id: string, status: AgreementStatus) => void
  deleteAgreement: (id: string) => void
  signByStudent: (id: string) => void
  signByCompany: (id: string) => void
  signBySchool: (id: string) => void
  getAgreementById: (id: string) => Agreement | undefined
  getAgreementsByStudent: (studentId: string) => Agreement[]
  getAgreementsByCompany: (companyId: string) => Agreement[]
  getAgreementsBySchool: (schoolId: string) => Agreement[]
}

export const useAgreementStore = create<AgreementState>((set, get) => ({
  agreements: mockAgreements,
  addAgreement: (agreement) => {
    const newAgreement: Agreement = {
      ...agreement,
      id: `agr-${Date.now()}`,
    }
    set((state) => ({ agreements: [...state.agreements, newAgreement] }))
  },
  updateAgreement: (id, data) => {
    set((state) => ({
      agreements: state.agreements.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    }))
  },
  updateAgreementStatus: (id, status) => {
    set((state) => ({
      agreements: state.agreements.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    }))
  },
  deleteAgreement: (id) => {
    set((state) => ({ agreements: state.agreements.filter((a) => a.id !== id) }))
  },
  signByStudent: (id) => {
    const today = new Date().toISOString().split('T')[0]
    set((state) => ({
      agreements: state.agreements.map((a) =>
        a.id === id
          ? {
              ...a,
              studentSigned: true,
              studentSignDate: today,
              status: a.companySigned ? (a.schoolSigned ? 'completed' : 'pending_school') : 'pending_company',
            }
          : a
      ),
    }))
  },
  signByCompany: (id) => {
    const today = new Date().toISOString().split('T')[0]
    set((state) => ({
      agreements: state.agreements.map((a) =>
        a.id === id
          ? {
              ...a,
              companySigned: true,
              companySignDate: today,
              status: a.studentSigned ? (a.schoolSigned ? 'completed' : 'pending_school') : 'pending_student',
            }
          : a
      ),
    }))
  },
  signBySchool: (id) => {
    const today = new Date().toISOString().split('T')[0]
    set((state) => ({
      agreements: state.agreements.map((a) =>
        a.id === id
          ? {
              ...a,
              schoolSigned: true,
              schoolSignDate: today,
              status: a.studentSigned && a.companySigned ? 'completed' : a.studentSigned ? 'pending_company' : 'pending_student',
            }
          : a
      ),
    }))
  },
  getAgreementById: (id) => get().agreements.find((a) => a.id === id),
  getAgreementsByStudent: (studentId) => get().agreements.filter((a) => a.studentId === studentId),
  getAgreementsByCompany: (companyId) => get().agreements.filter((a) => a.companyId === companyId),
  getAgreementsBySchool: (schoolId) => get().agreements.filter((a) => a.schoolId === schoolId),
}))
