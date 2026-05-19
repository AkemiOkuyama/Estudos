<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarrinhoStore } from '../stores/cartStore.js'
import { db } from '../firebase/config.js'
import { collection, onSnapshot } from 'firebase/firestore'

const carrinho = useCarrinhoStore()
const busca = ref('')
const produtos = ref([])

onMounted(() => {
  onSnapshot(collection(db, 'produtos'), (snapshot) => {
    produtos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})

const produtosFiltrados = computed(() => {
  const t = busca.value.toLowerCase()
  return produtos.value.filter(p => p.nome.toLowerCase().includes(t) || p.nutri.toLowerCase().includes(t))
})
</script>

<template>
  <div class="store-web">
    <header class="store-header">
      <h2>Catálogo</h2>
      <input v-model="busca" type="text" placeholder="Buscar..." class="search-input" />
    </header>
    <div class="grid">
      <div v-for="p in produtosFiltrados" :key="p.id" class="card product-item">
        <div class="info">
          <span class="tag" :class="p.nivel">{{ p.nutri }}</span>
          <h3>{{ p.nome }}</h3>
          <p class="price">R$ {{ p.preco.toFixed(2) }}</p>
        </div>
        <button class="primary add-btn" @click="carrinho.adicionarItem(p)">
          <i class="fa-solid fa-cart-plus"></i>
          <span>Add</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.store-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.search-input { width: 250px; padding: 10px; border: 1px solid var(--border); border-radius: 8px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.product-item { display: flex; justify-content: space-between; align-items: center; }
.info h3 { font-size: 1rem; margin: 5px 0; }
.price { font-weight: 700; color: var(--text); }
.add-btn { padding: 8px 15px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
</style>