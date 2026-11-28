---
"@kobalte/core": patch
---

Prepare for the stable Solid 2.0 release: use lowercase DOM attributes (`inputmode`, `autocomplete`, `spellcheck`, `contenteditable`, `readonly`, `tabindex`) in render props and read the OTP field input ref in the compute phase of its render effect.

Fix `TimeField` crashing on render in Solid 2: effect callbacks no longer return setter values as cleanups, and `TimeField.Segment` no longer creates a focus signal inside an effect callback.
