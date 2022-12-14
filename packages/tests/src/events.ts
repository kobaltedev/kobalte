import { fireEvent } from "solid-testing-library";

import { createPointerEvent } from "./utils";

/**
 * Triggers a "press" event on an element.
 */
export async function triggerPress(element: Document | Element | Window | Node, opts?: any) {
  fireEvent(
    element,
    createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse", ...opts })
  );
  await Promise.resolve();

  fireEvent(
    element,
    createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse", ...opts })
  );
  await Promise.resolve();

  //fireEvent.click(element);
  //await Promise.resolve();
}

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
