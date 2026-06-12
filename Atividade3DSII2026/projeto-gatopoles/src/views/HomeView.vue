<template>
  <main class="home">

    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text">
          <span class="badge">🐾 Adoção responsável</span>
          <h1>
            Um lar muda tudo.<br />
            Um gato também.
          </h1>
          <p>
            A Gatópoles conecta gatos resgatados a famílias responsáveis,
            promovendo adoções seguras e cheias de amor.
          </p>
          <div class="actions">
            <RouterLink to="/adocao" class="btn">Ver gatinhos</RouterLink>
            <RouterLink to="/sobre" class="btn-outline">Conhecer a ONG</RouterLink>
          </div>
        </div>

        <div class="hero-card">
          <div class="hero-box">
            <h2>💜 Faça parte dessa história</h2>
            <p>Cada adoção abre espaço para salvar mais uma vida.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container stats-grid">
        <div class="stat">
          <h3>+10 anos</h3>
          <p>de atuação</p>
        </div>
        <div class="stat">
          <h3>+80</h3>
          <p>voluntários</p>
        </div>
        <div class="stat">
          <h3>centenas</h3>
          <p>de gatos resgatados</p>
        </div>
        <div class="stat">
          <h3>adoção responsável</h3>
          <p>como prioridade</p>
        </div>
      </div>
    </section>

    <section class="mission">
      <div class="container">
        <h2>Nossa missão</h2>
        <div class="cards">
          <div class="card">
            <h3>🐱 Resgatar</h3>
            <p>Retirar gatos de situações de risco e abandono.</p>
          </div>
          <div class="card">
            <h3>🩺 Cuidar</h3>
            <p>Garantir atendimento veterinário completo.</p>
          </div>
          <div class="card">
            <h3>🏡 Acolher</h3>
            <p>Encontrar lares seguros e responsáveis.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h2>Pronto para mudar uma vida?</h2>
        <p>Veja os gatos disponíveis e encontre seu novo melhor amigo.</p>
        <RouterLink to="/adocao" class="btn-light">
          Adotar agora 💜
        </RouterLink>
      </div>
    </section>

  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: var(--text-light);
  padding: 5rem 0;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: center;
}

.hero-text h1 {
  color: white;
  font-size: 3rem;
  line-height: 1.1;
}

.hero-text p {
  color: rgba(255, 255, 255, 0.9);
  margin-top: 1rem;
}

.stats, .mission {
  padding: 5rem 0;
}

.stats h3, .stats p, .mission h2, .mission h3, .mission p {
  color: var(--text);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  text-align: center;
}

.stat h3 {
  color: var(--primary);
  font-size: 1.8rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.card {
  background: var(--surface);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
}

.cta {
  background: var(--primary);
  color: white;
  padding: 5rem 0;
  text-align: center;
}

.btn-outline {
  padding: 0.9rem 1.5rem;
  border: 2px solid white;
  color: white;
  border-radius: 999px;
  transition: 0.3s;
}

.btn-outline:hover {
  background: white;
  color: var(--primary-dark);
}

.btn-light {
  display: inline-block;
  margin-top: 2rem;
  background: white;
  color: var(--primary-dark);
  padding: 0.9rem 1.8rem;
  border-radius: 999px;
  font-weight: bold;
}

@media (max-width: 900px) {
  .hero-content { grid-template-columns: 1fr; text-align: center; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .cards { grid-template-columns: 1fr; }
}
</style>