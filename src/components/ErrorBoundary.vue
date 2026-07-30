<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

// Holds the captured error. null = no error → render the children normally.
const error = ref<Error | null>(null);

// Limitation to remember (same as a React error boundary): this catches errors
// thrown during a descendant's render / lifecycle / watchers — NOT errors from
// event handlers or async callbacks (those bypass it).

function retry(): void {
  // Clear the error so the <slot> renders again.
  error.value = null;
}

onErrorCaptured((err) => {
  // 1. store `err` in `error` so the template shows the fallback
  // 2. `return false` to STOP the error propagating further up
  //    (to parent boundaries / Vue's global handler)
  error.value = err;
  return false;
});
</script>

<template>
  <!-- When a child has thrown, show the fallback instead of the children. -->
  <div v-if="error" class="error-boundary">
    <p>⚠️ Something broke: {{ error.message }}</p>
    <button type="button" @click="retry" class="error-button">Retry</button>
  </div>

  <!-- Otherwise render whatever was placed between the boundary's tags. -->
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  border: 1px solid var(--error);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--error);
}
.error-button {
  margin-top: 8px;
}
</style>
