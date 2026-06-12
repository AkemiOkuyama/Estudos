<template>
  <form @submit.prevent="handleSubmit" class="animal-form">
    
    <div class="form-group">
      <label>Nome do Gatinho</label>
      <input type="text" v-model="form.nome" placeholder="Ex: Mimi" required />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Sexo</label>
        <select v-model="form.sexo" required>
          <option value="">Selecione...</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
        </select>
      </div>

      <div class="form-group">
        <label>Idade</label>
        <input type="text" v-model="form.idade" placeholder="Ex: 2 meses" required />
      </div>
    </div>

    <div class="form-group">
      <label>Descrição</label>
      <textarea v-model="form.descricao" placeholder="Conte um pouco sobre a personalidade dele..." rows="3" required></textarea>
    </div>

    <div class="form-group">
      <label>URL da Foto</label>
      <input type="url" v-model="form.fotoUrl" placeholder="https://exemplo.com/foto.jpg" />
    </div>

    <div class="checkbox-group">
      <label class="checkbox-item">
        <input type="checkbox" v-model="form.castrado" /> Castrado
      </label>
      <label class="checkbox-item">
        <input type="checkbox" v-model="form.vacinado" /> Vacinado
      </label>
      <label class="checkbox-item">
        <input type="checkbox" v-model="form.vermifugado" /> Vermifugado
      </label>
    </div>

    <button type="submit" class="btn">{{ submitLabel }}</button>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  animal: { type: Object, default: null },
  submitLabel: { type: String, default: "Cadastrar" }
});

const emit = defineEmits(["submit"]);

const form = ref({
  nome: "",
  sexo: "",
  idade: "",
  descricao: "",
  fotoUrl: "",
  castrado: false,
  vacinado: false,
  vermifugado: false
});

watch(() => props.animal, (newVal) => {
  if (newVal) {
    form.value = { ...newVal };
  } else {
    form.value = { nome: "", sexo: "", idade: "", descricao: "", fotoUrl: "", castrado: false, vacinado: false, vermifugado: false };
  }
}, { immediate: true });

function handleSubmit() {
  emit("submit", { ...form.value });
  if (!props.animal) {
    form.value = { nome: "", sexo: "", idade: "", descricao: "", fotoUrl: "", castrado: false, vacinado: false, vermifugado: false };
  }
}
</script>

<style scoped>
.animal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-weight: var(--weight-semibold);
  font-size: var(--font-sm);
  color: var(--primary-dark);
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin: 0.5rem 0;
  padding: 1rem;
  background: var(--surface-hover);
  border-radius: var(--radius-md);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-sm);
  cursor: pointer;
}

.checkbox-item input {
  width: auto;
  margin: 0;
}

.btn {
  width: 100%;
  margin-top: 1rem;
}
</style>