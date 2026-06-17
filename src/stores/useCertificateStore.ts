import { create } from 'zustand'
import type { Certificate } from '@/types'
import { mockCertificates } from '@/data/mockData'

interface CertificateState {
  certificates: Certificate[]
  addCertificate: (certificate: Omit<Certificate, 'id' | 'issuedAt'>) => void
  updateCertificate: (id: string, data: Partial<Certificate>) => void
  deleteCertificate: (id: string) => void
  getCertificateById: (id: string) => Certificate | undefined
  getCertificatesByStudent: (studentId: string) => Certificate[]
  getCertificatesByCompany: (companyId: string) => Certificate[]
  getCertificatesByAgreement: (agreementId: string) => Certificate[]
}

export const useCertificateStore = create<CertificateState>((set, get) => ({
  certificates: mockCertificates,
  addCertificate: (certificate) => {
    const newCertificate: Certificate = {
      ...certificate,
      id: `cert-${Date.now()}`,
      issuedAt: new Date().toISOString().split('T')[0],
    }
    set((state) => ({ certificates: [...state.certificates, newCertificate] }))
  },
  updateCertificate: (id, data) => {
    set((state) => ({
      certificates: state.certificates.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    }))
  },
  deleteCertificate: (id) => {
    set((state) => ({ certificates: state.certificates.filter((c) => c.id !== id) }))
  },
  getCertificateById: (id) => get().certificates.find((c) => c.id === id),
  getCertificatesByStudent: (studentId) => get().certificates.filter((c) => c.studentId === studentId),
  getCertificatesByCompany: (companyId) => get().certificates.filter((c) => c.companyId === companyId),
  getCertificatesByAgreement: (agreementId) => get().certificates.filter((c) => c.agreementId === agreementId),
}))
