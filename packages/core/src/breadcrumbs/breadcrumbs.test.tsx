/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/breadcrumbs/test/useBreadcrumbs.test.js
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/breadcrumbs/test/useBreadcrumbItem.test.js
 */

import { render } from "@solidjs/testing-library";

import * as Breadcrumbs from ".";

describe("Breadcrumbs", () => {
	it("should have default 'aria-label'", () => {
		const { getByRole } = render(() => <Breadcrumbs.Root />);

		const nav = getByRole("navigation");
		expect(nav).toHaveAttribute("aria-label", "Breadcrumbs");
	});

	it("should have default separator", () => {
		const { getAllByText } = render(() => (
			<Breadcrumbs.Root>
				<ol>
					<li>
						<Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
					</li>
					<li>
						<Breadcrumbs.Link href="/components">Components</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
					</li>
					<li>
						<Breadcrumbs.Link current>Breadcrumbs</Breadcrumbs.Link>
					</li>
				</ol>
			</Breadcrumbs.Root>
		));

		const separators = getAllByText("/");
		expect(separators.length).toBe(2);
	});

	it("supports custom string separator", () => {
		const { getAllByText } = render(() => (
			<Breadcrumbs.Root separator=">">
				<ol>
					<li>
						<Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
					</li>
					<li>
						<Breadcrumbs.Link href="/components">Components</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
					</li>
					<li>
						<Breadcrumbs.Link current>Breadcrumbs</Breadcrumbs.Link>
					</li>
				</ol>
			</Breadcrumbs.Root>
		));

		const separators = getAllByText(">");
		expect(separators.length).toBe(2);
	});

	it("supports custom JSX.Element separator", () => {
		const { getAllByText } = render(() => (
			<Breadcrumbs.Root separator={<span>jsx separator</span>}>
				<ol>
					<li>
						<Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
					</li>
					<li>
						<Breadcrumbs.Link href="/components">Components</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
					</li>
					<li>
						<Breadcrumbs.Link current>Breadcrumbs</Breadcrumbs.Link>
					</li>
				</ol>
			</Breadcrumbs.Root>
		));

		const separators = getAllByText("jsx separator");
		expect(separators.length).toBe(2);
	});

	it("separator should be 'aria-hidden'", () => {
		const { getAllByText } = render(() => (
			<Breadcrumbs.Root>
				<ol>
					<li>
						<Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
					</li>
					<li>
						<Breadcrumbs.Link href="/components">Components</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
					</li>
					<li>
						<Breadcrumbs.Link current>Breadcrumbs</Breadcrumbs.Link>
					</li>
				</ol>
			</Breadcrumbs.Root>
		));

		const separators = getAllByText("/");

		for (const el of separators) {
			expect(el).toHaveAttribute("aria-hidden", "true");
		}
	});

	describe("Link", () => {
		it("should have 'aria-current=page' attribute when is current link", () => {
			const { getByText } = render(() => (
				<Breadcrumbs.Root>
					<ol>
						<li>
							<Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
							<Breadcrumbs.Separator />
						</li>
						<li>
							<Breadcrumbs.Link href="/components">Components</Breadcrumbs.Link>
							<Breadcrumbs.Separator />
						</li>
						<li>
							<Breadcrumbs.Link current>Breadcrumbs</Breadcrumbs.Link>
						</li>
					</ol>
				</Breadcrumbs.Root>
			));

			const currentLink = getByText("Breadcrumbs");
			expect(currentLink).toHaveAttribute("aria-current", "page");
		});

		it("should have 'data-current' attribute when is current link", () => {
			const { getByText } = render(() => (
				<Breadcrumbs.Root>
					<ol>
						<li>
							<Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
							<Breadcrumbs.Separator />
						</li>
						<li>
							<Breadcrumbs.Link href="/components">Components</Breadcrumbs.Link>
							<Breadcrumbs.Separator />
						</li>
						<li>
							<Breadcrumbs.Link current>Breadcrumbs</Breadcrumbs.Link>
						</li>
					</ol>
				</Breadcrumbs.Root>
			));

			const currentLink = getByText("Breadcrumbs");
			expect(currentLink).toHaveAttribute("data-current");
		});

		it("should be disabled when is current link", () => {
			const { getByText } = render(() => (
				<Breadcrumbs.Root>
					<ol>
						<li>
							<Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
							<Breadcrumbs.Separator />
						</li>
						<li>
							<Breadcrumbs.Link href="/components">Components</Breadcrumbs.Link>
							<Breadcrumbs.Separator />
						</li>
						<li>
							<Breadcrumbs.Link current>Breadcrumbs</Breadcrumbs.Link>
						</li>
					</ol>
				</Breadcrumbs.Root>
			));

			const currentLink = getByText("Breadcrumbs");
			expect(currentLink).toHaveAttribute("aria-disabled", "true");
			expect(currentLink).toHaveAttribute("data-disabled");
		});
	});
});
