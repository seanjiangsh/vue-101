import { onActivated, onDeactivated, onMounted, onUnmounted } from "vue";

/**
 * Run `handler` whenever `targetKey` is pressed, but only while the host
 * component is on screen. The lifecycle hooks are called INSIDE this function
 * so they register against the component that calls it (during its setup) —
 * calling them at module scope would run once at import time, with no active
 * component instance to attach to.
 *
 *   useKeydown("Escape", reset);
 *
 * Why all four hooks? So it works with OR without <KeepAlive>:
 *   - No KeepAlive: onMounted adds, onUnmounted removes.
 *   - KeepAlive:    the component isn't unmounted on navigation, so onUnmounted
 *                   wouldn't fire — onActivated/onDeactivated add/remove on the
 *                   show/hide instead.
 * Registering on both pairs is safe: addEventListener ignores a duplicate with
 * the same type + same function reference, so the extra call is a no-op.
 */
export function useKeydown(
  targetKey: string,
  handler: (event: KeyboardEvent) => void,
): void {
  function onKeydown(event: KeyboardEvent): void {
    if (event.key === targetKey) handler(event);
  }

  // Same `onKeydown` reference for add and remove, so removal always matches.
  const start = (): void => window.addEventListener("keydown", onKeydown);
  const stop = (): void => window.removeEventListener("keydown", onKeydown);

  onMounted(start);
  onActivated(start);
  onUnmounted(stop);
  onDeactivated(stop);
}
