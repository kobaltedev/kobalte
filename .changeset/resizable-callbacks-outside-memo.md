---
"@kobalte/core": patch
---

Call `Resizable.Panel` `onCollapse` / `onExpand` from an effect instead of from inside a memo, so the callbacks can update signals without Solid 2 rejecting the write (`REACTIVE_WRITE_IN_OWNED_SCOPE`).
