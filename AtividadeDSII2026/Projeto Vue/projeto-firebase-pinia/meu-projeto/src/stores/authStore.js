import { defineStore } from 'pinia'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    authIsReady: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    setUser(user) {
      this.user = user
    },

    setAuthReady() {
      this.authIsReady = true
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
      } catch (error) {
        console.error('Erro ao sair:', error)
      }
    }
  }
})