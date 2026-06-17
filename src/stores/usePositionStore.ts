import { create } from 'zustand'
import type { Position, PositionStatus } from '@/types'
import { mockPositions } from '@/data/mockData'

interface PositionState {
  positions: Position[]
  addPosition: (position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>) => void
  updatePosition: (id: string, data: Partial<Position>) => void
  updatePositionStatus: (id: string, status: PositionStatus) => void
  getPositionById: (id: string) => Position | undefined
  getPositionsByCompany: (companyId: string) => Position[]
  getApprovedPositions: () => Position[]
}

export const usePositionStore = create<PositionState>((set, get) => ({
  positions: mockPositions,
  addPosition: (position) => {
    const newPosition: Position = {
      ...position,
      id: `pos-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    set((state) => ({ positions: [...state.positions, newPosition] }))
  },
  updatePosition: (id, data) => {
    set((state) => ({
      positions: state.positions.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().split('T')[0] } : p
      ),
    }))
  },
  updatePositionStatus: (id, status) => {
    set((state) => ({
      positions: state.positions.map((p) =>
        p.id === id ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p
      ),
    }))
  },
  getPositionById: (id) => get().positions.find((p) => p.id === id),
  getPositionsByCompany: (companyId) => get().positions.filter((p) => p.companyId === companyId),
  getApprovedPositions: () => get().positions.filter((p) => p.status === 'approved'),
}))
