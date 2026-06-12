<template>
  <div class="overlay" v-if="visible">
    <div class="dialog">
      <h2>{{ title }}</h2>

      <p>{{ message }}</p>

      <div class="actions">
        <button @click="$emit('cancel')">
          Cancelar
        </button>

        <button class="danger" @click="$emit('confirm')">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: String,
  message: String,
});

defineEmits(["confirm", "cancel"]);
</script>

<style scoped>
.overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);

  display:flex;
  justify-content:center;
  align-items:center;
}

.dialog{
  background:white;
  padding:2rem;
  border-radius:16px;
  width:350px;
}

.actions{
  display:flex;
  justify-content:flex-end;
  gap:1rem;
  margin-top:2rem;
}

.danger{
  background:#ef4444;
  color:white;
}
</style>