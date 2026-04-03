import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import App from './App.vue'
import { auth } from './firebase/config'
import { useAuthStore } from './stores/authStore'
import router from './router'
import './style.css'

const pinia = createPinia()
let app

onAuthStateChanged(auth, (user) => {
  const authStore = useAuthStore(pinia)

  authStore.setUser(user)
  authStore.setAuthReady()

  if (!app) {
    app = createApp(App)

    app.use(pinia)
    app.use(router)

    router.isReady().then(() => {
      app.mount('#app')
    })
  }
})