<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore.js'
import { useCarrinhoStore } from './stores/cartStore.js'
import CartModal from './views/CartModal.vue'
import logoUrl from './assets/EcoLista.png'

const authStore = useAuthStore()
const carrinho = useCarrinhoStore()
const router = useRouter()
const modalAberto = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
const userDisplay = computed(() => authStore.user?.email.split('@')[0] || 'Usuário')
</script>

<template>
  <div class="web-app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="brand" @click="router.push('/')">
          <img :src="logoUrl" alt="Logo" class="logo-img" />
          <h1>EcoLista</h1>
        </div>
        
        <div class="nav-links">
          <router-link to="/">Início</router-link> 
          
          <router-link to="/cart">Loja</router-link>
          <router-link v-if="authStore.user" to="/dashboard">Listas</router-link>
          <router-link v-if="authStore.user" to="/admin/produtos">Cadastro</router-link>
        </div>

        <div class="nav-actions">
          <button class="btn-cart" @click="modalAberto = true">
            <i class="fa-solid fa-cart-shopping icon-white"></i>
            <span v-if="carrinho.totalItens > 0" class="badge">{{ carrinho.totalItens }}</span>
          </button>
          
          <div v-if="authStore.user" class="user-info">
            <span class="username">{{ userDisplay }}</span>
            <button class="btn-exit" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span>Sair</span>
            </button>
          </div>
          <router-link v-else to="/login" class="btn-login">Entrar</router-link>
        </div>
      </div>
    </nav>

    <main class="layout">
      <router-view></router-view>
    </main>

    <CartModal v-model="modalAberto" />
  </div>
</template>

<style scoped>
.navbar { background: white; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 1000; }
.nav-container { max-width: 1100px; margin: 0 auto; height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
.brand { display: flex; align-items: center; gap: 10px; cursor: pointer; color: var(--primary); }
.logo-img { width: 32px; height: 32px; }
.nav-links { display: flex; gap: 20px; }
.nav-links a { text-decoration: none; color: var(--text); font-weight: 600; font-size: 0.9rem; }
.nav-links a.router-link-active { color: var(--primary); }
.nav-actions { display: flex; align-items: center; gap: 15px; }
.btn-cart { background: var(--secondary); width: 42px; height: 42px; border-radius: 10px; position: relative; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
.icon-white { color: white !important; font-size: 1.1rem; }
.badge { position: absolute; top: -5px; right: -5px; background: var(--danger); color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; border: 2px solid white; }
.user-info { display: flex; align-items: center; gap: 12px; border-left: 1px solid var(--border); padding-left: 15px; }
.username { font-size: 0.9rem; font-weight: 500; }
.btn-exit { background: #fff5f5; color: var(--danger); padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; border: 1px solid #ffebeb; display: flex; align-items: center; gap: 5px; cursor: pointer; transition: 0.2s; }
.btn-exit:hover { background: var(--danger); color: white; }
.btn-login { background: var(--primary); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
</style>