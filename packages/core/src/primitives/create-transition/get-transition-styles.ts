/*
 * Portions of this file are based on code from mantinedev.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/8546c580fdcaa9653edc6f4813103349a96cfb09/src/mantine-core/src/Transition/get-transition-styles/get-transition-styles.ts
 */

import type { JSX } from "solid-js";

import type { TransitionStyles } from "./types";

const TRANSITION_PHASES_MAP = {
	beforeEnter: "out",
	enter: "in",
	afterEnter: "in",
	beforeExit: "in", //"out",
	exit: "out",
	afterExit: "out",
} as const;

export type TransitionPhase = keyof typeof TRANSITION_PHASES_MAP;

interface GetTransitionStylesParams {
	transition: TransitionStyles;
	phase: TransitionPhase;
	duration: number;
	easing: JSX.CSSProperties["transition-timing-function"];
}

export function getTransitionStyles(
	params: GetTransitionStylesParams,
): JSX.CSSProperties {
	const shared: JSX.CSSProperties = {
		"transition-duration": `${params.duration}ms`,
		"transition-timing-function": params.easing,
	};

	return {
		"transition-property": getTransitionProperty(params.transition),
		...shared,
		...params.transition.common,
		...params.transition[TRANSITION_PHASES_MAP[params.phase]],
	};
}

function getTransitionProperty(transitionStyles: TransitionStyles): string {
	return [
		...new Set([
			...Object.keys(transitionStyles.in),
			...Object.keys(transitionStyles.out),
		]),
	].join(", ");
}
