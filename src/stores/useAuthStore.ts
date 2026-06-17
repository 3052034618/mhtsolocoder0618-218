import { create } from 'zustand'
import type { User } from '@/types'
import { mockUsers } from '@/data/mockData'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, role: User['role']) => void
  logout: () => void
  switchRole: (role: User['role']) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, role) => {
    const user = mockUsers.find((u) => u.email === email && u.role === role)
    if (user) {
      set({ user, isAuthenticated: true })
    }
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  switchRole: (role) => {
    const user = mockUsers.find((u) => u.role === role)
    if (user) {
      set({ user, isAuthenticated: true })
    }
  },
}))
