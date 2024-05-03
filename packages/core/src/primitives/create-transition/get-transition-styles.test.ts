/*
 * Portions of this file are based on code from mantinedev.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/e88b62a7c97418d8c65ba6ce505469c8c906698a/src/mantine-core/src/Transition/get-transition-styles/get-transition-styles.test.ts
 */

import { createRoot } from "solid-js";

import { getTransitionStyles } from "./get-transition-styles";

describe("getTransitionStyles", () => {
	it("supports custom transitions", () =>
		createRoot((dispose) => {
			const customTransition = {
				in: { opacity: 1, "background-color": "red" },
				out: { opacity: 0, "background-color": "blue" },
				common: { color: "green" },
			};

			expect(
				getTransitionStyles({
					transition: customTransition,
					phase: "afterEnter",
					duration: 625,
					easing: "ease",
				}),
			).toStrictEqual({
				...customTransition.in,
				...customTransition.common,
				"transition-property": "opacity, background-color",
				"transition-duration": "625ms",
				"transition-timing-function": "ease",
			});

			expect(
				getTransitionStyles({
					transition: customTransition,
					phase: "afterExit",
					duration: 625,
					easing: "ease",
				}),
			).toStrictEqual({
				...customTransition.out,
				...customTransition.common,
				"transition-property": "opacity, background-color",
				"transition-duration": "625ms",
				"transition-timing-function": "ease",
			});

			dispose();
		}));
});
