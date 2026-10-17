<script setup lang="ts">
import { fetchQuote } from "../utils/fakeQuoteApi";

const props = defineProps<{ fail?: boolean }>();

// A top-level `await` makes this an ASYNC component: its setup returns a
// promise, and Vue renders it only after that promise settles. The parent must
// wrap it in <Suspense> to show something meanwhile; without one, Vue warns and
// renders nothing. A rejection (fail = true) surfaces as an error the nearest
// onErrorCaptured can catch. React comparison: the component "suspends" while
// its data loads. `quote` is inferred as Quote from fetchQuote's return type.
const quote = await fetchQuote(props.fail);
</script>

<template>
  <blockquote class="quote">
    <p>“{{ quote.text }}”</p>
    <footer>— {{ quote.author }}</footer>
  </blockquote>
</template>

<style scoped>
.quote {
  margin: 0;
  max-width: 320px;
  font-style: italic;
}
.quote p {
  margin: 0 0 4px;
}
.quote footer {
  font-style: normal;
  font-size: 0.85rem;
}
</style>
