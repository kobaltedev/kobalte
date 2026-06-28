---
"@kobalte/core": patch
---

fix(context-menu): always call the user-provided `onContextMenu` handler on `ContextMenu.Trigger`, not only when the trigger is disabled. The handler now runs in every case (giving consumers access to the event, e.g. pointer coordinates), and calling `event.preventDefault()` from it opts out of opening the menu.
