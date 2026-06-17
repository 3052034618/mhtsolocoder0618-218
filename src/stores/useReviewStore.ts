import { create } from 'zustand'
import type { CompanyReview, ReviewStatus } from '@/types'
import { mockReviews } from '@/data/mockData'

interface ReviewState {
  reviews: CompanyReview[]
  addReview: (review: Omit<CompanyReview, 'id'>) => void
  updateReview: (id: string, data: Partial<CompanyReview>) => void
  deleteReview: (id: string) => void
  approveReview: (id: string, reviewerId: string, reviewerName: string, comment: string) => void
  rejectReview: (id: string, reviewerId: string, reviewerName: string, comment: string) => void
  getReviewById: (id: string) => CompanyReview | undefined
  getReviewsByStatus: (status: ReviewStatus) => CompanyReview[]
  getReviewByCompanyId: (companyId: string) => CompanyReview | undefined
  getPendingReviews: () => CompanyReview[]
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: mockReviews,
  addReview: (review) => {
    const newReview: CompanyReview = {
      ...review,
      id: `review-${Date.now()}`,
    }
    set((state) => ({ reviews: [...state.reviews, newReview] }))
  },
  updateReview: (id, data) => {
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === id ? { ...r, ...data } : r
      ),
    }))
  },
  deleteReview: (id) => {
    set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) }))
  },
  approveReview: (id, reviewerId, reviewerName, comment) => {
    const today = new Date().toISOString().split('T')[0]
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === id
          ? { ...r, status: 'approved' as ReviewStatus, reviewerId, reviewerName, reviewComment: comment, reviewedAt: today }
          : r
      ),
    }))
  },
  rejectReview: (id, reviewerId, reviewerName, comment) => {
    const today = new Date().toISOString().split('T')[0]
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === id
          ? { ...r, status: 'rejected' as ReviewStatus, reviewerId, reviewerName, reviewComment: comment, reviewedAt: today }
          : r
      ),
    }))
  },
  getReviewById: (id) => get().reviews.find((r) => r.id === id),
  getReviewsByStatus: (status) => get().reviews.filter((r) => r.status === status),
  getReviewByCompanyId: (companyId) => get().reviews.find((r) => r.companyId === companyId),
  getPendingReviews: () => get().reviews.filter((r) => r.status === 'pending'),
}))
