<template>
  <div class="spinner"></div>
</template>

<style scoped>
.spinner {
  width: 50px;
  height: 50px;

  border: 5px solid #eee;
  border-top-color: var(--primary);

  border-radius: 50%;

  animation: spin .8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>