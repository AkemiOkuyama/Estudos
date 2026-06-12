<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="brand">
        <h2>🐱 Gatópoles</h2>
        <p>
          Transformando vidas através da adoção responsável de gatos.
        </p>
      </div>

      <div class="links">
        <h3>Links</h3>

        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/adocao">Adoção</RouterLink>
        <RouterLink to="/sobre">Sobre</RouterLink>
        <RouterLink to="/login">Admin</RouterLink>
      </div>

      <div class="info">
        <h3>Contato</h3>

        <p>São Paulo - SP</p>
        <p>contato@gatopoles.org</p>
        <p>ONG sem fins lucrativos</p>
      </div>
    </div>

    <div class="bottom">
      <p>© {{ new Date().getFullYear() }} Gatópoles. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.footer {
  background: var(--primary-dark);
  color: var(--text-light);
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;

  padding: 3rem 0;
}

.brand h2 {
  color: var(--text-light);
  margin-bottom: 1rem;
}

.brand p {
  color: rgba(255, 255, 255, 0.8);
}

.links,
.info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.links h3,
.info h3 {
  color: var(--text-light);
  margin-bottom: 0.8rem;
}

.links a {
  color: rgba(255, 255, 255, 0.8);
  transition: var(--transition-fast);
}

.links a:hover {
  color: var(--text-light);
}

.info p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.bottom {
  text-align: center;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bottom p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .links,
  .info {
    align-items: center;
  }
}
</style>