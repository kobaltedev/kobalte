import { renderToString } from "@solidjs/web";
import { describe, expect, it } from "vitest";

import * as TextField from ".";

function attr(html: string, name: string): string[] {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return [...html.matchAll(new RegExp(`\\b${escaped}="([^"]*)"`, "g"))].map(
		(m) => m[1],
	);
}

describe("TextField (SSR)", () => {
	it("associates the label and the input in the server-rendered HTML", () => {
		const html = renderToString(() => (
			<TextField.Root>
				<TextField.Label>Email</TextField.Label>
				<TextField.Input />
			</TextField.Root>
		));

		const ids = attr(html, "id");
		const inputId = ids.find((id) => id.endsWith("-input"));

		// Effects don't run on the server, so the association is derived from
		// the ids the parts generate at creation time (`${rootId}-label`,
		// `${rootId}-input`) instead of the effect-driven registry. The label
		// points at the input and the input points back at the label.
		expect(inputId).toBeDefined();
		expect(attr(html, "for")).toEqual([inputId]);
		expect(attr(html, "aria-labelledby")).toEqual([
			ids.find((id) => id.endsWith("-label")),
		]);
	});

	it("links the description and the error message from the input", () => {
		const html = renderToString(() => (
			<TextField.Root validationState="invalid">
				<TextField.Label>Email</TextField.Label>
				<TextField.Input />
				<TextField.Description>Internal use only.</TextField.Description>
				<TextField.ErrorMessage>An email is required.</TextField.ErrorMessage>
			</TextField.Root>
		));

		expect(html).toContain('role="alert"');
		expect(html).toContain("Internal use only.");

		const ids = attr(html, "id");
		const described = attr(html, "aria-describedby")[0].split(" ");

		expect(described).toHaveLength(2);
		// Every described id resolves to an element that is actually rendered.
		expect(ids).toEqual(expect.arrayContaining(described));
		expect(described.some((id) => id.endsWith("-description"))).toBe(true);
		expect(described.some((id) => id.endsWith("-error-message"))).toBe(true);
		expect(described.some((id) => id.endsWith("-input"))).toBe(false);
	});

	it("does not announce an error message for a valid field", () => {
		const html = renderToString(() => (
			<TextField.Root>
				<TextField.Label>Email</TextField.Label>
				<TextField.Input />
				<TextField.ErrorMessage>An email is required.</TextField.ErrorMessage>
			</TextField.Root>
		));

		expect(html).not.toContain("An email is required.");
		expect(html).not.toContain('role="alert"');

		// The error message id is only derived when the field is invalid.
		const described = attr(html, "aria-describedby")[0]?.split(" ") ?? [];
		expect(described.some((id) => id.endsWith("-error-message"))).toBe(false);
	});
});
