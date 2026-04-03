<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const router = useRouter()

const descricao = ref('')
const valor = ref('')
const despesas = ref([])
const aviso = ref('')

let unsubscribe = null

const salvarDespesa = async () => {
  aviso.value = ''

  if (!descricao.value || !valor.value) {
    aviso.value = 'Preencha a descrição e o valor.'
    return
  }

  await addDoc(collection(db, 'financas'), {
    descricao: descricao.value,
    valor: Number(valor.value),
    userId: auth.currentUser.uid
  })

  descricao.value = ''
  valor.value = ''
}

const ouvirDespesas = () => {
  if (!auth.currentUser) return

  const q = query(
    collection(db, 'financas'),
    where('userId', '==', auth.currentUser.uid)
  )

  unsubscribe = onSnapshot(q, (snapshot) => {
    despesas.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
  })
}

const irParaDetalhe = (id) => {
  router.push({ name: 'expenseDetail', params: { id } })
}

onMounted(() => {
  if (auth.currentUser) {
    ouvirDespesas()
  }
})

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<template>
  <section class="card">
    <h1><i class="fa-solid fa-chart-line"></i> Dashboard</h1>
    <p class="muted">Somente usuários logados podem acessar esta tela.</p>

    <div class="form-row">
      <input v-model="descricao" placeholder="Descrição (ex: Arroz)" />
      <input v-model="valor" type="number" step="0.01" placeholder="Valor" />
      <button @click="salvarDespesa">
        <i class="fa-solid fa-plus"></i> Salvar
      </button>
    </div>

    <p v-if="aviso" class="error">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ aviso }}
    </p>

    <h3>Minha lista:</h3>

    <ul v-if="despesas.length">
      <li 
        v-for="item in despesas" 
        :key="item.id"
        @click="irParaDetalhe(item.id)"
        class="item"
      >
        <strong>{{ item.descricao }}</strong> — R$ {{ item.valor }}
      </li>
    </ul>

    <p v-else class="muted">Ainda não há nenhum item na sua lista.</p>
  </section>
</template>

<style scoped>
.item {
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: 0.2s;
}

.item:hover {
  background: #f0f2f8;
}
</style>