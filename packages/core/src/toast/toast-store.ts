import { createStore } from "solid-js/store";

import { Toast } from "./types";

const [state, setState] = createStore({
  toasts: [] as Toast[],
});

function add(toast: Toast) {
  setState("toasts", prev => [...prev, toast]);
}

function get(id: number) {
  return state.toasts.find(toast => toast.id === id);
}

function dismiss(id: number) {
  setState("toasts", toast => toast.id === id, "dismiss", true);
}

function remove(id: number) {
  setState("toasts", prev => prev.filter(toast => toast.id !== id));
}

function clear() {
  setState("toasts", []);
}

export const toastStore = {
  toasts: () => state.toasts,
  get,
  add,
  dismiss,
  remove,
  clear,
};
