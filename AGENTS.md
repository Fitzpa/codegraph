# AGENTS.md

## Repo Shape
- Use `npm` here; `package-lock.json` is the lockfile.
- `src/index.ts` is the public API entrypoint.
- `src/bin/codegraph.ts` is the CLI entrypoint.
- `__tests__/` holds Vitest tests.
- `dist/` is generated output, and `.codegraph/` is per-project runtime data.

## Commands
- `npm run build` runs `tsc` and copies `src/db/schema.sql` plus `src/extraction/wasm/*.wasm` into `dist/`.
- `npm test` runs the full Vitest suite once.
- `npx vitest run __tests__/foo.test.ts -t "case"` runs a focused test.
- `npm run test:watch`, `npm run test:eval`, `npm run eval`, and `npm run clean` are the other repo scripts.
- There is no dedicated lint script in `package.json`; `npm run build` is the main static verification step.

## Constraints
- Target Node.js 18-24; Node 25+ is known to be unstable for the WASM path.
- `tsconfig.json` is strict, including `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, and `noUncheckedIndexedAccess`.
- Do not edit `dist/`; change sources under `src/` and rebuild.
- Keep test filesystem state isolated; existing tests use temporary directories and clean them up.
- If you change schema or WASM assets, keep the build copy step in sync with `src/db/schema.sql` and `src/extraction/wasm/`.
