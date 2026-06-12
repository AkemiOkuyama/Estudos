<template>
  <main class="adocao">
    <section class="hero">
      <div class="container">
        <span class="badge">🐾 Encontre seu novo amigo</span>
        <h1>Adoção responsável</h1>
        <p>Conheça os gatinhos disponíveis para adoção e encontre o seu companheiro ideal.</p>
      </div>
    </section>

    <section class="filters">
      <div class="container filter-box">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar pelo nome..."
        />
        <select v-model="sexo">
          <option value="">Todos os sexos</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
        </select>
      </div>
    </section>

    <section class="lista">
      <div class="container">
        <div v-if="loading" class="state-msg">Carregando gatinhos...</div>

        <div v-else-if="filteredAnimals.length === 0" class="state-msg">
          Nenhum gatinho encontrado com esses filtros 🐱
        </div>

        <div v-else class="grid">
          <AnimalCard
            v-for="animal in filteredAnimals"
            :key="animal.id"
            :animal="animal"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AnimalCard from "../components/AnimalCard.vue";
import { getAnimals } from "../services/animalService";

const animals = ref([]);
const loading = ref(true);
const search = ref("");
const sexo = ref("");

async function loadAnimals() {
  loading.value = true;
  try {
    animals.value = await getAnimals();
  } finally {
    loading.value = false;
  }
}

const filteredAnimals = computed(() => {
  return animals.value.filter((a) => {
    const matchName = a.nome?.toLowerCase().includes(search.value.toLowerCase());
    const matchSexo = sexo.value ? a.sexo === sexo.value : true;
    return matchName && matchSexo;
  });
});

onMounted(loadAnimals);
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: var(--text-light);
  padding: 5rem 0;
  text-align: center;
}

.hero h1 { color: white; }

.hero p {
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 1rem auto 0;
}

.filters {
  background: var(--surface);
  padding: 2rem 0;
  border-bottom: 1px solid var(--border);
}

.filter-box {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-box input,
.filter-box select {
  padding: 0.9rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  min-width: 250px;
  background: var(--background);
}

.lista { padding: 4rem 0; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.state-msg {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
  font-size: var(--font-lg);
}

@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
}
</style>