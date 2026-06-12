<template>
  <article class="card">
    <div class="image-wrapper">
      <img
        :src="animal.fotoUrl && animal.fotoUrl.trim() !== '' ? animal.fotoUrl : '/images/cat-placeholder.png'"
        :alt="animal.nome || 'Gatinho'"
        class="animal-photo"
      />
      <span class="status">Disponível</span>
    </div>

    <div class="content">
      <h3>{{ animal.nome || 'Sem Nome' }}</h3>

      <div class="info">
        <span>🐱 {{ animal.sexo || 'Não informado' }}</span>
        <span>🎂 {{ animal.idade || 'Não informada' }}</span>
      </div>

      <p>{{ animal.descricao || 'Este gatinho ainda não tem uma descrição.' }}</p>

      <div class="tags" v-if="animal.castrado || animal.vacinado || animal.vermifugado">
        <span v-if="animal.castrado">Castrado</span>
        <span v-if="animal.vacinado">Vacinado</span>
        <span v-if="animal.vermifugado">Vermifugado</span>
      </div>

      <a 
        v-if="whatsappLink"
        :href="whatsappLink" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="btn-whatsapp"
      >
        Quero adotar 💜
      </a>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  animal: { 
    type: Object, 
    required: true,
    default: () => ({})
  },
});

const whatsappNumber = '5514998482325';
const whatsappLink = computed(() => {
  if (!props.animal || !props.animal.nome) return null;
  const message = encodeURIComponent(`Olá, tenho interesse em adotar o ${props.animal.nome}`);
  return `https://wa.me/${whatsappNumber}?text=${message}`;
});
</script>

<style scoped>
.card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
}

.image-wrapper {
  position: relative;
  background-color: #f3f4f6; 
}

.animal-photo {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block; 
}

.status {
  position: absolute;
  top: 15px;
  left: 15px;
  background: var(--primary);
  color: var(--text-light);
  font-size: var(--font-xs);
  padding: 0.4rem 1rem;
  border-radius: var(--radius-full);
  font-weight: var(--weight-bold);
  z-index: 1; 
}

.content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex-grow: 1; 
}

h3 {
  margin: 0;
  color: var(--text);
  font-size: var(--font-lg);
}

.info {
  display: flex;
  gap: 1rem;
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

p {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tags span {
  background: var(--primary-soft);
  color: var(--primary-dark);
  font-size: var(--font-xs);
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-full);
  font-weight: var(--weight-medium);
}

.btn-whatsapp {
  display: block;
  text-align: center;
  background: var(--primary);
  color: white;
  padding: 0.8rem;
  border-radius: var(--radius-full);
  text-decoration: none;
  font-weight: bold;
  margin-top: auto; 
  transition: background-color 0.3s;
}

.btn-whatsapp:hover {
  background: var(--primary-dark);
}
</style>