/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/b14ac1fff0cdaf45d1ea3e65c28c320ac0f743f2/packages/react/slot/src/Slot.test.tsx
 */

import { render } from "@solidjs/testing-library";
import { expect } from "vitest";

import { Polymorphic } from "./polymorphic";

describe("Polymorphic", () => {
	it("should render the 'as' string prop", () => {
		const { getByTestId } = render(() => (
			<Polymorphic data-testid="polymorphic" as="div">
				Button
			</Polymorphic>
		));

		const polymorphic = getByTestId("polymorphic");

		expect(polymorphic).toBeInstanceOf(HTMLDivElement);
	});

	it("should render the 'as' custom component prop", () => {
		const CustomButton = (props: any) => (
			<button id="custom" type="button" {...props} />
		);

		const { getByTestId } = render(() => (
			<Polymorphic data-testid="polymorphic" as={CustomButton}>
				Button
			</Polymorphic>
		));

		const polymorphic = getByTestId("polymorphic");

		expect(polymorphic).toBeInstanceOf(HTMLButtonElement);
		expect(polymorphic).toHaveAttribute("id", "custom");
	});
});
