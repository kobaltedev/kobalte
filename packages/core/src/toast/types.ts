/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 *
 */

import type { Component } from "solid-js";

export type ToastSwipeDirection = "up" | "down" | "left" | "right";

export type ToastPromiseState = "pending" | "fulfilled" | "rejected";

export interface ToastComponentProps {
	/** A unique id for the toast. */
	toastId: number;
}

export type ToastComponent = Component<ToastComponentProps>;

export interface ToastPromiseComponentProps<T, U = any>
	extends ToastComponentProps {
	/** The state of the promise. */
	state: ToastPromiseState;

	/** The resolved data of the promise when fulfilled. */
	data?: T;

	/** The error of the promise when rejected. */
	error?: U;
}

export type ToastPromiseComponent<T, U = any> = Component<
	ToastPromiseComponentProps<T, U>
>;

export interface ToastConfig {
	/** The unique id of the toast. */
	id: number;

	/** Whether the toast should be marked for dismiss. */
	dismiss: boolean;

	/** Whether the toast should be marked as an update. */
	update: boolean;

	/** The toast component to render. */
	toastComponent: ToastComponent;

	/** The id of the `<Toast.Region/>` to display the toast in. */
	region?: string;
}

export interface ShowToastOptions extends Pick<ToastConfig, "region"> {}
