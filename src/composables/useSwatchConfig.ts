import type { InjectionKey, Ref } from "vue";

// --- provide / inject practice ------------------------------------------------
// This is Vue's dependency injection: a parent `provide`s a value under a key,
// and ANY descendant (however deep) can `inject` it — no prop-drilling through
// the levels in between. React equivalent: createContext + <Provider> +
// useContext. The difference you'll feel: reactivity flows through injection
// automatically (provide a ref, injectors stay live), and there's no Provider
// re-render cascade.
//
// Scope note: this is *subtree*-scoped state (only components under the provider
// see it). That's the sweet spot between props (too tedious) and Pinia (global,
// overkill). It's literally the mechanism Vue Router and Pinia use internally.

export type SwatchSize = "sm" | "md" | "lg";

export interface SwatchConfig {
  size: SwatchSize;
  showLabels: boolean;
}

// Used as the fallback when a component injects with no provider above it — and
// as the starting value a provider can seed its own ref with.
export const defaultSwatchConfig: SwatchConfig = {
  size: "md",
  showLabels: true,
};

// A *typed* InjectionKey. The symbol carries the value's type (Ref<SwatchConfig>),
// so provide() rejects a wrong value and inject() returns the right type with no
// casting. (React: this is what createContext<T>() gives you — minus the
// `T | null` default and the null-check ceremony at every useContext call.)
export const swatchConfigKey = Symbol(
  "swatchConfig",
) as InjectionKey<Ref<SwatchConfig>>;

/**
 * TODO(you) #1 — provide the config so descendants can inject it.
 *
 *   import { provide } from "vue";
 *   ...
 *   provide(swatchConfigKey, config);
 *
 * Pass the WHOLE ref, not `config.value`: reactivity flows through injection, so
 * when the provider later mutates the ref, every injector re-renders. Hand over
 * `.value` and you'd freeze a snapshot (the injectors would never update).
 */
export function provideSwatchConfig(config: Ref<SwatchConfig>): void {
  // 👉 your provide(...) call goes here.
  void config; // (remove this line once you use `config`)
}

/**
 * TODO(you) #2 — inject the config, with a sensible "no provider" behaviour.
 *
 *   import { inject } from "vue";
 *   ...
 *   // Option A — supply a default (component still works standalone):
 *   return inject(swatchConfigKey, ref(defaultSwatchConfig));
 *
 *   // Option B — a "must be used inside a provider" guard (like a typed
 *   // useContext wrapper that throws instead of returning null):
 *   const config = inject(swatchConfigKey);
 *   if (!config) throw new Error("useSwatchConfig must be used within a provider");
 *   return config;
 *
 * Pick one and return a Ref<SwatchConfig>. (Consumers read config.value.size etc.)
 */
export function useSwatchConfig(): Ref<SwatchConfig> {
  // 👉 replace this with your inject(...) implementation.
  throw new Error("useSwatchConfig() not implemented yet — see TODO #2");
}
