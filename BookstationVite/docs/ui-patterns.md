# UI patterns (Bookstation Vite)

## Loading

- **`Loading` with `variant="page"` (default):** Use when an entire route or large region has no meaningful content until data arrives (e.g. library first fetch with only NavBar + spinner).
- **`Loading` with `variant="inline"`:** Use inside layout (sections, cards, profile shell) so NavBar and page chrome stay visible. Prefer owning the query in the smallest component that can show a local spinner.

## Back navigation

- **`OnBackButton`:** Uses browser history when `history.length > 1`, otherwise `location.state.from`, then `fallbackPath` (default `/explore`).
- **Preserving origin:** When linking to book detail, reading, author profile, or writing editor, pass `state={linkStateFromHere(location)}` from [`src/utils/navigation.js`](../src/utils/navigation.js) so deep pages can return to the correct list when history is short.

## Optional libraries (adopt when needed)

- **`clsx`:** Small helper for conditional `className` strings in dense UI (e.g. library toolbar).
- **`nuqs`:** URL-backed filter/sort state for shareable views (optional for library v2).
- **`@tanstack/react-query` `useQueries`:** Batch requests such as reading progress for many book IDs (library).
- **`framer-motion`:** Section motion on Explore (optional; watch bundle size).
- **`react-hotkeys-hook` / `@use-gesture/react`:** Reading keyboard and touch gestures (optional).

Document new dependencies in this file when you add them.
