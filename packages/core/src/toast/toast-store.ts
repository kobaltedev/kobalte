import { createStore } from "solid-js";

import type { ToastConfig } from "./types";

const [state, setState] = createStore({
	toasts: [] as ToastConfig[],
});

function add(toast: ToastConfig) {
	setState((s) => {
		s.toasts.push(toast);
	});
}

function get(id: number) {
	return state.toasts.find((toast) => toast.id === id);
}

function update(id: number, toast: ToastConfig) {
	setState((s) => {
		const index = s.toasts.findIndex((t) => t.id === id);
		if (index !== -1) s.toasts[index] = toast;
	});
}

function dismiss(id: number) {
	setState((s) => {
		const index = s.toasts.findIndex((t) => t.id === id);
		if (index !== -1) {
			const t = s.toasts[index];
			// Replace item (not just mutate property) to ensure array-level reactivity
			s.toasts[index] = {
				id: t.id,
				dismiss: true,
				update: t.update,
				toastComponent: t.toastComponent,
				region: t.region,
			};
		}
	});
}

function remove(id: number) {
	setState((s) => {
		s.toasts = s.toasts.filter((t) => t.id !== id);
	});
}

function clear() {
	setState((s) => {
		s.toasts = [];
	});
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
