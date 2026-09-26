<script setup lang="ts">
import { ref } from "vue";

// Local registration: importing a directive as a `v`-prefixed const is enough —
// <script setup> auto-registers `vClickOutside` as `v-click-outside` in the
// template. (Global alternative: app.directive("click-outside", ...) in main.ts,
// for a directive used app-wide.)
import { vClickOutside } from "../directives/vClickOutside";

const open = ref<boolean>(false);
function close(): void {
  open.value = false;
}
</script>

<template>
  <!-- v-click-outside wraps BOTH the button and the panel. So clicking the
       toggle counts as "inside" (won't close), and only a click elsewhere on the
       page closes the menu. Put the directive on just the panel instead and the
       very click that opens it would bubble out and close it again — a good bug
       to try once you've implemented the directive. -->
  <div class="dropdown" v-click-outside="close">
    <button type="button" @click="open = !open">Menu ▾</button>
    <ul v-if="open" class="dropdown-panel">
      <li>Profile</li>
      <li>Settings</li>
      <li>Sign out</li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 0;
  margin: 4px 0 0;
  padding: 4px;
  list-style: none;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: var(--shadow);
  min-width: 140px;
  z-index: 50;
}
.dropdown-panel li {
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.dropdown-panel li:hover {
  background: var(--border);
}
</style>
