import { fireEvent, render } from "@solidjs/testing-library";
import { afterAll, describe, expect, it, vi } from "vitest";

import * as Chip from ".";

describe("Chip", () => {
	const consoleMock = vi
		.spyOn(console, "log")
		.mockImplementation(() => undefined);

	afterEach(() => {
		consoleMock.mockClear();
	});

	afterAll(() => {
		consoleMock.mockReset();
	});

	it("should show Chip and it should be clickable", () => {
		const { getByRole } = render(() => (
			<Chip.Root onClick={() => console.log("hello world from chip A")}>
				<Chip.Label>Chip A</Chip.Label>
			</Chip.Root>
		));

		const button = getByRole("button", { name: /chip a/i });
		fireEvent.click(button);
		expect(consoleMock).toHaveBeenLastCalledWith("hello world from chip A");
	});

	it("should show disabled Chip and it should not be clickable", () => {
		const { getByRole } = render(() => (
			<Chip.Root onClick={() => console.log("not called")} disabled>
				<Chip.Label>Disabled Chip A</Chip.Label>
			</Chip.Root>
		));

		const button = getByRole("button", { name: /disabled chip a/i });
		fireEvent.click(button);
		expect(consoleMock).not.toHaveBeenCalled();
	});

	describe("keyboard accessible", () => {
		it("should show Chip and it should be clickable via keyboard enter", () => {
			const { getByRole } = render(() => (
				<Chip.Root onClick={() => console.log("hello world from chip A")}>
					<Chip.Label>Chip A</Chip.Label>
				</Chip.Root>
			));

			const button = getByRole("button", { name: /chip a/i });
			fireEvent.keyDown(button, { key: "Enter", code: "Enter", charCode: 13 });
			expect(consoleMock).toHaveBeenCalledWith("hello world from chip A");
		});

		it("should show Chip and it should be clickable via keyboard space", () => {
			const { getByRole } = render(() => (
				<Chip.Root onClick={() => console.log("hello world from chip B")}>
					<Chip.Label>Chip B</Chip.Label>
				</Chip.Root>
			));

			const button = getByRole("button", { name: /chip b/i });
			fireEvent.keyDown(button, { key: " ", code: "Space", charCode: 32 });
			expect(consoleMock).toHaveBeenCalledWith("hello world from chip B");
		});
	});
});
