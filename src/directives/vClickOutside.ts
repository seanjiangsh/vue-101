import type { Directive } from "vue";

// --- custom directive practice ------------------------------------------------
// A custom directive packages reusable *low-level DOM behavior* you attach with
// `v-name`. This one calls a handler when a click lands OUTSIDE the element it's
// on — the classic "close the dropdown when you click away" behavior.
//
// React has no direct equivalent: you'd hand-roll a ref + useEffect + manual
// addEventListener/removeEventListener in every component that needs it. A Vue
// directive is that logic extracted once and reused via an attribute.
//
// The lifecycle hooks below mirror a component's: `mounted` ≈ useEffect setup
// (element is now in the DOM), `unmounted` ≈ its cleanup (element is leaving).

// v-click-outside="close" → binding.value is the `close` function.
type ClickOutsideHandler = (event: MouseEvent) => void;

// We stash the listener on the element itself so unmounted() can remove the
// EXACT same function reference — addEventListener/removeEventListener only
// cancel out when handed an identical reference (an inline arrow won't match).
interface ClickOutsideEl extends HTMLElement {
  _clickOutside?: (event: MouseEvent) => void;
}

export const vClickOutside: Directive<ClickOutsideEl, ClickOutsideHandler> = {
  mounted(el, binding) {
    // Build the listener and stash it on the element, so unmounted() can hand
    // the SAME reference to removeEventListener. `el.contains(target)` is true
    // for clicks inside el, so we bail on those and only fire on outside clicks.
    el._clickOutside = (event) => {
      if (el.contains(event.target as Node)) return;
      binding.value(event);
    };
    document.addEventListener("click", el._clickOutside);
  },
  unmounted(el) {
    // TODO(you) #2 — tear it down (skip this and the listener LEAKS: it keeps
    // firing after the element is gone, holding a stale closure).
    //  a) document.removeEventListener("click", el._clickOutside) — guard for
    //     undefined first.
    //  b) delete el._clickOutside.
    void el; // remove once you use el
  },
};
