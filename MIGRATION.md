# Solid 2.0 Migration Guide

## Import paths

`JSX`, `ValidComponent`, and `ComponentProps` moved out of `solid-js` into `@solidjs/web`.

```ts
// before
import type { JSX, ValidComponent, ComponentProps } from "solid-js";

// after
import type { JSX, ValidComponent, ComponentProps } from "@solidjs/web";
```

`solid-js/web` (the DOM renderer) is now `@solidjs/web`.

```ts
import { render } from "@solidjs/web";
```

## HTML attributes are lowercase

Solid 2.0 uses lowercase HTML attribute names on native elements, matching the HTML spec rather than React conventions.

```tsx
// before
<div tabIndex={0} />
<input readOnly />

// after
<div tabindex={0} />
<input readonly />
```

This affects any `RenderProps` interface whose props are spread onto native elements via `Polymorphic`. Both the interface definition and the JSX must use the lowercase name.

Other affected attributes: `autocomplete`, `autocorrect`, `spellcheck`, `enterkeyhint`, `contenteditable`, `inputmode`.

## Renamed helpers

| Solid 1.x | Solid 2.0 |
|-----------|-----------|
| `mergeProps` | `merge` |
| `splitProps` | `omit` |
| `unwrap` | `snapshot` |
| `onMount` | `onSettled` |
| `createComputed` | `createEffect` (split form) / `createMemo` |
| `Index` | `<For keyed={false}>` |
| `classList` | `class` (object/array accepted) |
| `batch` | removed — writes are auto-batched |

## Effects: split compute/apply form

`createEffect` now takes two functions. Reactive reads belong in the first (compute), side effects in the second (apply).

```ts
// before
createEffect(on(source, (value) => { el.title = value; }));

// after
createEffect(
  () => source(),
  (value) => { el.title = value; },
);
```

Cleanup is returned from the apply function instead of using `onCleanup`.

```ts
createEffect(
  () => source(),
  (value) => {
    const id = setTimeout(() => doWork(value), 100);
    return () => clearTimeout(id);
  },
);
```

## Context: no more `.Provider`

```tsx
// before
<ThemeContext.Provider value="dark"><App /></ThemeContext.Provider>

// after
<ThemeContext value="dark"><App /></ThemeContext>
```

## Store setters are draft-first

```ts
// before
import { produce } from "solid-js/store";
setStore(produce(s => { s.count++; }));

// after
setStore(s => { s.count++; });
```

## Signals: no writes inside reactive scope

Writing to a signal inside a component body, memo, or effect throws `SIGNAL_WRITE_IN_OWNED_SCOPE` in dev. Derive values with `createMemo` instead, or write in event handlers.
