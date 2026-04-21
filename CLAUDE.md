# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**tc-create-app** is a React SPA for translating unfoldingWord Gateway Language resources (Translation Notes, Translation Words, Translation Questions, Translation Academy, Open Bible Stories). It connects to a Gitea server (Door43) via OAuth, uses a branch-based workflow to protect master, and supports side-by-side source/target editing for both Markdown and TSV file formats.

Live at: https://create.translationcore.com

## Commands

```bash
# Development (requires set-env.sh sourced first)
yarn start                  # Dev server on port 3000

# Testing
yarn test:unit              # Jest unit tests with coverage
yarn cypress                # Cypress interactive (requires NODE_ENV=test + app running)
yarn cypress:run            # Cypress headless
yarn test                   # Full suite: start server + Cypress + coverage

# Building
yarn build                  # Production build + styleguidist docs
yarn styleguide             # Run styleguidist locally
```

**Important:** `set-env.sh` must be sourced before `yarn start` or `yarn build` — it sets `REACT_APP_*` env vars via rescripts (a CRA config override layer).

**Cypress local setup:** Requires a `cypress.env.json` file with `TEST_USERNAME` and `TEST_PASSWORD` for a Door43 QA account with unfoldingWord org membership.

**Single unit test:** `yarn test:unit --testPathPattern=<filename>`

## Architecture

### Data Flow

```
User → OAuth (Gitea/Door43)
  → App.js resumes persisted state from localforage
  → AppContextProvider (useStateReducer + useGiteaReactToolkit)
  → Layout → Workspace
      → ApplicationStepper (org → language → resource → file)
      → Translatable (side-by-side editor once all steps complete)
          → TranslatableTSV  (for .tsv files)
          → markdown-translatable  (for .md files)
```

### State Management

There is no Redux — state lives in React Context (`AppContext`) driven by `useReducer` in `/src/hooks/useStateReducer.js`, with the reducer in `/src/core/state.reducer.js`. State is deep-frozen (mutations throw). Key state slices: `authentication`, `organization`, `language`, `sourceRepository`, `targetRepository`, `filepath`, `contentIsDirty`, `criticalValidationErrors`, `cachedFile`.

### Persistence: Two localforage Stores

- **state-store** — auth token, org, language, filepath, resource links, editor preferences. Loaded on app start in `App.js` via `resumeState()`.
- **cache-store** — file contents keyed by `html_url`. Written by auto-save; cleared on successful commit to Gitea. On file open, stale cache triggers a user warning.

### Gitea Integration

All repo/file operations go through `gitea-react-toolkit` hooks wired up in `/src/hooks/useGiteaReactToolkit.js`. This handles OAuth, organization browsing, repository forking, file read/write, and PR creation. The app never pushes directly to master — edits go to a user branch and a PR is created.

### Branch Merger

`dcs-branch-merger` (`BranchMergerProvider`) polls master every 5 minutes for upstream changes and surfaces merge conflicts. It only activates when all required Gitea params (server, owner, repo, userBranch, token) are present.

### Validation

`/src/core/onOpenValidations.js` runs `uw-content-validation` when a file opens. Critical errors block editing and show `CriticalValidationErrorsDialog`. Validation priority (`high`/`low`) is user-configurable state.

### No Client-Side Routing

The app is a single page — the workflow state (stepper step, whether a file is open) drives which UI renders, not URL routes.

## Environment & Deployment

`.netlify.toml` sets `REACT_APP_DOOR43_SERVER_URL` per deploy context:
- **production/stage:** `https://git.door43.org` (real data)
- **deploy-preview/development:** `https://qa.door43.org` (dev data)

Local dev defaults to QA server via `.env`.

## Key Files

| File | Purpose |
|------|---------|
| `src/App.context.js` | Wires all context providers and hooks together |
| `src/hooks/useStateReducer.js` | Global state dispatch + localStorage save/load |
| `src/hooks/useGiteaReactToolkit.js` | Gitea API integration |
| `src/core/state.reducer.js` | All state action handlers |
| `src/core/persistence.js` | localforage read/write helpers |
| `src/core/onOpenValidations.js` | File validation on open |
| `src/components/translatable/Translatable.js` | Main editor, dispatches to TSV or Markdown sub-editor |
| `src/components/application-stepper/ApplicationStepper.js` | Onboarding workflow (org → lang → resource → file) |

## Non-Obvious Details

- **rescripts** — overrides CRA config without ejecting; config lives in the `rescripts` array in `package.json`
- **Pre-commit hook** — `increment-build.sh` runs via Husky on every commit; it updates `public/build_number`
- **Electron support** — `public/electron-package.json` exists; `yarn electron:build` produces a desktop app
- **Styleguidist docs** — Component docs are `.md` files colocated with components; `yarn build` merges them into `/build`
- **Multi-language UI strings** — `src/core/localStrings.js` provides key-based string lookup (English only currently)
- **Font preferences** — `selectedFont` and `fontScale` (100–200%) are persisted state, applied globally to the editor; default font comes from `uw-languages-rcl` based on selected language