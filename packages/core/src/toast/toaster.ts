import { isFunction } from "@kobalte/utils";

import { toastStore } from "./toast-store";
import type {
	ShowToastOptions,
	ToastComponent,
	ToastPromiseComponent,
} from "./types";

let toastsCounter = 0;

/** Adds a new toast to the visible toasts or queue depending on current state and limit, and return the id of the created toast. */
function show(toastComponent: ToastComponent, options?: ShowToastOptions) {
	const id = toastsCounter++;
	toastStore.add({
		id,
		toastComponent,
		dismiss: false,
		update: false,
		region: options?.region,
	});
	return id;
}

/** Update the toast of the given id with a new rendered component. */
function update(id: number, toastComponent: ToastComponent) {
	toastStore.update(id, { id, toastComponent, dismiss: false, update: true });
}

/** Adds a new promise-based toast to the visible toasts or queue depending on current state and limit, and return the id of the created toast. */
function promise<T, U = any>(
	promise: Promise<T> | (() => Promise<T>),
	toastComponent: ToastPromiseComponent<T, U>,
	options?: ShowToastOptions,
) {
	const id = show((props) => {
		return toastComponent({
			get toastId() {
				return props.toastId;
			},
			state: "pending",
		});
	}, options);

	(isFunction(promise) ? promise() : promise)
		.then((data) =>
			update(id, (props) => {
				return toastComponent({
					get toastId() {
						return props.toastId;
					},
					state: "fulfilled",
					data,
				});
			}),
		)
		.catch((error) =>
			update(id, (props) => {
				return toastComponent({
					get toastId() {
						return props.toastId;
					},
					state: "rejected",
					error,
				});
			}),
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
