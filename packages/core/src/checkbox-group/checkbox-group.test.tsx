/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/checkbox/test/Checkbox.test.js
 */

import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as CheckboxGroup from ".";

describe("CheckboxGroup", () => {
	installPointerEvent();

	it("handles defaults", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole, getAllByRole, getByLabelText } = render(() => (
			<CheckboxGroup.Root onChange={onChangeSpy}>
				<CheckboxGroup.Label>Favorite Pets</CheckboxGroup.Label>
				<div>
					<CheckboxGroup.Item id="dogs" value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="dragons" value="dragons">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dragons</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</div>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const inputs = getAllByRole("checkbox") as HTMLInputElement[];

		expect(checkboxGroup).toBeInTheDocument();
		expect(inputs.length).toBe(3);

		expect(inputs[0].value).toBe("dogs");
		expect(inputs[1].value).toBe("cats");
		expect(inputs[2].value).toBe("dragons");

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeFalsy();

		const dragons = getByLabelText("Dragons");

		fireEvent.click(dragons);
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledWith(["dragons"]);

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeTruthy();
	});

	it("can have a default value", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole, getAllByRole, getByLabelText } = render(() => (
			<CheckboxGroup.Root defaultValues={["cats"]} onChange={onChangeSpy}>
				<CheckboxGroup.Label>Favorite Pets</CheckboxGroup.Label>
				<div>
					<CheckboxGroup.Item id="dogs" value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="dragons" value="dragons">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dragons</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</div>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const inputs = getAllByRole("checkbox") as HTMLInputElement[];

		expect(checkboxGroup).toBeTruthy();
		expect(inputs.length).toBe(3);
		expect(onChangeSpy).not.toHaveBeenCalled();

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeTruthy();
		expect(inputs[2].checked).toBeFalsy();

		const dragons = getByLabelText("Dragons");

		fireEvent.click(dragons);
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledWith(["cats", "dragons"]);

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeTruthy();
		expect(inputs[2].checked).toBeTruthy();
	});

	it("value can be controlled", async () => {
		const onChangeSpy = vi.fn();
		const { getAllByRole, getByLabelText } = render(() => (
			<CheckboxGroup.Root values={["cats"]} onChange={onChangeSpy}>
				<CheckboxGroup.Label>Favorite Pets</CheckboxGroup.Label>
				<div>
					<CheckboxGroup.Item id="dogs" value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="dragons" value="dragons">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dragons</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</div>
			</CheckboxGroup.Root>
		));

		const inputs = getAllByRole("checkbox") as HTMLInputElement[];

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeTruthy();
		expect(inputs[2].checked).toBeFalsy();

		const dragons = getByLabelText("Dragons");

		fireEvent.click(dragons);
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledWith(["cats", "dragons"]);

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeTruthy();

		// false because `value` is controlled.
		expect(inputs[2].checked).toBeFalsy();
	});

	// FIXME:
	it("can select value by clicking on the item control", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole, getAllByRole, getByTestId } = render(() => (
			<CheckboxGroup.Root onChange={onChangeSpy}>
				<CheckboxGroup.Label>Favorite Pets</CheckboxGroup.Label>
				<div>
					<CheckboxGroup.Item value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item value="cats">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item value="dragons">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl data-testid="dragons-control" />
						<CheckboxGroup.ItemLabel>Dragons</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</div>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const inputs = getAllByRole("checkbox") as HTMLInputElement[];

		expect(checkboxGroup).toBeTruthy();
		expect(inputs.length).toBe(3);
		expect(onChangeSpy).not.toHaveBeenCalled();

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeFalsy();

		const dragonsControl = getByTestId("dragons-control");
		expect(inputs[2].checked).toBeFalsy();

		fireEvent.click(dragonsControl);
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledWith(["dragons"]);

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeTruthy();
	});

	// FIXME:
	it("can select value by pressing the Space key on the item control", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole, getAllByRole, getByTestId } = render(() => (
			<CheckboxGroup.Root onChange={onChangeSpy}>
				<CheckboxGroup.Label>Favorite Pets</CheckboxGroup.Label>
				<div>
					<CheckboxGroup.Item id="dogs" value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="dragons" value="dragons">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl data-testid="dragons-control" />
						<CheckboxGroup.ItemLabel>Dragons</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</div>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const inputs = getAllByRole("checkbox") as HTMLInputElement[];

		expect(checkboxGroup).toBeTruthy();
		expect(inputs.length).toBe(3);
		expect(onChangeSpy).not.toHaveBeenCalled();

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeFalsy();

		const dragonsControl = getByTestId("dragons-control");

		fireEvent.keyDown(dragonsControl, { key: " " });
		fireEvent.keyUp(dragonsControl, { key: " " });
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledWith(["dragons"]);

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeTruthy();
	});

	it("name can be controlled", () => {
		const { getAllByRole } = render(() => (
			<CheckboxGroup.Root name="test-name">
				<CheckboxGroup.Label>Favorite Pets</CheckboxGroup.Label>
				<div>
					<CheckboxGroup.Item id="dogs" value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="dragons" value="dragons">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dragons</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</div>
			</CheckboxGroup.Root>
		));

		const inputs = getAllByRole("checkbox") as HTMLInputElement[];

		expect(inputs[0]).toHaveAttribute("name", "test-name");
		expect(inputs[1]).toHaveAttribute("name", "test-name");
		expect(inputs[2]).toHaveAttribute("name", "test-name");
	});

	it("supports visible label", () => {
		const { getByRole, getByText } = render(() => (
			<CheckboxGroup.Root>
				<CheckboxGroup.Label>Favorite Pets</CheckboxGroup.Label>
				<div>
					<CheckboxGroup.Item id="dogs" value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="dragons" value="dragons">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dragons</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</div>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const label = getByText("Favorite Pets");

		expect(checkboxGroup).toHaveAttribute("aria-labelledby", label.id);
		expect(label).toBeInstanceOf(HTMLSpanElement);
		expect(label).not.toHaveAttribute("for");
	});

	// FIXME:
	it.only("supports 'aria-labelledby'", () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root aria-labelledby="foo">
				<div>
					<CheckboxGroup.Item id="dogs" value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item id="dragons" value="dragons">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dragons</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</div>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");

		expect(checkboxGroup).toHaveAttribute("aria-labelledby", "foo");
	});
});
