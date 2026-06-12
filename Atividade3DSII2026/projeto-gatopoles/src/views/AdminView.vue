<template>
  <main class="admin-page">
    
    <section class="admin-header">
      <div class="container header-content">
        <div class="brand">
          <div>
            <span class="badge">⚙️ Painel administrativo</span>
            <h1>Gerenciar gatinhos</h1>
            <p>Cadastre, edite ou remova animais para adoção.</p>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">Sair</button>
      </div>
    </section>

    <section class="container admin-content">
      
      <div class="card form-card">
        <h2>{{ editingAnimal ? "Editar gatinho" : "Cadastrar gatinho" }}</h2>
        <AnimalForm
          :animal="editingAnimal"
          :submit-label="editingAnimal ? 'Salvar alterações' : 'Cadastrar'"
          @submit="saveAnimal"
        />
      </div>

      <div class="card list-card">
        <h2>Animais cadastrados</h2>

        <div v-if="loading" class="status-msg">Carregando...</div>
        
        <div v-else-if="animals.length === 0" class="status-msg">
          Nenhum animal cadastrado ainda.
        </div>

        <div v-else class="list">
          <div v-for="animal in animals" :key="animal.id" class="item">
            <img :src="animal.fotoUrl || '/images/logo.png'" :alt="animal.nome" />
            <div class="info">
              <h3>{{ animal.nome }}</h3>
              <p>{{ animal.sexo }} • {{ animal.idade }}</p>
              <div class="actions">
                <button class="btn-edit" @click="editAnimal(animal)">Editar</button>
                <button class="btn-delete" @click="removeAnimal(animal.id)">Excluir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AnimalForm from "../components/AnimalForm.vue";
import { getAnimals, addAnimal, updateAnimal, deleteAnimal } from "../services/animalService";
import { logout } from "../services/authService";

const router = useRouter();
const animals = ref([]);
const loading = ref(true);
const editingAnimal = ref(null);

async function loadAnimals() {
  loading.value = true;
  try {
    animals.value = await getAnimals();
  } finally {
    loading.value = false;
  }
}

async function saveAnimal(data) {
  try {
    if (editingAnimal.value) {
      await updateAnimal(editingAnimal.value.id, data);
      editingAnimal.value = null;
    } else {
      await addAnimal(data);
    }
    await loadAnimals();
    alert("Operação realizada com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Falha ao salvar. Verifique se você está logado!");
  }
}

function editAnimal(animal) {
  editingAnimal.value = { ...animal };
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function removeAnimal(id) {
  if (!confirm("Deseja realmente excluir este animal?")) return;
  await deleteAnimal(id);
  await loadAnimals();
}

async function handleLogout() {
  await logout();
  router.push("/login");
}

onMounted(loadAnimals);
</script>

<style scoped>
.admin-page { background: var(--background); min-height: 100vh; }

.admin-header {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-light));
  color: var(--text-light);
  padding: 3rem 0;
}

.header-content { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}

.brand { display: flex; align-items: center; gap: 1rem; }

.logout-btn { 
  background: white; color: var(--primary-dark); font-weight: 600; 
  padding: 0.6rem 1.2rem; border-radius: var(--radius-full); 
  border: none; cursor: pointer; transition: var(--transition);
}

.admin-content { 
  display: grid; 
  grid-template-columns: 1fr 1.2fr; 
  gap: 2rem; 
  padding: 3rem 0; 
  align-items: start;
}

.status-msg { color: var(--text-muted); text-align: center; margin-top: 2rem; }

.list { display: flex; flex-direction: column; gap: 1rem; }

.item {
  display: flex; gap: 1rem; padding: 1rem;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-md); transition: var(--transition);
}

.item img { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); }
.info h3 { margin: 0; color: var(--text); }
.info p { color: var(--text-secondary); font-size: var(--font-sm); }

.actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }

.btn-edit, .btn-delete { 
  border: none; padding: 0.4rem 0.8rem; border-radius: var(--radius-full); 
  cursor: pointer; font-weight: 600; font-size: var(--font-xs);
}
.btn-edit { background: var(--primary); color: white; }
.btn-delete { background: var(--danger); color: white; }

@media (max-width: 900px) {
  .admin-content { grid-template-columns: 1fr; }
  .header-content { flex-direction: column; gap: 1rem; }
}
</style>