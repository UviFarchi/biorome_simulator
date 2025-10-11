# Repository Guidelines

## Project Structure & Module Organization

Source lives in `src/`, split by role: `components/` for Vue SFCs, `stores/` for Pinia, `engine/` for simulation logic, `dict/` for static configuration, and `utils/` for helpers. `public/` holds files served verbatim, while `src/assets/` contains processed images and styles. The Vite alias `@/` maps to `src`, so prefer it to deep relative paths.

## Build, Test, and Development Commands

Run `npm install` to sync dependencies (Node 20+). Use `npm run dev` for a hot-reloading dev server and `npm run build` for an optimized bundle. `npm run preview` serves the production build locally. `npm run lint` and `npm run format:check` catch style issues; keep them green before opening a PR.

## Coding Style & Naming

ESLint and Prettier enforce two-space indentation, semicolons, and single quotes. Vue components follow PascalCase filenames (for example, `ControlPanel.vue`). Stores, composables, and utilities use camelCase (`gameStore.js`, `useSimulation.js`), while shared constants stay in SCREAMING_SNAKE_CASE. Run `npm run lint:fix` or `npm run format` when Prettier hints at changes; husky will block commits that fail lint-staged.

## Testing Expectations

Vitest (jsdom environment) drives unit and component coverage. Place new suites in `tests/` or alongside source as `*.spec.ts`/`*.spec.js`. Mirror the structure of the component or store under test, isolate side effects with `vi.fn()`, and keep fixtures small. Execute `npm run test` before pushing so the CI run passes on the first attempt.

## Commit & Pull Request Guidelines

Commits stay concise and present tense, e.g., `Refine panel spacing`. Avoid bundling unrelated work. Pull requests should include a problem statement, summary of the solution, linked issues, and screenshots or recordings when UI changes. Document manual testing or new Vitest coverage in the PR body to help reviewers follow along.

## Environment & Configuration Tips

Target the Node versions listed in `package.json`; `nvm use` keeps local environments aligned. Husky installs via `npm install` and runs `lint-staged`, so stage only relevant files to speed up checks. Document new environment variables in `.env.example` and prefix runtime values with `VITE_` for Vite to expose them.
