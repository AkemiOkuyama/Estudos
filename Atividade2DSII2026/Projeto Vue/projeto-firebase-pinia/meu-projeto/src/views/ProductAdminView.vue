<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/config.js'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'

const nome = ref('')
const preco = ref(0)
const nutri = ref('')
const nivel = ref('low')
const enviando = ref(false)

const produtos = ref([])

onMounted(() => {
  const q = query(collection(db, 'produtos'), orderBy('nome', 'asc'))
  onSnapshot(q, (snapshot) => {
    produtos.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  })
})

const salvarProduto = async () => {
  if (!nome.value || preco.value <= 0) return alert('Preencha os campos corretamente')
  enviando.value = true
  try {
    await addDoc(collection(db, 'produtos'), {
      nome: nome.value,
      preco: Number(preco.value),
      nutri: nutri.value,
      nivel: nivel.value
    })
    nome.value = ''; preco.value = 0; nutri.value = ''; nivel.value = 'low';
  } catch (e) {
    alert('Erro ao salvar')
  } finally {
    enviando.value = false
  }
}

const excluirProduto = async (id) => {
  if (confirm('Deseja realmente remover este item do catálogo?')) {
    try {
      await deleteDoc(doc(db, 'produtos', id))
    } catch (e) {
      alert('Erro ao excluir')
    }
  }
}
</script>

<template>
  <div class="admin-container">
    <div class="card admin-card">
      <div class="auth-header">
        <div class="logo-circle"><i class="fa-solid fa-plus"></i></div>
        <h2>Gerenciar Catálogo</h2>
        <p class="muted">Adicione ou remova itens do sistema</p>
      </div>
      
      <form @submit.prevent="salvarProduto" class="admin-form">
        <div class="input-group-custom">
          <input v-model="nome" type="text" placeholder="Nome do Produto" required />
        </div>
        <div class="input-group-custom">
          <input v-model="preco" type="number" step="0.01" placeholder="Preço R$" required />
        </div>
        <div class="input-group-custom">
          <input v-model="nutri" type="text" placeholder="Nutriente Principal" required />
        </div>
        
        <div class="nivel-selector">
          <p>Nível Nutricional:</p>
          <div class="radio-group">
            <label><input type="radio" v-model="nivel" value="low"> <span class="tag low">Saudável</span></label>
            <label><input type="radio" v-model="nivel" value="medium"> <span class="tag medium">Moderado</span></label>
            <label><input type="radio" v-model="nivel" value="high"> <span class="tag high">Crítico</span></label>
          </div>
        </div>

        <button class="primary btn-large" :disabled="enviando">
          {{ enviando ? 'Salvando...' : 'Cadastrar Produto' }}
        </button>
      </form>
    </div>

    <div class="card list-card">
      <h3>Itens Cadastrados ({{ produtos.length }})</h3>
      <div class="admin-list">
        <div v-for="p in produtos" :key="p.id" class="admin-item">
          <div class="item-meta">
            <span class="tag" :class="p.nivel">{{ p.nutri }}</span>
            <strong>{{ p.nome }}</strong>
          </div>
          <button class="btn-delete" @click="excluirProduto(p.id)">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container { display: flex; flex-direction: column; align-items: center; gap: 30px; padding: 40px 20px; }
.admin-card, .list-card { width: 100%; max-width: 500px; }
.auth-header { text-align: center; margin-bottom: 25px; }

.input-group-custom { margin-bottom: 12px; }
.input-group-custom input { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; outline: none; background: #fcfdfc; }

.nivel-selector { margin: 15px 0; }
.radio-group { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
.radio-group label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; }

.admin-list { margin-top: 20px; max-height: 400px; overflow-y: auto; }
.admin-item { 
  display: flex; justify-content: space-between; align-items: center; 
  padding: 12px; border-bottom: 1px solid var(--border);
}
.item-meta { display: flex; flex-direction: column; gap: 4px; }
.btn-delete { 
  background: #fff5f5; color: var(--danger); 
  width: 35px; height: 35px; border-radius: 8px;
  transition: 0.2s;
}
.btn-delete:hover { background: var(--danger); color: white; }
.btn-large { width: 100%; padding: 15px; font-size: 1rem; cursor: pointer; }
</style>