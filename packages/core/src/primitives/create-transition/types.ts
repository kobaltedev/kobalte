/*
 * Portions of this file are based on code from mantinedev.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/8546c580fdcaa9653edc6f4813103349a96cfb09/src/mantine-core/src/Transition/transitions.ts
 */

import type { JSX } from "solid-js";

export interface TransitionStyles {
	/** Styles for mounted state. */
	in: JSX.CSSProperties;

	/** Styles for unmounted state. */
	out: JSX.CSSProperties;

	/** Styles for both mounted and unmounted states. */
	common?: JSX.CSSProperties;
}
