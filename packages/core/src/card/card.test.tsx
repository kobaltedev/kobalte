import { render } from "@solidjs/testing-library";

import * as Card from ".";

describe("Card", () => {
	it("should render a 'div' by default", () => {
		const { container } = render(() => <Card.Root>content</Card.Root>);

		const root = container.firstElementChild;

		expect(root).toBeInstanceOf(HTMLDivElement);
	});

	it("should not have a 'role' attribute by default", () => {
		const { container } = render(() => <Card.Root>content</Card.Root>);

		const root = container.firstElementChild;

		expect(root).not.toHaveAttribute("role");
	});

	it("should allow 'role' to be set explicitly (e.g. 'region')", () => {
		const { container } = render(() => (
			<Card.Root role="region">content</Card.Root>
		));

		const root = container.firstElementChild;

		expect(root).toHaveAttribute("role", "region");
	});

	it("should not have 'aria-labelledby' or 'aria-describedby' when no Title/Description are rendered", () => {
		const { container } = render(() => <Card.Root>content</Card.Root>);

		const root = container.firstElementChild;

		expect(root).not.toHaveAttribute("aria-labelledby");
		expect(root).not.toHaveAttribute("aria-describedby");
	});

	it("should wire 'aria-labelledby' to Card.Title's id", () => {
		const { container, getByText } = render(() => (
			<Card.Root>
				<Card.Title>Security</Card.Title>
			</Card.Root>
		));

		const root = container.firstElementChild;
		const title = getByText("Security");

		expect(root).toHaveAttribute("aria-labelledby", title.id);
	});

	it("should wire 'aria-describedby' to Card.Description's id", () => {
		const { container, getByText } = render(() => (
			<Card.Root>
				<Card.Description>Security insights</Card.Description>
			</Card.Root>
		));

		const root = container.firstElementChild;
		const description = getByText("Security insights");

		expect(root).toHaveAttribute("aria-describedby", description.id);
	});

	it("should render Card.Title as an 'h3' by default", () => {
		const { getByText } = render(() => (
			<Card.Root>
				<Card.Title>Security</Card.Title>
			</Card.Root>
		));

		expect(getByText("Security")).toBeInstanceOf(HTMLHeadingElement);
	});

	it("should render Card.Header, Card.HeaderAction, Card.Content and Card.Footer as 'div's", () => {
		const { getByTestId } = render(() => (
			<Card.Root>
				<Card.Header data-testid="header">
					<Card.HeaderAction data-testid="header-action" />
				</Card.Header>
				<Card.Content data-testid="content" />
				<Card.Footer data-testid="footer" />
			</Card.Root>
		));

		expect(getByTestId("header")).toBeInstanceOf(HTMLDivElement);
		expect(getByTestId("header-action")).toBeInstanceOf(HTMLDivElement);
		expect(getByTestId("content")).toBeInstanceOf(HTMLDivElement);
		expect(getByTestId("footer")).toBeInstanceOf(HTMLDivElement);
	});
});
