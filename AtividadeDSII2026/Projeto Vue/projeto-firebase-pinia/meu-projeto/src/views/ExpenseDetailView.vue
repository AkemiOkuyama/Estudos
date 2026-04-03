<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const route = useRoute()
const router = useRouter()

const item = ref(null)
const loading = ref(true)
const erro = ref('')

const buscarItem = async () => {
  try {
    const docRef = doc(db, 'financas', route.params.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      item.value = docSnap.data()
    } else {
      erro.value = 'Item não encontrado.'
    }
  } catch (e) {
    erro.value = 'Erro ao carregar item.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  buscarItem()
})
</script>

<template>
  <section class="card">
    <h1><i class="fa-solid fa-receipt"></i> Detalhe da Despesa</h1>

    <p v-if="loading" class="muted">Carregando...</p>

    <p v-if="erro" class="error">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ erro }}
    </p>

    <div v-if="item">
      <p><strong>Descrição:</strong> {{ item.descricao }}</p>
      <p><strong>Valor:</strong> R$ {{ item.valor }}</p>
    </div>

    <button @click="router.push('/dashboard')">
      <i class="fa-solid fa-arrow-left"></i> Voltar
    </button>
  </section>
</template>

<style scoped>
button {
  margin-top: 15px;
}
</style>