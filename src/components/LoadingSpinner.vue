<template>
  <p class="loading" role="status">
    <span class="spinner" aria-hidden="true" />
    Loading…
  </p>
</template>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--text-h);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
