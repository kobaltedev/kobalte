---
"@kobalte/core": patch
---

fix(dialog): modal dialog without trigger now restores focus to originalFocusedElement on close (#768)

Previously `DialogContent.onCloseAutoFocus` unconditionally called `e.preventDefault()` in modal
mode even when `context.triggerRef()` was `undefined` (programmatically-opened dialogs).
This cancelled `createFocusTrap`'s fallback restore to `originalFocusedElement`, leaving focus
on `<body>`. The same issue existed in `PopoverContent` modal mode.

The fix: only call `e.preventDefault()` and `.focus()` when a trigger element actually exists;
otherwise leave the event un-prevented so `createFocusTrap` can fall back correctly.
The same guard has been applied consistently to `SelectContent.onFinalFocus` and
`ComboboxContent.onFinalFocus`.

fix(dismissable-layer): portalled child overlays inside a modal dialog/popover are no longer aria-hidden (#766)

`createHideOutside` in `DialogContent`, `PopoverContent`, `SelectContent`, and `ComboboxContent`
only included the component's own content element as a target. When a non-modal `Select` or
`Popover` with `Portal` was opened inside a modal `Dialog`, its portalled content element (which
renders outside the dialog in the DOM tree) was hidden by `ariaHideOutside`.

The fix converts `DismissableLayer`'s internal `nestedLayers` from a plain `Set` to a reactive
`createSignal<Element[]>`. A new `_onNestedLayersRef` callback prop synchronously hands the
reactive accessor to the parent content component before any effects run. Each content component
then includes `nestedLayersSignal()` in its `createHideOutside` targets so portalled child
layers remain visible to screen readers.

fix(test-setup): restore real timers after each test file to prevent fake-timer leakage (#isolation)

Five test files call `vi.useFakeTimers()` in `beforeEach` without a matching `afterAll(vi.useRealTimers)`.
With `isolate: false` in `vite.config.ts`, fake timers leaked into subsequent files in the same
worker, causing `userEvent.type` and `waitFor` calls to time out. Added
`afterAll(() => vi.useRealTimers())` to `test-setup.ts`.
