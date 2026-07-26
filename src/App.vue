<script setup lang="ts">
import { KeepAlive } from "vue";

// App shell: a nav to switch scenes, and <RouterView> where the matched
// route's component renders (the router is registered in main.ts).
</script>

<template>
  <nav class="scene-nav">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/perspective">Perspective</RouterLink>
  </nav>

  <RouterView v-slot="{ Component }">
    <KeepAlive><component :is="Component" /></KeepAlive>
  </RouterView>
</template>

<style scoped>
/* Scoped: these styles apply only to App.vue's own elements. */
.scene-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 12px;
  border-bottom: 1px solid var(--border);
}

.scene-nav a {
  color: var(--text);
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 5px;
}

/* Vue Router adds `.router-link-active` to the link of the current route. */
.scene-nav a.router-link-active {
  color: var(--accent);
  background: var(--accent-bg);
}
</style>
