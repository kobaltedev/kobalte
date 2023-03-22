import { isFunction } from "@kobalte/utils";

import { toastStore } from "./toast-store";
import { ToastComponent, ToastPromiseComponent } from "./types";

let toastsCounter = 0;

/** Adds a new toast to the visible toasts or queue depending on current state and limit. */
function show(toastComponent: ToastComponent) {
  const id = toastsCounter++;
  toastStore.add({ id, toastComponent, dismiss: false, update: false });
  return id;
}

/** Update the toast of the given id with a new rendered content. */
function update(id: number, toastComponent: ToastComponent) {
  toastStore.update(id, { id, toastComponent, dismiss: false, update: true });
}

/** Adds a new promise-based toast to the visible toasts or queue depending on current state and limit. */
function promise<T, U = any>(
  promise: Promise<T> | (() => Promise<T>),
  toastComponent: ToastPromiseComponent<T, U>
) {
  const id = show(props => {
    return toastComponent({
      get toastId() {
        return props.toastId;
      },
      state: "pending",
    });
  });

  (isFunction(promise) ? promise() : promise)
    .then(data =>
      update(id, props => {
        return toastComponent({
          get toastId() {
            return props.toastId;
          },
          state: "fulfilled",
          data,
        });
      })
    )
    .catch(error =>
      update(id, props => {
        return toastComponent({
          get toastId() {
            return props.toastId;
          },
          state: "rejected",
          error,
        });
      })
    );

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
  update,
  promise,
  dismiss,
  clear,
};
