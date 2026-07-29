<script setup lang="ts">
import { computed, ref } from "vue";

const boom = ref<boolean>(false);

// The error is thrown HERE — while this computed is evaluated during render —
// NOT inside the click handler. That distinction is the whole lesson: error
// boundaries only catch errors from render / lifecycle / watchers, so throwing
// directly in @click would escape the boundary. The button just flips a flag,
// and the resulting re-render is what throws.
const message = computed<string>(() => {
  if (boom.value) throw new Error("BuggyChild exploded during render");
  return "I'm fine — click to explode";
});
</script>

<template>
  <div class="buggy-child">
    <p>{{ message }}</p>
    <button type="button" @click="boom = true">Explode 💥</button>
  </div>
</template>
