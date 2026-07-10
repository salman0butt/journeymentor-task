# Flight Search

A small single-page flight search built with Vue 3 and the Duffel sandbox API. You fill in a
route, dates, passengers and cabin, and it gives you back a list of real offers you can sort,
filter, and drill into. I tried to keep the scope tight and finish the pieces properly instead
of half-building a long feature list.

## Live demo

`[https://…](https://journeymentor-task.vercel.app/)`

## Running it locally

You'll need Node 18+ and a free Duffel sandbox token (grab one at
https://app.duffel.com/join under Developers → Access tokens; it starts with `duffel_test_`).

```bash
npm install
cp .env.example .env      # then paste your token into DUFFEL_TOKEN
npm run dev               # http://localhost:5173
```

That's all you need. `npm run dev` runs Vite plus a tiny dev-only middleware that stands in for
the serverless API locally, so you don't need the Vercel CLI just to try it. If you'd rather
exercise the real Vercel functions, `npm run dev:vercel` runs `vercel dev` instead.

A note on the token: it's server-side only. It's read inside `/api` (and the dev middleware),
never imported into any client code, and `.env` is git-ignored so it can't be committed. In
production you set `DUFFEL_TOKEN` as a Vercel environment variable.

## The Duffel CORS problem, and how I handled it

Duffel blocks calls straight from the browser, so the app never talks to Duffel directly.
Instead there are two small serverless functions under `/api`:

- `POST /api/search` for the offer requests
- `GET /api/places` for place suggestions (used by autocomplete)

They live in `api/_duffel.ts`, which is the only place the token is attached. I deliberately
kept these as two narrow, single-purpose endpoints rather than one generic "forward anything to
Duffel" proxy. A catch-all proxy would let anyone who finds the deployed URL burn your token and
quota on arbitrary Duffel calls; two fixed endpoints only expose the two operations the app
actually needs. The same functions run on Vercel in production, and the dev middleware in
`vite.config.ts` reuses the exact same code so local and deployed behaviour don't drift.

## State management: Pinia _and_ Vue Query

I split state by what it actually is, which ended up being the most important decision in the app.

**Server state goes to TanStack Vue Query.** The offers and place suggestions are async,
cancellable, cacheable data that belongs to Duffel, not to the UI. Vue Query is built for exactly
that, so `useOffersQuery` and `usePlacesQuery` hand me loading/error/empty states, request
cancellation (so a slow response can never overwrite a newer search, which is the race-condition
case they call out), request dedup, and caching for free. The offer query is keyed on the search
criteria, so shifting the date window is just a new key: results are cached per date, and shifting
back to a date you've already seen is instant with no refetch. I started with a hand-rolled
`AbortController` plus request-id guard and then deleted it once Vue Query was in, because the
library does the same job better and with fewer bugs.

**Client and UI state goes to Pinia.** Everything that isn't server data lives in Pinia: the
search `criteria`, the active filters and sort, and the search history. These are shared across
unrelated components and need to survive a reload, which is the profile Pinia fits; doing it with
plain composables would've meant reinventing a module-scoped store plus manual `localStorage`
syncing. Reload persistence uses Pinia's persisted-state plugin for the criteria, filters and
history, and Vue Query's own cache persistence (to `localStorage`) for the results, so a refresh
restores your search and its offers without hitting the network again.

Composables are still around, but only for genuinely stateless helpers (`useDebounce`,
`useVisibleOffers`), which is what they're good at. I left `provide`/`inject` out; there's no
subtree-scoped config that needed passing down.

## TypeScript (and Zod)

TypeScript throughout, in strict mode. Duffel's responses are big and deeply nested, so typed
domain models plus a normalized `Offer` view-model keep the components simple: they read a flat,
predictable shape instead of digging through raw JSON.

Zod does two jobs. It validates the search form (one schema, with `validation.ts` as a thin
adapter that turns Zod issues into per-field messages), and, more usefully, it parses the Duffel
responses at the service boundary. That means a malformed or unexpected response fails loudly and
safely at the edge instead of blowing up somewhere deep in a component.

## What it does

Everything in the core spec, plus every listed bonus:

- Search form with validation before anything fires (origin and destination must differ, dates
  must be sane, at least one passenger)
- Results with airline, times, duration, stops and price, and explicit loading, empty, error and
  success states
- Sort by price, total duration, or departure time
- Filter by stops, price range, airline, and time of day, all combinable; the airline list and
  price bounds come from the current results
- Offer detail expanded in place: segments, layovers, baggage
- Date-window shifting (±3 days) without re-running the whole form
- Reload persistence (search, filters, results, history)
- Responsive from mobile (filters collapse into a drawer) to desktop (two columns)
- Debounced origin/destination autocomplete
- Persisted search history you can click to replay

## What I left out, and why

- **Automated end-to-end tests.** The brief says pick what you can finish cleanly, so instead of
  a flaky live-API E2E suite I kept focused component tests and validated the full flow manually
  against the sandbox (search, filters, detail, date-shift, reload). It's a conscious trade-off,
  not an oversight.
- **Refreshing expired offers.** Duffel offers expire, so a persisted result can go stale after a
  long time. Reload restores the last results as required; I didn't add automatic re-validation of
  expired offers.

## How it's laid out

```
api/                 the CORS fix: serverless functions; the token lives here only
src/
  components/        grouped by function: search / results / filters / states
  composables/       Vue Query hooks and small helpers
  services/          duffelService, the only place that calls the API
  stores/            Pinia: search criteria, filters, history
  lib/               pure logic: types, schemas, mappers, validation, filter/sort, formatting
```

The rough data flow: the search form writes criteria into the store, `useOffersQuery` picks that
up and calls the service, the service hits `/api` and validates the response with Zod before
mapping it to the view-model, `useVisibleOffers` applies the filters and sort, and the results
panel renders it.

## Tests

Component tests with Vitest and Vue Test Utils, focused on the main components and their behaviour
rather than every internal helper: the search form's validation, the results panel's loading,
empty, error and success states, the autocomplete's typing-and-select flow, the offer card and
its expanded detail, and the date-window shift.

```bash
npm run test
```

## Stack

Vue 3 (`<script setup>`), Vite, TypeScript (strict), Tailwind CSS v4, Pinia with persisted state,
TanStack Vue Query, Zod, and Vitest. Linting and formatting via ESLint and Prettier.

The scripts you'll actually use:

- `npm run dev` runs Vite with the local `/api` middleware
- `npm run dev:vercel` runs `vercel dev` (the real serverless runtime)
- `npm run build` type-checks then builds for production
- `npm run test` runs the tests
- `npm run typecheck` runs the `vue-tsc` project check
- `npm run lint` and `npm run format` run ESLint and Prettier
