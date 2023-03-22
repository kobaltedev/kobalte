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

function update(id: number, toast: Toast) {
  const index = state.toasts.findIndex(toast => toast.id === id);

  if (index != -1) {
    setState("toasts", prev => [...prev.slice(0, index), toast, ...prev.slice(index + 1)]);
  }
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
  add,
  get,
  update,
  dismiss,
  remove,
  clear,
};
