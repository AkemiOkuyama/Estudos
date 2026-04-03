<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const userEmail = computed(() => authStore.user?.email || 'Deslogado')

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <h2><i class="fa-solid fa-fire"></i> Vue + Firebase</h2>
      <span class="muted">Usuário: {{ userEmail }}</span>
    </header>

    <nav class="menu">
      <router-link to="/">
        <i class="fa-solid fa-house"></i> Início
      </router-link>

      <router-link v-if="!authStore.user" to="/login">
        <i class="fa-solid fa-right-to-bracket"></i> Login
      </router-link>

      <router-link v-if="authStore.user" to="/dashboard">
        <i class="fa-solid fa-chart-line"></i> Dashboard
      </router-link>

      <router-link v-if="authStore.user" to="/profile">
        <i class="fa-solid fa-id-card"></i> Perfil
      </router-link>

      <button v-if="authStore.user" class="linklike" @click="logout">
        <i class="fa-solid fa-right-from-bracket"></i> Sair
      </button>
    </nav>

    <router-view></router-view>
  </div>
</template>

<style scoped>
.layout {
  max-width: 900px;
  margin: 0 auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.menu {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.menu a {
  text-decoration: none;
  color: #81C784;
  font-weight: 600;
}

.menu a.router-link-active {
  color: #111;
}

.linklike {
  background: none;
  border: none;
  color: #c0392b;
  cursor: pointer;
  font-weight: 600;
}

.linklike:hover {
  text-decoration: underline;
}

.muted {
  color: #666;
}
</style>