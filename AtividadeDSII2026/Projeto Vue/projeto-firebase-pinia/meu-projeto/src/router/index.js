import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView from '../views/ProfileView.vue'
import ExpenseDetailView from '../views/ExpenseDetailView.vue'
import { useAuthStore } from '../stores/authStore'

const routes = [
  { path: '/', component: HomeView },

  { path: '/login', component: LoginView },

  { 
    path: '/dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true }
  },

  { 
    path: '/profile', 
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },

  { 
    path: '/expense/:id', 
    name: 'expenseDetail',
    component: ExpenseDetailView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.authIsReady) return

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } else {
    next()
  }
})

export default router