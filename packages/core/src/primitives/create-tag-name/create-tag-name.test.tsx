/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/8a13899ff807bbf39f3d89d2d5964042ba4d5287/packages/ariakit-react-utils/src/__tests__/hooks-test.tsx
 */

import { render } from "@solidjs/testing-library";
import { type Accessor, createSignal } from "solid-js";

import { createTagName } from "./create-tag-name";

describe("createTagName", () => {
	it("should use 'tagName' from ref", () => {
		let tagName: Accessor<string | undefined>;

		const TestComponent = () => {
			const [ref, setRef] = createSignal<HTMLDivElement | undefined>(
				undefined,
				{ ownedWrite: true },
			);
			tagName = createTagName(ref, () => "button");
			return <div ref={setRef} />;
		};

		render(() => <TestComponent />);

		expect(tagName!()).toBe("div");
	});

	it("should use type as 'tagName' when ref is undefined", () => {
		let tagName: Accessor<string | undefined>;

		const TestComponent = () => {
			const [ref] = createSignal<HTMLDivElement | undefined>(undefined);
			tagName = createTagName(ref, () => "button");
			return <div />;
		};

		render(() => <TestComponent />);

		expect(tagName!()).toBe("button");
	});
});
