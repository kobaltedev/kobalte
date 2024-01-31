/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/avatar/src/Avatar.test.tsx
 */

import { render, screen } from "@solidjs/testing-library";

import * as Image from ".";

const ROOT_TEST_ID = "image-root";
const FALLBACK_TEXT = "AB";
const IMAGE_ALT_TEXT = "Fake Image";
const DELAY = 300;

describe("Image", () => {
	describe("with fallback and a working image", () => {
		const originalGlobalImage = window.Image;

		beforeAll(() => {
			(window.Image as any) = class MockImage {
				onload: () => void = () => {};
				src = "";
				constructor() {
					setTimeout(() => {
						this.onload();
					}, DELAY);
				}
			};
		});

		afterAll(() => {
			window.Image = originalGlobalImage;
		});

		it("should render the fallback initially", () => {
			render(() => (
				<Image.Root data-testid={ROOT_TEST_ID}>
					<Image.Fallback>{FALLBACK_TEXT}</Image.Fallback>
					<Image.Img src="/test.jpg" alt={IMAGE_ALT_TEXT} />
				</Image.Root>
			));

			const fallback = screen.queryByText(FALLBACK_TEXT);
			expect(fallback).toBeInTheDocument();
		});

		it("should not render the image initially", () => {
			render(() => (
				<Image.Root data-testid={ROOT_TEST_ID}>
					<Image.Fallback>{FALLBACK_TEXT}</Image.Fallback>
					<Image.Img src="/test.jpg" alt={IMAGE_ALT_TEXT} />
				</Image.Root>
			));

			const image = screen.queryByRole("img");
			expect(image).not.toBeInTheDocument();
		});

		it("should render the image after it has loaded", async () => {
			render(() => (
				<Image.Root data-testid={ROOT_TEST_ID}>
					<Image.Fallback>{FALLBACK_TEXT}</Image.Fallback>
					<Image.Img src="/test.jpg" alt={IMAGE_ALT_TEXT} />
				</Image.Root>
			));

			const image = await screen.findByRole("img");
			expect(image).toBeInTheDocument();
		});

		it("should have alt text on the image", async () => {
			render(() => (
				<Image.Root data-testid={ROOT_TEST_ID}>
					<Image.Fallback>{FALLBACK_TEXT}</Image.Fallback>
					<Image.Img src="/test.jpg" alt={IMAGE_ALT_TEXT} />
				</Image.Root>
			));

			const image = await screen.findByAltText(IMAGE_ALT_TEXT);
			expect(image).toBeInTheDocument();
		});
	});

	describe("with fallback and delayed render", () => {
		it("should not render a fallback immediately", () => {
			render(() => (
				<Image.Root data-testid={ROOT_TEST_ID} fallbackDelay={DELAY}>
					<Image.Fallback>{FALLBACK_TEXT}</Image.Fallback>
				</Image.Root>
			));

			const fallback = screen.queryByText(FALLBACK_TEXT);
			expect(fallback).not.toBeInTheDocument();
		});

		it("should render a fallback after the delay", async () => {
			render(() => (
				<Image.Root data-testid={ROOT_TEST_ID} fallbackDelay={DELAY}>
					<Image.Fallback>{FALLBACK_TEXT}</Image.Fallback>
				</Image.Root>
			));

			let fallback = screen.queryByText(FALLBACK_TEXT);
			expect(fallback).not.toBeInTheDocument();

			fallback = await screen.findByText(FALLBACK_TEXT);
			expect(fallback).toBeInTheDocument();
		});
	});
});
