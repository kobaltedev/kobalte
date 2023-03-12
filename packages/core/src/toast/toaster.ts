import { JSX } from "solid-js";

import { toastStore } from "./toast-store";

let toastsCounter = 0;

/** Adds a new toast to the visible toasts or queue depending on current state and limit. */
function show(render: (id: number) => JSX.Element) {
  const id = toastsCounter++;
  toastStore.add({ id, render, dismiss: false });
  return id;
}

/** Removes toast with given id from visible toasts and queue. */
function dismiss(id: number) {
  toastStore.dismiss(id);
  return id;
}

/** Removes all toasts from visible toasts and queue. */
function clear() {
  toastStore.clear();
}

// User facing API.
export const toaster = {
  show,
  dismiss,
  clear,
};
