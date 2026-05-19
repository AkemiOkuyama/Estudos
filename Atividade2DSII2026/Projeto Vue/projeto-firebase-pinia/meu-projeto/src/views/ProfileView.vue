<template>
  <div class="profile-container">
    <div class="card profile-card">
      <div class="avatar-section">
        <div class="avatar">{{ authStore.user?.email[0].toUpperCase() }}</div>
        <h2>Meu Perfil</h2>
      </div>
      
      <div class="info-list">
        <div class="info-item">
          <label>E-mail</label>
          <p>{{ authStore.user?.email }}</p>
        </div>
        <div class="info-item">
          <label>Status da Conta</label>
          <p><span class="badge-active">Ativa</span></p>
        </div>
      </div>

      <button class="btn-outline w-100" @click="authStore.logout()">
        <i class="fa-solid fa-arrow-right-from-bracket"></i> Encerrar Sessão
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore.js'
const authStore = useAuthStore()
</script>

<style scoped>
.profile-container { display: flex; justify-content: center; padding: 40px 0; }
.profile-card { width: 100%; max-width: 500px; text-align: center; }
.avatar { 
  width: 80px; height: 80px; background: var(--primary); color: white; 
  font-size: 2rem; border-radius: 50%; display: flex; align-items: center; 
  justify-content: center; margin: 0 auto 15px; font-weight: bold;
}
.info-list { text-align: left; margin: 30px 0; }
.info-item { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
.info-item label { font-size: 0.8rem; color: #7f8c8d; text-transform: uppercase; }
.info-item p { margin: 5px 0 0; font-weight: 600; }
.badge-active { background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; }
.btn-outline { 
  background: transparent; border: 2px solid #eee; color: var(--accent); 
  width: 100%; padding: 12px; border-radius: 10px;
}
.btn-outline:hover { background: #fff5f5; border-color: var(--accent); }
</style>