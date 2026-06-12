<template>
  <main class="detalhes-container">
    
    <div v-if="loading" class="estado-central">
      <LoadingSpinner />
    </div>

    <div v-else-if="gato" class="card-detalhe">
      <div class="foto-wrapper">
        <img :src="gato.fotoUrl || '/images/logo.png'" :alt="gato.nome" class="foto-destaque" />
      </div>

      <h1>Olá, eu sou o {{ gato.nome }}!</h1>

      <div class="info-grid">
        <p><strong>Idade:</strong> {{ gato.idade }}</p>
        <p><strong>Sexo:</strong> {{ gato.sexo }}</p>
        <p v-if="gato.porte"><strong>Porte:</strong> {{ gato.porte }}</p>
      </div>

      <p class="descricao">{{ gato.descricao }}</p>

      <div class="tags" v-if="gato.castrado || gato.vacinado || gato.vermifugado">
        <span class="badge" v-if="gato.castrado">Castrado</span>
        <span class="badge" v-if="gato.vacinado">Vacinado</span>
        <span class="badge" v-if="gato.vermifugado">Vermifugado</span>
      </div>
      
      <div class="acoes">
        <a :href="whatsappLink" 
           target="_blank" 
           rel="noopener noreferrer"
           class="btn btn-whatsapp">
           Quero adotar! 🐾
        </a>
        
        <router-link to="/adocao" class="btn-voltar">Voltar para a lista</router-link>
      </div>
    </div>

    <div v-else class="estado-central">
      <EmptyState />
    </div>

  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getAnimalById } from '../services/animalService';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const gato = ref(null);
const loading = ref(true);

const whatsappNumber = '5514998482325';

const whatsappLink = computed(() => {
  if (!gato.value) return '#';
  const message = encodeURIComponent(`Olá, tenho interesse em adotar o ${gato.value.nome}`);
  return `https://wa.me/${whatsappNumber}?text=${message}`;
});

onMounted(async () => {
  try {
    gato.value = await getAnimalById(route.params.id);
  } catch (error) {
    console.error("Erro ao carregar animal:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.detalhes-container { 
  padding: 5rem 2rem; 
  display: flex; 
  justify-content: center; 
  align-items: center;
  min-height: 80vh;
}

.estado-central {
  display: flex;
  justify-content: center;
  width: 100%;
}

.card-detalhe { 
  background: var(--surface); 
  padding: 2.5rem; 
  border-radius: 20px; 
  box-shadow: var(--shadow-lg); 
  max-width: 600px; 
  width: 100%;
  text-align: center; 
}

.foto-wrapper {
  margin-bottom: 1.5rem;
}

.foto-destaque {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

h1 {
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
}

.info-grid {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.descricao {
  font-size: 1.1rem;
  color: var(--text);
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.tags {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.acoes { 
  display: flex; 
  flex-direction: column; 
  gap: 1rem; 
  align-items: center;
}

.btn-whatsapp { 
  background: var(--secondary);
  color: white; 
  width: 100%;
  padding: 1rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: bold;
}

.btn-whatsapp:hover {
  background: #f48fb1;
}

.btn-voltar { 
  color: var(--text-secondary); 
  text-decoration: none; 
  font-weight: 500;
  margin-top: 1rem;
}

.btn-voltar:hover {
  color: var(--primary);
  text-decoration: underline;
}
</style>