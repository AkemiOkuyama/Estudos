<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/config.js'
import { useAuthStore } from '../stores/authStore.js'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

const authStore = useAuthStore()
const listasSalvas = ref([])
const carregando = ref(true)

onMounted(() => {
  if (!authStore.user) {
    carregando.value = false
    return
  }

  const q = query(
    collection(db, 'users', authStore.user.uid, 'pedidos'),
    orderBy('data', 'desc')
  )

  onSnapshot(q, (snapshot) => {
    listasSalvas.value = snapshot.docs.map(doc => {
      const dados = doc.data()
      
      let dataFormatada = 'Data não disponível'
      if (dados.data) {
        const d = dados.data.toDate()
        dataFormatada = d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }

      return {
        id: doc.id,
        ...dados,
        dataFormatada
      }
    })
    carregando.value = false
  }, (error) => {
    console.error("Erro ao buscar listas no Dashboard:", error)
    carregando.value = false
  })
})
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h2>Painel de Planejamento</h2>
      <p class="muted">Histórico de listas e métricas de consumo estratégico</p>
    </header>

    <div v-if="carregando" class="loading-state card">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Buscando suas listas estratégicas...</p>
    </div>

    <div v-else-if="listasSalvas.length === 0" class="empty-dashboard card">
      <i class="fa-solid fa-folder-open"></i>
      <h3>Nenhum planejamento salvo</h3>
      <p>Você ainda não salvou nenhuma lista. Vá até a loja, monte seu carrinho e clique em "Salvar Lista Estratégica".</p>
      <router-link to="/cart" class="primary btn-action">Ir para a Loja</router-link>
    </div>

    <div v-else class="dashboard-grid">
      <div v-for="lista in listasSalvas" :key="lista.id" class="card lista-card">
        <div class="lista-header">
          <div class="header-meta">
            <h3>{{ lista.titulo }}</h3>
            <span class="lista-data"><i class="fa-regular fa-calendar"></i> {{ lista.dataFormatada }}</span>
          </div>
          <div class="lista-badge">
            <span class="total-price">R$ {{ Number(lista.valorTotal || lista.total || 0).toFixed(2) }}</span>
          </div>
        </div>

        <div class="lista-body">
          <h4>Itens Planejados ({{ lista.itens ? lista.itens.length : 0 }}):</h4>
          <ul class="itens-resumo">
            <li v-for="(item, index) in lista.itens" :key="index" class="item-linha">
              <span class="item-nome">
                <span class="bullet-nivel" :class="item.nivel"></span>
                {{ item.quantidade }}x {{ item.nome }}
              </span>
              <span class="item-preco-un">R$ {{ Number(item.preco).toFixed(2) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; box-sizing: border-box; }
.dashboard-header { margin-bottom: 30px; }
.dashboard-header h2 { font-size: 2rem; color: var(--text); margin-bottom: 5px; }

.loading-state, .empty-dashboard { text-align: center; padding: 60px 20px; }
.loading-state i, .empty-dashboard i { font-size: 3rem; color: var(--primary); margin-bottom: 15px; }
.empty-dashboard h3 { margin-bottom: 10px; }
.empty-dashboard p { color: var(--text-light); max-width: 450px; margin: 0 auto 25px; line-height: 1.5; }
.btn-action { display: inline-block; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; }

.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.lista-card { padding: 25px; display: flex; flex-direction: column; gap: 20px; box-sizing: border-box; }

.lista-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; border-bottom: 1px solid var(--border); padding-bottom: 15px; }
.header-meta { min-width: 0; }
.lista-header h3 { font-size: 1.2rem; color: var(--text); margin-bottom: 5px; word-break: break-word; }
.lista-data { font-size: 0.85rem; color: var(--text-light); display: flex; align-items: center; gap: 5px; }
.lista-badge { background: var(--secondary); color: var(--text); padding: 6px 12px; border-radius: 8px; font-weight: 700; flex-shrink: 0; }

.lista-body h4 { font-size: 0.85rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
.itens-resumo { list-style: none; padding: 0; margin: 0; max-height: 180px; overflow-y: auto; padding-right: 5px; }

.itens-resumo::-webkit-scrollbar { width: 4px; }
.itens-resumo::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

.item-linha { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed var(--border); font-size: 0.9rem; gap: 10px; }
.item-linha:last-child { border-bottom: none; }
.item-nome { display: flex; align-items: center; gap: 8px; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.item-preco-un { color: var(--text-light); font-size: 0.85rem; flex-shrink: 0; }

.bullet-nivel { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.bullet-nivel.low { background: #2ecc71; }
.bullet-nivel.medium { background: #f1c40f; }
.bullet-nivel.high { background: #e74c3c; }

@media (max-width: 600px) {
  .dashboard-container { padding: 20px 15px; }
  .dashboard-header h2 { font-size: 1.6rem; }
  .dashboard-grid { grid-template-columns: 1fr; }
  .lista-card { padding: 15px; gap: 15px; }
}
</style>