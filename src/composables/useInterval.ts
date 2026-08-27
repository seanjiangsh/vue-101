import { ref, type Ref } from "vue";
// 👉 TODO: import { onScopeDispose } from "vue" for the cleanup step below.

interface UseIntervalReturn {
  isActive: Ref<boolean>;
  start: () => void;
  stop: () => void;
}

/**
 * Run `callback` every `ms` while active, with start/stop control.
 *
 * The lesson is the cleanup (your TODO): use `onScopeDispose`, NOT `onUnmounted`.
 * A component's setup() IS an "effect scope", so inside a component this behaves
 * exactly like onUnmounted. But onScopeDispose ALSO fires for a *manual*
 * effectScope().stop() — so this same composable cleans up correctly whether
 * it's used in a component OR inside a standalone scope (see the effectScope
 * stretch). It's the general-purpose cleanup primitive composables should use.
 */
export function useInterval(callback: () => void, ms: number): UseIntervalReturn {
  const isActive = ref<boolean>(false);
  let id: ReturnType<typeof setInterval> | undefined;

  function start(): void {
    if (isActive.value) return; // already running — don't stack timers
    isActive.value = true;
    id = setInterval(callback, ms);
  }

  function stop(): void {
    isActive.value = false;
    clearInterval(id);
    id = undefined;
  }

  // 👉 TODO (your practice): stop the timer when the owning scope is disposed,
  //    so it never leaks past the component/scope that started it:
  //
  //      onScopeDispose(stop);
  //
  //    (import onScopeDispose from "vue" above.) Then verify it in the demo:
  //    toggling the demo off UNMOUNTS it, which disposes its scope and fires
  //    this — the ticking stops with no leaked setInterval.

  return { isActive, start, stop };
}
