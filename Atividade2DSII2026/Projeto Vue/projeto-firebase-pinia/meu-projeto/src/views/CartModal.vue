<script setup>
import { ref } from 'vue'
import { useCarrinhoStore } from '../stores/cartStore.js'
import { useAuthStore } from '../stores/authStore.js'
import { db } from '../firebase/config.js'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const aberto = defineModel({ type: Boolean, default: false })
const carrinho = useCarrinhoStore()
const authStore = useAuthStore()
const nomeLista = ref('')
const salvando = ref(false)

const finalizarESalvar = async () => {
  if (!authStore.user || carrinho.itens.length === 0) return alert('Verifique login ou itens.')
  salvando.value = true
  try {
    const itensPuros = carrinho.itens.map(item => ({
      id: item.id,
      nome: item.nome,
      preco: Number(item.preco),
      quantidade: Number(item.quantidade),
      nivel: item.nivel,
      nutri: item.nutri
    }))

    await addDoc(collection(db, 'users', authStore.user.uid, 'pedidos'), {
      titulo: nomeLista.value.trim() || 'Minha Lista',
      itens: itensPuros,
      valorTotal: Number(carrinho.valorTotal),
      quantidadeTotal: Number(carrinho.totalItens),
      data: serverTimestamp()
    })

    alert('Lista salva estrategicamente com sucesso!')
    carrinho.limparCarrinho()
    nomeLista.value = ''
    aberto.value = false
  } catch (error) {
    console.error(error)
    alert('Erro ao salvar a lista.')
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="aberto" class="modal-overlay" @click.self="aberto = false">
      <div class="side-panel card">
        <header class="panel-header">
          <h2>Meu Planejamento</h2>
          <button @click="aberto = false" class="close-btn">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>

        <div class="panel-content">
          <div v-if="carrinho.itens.length === 0" class="empty-msg">
            <i class="fa-solid fa-basket-shopping"></i>
            <p>Sua lista está vazia.</p>
          </div>

          <div v-for="item in carrinho.itens" :key="item.id" class="item-row">
            <div class="item-info">
              <span class="tag" :class="item.nivel">{{ item.nutri }}</span>
              <strong>{{ item.nome }}</strong>
              <span class="price-sm">R$ {{ (item.preco * item.quantidade).toFixed(2) }}</span>
            </div>
            
            <div class="item-ctrl">
              <button @click="carrinho.atualizarQuantidade(item.id, item.quantidade - 1)">-</button>
              <span class="qty">{{ item.quantidade }}</span>
              <button @click="carrinho.atualizarQuantidade(item.id, item.quantidade + 1)">+</button>
              <button class="trash-btn" @click="carrinho.removerItem(item.id)">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>

        <footer class="panel-footer" v-if="carrinho.itens.length">
          <div class="input-group-save">
            <label>Nomeie seu planejamento:</label>
            <input v-model="nomeLista" type="text" placeholder="Ex: Compras da Semana..." />
          </div>

          <div class="total-row">
            <span>Total Estimado:</span>
            <strong>R$ {{ carrinho.valorTotal.toFixed(2) }}</strong>
          </div>
          
          <button class="primary w-100 btn-save" :disabled="salvando" @click="finalizarESalvar">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            {{ salvando ? 'Salvando no Banco...' : 'Salvar Lista Estratégica' }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; justify-content: flex-end; backdrop-filter: blur(2px); }
.side-panel { width: 100%; max-width: 400px; height: 100vh; border-radius: 0; display: flex; flex-direction: column; border-left: 2px solid var(--border); background: white; box-sizing: border-box; }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border); }
.close-btn { background: none; border: none; font-size: 1.5rem; color: var(--text-light); cursor: pointer; }
.panel-content { flex: 1; overflow-y: auto; padding: 20px; }
.empty-msg { text-align: center; margin-top: 50px; color: var(--text-light); }
.empty-msg i { font-size: 3rem; margin-bottom: 10px; opacity: 0.3; }
.item-row { padding: 15px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.item-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.item-info strong { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.price-sm { font-size: 0.85rem; font-weight: 700; color: var(--primary); }
.item-ctrl { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
.item-ctrl button { background: #f0f2f0; width: 30px; height: 30px; border-radius: 6px; border: none; cursor: pointer; }
.qty { font-weight: 800; min-width: 20px; text-align: center; }
.trash-btn { background: none !important; color: var(--danger); margin-left: 5px; }
.panel-footer { padding: 20px; border-top: 2px solid var(--border); background: #fcfdfc; }
.input-group-save { margin-bottom: 15px; }
.input-group-save label { font-size: 0.85rem; color: var(--text-light); display: block; margin-bottom: 5px; }
.input-group-save input { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 10px; outline: none; background: #fff; box-sizing: border-box; }
.total-row { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 20px; }
.btn-save { padding: 16px; font-size: 1rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; box-sizing: border-box; }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }

@media (max-width: 500px) {
  .modal-overlay { align-items: flex-end; }
  .side-panel { width: 100%; max-width: 100%; height: 85vh; border-radius: 20px 20px 0 0; border-left: none; border-top: 2px solid var(--border); }
}
</style>