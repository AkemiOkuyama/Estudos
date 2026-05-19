<template>
  <div class="home-container">
    <div class="hero card">
      <div class="hero-content">
        <i class="fa-solid fa-seedling hero-icon"></i>
        <h1>Planeje com estratégia, <span class="text-primary">compre com economia.</span></h1>
        <p>Organize seus produtos, controle seus gastos e domine sua rotina com o EcoLista.</p>
        
        <div class="hero-actions">
          <template v-if="!authStore.user">
            <router-link to="/login" class="primary btn-large-link">Começar Agora</router-link>
          </template>

          <template v-else>
            <router-link to="/admin/produtos" class="primary btn-large-link">
              <i class="fa-solid fa-plus-circle"></i> Cadastrar Produto
            </router-link>
            <router-link to="/cart" class="secondary-btn btn-large-link">
              <i class="fa-solid fa-basket-shopping"></i> Montar Minha Lista
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore.js'
const authStore = useAuthStore()
</script>

<style scoped>
.home-container { padding: 40px 0; text-align: center; }
.hero { padding: 80px 20px; background: linear-gradient(135deg, #ffffff 0%, #f0f9f0 100%); border: none; }
.hero-icon { font-size: 4.5rem; color: var(--primary); margin-bottom: 25px; }
h1 { font-size: 2.8rem; color: var(--text); margin-bottom: 20px; line-height: 1.2; }
.text-primary { color: var(--primary); }
p { font-size: 1.2rem; color: var(--text-light); max-width: 650px; margin: 0 auto 40px; line-height: 1.6; }
.hero-actions { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }

.btn-large-link { 
  text-decoration: none; 
  padding: 16px 40px; 
  border-radius: 12px; 
  font-weight: 700; 
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}
.primary { background: var(--primary); color: white; }
.secondary-btn { background: var(--secondary); color: var(--text); }

/* Feedback visual de interação */
.primary:hover, .secondary-btn:hover { 
  opacity: 0.9; 
  transform: translateY(-2px); 
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>