<template>
  <div class="auth-page">
    <div class="card auth-card">
      <div class="auth-header">
        <div class="logo-circle"><i class="fa-solid fa-lock"></i></div>
        <h2>{{ isLogin ? 'Acessar Conta' : 'Nova Conta' }}</h2>
        <p class="muted">Entre para salvar suas listas</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <i class="fa-solid fa-envelope"></i>
          <input v-model="email" type="email" placeholder="E-mail" required />
        </div>
        <div class="input-group">
          <i class="fa-solid fa-key"></i>
          <input v-model="password" type="password" placeholder="Senha" required />
        </div>
        <button class="primary w-100 btn-large">
          {{ isLogin ? 'Entrar' : 'Cadastrar' }}
        </button>
      </form>

      <button class="linklike toggle-btn" @click="isLogin = !isLogin">
        {{ isLogin ? 'Ainda não tem conta? Crie uma' : 'Já tem conta? Entre aqui' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleSubmit = async () => {
  try {
    isLogin.value ? await authStore.login(email.value, password.value) : await authStore.register(email.value, password.value)
    router.push('/') 
  } catch (e) { alert("Erro na autenticação") }
}
</script>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; min-height: 70vh; padding: 20px; box-sizing: border-box; }
.auth-card { width: 100%; max-width: 400px; padding: 40px; box-sizing: border-box; }
.auth-header { text-align: center; margin-bottom: 30px; }
.logo-circle { width: 60px; height: 60px; background: var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: var(--primary); font-size: 1.5rem; }
.input-group { position: relative; margin-bottom: 20px; display: flex; align-items: center; background: #fcfdfc; border: 1px solid var(--border); border-radius: 10px; padding: 0 15px; box-sizing: border-box; }
.input-group i { color: var(--primary); }
.input-group input { border: none; background: transparent; padding: 15px; width: 100%; outline: none; font-size: 1rem; }
.btn-large { margin-top: 30px; width: 100%; padding: 16px; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; box-sizing: border-box; cursor: pointer; }
.toggle-btn { margin-top: 15px; width: 100%; padding: 10px; font-size: 0.9rem; background: none; color: var(--text-light); border: none; cursor: pointer; }
.toggle-btn:hover { text-decoration: underline; color: var(--primary); }

@media (max-width: 400px) {
  .auth-card { padding: 25px 20px; }
  .logo-circle { width: 50px; height: 50px; font-size: 1.2rem; }
  h2 { font-size: 1.5rem; }
}
</style>