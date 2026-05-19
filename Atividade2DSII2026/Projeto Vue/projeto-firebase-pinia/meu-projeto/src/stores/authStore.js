import { defineStore } from 'pinia'
import { auth } from '../firebase/config.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    authReady: false
  }),
  actions: {
    async register(email, password) {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      this.user = res.user
    },
    async login(email, password) {
      const res = await signInWithEmailAndPassword(auth, email, password)
      this.user = res.user
    },
    async logout() {
      await signOut(auth)
      this.user = null
    },
    setUser(user) { this.user = user },
    setAuthReady() { this.authReady = true }
  }
})