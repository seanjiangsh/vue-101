/**
 * Return the element after `current` in `arr`, wrapping around at the end.
 * If `current` isn't found, falls back to the first element.
 *
 * The `readonly [T, ...T[]]` parameter is a *non-empty* tuple: it forces
 * callers to pass an array with at least one element, which guarantees
 * `arr[0]` exists — so this function can never return `undefined`.
 * Pass literal arrays with `as const` to satisfy it, e.g.
 *   cycle(["a", "b", "c"] as const, current)
 */
export function cycle<T>(arr: readonly [T, ...T[]], current: T): T {
  const i = arr.indexOf(current);
  if (i === -1) {
    return arr[0]; // not found → start from the beginning
  }
  return arr[(i + 1) % arr.length]; // % wraps the last element back to arr[0]
}
