import { cleanup } from "@solidjs/testing-library";
import { afterEach } from "vitest";

// `@solidjs/testing-library` registers its own `afterEach(cleanup)` as a
// module-level side effect. With `isolate: false` (see vite.config.ts),
// vitest reuses the same Node module cache for externalized deps across all
// test files in a worker, so that module body only runs once — meaning only
// the first test file to import it actually gets automatic cleanup between
// tests. Every other file in the worker leaks mounted containers/focus state
// into later tests. Registering `afterEach` again here (a project file,
// re-evaluated per test file even with isolate disabled) makes cleanup run
// for every file regardless of import order.
afterEach(() => cleanup());
