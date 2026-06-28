---
'@kobalte/core': patch
---

fix(dismissable-layer): guard `isTopMostLayer` against an empty layer stack.

When the dismissable-layer stack is empty (e.g. callbacks fired after the last layer has already been removed during teardown), `layers[layers.length - 1]` is `undefined` and reading `.node` on it throws `TypeError: Cannot read properties of undefined (reading 'node')`. Returning `false` early when there are no layers makes the predicate behave consistently with "no top-most layer is currently registered".
