import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import HomeView from '../views/HomeView.vue'
import SobreView from '../views/SobreView.vue'
import AdocaoView from '../views/AdocaoView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue' // Importação adicionada
import AdminView from '../views/AdminView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/sobre', name: 'sobre', component: SobreView },
  { path: '/adocao', name: 'adocao', component: AdocaoView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView }, // Rota adicionada
  { 
    path: '/admin', 
    name: 'admin', 
    component: AdminView,
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

function getCurrentUser() {
  return new Promise((resolve) => {
    const removeListener = onAuthStateChanged(getAuth(), (user) => {
      removeListener()
      resolve(user)
    })
  })
}

router.beforeEach(async (to) => {
  const usuarioLogado = await getCurrentUser()
  const rotaProtegida = to.matched.some(record => record.meta.requiresAuth)

  if (rotaProtegida && !usuarioLogado) {
    return { name: 'login' }
  }

  if ((to.path === '/login' || to.path === '/register') && usuarioLogado) {
    return { name: 'admin' }
  }
})

export default router