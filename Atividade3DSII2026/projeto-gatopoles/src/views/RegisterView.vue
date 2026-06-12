<template>
  <main class="auth-page">
    <section class="auth-container">
      <div class="card">
        <div class="header">
          <h1>Criar Conta</h1>
          <p>Cadastre-se para acessar o painel administrativo.</p>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="field">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="email@exemplo.com" required />
          </div>
          <div class="field">
            <label>Senha</label>
            <input v-model="password" type="password" placeholder="Mínimo 6 caracteres" required />
          </div>
          <button type="submit" class="btn" :disabled="loading">
            {{ loading ? "Cadastrando..." : "Criar conta" }}
          </button>
        </form>
        
        <p v-if="error" class="error">{{ error }}</p>
        <p class="link">Já tem conta? <RouterLink to="/login">Entrar</RouterLink></p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../services/authService";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();

async function handleRegister() {
  loading.value = true;
  try {
    await register(email.value, password.value);
    router.push("/admin");
  } catch (err) {
    error.value = "Erro: " + err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
}

.auth-container {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
}

.card {
  background: var(--surface);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem; 
}

input {
  padding: 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-top: 0.5rem; 
}

button {
  width: 100%;
  margin-top: 1rem;
}

.link { 
  margin-top: 1.5rem; 
  text-align: center; 
  font-size: 0.9rem; 
  color: var(--text-secondary); 
}

.link a { 
  color: var(--primary); 
  font-weight: bold; 
  text-decoration: none; 
}

.error {
  margin-top: 1rem;
  color: var(--danger);
  text-align: center;
  font-size: 0.9rem;
}
</style>