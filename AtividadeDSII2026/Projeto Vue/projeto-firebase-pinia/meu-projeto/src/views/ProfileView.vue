<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase/config'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })
})

const logout = async () => {
  await signOut(auth)
  router.push('/login')
}
</script>

<template>
  <section class="card">
    <h1><i class="fa-solid fa-user"></i> Perfil</h1>

    <div v-if="user">
      <p><strong>Email:</strong> {{ user.email }}</p>

      <button @click="logout">
        <i class="fa-solid fa-right-from-bracket"></i> Sair
      </button>
    </div>

    <p v-else class="muted">Carregando usuário...</p>
  </section>
</template>

<style scoped>
button {
  margin-top: 15px;
}
</style>