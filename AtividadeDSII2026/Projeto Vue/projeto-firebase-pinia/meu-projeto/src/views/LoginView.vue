<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../firebase/config'

const router = useRouter()

const email = ref('')
const senha = ref('')
const erro = ref('')

const tratarErro = (e) => {
  if (e.code === 'auth/user-not-found') {
    return 'Usuário não encontrado.'
  }
  if (e.code === 'auth/wrong-password') {
    return 'Senha incorreta, tente novamente.'
  }
  if (e.code === 'auth/email-already-in-use') {
    return 'Este email já está cadastrado.'
  }
  if (e.code === 'auth/weak-password') {
    return 'A senha deve ter pelo menos 6 caracteres.'
  }
  if (e.code === 'auth/invalid-email') {
    return 'Email inválido.'
  }
  return 'Erro ao autenticar.'
}

const validarCampos = () => {
  if (!email.value || !senha.value) {
    erro.value = 'Preencha com o email e senha corretamente.'
    return false
  }
  return true
}

const entrar = async () => {
  erro.value = ''

  if (!validarCampos()) return

  try {
    await signInWithEmailAndPassword(auth, email.value, senha.value)
    router.push('/dashboard')
  } catch (e) {
    erro.value = tratarErro(e)
  }
}

const registrar = async () => {
  erro.value = ''

  if (!validarCampos()) return

  try {
    await createUserWithEmailAndPassword(auth, email.value, senha.value)
    router.push('/dashboard')
  } catch (e) {
    erro.value = tratarErro(e)
  }
}
</script>

<template>
  <section class="card">
    <h1><i class="fa-solid fa-right-to-bracket"></i> Login</h1>
    <p class="muted">Digite o seu e-mail e senha para acessar sua conta.</p>

    <label class="field">
      Email
      <input v-model="email" type="email" placeholder="aluno@email.com" />
    </label>

    <label class="field">
      Senha
      <input v-model="senha" type="password" placeholder="mínimo 6 caracteres" />
    </label>

    <div class="actions">
      <button @click="entrar">
        <i class="fa-solid fa-arrow-right"></i> Entrar
      </button>

      <button class="secondary" @click="registrar">
        <i class="fa-solid fa-user-plus"></i> Criar conta
      </button>
    </div>

    <p v-if="erro" class="error">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ erro }}
    </p>
  </section>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.actions {
  margin-top: 10px;
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

button.secondary {
  background: #ffffff;
}

button:hover {
  opacity: 0.9;
}

.error {
  margin-top: 10px;
  color: #c0392b;
}
</style>