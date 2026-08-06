<script setup lang="ts">
import { useKeydown } from "../composables/useKeydown";

// v-model:open — a *named* model. `defineModel("open")` pairs with the parent's
// `v-model:open="..."`. (`defineModel()` with no name is the default v-model;
// a component can expose several named models.)
const open = defineModel<boolean>("open", { default: false });

function close(): void {
  open.value = false;
}

useKeydown("Escape", close);
</script>

<template>
  <!-- <Teleport> relocates this markup to <body>, so the overlay can't be
       clipped or positioned by a parent's overflow/transform. It's Vue's
       createPortal. Note: scoped styles STILL apply — Vue keeps the data-v
       attribute on the teleported nodes. -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <!-- @click.self: only a click on the backdrop itself (not its children)
           closes. `.self` is an event modifier — no manual target check. -->
      <div v-if="open" class="modal-backdrop" @click.self="close">
        <div class="modal" role="dialog" aria-modal="true">
          <header class="modal-header">
            <!-- Named slot, with fallback content if the parent omits it. -->
            <slot name="header">Dialog</slot>
            <button
              type="button"
              class="modal-x"
              aria-label="Close"
              @click="close"
            >
              ✕
            </button>
          </header>

          <div class="modal-body">
            <!-- Default (unnamed) slot: the main content. -->
            <slot />
          </div>

          <footer class="modal-footer">
            <!-- Named slot with a sensible default action. -->
            <slot name="footer" :close="close">
              <button type="button" @click="close">Close</button>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 100;
}
.modal {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  min-width: 300px;
  max-width: 90vw;
  box-shadow: var(--shadow);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text-h);
}
.modal-body {
  padding: 16px;
}
.modal-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
}
.modal-x {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  font-size: 18px;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
