<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const userEmail = computed(() => authStore.user?.email || 'Nenhum usuário logado')

const irParaLogin = () => router.push('/login')
const irParaDashboard = () => router.push('/dashboard')
const irParaPerfil = () => router.push('/profile')
</script>

<template>
  <section class="card">
    <h1><i class="fa-solid fa-house"></i> Início</h1>

    <p>Este projeto mostra Pinia + Router + Firebase.</p>

    <p>
      <strong>Status:</strong>
      {{ authStore.user ? 'Logado' : 'Deslogado' }}
      <span class="muted">({{ userEmail }})</span>
    </p>

    <div class="actions">
      <button v-if="!authStore.user" @click="irParaLogin">
        <i class="fa-solid fa-right-to-bracket"></i> Login
      </button>

      <button v-if="authStore.user" @click="irParaDashboard">
        <i class="fa-solid fa-chart-line"></i> Dashboard
      </button>

      <button v-if="authStore.user" @click="irParaPerfil">
        <i class="fa-solid fa-user"></i> Perfil
      </button>
    </div>

    <p class="muted">
      Dica: tente acessar o Dashboard sem logar para ver a guarda em ação.
    </p>
  </section>
</template>

<style scoped>
.actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background: #81C784;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

button:hover {
  opacity: 0.9;
}
</style>