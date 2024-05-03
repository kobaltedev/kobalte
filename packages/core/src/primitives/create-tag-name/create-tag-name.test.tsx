/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/8a13899ff807bbf39f3d89d2d5964042ba4d5287/packages/ariakit-react-utils/src/__tests__/hooks-test.tsx
 */

import { render } from "@solidjs/testing-library";
import { createEffect } from "solid-js";

import { createTagName } from "./create-tag-name";

describe("createTagName", () => {
	it("should use 'tagName' from ref", () => {
		let tagNameVal: string | undefined;

		const TestComponent = () => {
			let ref: HTMLDivElement | undefined;

			const tagName = createTagName(
				() => ref,
				() => "button",
			);

			createEffect(() => {
				tagNameVal = tagName();
			});

			return <div ref={ref} />;
		};

		render(() => <TestComponent />);

		expect(tagNameVal).toBe("div");
	});

	it("should use type as 'tagName' when ref is undefined", () => {
		let tagNameVal: string | undefined;

		const TestComponent = () => {
			let ref: HTMLDivElement | undefined;

			const tagName = createTagName(
				() => ref,
				() => "button",
			);

			createEffect(() => {
				tagNameVal = tagName();
			});

			return <div />;
		};

		render(() => <TestComponent />);

		expect(tagNameVal).toBe("button");
	});
});
