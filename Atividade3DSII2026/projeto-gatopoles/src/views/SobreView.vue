<template>
  <main class="sobre">

    <section class="hero">
      <div class="container hero-content">
        <span class="badge">🐾 Sobre a Gatópoles</span>
        <h1>Uma missão movida por amor aos gatos</h1>
        <p>
          A Gatópoles é uma ONG dedicada ao resgate, cuidado e adoção responsável
          de gatos em situação de vulnerabilidade.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container content">
        <h2>Nossa história</h2>
        <p>
          Fundada em 2013 em São Paulo, a Gatópoles nasceu da união de pessoas
          apaixonadas por gatos que decidiram agir diante do abandono e dos riscos
          enfrentados pelos animais nas ruas.
        </p>
        <p>
          Desde então, a ONG atua com uma rede de aproximadamente 80 voluntários,
          que dedicam seu tempo para resgatar, tratar e encaminhar gatos para
          adoção responsável.
        </p>
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
            <p>Oferecer tratamento veterinário completo e acolhimento.</p>
          </div>
          <div class="card">
            <h3>🏡 Adoção responsável</h3>
            <p>Garantir lares seguros e definitivos.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="container content">
        <h2>Quem faz isso acontecer</h2>
        <p>
          A Gatópoles é mantida por voluntários que atuam de forma independente,
          sem apoio governamental. O trabalho é sustentado por doações e pela
          dedicação de pessoas que acreditam na causa animal.
        </p>
        <p>
          Cada contribuição ajuda a salvar mais vidas e garantir que mais gatos
          tenham a chance de encontrar um lar cheio de amor.
        </p>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h2>Quer fazer parte dessa história?</h2>
        <p>Conheça nossos gatos disponíveis para adoção.</p>
        <RouterLink to="/adocao" class="btn-light">
          Ver adoções 💜
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
  text-align: center;
}

.hero h1 {
  color: white;
  font-size: 2.8rem;
}

.hero p {
  color: rgba(255, 255, 255, 0.85);
  max-width: 700px;
  margin: 1rem auto 0;
}

.badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.section {
  padding: 5rem 0;
}

.section.alt {
  background: var(--surface);
}

.section h2, 
.mission h2, 
.card h3 {
  color: var(--primary);
}

.section p {
  color: var(--text-secondary);
}

.content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.content h2 {
  margin-bottom: 1.5rem;
}

.mission {
  background: var(--background);
  padding: 5rem 0;
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
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.cta {
  background: var(--primary);
  color: var(--text-light);
  text-align: center;
}

.cta h2 {
  color: white;
}

.btn-light {
  display: inline-block;
  margin-top: 2rem;
  background: white;
  color: var(--primary-dark);
  padding: 0.9rem 1.8rem;
  border-radius: 999px;
  font-weight: bold;
  transition: 0.3s;
}

.btn-light:hover {
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .cards {
    grid-template-columns: 1fr;
  }
  .hero h1 {
    font-size: 2rem;
  }
}
</style>