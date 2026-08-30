import { onScopeDispose, ref, type Ref } from "vue";

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
export function useInterval(
  callback: () => void,
  ms: number,
): UseIntervalReturn {
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

  // Stop the timer when the owning scope is disposed, so it never leaks past the
  // component/scope that started it. Fires on component unmount OR a manual
  // effectScope().stop() — which is exactly why this is onScopeDispose and not
  // onUnmounted.
  onScopeDispose(stop);

  return { isActive, start, stop };
}
