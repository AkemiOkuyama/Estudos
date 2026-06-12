<template>
  <header class="navbar">
    <div class="container nav-content">

      <RouterLink to="/" class="logo">
        <img src="/images/logo.png" alt="Gatópoles" />
      </RouterLink>

      <button class="menu-toggle" @click="menuOpen = !menuOpen">
        ☰
      </button>

      <nav :class="{ open: menuOpen }">
        <RouterLink to="/" @click="closeMenu">Home</RouterLink>
        <RouterLink to="/adocao" @click="closeMenu">Adoção</RouterLink>
        <RouterLink to="/sobre" @click="closeMenu">Sobre</RouterLink>
        <RouterLink to="/login" class="login-btn" @click="closeMenu">
          Admin
        </RouterLink>
      </nav>

    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const menuOpen = ref(false);

function closeMenu() {
  menuOpen.value = false;
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  height: 80px; 
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--primary);
  flex-shrink: 0;
}

.logo img {
  width: 150px !important; 
  height: 100px !important;
  object-fit: contain;     
  border-radius: 8px;      
}

nav {
  display: flex;
  gap: 2rem;
  align-items: center; 
}

nav a {
  color: var(--text-secondary);
  font-weight: var(--weight-medium);
  transition: 0.2s;
  display: flex;
  align-items: center;
}

nav a:hover { color: var(--primary); }

.router-link-active {
  color: var(--primary);
  font-weight: 600;
}

.login-btn {
  background: var(--primary);
  color: white !important;
  padding: 0.6rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu-toggle { display: block; }

  nav {
    display: none;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--surface);
    padding: 2rem;
    border-bottom: 1px solid var(--border);
    gap: 1.5rem;
  }

  nav.open { display: flex; }
}
</style>