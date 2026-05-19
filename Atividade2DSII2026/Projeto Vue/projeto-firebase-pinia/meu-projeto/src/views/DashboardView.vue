<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore.js'
import { db } from '../firebase/config.js'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

const authStore = useAuthStore()
const pedidos = ref([])

onMounted(async () => {
  if (authStore.user) {
    const q = query(
      collection(db, 'users', authStore.user.uid, 'pedidos'),
      orderBy('data', 'desc')
    )
    const querySnapshot = await getDocs(q)
    pedidos.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }
})
</script>

<template>
  <div class="dashboard-page">
    <header class="header-section">
      <h2>Meus Planejamentos</h2>
      <p class="muted">Histórico de listas salvas no EcoLista</p>
    </header>

    <div class="history-grid">
      <div v-for="pedido in pedidos" :key="pedido.id" class="card history-card">
        <div class="history-header">
          <span class="date">{{ pedido.data?.toDate().toLocaleDateString() }}</span>
          <span class="total-tag">R$ {{ pedido.total.toFixed(2) }}</span>
        </div>
        <ul class="items-list">
          <li v-for="item in pedido.itens" :key="item.id">
            {{ item.quantidade }}x {{ item.nome }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-section { margin-bottom: 30px; }
.history-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
.total-tag { font-weight: 800; color: var(--primary-dark); }
.items-list { list-style: none; font-size: 0.9rem; color: var(--text); }
.date { font-weight: 600; font-size: 0.85rem; color: var(--text-light); }
</style>