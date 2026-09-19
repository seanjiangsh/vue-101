import { inject, provide, type InjectionKey, type Ref } from "vue";

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
export const swatchConfigKey = Symbol("swatchConfig") as InjectionKey<
  Ref<SwatchConfig>
>;

/**
 * Provider side. A component calls this in its setup to share `config` with all
 * descendants. We pass the WHOLE ref (not `config.value`): injection shares the
 * live reference, so when the provider mutates the ref, every injector updates.
 * Handing over `.value` would freeze a snapshot that never changes.
 *
 * Must run synchronously during setup (same rule as lifecycle hooks) — `provide`
 * registers into the *current* component instance and returns nothing.
 */
export function provideSwatchConfig(config: Ref<SwatchConfig>): void {
  provide(swatchConfigKey, config);
}

/**
 * Consumer side. Any descendant calls this to read the shared config. `inject`
 * returns `Ref<SwatchConfig> | undefined` — undefined when there's no provider
 * above — so we guard and throw. That turns silent breakage into a clear error
 * at the offending component: the typed equivalent of a `useContext` wrapper
 * that refuses to hand back a null context. (Alternative: pass a default as the
 * 2nd arg to `inject` if the component should work standalone instead.)
 */
export function useSwatchConfig(): Ref<SwatchConfig> {
  const config = inject(swatchConfigKey);
  if (!config)
    throw new Error("useSwatchConfig must be used within a provider");
  return config;
}
