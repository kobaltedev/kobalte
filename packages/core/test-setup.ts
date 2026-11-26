import { cleanup } from "@solidjs/testing-library";
import { afterAll, afterEach, vi } from "vitest";

// `@solidjs/testing-library` registers its own `afterEach(cleanup)` as a
// module-level side effect. With `isolate: false` (see vite.config.ts),
// Vitest reuses evaluated dependencies within each worker, so that module body
// only runs once -- meaning only the first test file to import it gets
// automatic cleanup between tests. Files that render without registering their
// own cleanup hook can leave mounted containers and focus state in the worker.
// This setup file runs before each test file and registers its
// `afterEach(cleanup)` hook regardless of import order.
afterEach(() => cleanup());

// If any test file in this worker enables fake timers without restoring real
// timers, later files in the same worker that await real timers (e.g.
// `userEvent`, `waitFor`, `setTimeout`) time out. Restore real timers after
// every file as a safety net.
afterAll(() => {
	vi.clearAllTimers();
	vi.useRealTimers();
});
