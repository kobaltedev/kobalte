import { render } from "@solidjs/testing-library";

import * as Divider from ".";

describe("Divider", () => {
	it("should render a 'div' by default", () => {
		const { getByRole } = render(() => <Divider.Root />);

		const divider = getByRole("separator");

		expect(divider).toBeInstanceOf(HTMLDivElement);
	});

	it("should have 'role=separator' by default", () => {
		const { getByRole } = render(() => <Divider.Root />);

		const divider = getByRole("separator");

		expect(divider).toHaveAttribute("role", "separator");
	});

	it("should not have implicit 'aria-orientation' when 'orientation=horizontal'", () => {
		const { getByRole } = render(() => (
			<Divider.Root orientation="horizontal" />
		));

		const divider = getByRole("separator");

		expect(divider).not.toHaveAttribute("aria-orientation");
	});

	it("should have 'aria-orientation' set to vertical when 'orientation=vertical'", () => {
		const { getByRole } = render(() => <Divider.Root orientation="vertical" />);

		const divider = getByRole("separator");

		expect(divider).toHaveAttribute("aria-orientation", "vertical");
	});

	it("should have 'data-orientation=horizontal' when 'orientation=horizontal'", () => {
		const { getByRole } = render(() => (
			<Divider.Root orientation="horizontal" />
		));

		const divider = getByRole("separator");

		expect(divider).toHaveAttribute("data-orientation", "horizontal");
	});

	it("should have 'data-orientation=vertical' when 'orientation=vertical'", () => {
		const { getByRole } = render(() => <Divider.Root orientation="vertical" />);

		const divider = getByRole("separator");

		expect(divider).toHaveAttribute("data-orientation", "vertical");
	});

	it("should not have a 'data-inset' attribute by default", () => {
		const { getByRole } = render(() => <Divider.Root />);

		const divider = getByRole("separator");

		expect(divider).not.toHaveAttribute("data-inset");
	});

	it("should have 'data-inset' set when 'inset' is provided", () => {
		const { getByRole } = render(() => <Divider.Root inset="context" />);

		const divider = getByRole("separator");

		expect(divider).toHaveAttribute("data-inset", "context");
	});

	it("should render children content", () => {
		const { getByText } = render(() => <Divider.Root>OR</Divider.Root>);

		expect(getByText("OR")).toBeInTheDocument();
	});

	it("should not have 'role=separator' when rendered as 'hr'", () => {
		const { getByRole } = render(() => <Divider.Root as="hr" />);

		const divider = getByRole("separator");

		expect(divider).toBeInstanceOf(HTMLHRElement);
		expect(divider).not.toHaveAttribute("role");
	});

	it("should allow 'role' to be overridden", () => {
		const { container } = render(() => <Divider.Root role="presentation" />);

		const divider = container.querySelector("[role='presentation']");

		expect(divider).not.toBeNull();
	});
});
