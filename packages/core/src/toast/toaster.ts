import { JSX } from "solid-js";
import { createStore } from "solid-js/store";

import { Toast } from "./types";

let toastsCounter = 0;

const [state, setState] = createStore({
  toasts: [] as Toast[],
});

function remove(id: number) {
  setState("toasts", prev => prev.filter(toast => toast.id !== id));
  return id;
}

function show(render: (id: number) => JSX.Element) {
  const id = toastsCounter++;
  setState("toasts", prev => [...prev, { id, render, dismiss: false }]);
  return id;
}

function dismiss(id: number) {
  setState("toasts", toast => toast.id === id, "dismiss", true);
  return id;
}

export const toastStore = {
  toasts: () => state.toasts,
  remove,
};

export const toaster = {
  show,
  dismiss,
};
