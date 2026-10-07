import { customRef, type Ref } from "vue";

// --- customRef practice ------------------------------------------------------
// A normal ref does two things automatically: when read, it TRACKS whoever is
// reading it (a render, computed or watcher); when written, it TRIGGERS them to
// re-run. customRef hands both of those to you. `track()` and `trigger()` are the
// raw reactivity primitives, and you decide when each one runs.
//
// Here we delay `trigger()`, which gives a debounced ref. You can bind it with
// v-model like any other ref, and its dependents update only after the user
// pauses typing. React has nothing as direct: you'd pair useState with a
// useDebounce hook and keep two values (raw and debounced) in sync yourself.

export function useDebouncedRef<T>(initial: T, delay = 300): Ref<T> {
  let value = initial;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return customRef<T>((track, trigger) => ({
    get() {
      // Register the current reader (render/computed/watch) as a dependent.
      // Leave this out and nothing would ever re-run when the value changes.
      track();
      return value;
    },
    set(newValue) {
      // Debounce: each write cancels the one still waiting, so only the last
      // write in a burst lands. The assignment sits inside the timeout next to
      // trigger(), so readers keep seeing the old value until the delay ends
      // and then all move to the new value together.
      clearTimeout(timer);
      timer = setTimeout(() => {
        value = newValue;
        trigger();
      }, delay);
    },
  }));

  // TODO(you) #2: stop a pending timer from firing after its owner is gone.
  // If the component unmounts during the delay, the timeout still fires later
  // and calls trigger() on a ref nobody uses. Register an onScopeDispose
  // callback that clears the timer (the same pattern as useInterval in Part A).
  // Note: `return customRef(...)` above exits the function, so store the ref in
  // a const, register the cleanup, and then return the const.
}
