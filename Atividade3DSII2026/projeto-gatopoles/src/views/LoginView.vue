<template>
  <main class="login">
    <section class="login-container">
      <div class="card">
        <div class="header">
          <span class="badge">🔐 Área administrativa</span>
          <h1>Login</h1>
          <p>Acesse o painel para gerenciar os gatinhos da Gatópoles.</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="field">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="Digite seu email"
              required
            />
          </div>

          <div class="field">
            <label>Senha</label>
            <input
              v-model="password"
              type="password"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" class="btn" :disabled="loading">
            {{ loading ? "Entrando..." : "Entrar" }}
          </button>

          <p v-if="error" class="error">{{ error }}</p>
        </form>

        <div class="register-link">
          <p>Não tem uma conta? 
            <RouterLink to="/register">Cadastre-se aqui</RouterLink>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { login } from "../services/authService";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();

async function handleLogin() {
  error.value = "";
  loading.value = true;

  try {
    await login(email.value, password.value);
    router.push("/admin");
  } catch (err) {
    error.value = "E-mail ou senha inválidos.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
}

.login-container {
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

.header h1 {
  margin-top: 1rem;
  font-size: 2rem;
}

.header p {
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.badge {
  display: inline-block;
  background: var(--primary-soft);
  color: var(--primary-dark);
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  margin-bottom: 0.3rem;
  font-weight: 600;
}

input {
  padding: 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  outline: none;
}

input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
}

button {
  width: 100%;
  margin-top: 1rem;
}

.error {
  margin-top: 1rem;
  color: var(--danger);
  text-align: center;
  font-size: 0.9rem;
}

.register-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.register-link a {
  color: var(--primary);
  font-weight: bold;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .card {
    padding: 2rem;
  }
}
</style>