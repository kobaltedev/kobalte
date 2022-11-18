import { JSX } from "solid-js";

import { isFunction } from "./assertion";

/** Call a JSX.EventHandlerUnion with the event. */
export function callHandler<T, E extends Event>(
  event: E & {
    currentTarget: T;
    target: Element;
  },
  handler: JSX.EventHandlerUnion<T, E> | undefined
) {
  if (handler) {
    if (isFunction(handler)) {
      handler(event);
    } else {
      handler[0](handler[1], event);
    }
  }

  return event?.defaultPrevented;
}

/** Calls all JSX.EventHandlerUnion in the order they were chained with the same event. */
export function chainHandlers<T, E extends Event>(
  event: E & {
    currentTarget: T;
    target: Element;
  },
  callbacks: Array<JSX.EventHandlerUnion<T, E> | undefined>
): void {
  for (const callback of callbacks) {
    callHandler(event, callback);
  }
}
