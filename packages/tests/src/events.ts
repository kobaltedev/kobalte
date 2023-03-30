import { fireEvent } from "@solidjs/testing-library";

import { createPointerEvent } from "./utils";

/**
 * Triggers a "touch" event on an element.
 */
export async function triggerTouch(element: Document | Element | Window | Node, opts?: any) {
  fireEvent(
    element,
    createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch", ...opts })
  );
  await Promise.resolve();

  fireEvent(
    element,
    createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch", ...opts })
  );
  await Promise.resolve();
}
