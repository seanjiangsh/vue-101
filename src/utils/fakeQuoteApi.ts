// A stand-in for a real API: resolves (or rejects) after a delay, with no
// network involved. The delay is what makes <Suspense>'s fallback visible.

export interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger Dijkstra" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
];

export function fetchQuote(fail = false, ms = 800): Promise<Quote> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) reject(new Error("Quote service is down"));
      else resolve(quotes[Math.floor(Math.random() * quotes.length)]!);
    }, ms);
  });
}
