# Report: `STRICT_READ_UNTRACKED` diagnostics in kobalte cores

- Date: 2026-09-27
- Branch: `fix/comps` (`43b01e1e chore: bump solid rc` + uncommitted fix pass)
- Solid versions: `solid-js@2.0.0-rc.10`, `@solidjs/signals@2.0.0-rc.10` (dev builds), compiled via `@solidjs/vite-plugin@3.0.0-next.46` (`compiler: "babel"`) on `vite@8.1.3`
- Method: ran the full `@kobalte/core` unit test suite (`vitest run`, 48 files / 670 tests) and captured Solid's structured diagnostics via a temporary vitest setup file subscribing to `OBSERVE.diagnostics` (the rc.10 diagnostic channel; rc.3 exposed the same stream as `DEV.diagnostics`). The capture harness was removed after each run; only the source fixes below remain.

## TL;DR

No test failures and **no thrown errors**. Solid 2's dev build emitted **1633 `STRICT_READ_UNTRACKED` warnings** (severity `warn`) during the run — up from 1471 on rc.3. The related **`PENDING_ASYNC_UNTRACKED_READ`** diagnostic (severity `error`) still did **not** occur. A new rc.10 diagnostic, **`NO_OWNER_EFFECT`** (severity `warn`, 116–170 occurrences depending on run), also fired for the first time.

**First fix pass applied** (uncommitted): the provably behavior-neutral cases are wrapped in `untrack(…)`, taking the strict-read count from **1633 → 534** (all 670 tests still pass). The remaining 534 are the cases that need a design decision — see *Remaining (needs review)* below.

The default Vitest reporter swallows these `console.warn` calls for passing tests, which is why they are invisible on a normal `pnpm test`. They are also invisible in production builds (the prod bundle never labels untracked reads).

## What `STRICT_READ_UNTRACKED` is

Emitted by `warnStrictReadUntracked` in `@solidjs/signals` (dev builds) when a signal/memo/store is read while Solid has enabled "strict read" mode:

```
[STRICT_READ_UNTRACKED] Reactive value read directly in <...> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
```

Solid enables this mode around:
- Component constructors: `untrack(() => Comp(props), "<CompName>")` — so any bare signal read in a component body is flagged;
- `<Show>`, `<Match>`, keyed `<For>` child factories;
- the **side-effect callback** of two-argument `createEffect(track, fn)` — flagged as `"an effect callback"`.

The value read is not subscribed (it "will not update"), but it does not throw; it is a dev-only advisory warning.

Mechanism note (from `@solidjs/signals` `dev-shared.js`): strict read is a module-level flag set by `untrack(fn, strictReadLabel)`. A nested, label-less `untrack(fn)` resets the flag to `false` for its body — which is why wrapping an already-untracked read in `untrack` is a **strict no-op** behaviorally (it only silences the warning) and why the fixes below carry no side effects.

Note: rc.10 renamed the strict-read labels to the components' dotted source names (`<CollapsibleContent>` → `<Collapsible.Content>`, `<NumberFieldRoot>` → `<NumberField.Root>`, etc.) and `DEV.diagnostics` moved to `OBSERVE.diagnostics`.

## Breakdown by read context (label) — before fixes

| label                | rc.3  | rc.10 (pre-fix) |
|----------------------|-------|-------|
| an effect callback   | 1026  | 1188  |
| `<For>`              | 128   | 128   |
| `<ComboboxBase>`     | 120   | 120   |
| `<Collapsible.Content>` | 113 | 113   |
| `<NumberField.Root>` | 44    | 44    |
| `<FormControlLabel>` | 27    | 27    |
| `<Popover.Trigger>`  | 7     | 7     |
| `<DatePicker.Content>` | 4   | 4     |
| `<Steps.Root>`       | 2     | 2     |
| `NO_OWNER_EFFECT`    | –     | 116–170 |
| **total**            | **1471** | **1749–1803** (1633 strict-read + 116–170 NO_OWNER_EFFECT) |

Counts are occurrences (the same site re-warns on every effect re-run / interaction), not unique code sites. Run-to-run counts vary slightly; the set of unique sites is stable.

## Fix pass 1 — applied (1633 → 534 strict-read warnings)

Rule: wrap a read in `untrack(…)` **only** when the physical read site is reached exclusively from one-shot contexts (event handlers, effect side-effect callbacks, or component-body snapshots). Because those reads were already untracked (that's why they warn), the wrap is provably a no-op. Nothing that a tracked caller (JSX, memo, effect compute function) depends on was touched. Verified by re-running the suite: **48 files / 670 tests pass**, `pnpm -r typecheck` clean.

| read site (pre-fix count) | fix |
|---|---|
| `combobox/combobox-base.tsx:833,834` (60+60) | `untrack(() => getItemCount(listState.collection()))`, `untrack(() => disclosureState.isOpen())` — one-shot announcement baselines |
| `combobox/combobox-base.tsx:789` (85) | `untrack(showAllOptions)` in the `createEffect(inputValue, …)` callback |
| `combobox/combobox-base.tsx:749` (76) | `untrack(allOptions)` in `resetInputValue` (2-arg effect callback) |
| `collapsible/collapsible-content.tsx:78` (113) | `untrack(isOpen)` for the mount-animation baseline |
| `number-field/number-field-root.tsx:228-229` (44) | `untrack(() => { … })` around the initial raw-value sync |
| `selection/create-selectable-item.ts:172` (95) | `untrack(ref)` in `onFocus` |
| `selection/create-selectable-collection.ts:367` (54) | `untrack(() => access(…))` for the three option reads in `onFocusIn` |
| `resizable/resizable-lib.ts:867-869` (90×3) + 840,841,853,860,881 | `untrack(() => …)` for all `handle.startIntersection/endIntersection.handle()`, `handle.focused()`, `handle.handleCursorStyle()` reads in `onHoveredChange` |
| `calendar/create-calendar-state.ts:534,536` (26+13) | `untrack(() => { … })` around `focusCell` |
| `menubar/menubar-root.tsx:220` (22) | `untrack(() => [ref(), ...menuRefs().values()])` in `shouldExcludeElement` |
| `radio-group/radio-group-root.tsx:186,187,190` (6+6+16) | `untrack(ref)`, `untrack(() => isSelectedValue(…))` in `setSelectedValue` |
| `checkbox/checkbox-input.tsx:124,136` (9+9) | `untrack(isInternalChangeEvent)`, `untrack(() => context.checked())` in `onChange` |
| `radio-group/radio-group-item-input.tsx:127,139` (6+6) | same pattern in `onChange` |
| `dismissable-layer/dismissable-layer.tsx:132,137,143,147,160,161,164,165,166,169` (~50) | `untrack(() => { … })` around `shouldExcludeElement`, `onPointerDownOutside`, `onFocusOutside`, and the Escape shortcut handler |
| `select/select-trigger.tsx:197,207` (2) | `untrack(() => selectionManager().isFocused())`, `untrack(() => context.isOpen())` in `onFocus`/`onBlur` |
| `menu/menu-sub-content.tsx:87` (1) | `untrack(() => context.triggerRef())` in `onFocusOutside` |
| `form-control/form-control-label.tsx:66` (27) | `untrack(() => mergedProps.ref)` (props are signal-backed; matches the existing pattern in `collapsible-content.tsx:141`) |
| `popover/popover-trigger.tsx:71` (7) | `untrack(() => p.ref)` |
| `popover/popover-root.tsx:177` (4) | `untrack(() => mergedProps.id)` in `generateId` |

17 files changed, +118/−77. Re-capture confirms every target site is now zero.

## Remaining 534 — needs review (not fixed)

### 1. `selection/selection-manager.ts` methods (278) — shared methods, cannot blind-`untrack`

| read site | count | method |
|---|---|---|
| `selection-manager.ts:404` | 95 | `isDisabled(key)` → `this.collection().getItem(key)` |
| `selection-manager.ts:72` | 95 | `setFocusedKey(key)` → `this.collection().getItem(key)` |
| `selection-manager.ts:57` | 81 | `isFocused()` → `this.state.isFocused()` |
| `selection-manager.ts:226` | 7 | `getKey(key)` |

These fire only when invoked from an effect-callback window (keyboard/focus handlers run inside effects). But the **physical read lines are also reached from tracked callers** (e.g. `isDisabled` feeds JSX `disabled` props, `isFocused` is read in select/combobox render paths), so wrapping the reads in `untrack` would silently break that reactivity. Correct fix requires either a caller-side untracked accessor or restructuring so the handler path doesn't read in the effect window — a design decision.

### 2. `selectionManager` getters passed into `createSelectable*` (113)

- `listbox/listbox-item.tsx:116` (92) — `const selectionManager = () => listBoxContext.listState().selectionManager()` — used both in JSX/memos (tracked) and inside `createSelectableItem` handlers (untracked).
- `listbox/listbox-root.tsx:248` (21) — `selectionManager: () => listState().selectionManager()` passed to `createSelectableList`.

Same dilemma as above: a separate untracked accessor for the handler path would be the fix, but that duplicates the accessor.

### 3. Hidden `<select>` inside `<For>` (128)

- `combobox/combobox-hidden-select.tsx:21` (82) — `collection={context.listState().collection()}`
- `select/select-hidden-select.tsx:21` (46) — same

`hidden-select-base.tsx:72,76,109,123,124` read `props.collection`/`props.selectionManager` inside the `<For>` child factory (untracked by `<For>`'s contract). Fix is structural: hoist the reads out of the render callback (e.g. pre-bind a memo before `<For>`) so the child factory only touches `key`. Not done because it touches the shared hidden-select render path used by both select and combobox.

### 4. Test code (15)

- `date-picker/date-picker.test.tsx:30` (8) and `calendar/calendar.test.tsx:27` (5) — `date()!` read in a render-prop child.
- `steps/steps.test.tsx:216` (2) — `value={value()}` in a local controlled component (`<Steps.Root>` label).

Left as-is; these are test-local.

## NEW on rc.10: `NO_OWNER_EFFECT` (116–170, severity `warn`)

rc.10 added a lifecycle check for effects created outside any reactive owner (they can never be disposed). Two source sites:

| read site | count (latest run) | cause |
|---|---|---|
| `resizable/resizable-root.tsx:250` (`registerPanel`) | 36 | `createEffect(() => panelSizeMemo(), …)` runs in the panel-registration path (the `children` callback), which executes outside a reactive owner — never inside the panel subtree's `createRoot` |
| `drawer/drawer-content.tsx:131-137` | 80 | `createEventListener(document, …)` (pointermove/touchmove/pointerup/touchend/contextmenu) created inside the **side-effect callback** of `createEffect(() => dialogCtx.isOpen(), …)` — that callback is not a tracking/owner scope, so the listeners' render effects are unowned |

Not emitted by rc.3 (the code did not exist then); the effects themselves are pre-existing. The count varies run-to-run (170 in the first rc.10 capture, 116 in the post-fix capture) with teardown timing. **Not fixed** — the fixes are structural (give `registerPanel` a `createRoot`, and move the drawer's `createEventListener` calls out of the effect's side-effect callback), not a one-line wrap.

## Per-test-file trigger map (pre-fix, where the warnings surfaced)

`STRICT_READ_UNTRACKED` only — the capture attaches the current test file to every entry, so the rc.3 "unattributed teardown" bucket is fully attributed:

| test file | occurrences | | test file | occurrences |
|---|---|---|---|---|
| combobox | 265 | | minimal-dialog | 54 |
| select | 254 | | resizable | 54 |
| accordion | 144 | | tabs | 51 |
| listbox | 135 | | toast | 49 |
| menubar | 118 | | search | 49 |
| radio-group | 94 | | number-field | 44 |
| checkbox | 72 | | date-picker | 43 |
| dialog | 54 | | toggle-group | 40 |
| alert-dialog | 54 | | calendar | 20 |
| | | | switch | 13 |
| image / steps | 7 | | create-calendar-state / collapsible | 6 |

## Notes

- Severity is `warn` only for both codes; no errors were thrown and all 670 tests pass, so these are correctness risks (values read once and not updated; effects that leak on unmount), not crashes.
- rc.10 vs rc.3 delta before fixes was concentrated: strict-read grew by **162**, all of it the `resizable-lib.ts:867-869` hover reads (36 → 90 each), and a **new `selectionBehavior` read** at `selection-manager.ts:47` (16) surfaced.
- The strict-read capture channel moved from `DEV.diagnostics` (rc.3) to `OBSERVE.diagnostics` (rc.10); entries carry an `ownerPath` (owner chain) rather than an event-level stack, so read sites were re-derived from a stack captured inside the diagnostic listener (which runs synchronously inside the read).
- Testing storybook was not required: the unit suite already exercises the affected components. The same warnings would appear in any dev-mode consumer (docs/playground/storybook dev, browser console).
- The previous fixes in `#724`, `#728` and `89506863` targeted a subset of these same patterns (`create-dom-collection`, `tabs-indicator`, `collapsible-content`, `dialog`, `link`); the sites above are the remaining occurrences on the current branch.

## Addendum — 2026-09-28 (issues #1–#6 fix pass)

The `number-field/number-field-root.tsx:228-229` read site above (44 occurrences) no
longer exists: the render-body raw-value sync it wrapped was the `onRawValueChange`
call that fired during render (issue #2 in `issues.md`). It was replaced with a
two-argument `createEffect` whose compute reads `value()` and runs
`parseRawValue(...)`, so the report stays in the effect's tracked phase instead of
reading inside an `untrack(…)` window. The original site is gone rather than
re-styled, so the "remaining 534" total should be read as 534 − the former 44 at
that site, plus whatever the removed call no longer emits.

The new effects added in this pass (both issue-1 display-normalization effects in
`text-field-root.tsx` / `number-field-root.tsx`, and the `number-field-root.tsx`
raw-value report effect) keep every reactive read inside their compute functions;
their side-effect callbacks touch only the DOM and `mergedProps.onRawValueChange`.
Re-running the full suite after the changes (680 client tests + 3 SSR tests) shows
no `STRICT_READ_UNTRACKED`, `REACTIVE_WRITE_IN_OWNED_SCOPE`, or `SERVER_WRITE`
warnings from the touched components, and `tsc --noEmit` is clean.

SSR note: the registered-id fallbacks and per-part sync registration introduced in
this pass are client-only (`isServer`-gated writes) specifically so SSR rendering
does not emit `[SERVER_WRITE]` deprecations; on the server the association derives
from the deterministic `${rootId}-label` / `${rootId}-input` / `${rootId}-description`
ids the parts generate at creation time.

## Suggested fix shape for the remaining cases

- `selection-manager` + `listbox` getters: add a dedicated untracked accessor for the handler path (e.g. `() => untrack(() => listState().selectionManager())`) and pass *that* into `createSelectableItem`/`createSelectableList`, leaving the tracked accessor for JSX/memos. This avoids changing reactivity for render paths.
- hidden-select `<For>`: hoist `props.collection`/`props.selectionManager` into a variable before the `<For>` (or a memo) so the child factory only consumes `key`.
- `NO_OWNER_EFFECT` → create the effects inside a real owner: give `registerPanel` a `createRoot` (resizable-root.tsx:250) and move the drawer's `createEventListener` calls out of the `createEffect(track, fn)` side-effect callback into the tracked phase (drawer-content.tsx:131-137) or wrap them in a `createRoot` the component owns.