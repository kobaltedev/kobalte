import { render, screen } from "@solidjs/testing-library";

import * as Separator from ".";
import { As } from "../polymorphic";

describe("Separator", () => {
	it("should render an 'hr' by default", () => {
		render(() => <Separator.Root />);

		const separator = screen.getByRole("separator");

		expect(separator).toBeInstanceOf(HTMLHRElement);
	});

	it("should not have implicit 'aria-orientation' by default", () => {
		render(() => <Separator.Root />);

		const separator = screen.getByRole("separator");

		expect(separator).not.toHaveAttribute("aria-orientation");
	});

	it("should not have implicit 'role=separator' by default", () => {
		render(() => <Separator.Root />);

		const separator = screen.getByRole("separator");

		expect(separator).not.toHaveAttribute("role", "separator");
	});

	it("should not have implicit 'aria-orientation' when 'orientation=horizontal'", () => {
		render(() => <Separator.Root orientation="horizontal" />);

		const separator = screen.getByRole("separator");

		expect(separator).not.toHaveAttribute("aria-orientation");
	});

	it("should have 'aria-orientation' set to vertical when 'orientation=vertical'", () => {
		render(() => <Separator.Root orientation="vertical" />);

		const separator = screen.getByRole("separator");

		expect(separator).toHaveAttribute("aria-orientation", "vertical");
	});

	it("should have 'role=separator' when rendered element is not 'hr'", () => {
		render(() => (
			<Separator.Root asChild>
				<As component="span" />
			</Separator.Root>
		));

		const separator = screen.getByRole("separator");

		expect(separator).toBeInstanceOf(HTMLSpanElement);
		expect(separator).toHaveAttribute("role", "separator");
	});

	it("should have 'data-orientation=horizontal' when 'orientation=horizontal'", () => {
		render(() => <Separator.Root orientation="horizontal" />);

		const separator = screen.getByRole("separator");

		expect(separator).toHaveAttribute("data-orientation", "horizontal");
	});

	it("should have 'data-orientation=vertical' when 'orientation=vertical'", () => {
		render(() => <Separator.Root orientation="vertical" />);

		const separator = screen.getByRole("separator");

		expect(separator).toHaveAttribute("data-orientation", "vertical");
	});
});
