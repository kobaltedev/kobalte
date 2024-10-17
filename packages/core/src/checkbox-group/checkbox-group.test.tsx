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
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		const groupName = inputs[0].getAttribute("name");
		expect(inputs[0]).toHaveAttribute("name", groupName);
		expect(inputs[1]).toHaveAttribute("name", groupName);
		expect(inputs[2]).toHaveAttribute("name", groupName);

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
		expect(onChangeSpy).toHaveBeenCalledWith("dragons");

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeTruthy();
	});

	it("can have a default value", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole, getAllByRole, getByLabelText } = render(() => (
			<CheckboxGroup.Root
				defaultValues={[{ id: "cats", value: "cats" }]}
				onChange={onChangeSpy}
			>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
		expect(onChangeSpy).toHaveBeenCalledWith("dragons");

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeTruthy();
	});

	it("value can be controlled", async () => {
		const onChangeSpy = vi.fn();
		const { getAllByRole, getByLabelText } = render(() => (
			<CheckboxGroup.Root
				values={[{ id: "cats", value: "cats" }]}
				onChange={onChangeSpy}
			>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
		expect(onChangeSpy).toHaveBeenCalledWith("dragons");

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeTruthy();

		// false because `value` is controlled.
		expect(inputs[2].checked).toBeFalsy();
	});

	it("can select value by clicking on the item control", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole, getAllByRole, getByTestId } = render(() => (
			<CheckboxGroup.Root onChange={onChangeSpy}>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		fireEvent.click(dragonsControl);
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledWith("dragons");

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeTruthy();
	});

	it("can select value by pressing the Space key on the item control", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole, getAllByRole, getByTestId } = render(() => (
			<CheckboxGroup.Root onChange={onChangeSpy}>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
		expect(onChangeSpy).toHaveBeenCalledWith("dragons");

		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeTruthy();
	});

	it("name can be controlled", () => {
		const { getAllByRole } = render(() => (
			<CheckboxGroup.Root name="test-name">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
		const label = getByText("Favorite Pet");

		expect(checkboxGroup).toHaveAttribute("aria-labelledby", label.id);
		expect(label).toBeInstanceOf(HTMLSpanElement);
		expect(label).not.toHaveAttribute("for");
	});

	it("supports 'aria-labelledby'", () => {
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

	it("should combine 'aria-labelledby' if visible label is also provided", () => {
		const { getByRole, getByText } = render(() => (
			<CheckboxGroup.Root aria-labelledby="foo">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
		const label = getByText("Favorite Pet");

		expect(checkboxGroup).toHaveAttribute("aria-labelledby", `foo ${label.id}`);
	});

	it("supports 'aria-label'", () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root aria-label="My Favorite Pet">
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

		expect(checkboxGroup).toHaveAttribute("aria-label", "My Favorite Pet");
	});

	it("should combine 'aria-labelledby' if visible label and 'aria-label' is also provided", () => {
		const { getByRole, getByText } = render(() => (
			<CheckboxGroup.Root aria-label="bar" aria-labelledby="foo">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
		const label = getByText("Favorite Pet");

		expect(checkboxGroup).toHaveAttribute(
			"aria-labelledby",
			`foo ${label.id} ${checkboxGroup.id}`,
		);
	});

	it("supports visible description", () => {
		const { getByRole, getByText } = render(() => (
			<CheckboxGroup.Root>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
				<CheckboxGroup.Description>Description</CheckboxGroup.Description>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const description = getByText("Description");

		expect(description.id).toBeDefined();
		expect(checkboxGroup.id).toBeDefined();
		expect(checkboxGroup).toHaveAttribute("aria-describedby", description.id);

		// check that generated ids are unique
		expect(description.id).not.toBe(checkboxGroup.id);
	});

	it("supports visible description on single checkbox", () => {
		const { getByRole, getByText } = render(() => (
			<CheckboxGroup.Root>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
				<div>
					<CheckboxGroup.Item id="dogs" value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
						<CheckboxGroup.ItemDescription>
							Description
						</CheckboxGroup.ItemDescription>
					</CheckboxGroup.Item>
				</div>
			</CheckboxGroup.Root>
		));

		const checkbox = getByRole("checkbox");
		const itemDescription = getByText("Description");

		expect(itemDescription.id).toBeDefined();
		expect(checkbox.id).toBeDefined();
		expect(checkbox).toHaveAttribute("aria-describedby", itemDescription.id);
	});

	it("supports 'aria-describedby'", () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root aria-describedby="foo">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).toHaveAttribute("aria-describedby", "foo");
	});

	it("should combine 'aria-describedby' if visible description", () => {
		const { getByRole, getByText } = render(() => (
			<CheckboxGroup.Root aria-describedby="foo">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
				<CheckboxGroup.Description>Description</CheckboxGroup.Description>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const description = getByText("Description");

		expect(checkboxGroup).toHaveAttribute(
			"aria-describedby",
			`${description.id} foo`,
		);
	});

	it("supports visible error message when invalid", () => {
		const { getByRole, getByText } = render(() => (
			<CheckboxGroup.Root validationState="invalid">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
				<CheckboxGroup.ErrorMessage>ErrorMessage</CheckboxGroup.ErrorMessage>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const errorMessage = getByText("ErrorMessage");

		expect(errorMessage.id).toBeDefined();
		expect(checkboxGroup.id).toBeDefined();
		expect(checkboxGroup).toHaveAttribute("aria-describedby", errorMessage.id);

		// check that generated ids are unique
		expect(errorMessage.id).not.toBe(checkboxGroup.id);
	});

	it("should not be described by error message when not invalid", () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
				<CheckboxGroup.ErrorMessage>ErrorMessage</CheckboxGroup.ErrorMessage>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");

		expect(checkboxGroup).not.toHaveAttribute("aria-describedby");
	});

	it("should combine 'aria-describedby' if visible error message when invalid", () => {
		const { getByRole, getByText } = render(() => (
			<CheckboxGroup.Root validationState="invalid" aria-describedby="foo">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
				<CheckboxGroup.ErrorMessage>ErrorMessage</CheckboxGroup.ErrorMessage>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const errorMessage = getByText("ErrorMessage");

		expect(checkboxGroup).toHaveAttribute(
			"aria-describedby",
			`${errorMessage.id} foo`,
		);
	});

	it("should combine 'aria-describedby' if visible description and error message when invalid", () => {
		const { getByRole, getByText } = render(() => (
			<CheckboxGroup.Root validationState="invalid" aria-describedby="foo">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
				<CheckboxGroup.Description>Description</CheckboxGroup.Description>
				<CheckboxGroup.ErrorMessage>ErrorMessage</CheckboxGroup.ErrorMessage>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");
		const description = getByText("Description");
		const errorMessage = getByText("ErrorMessage");

		expect(checkboxGroup).toHaveAttribute(
			"aria-describedby",
			`${description.id} ${errorMessage.id} foo`,
		);
	});

	it("should not have form control 'data-*' attributes by default", async () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root>
				<CheckboxGroup.Item id="cats" value="cats">
					<CheckboxGroup.ItemInput />
				</CheckboxGroup.Item>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");

		expect(checkboxGroup).not.toHaveAttribute("data-valid");
		expect(checkboxGroup).not.toHaveAttribute("data-invalid");
		expect(checkboxGroup).not.toHaveAttribute("data-required");
		expect(checkboxGroup).not.toHaveAttribute("data-disabled");
		expect(checkboxGroup).not.toHaveAttribute("data-readonly");
	});

	it("should have 'data-valid' attribute when valid", async () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root validationState="valid">
				<CheckboxGroup.Item id="cats" value="cats">
					<CheckboxGroup.ItemInput />
				</CheckboxGroup.Item>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");

		expect(checkboxGroup).toHaveAttribute("data-valid");
	});

	it("should have 'data-invalid' attribute when invalid", async () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root validationState="invalid">
				<CheckboxGroup.Item id="cats" value="cats">
					<CheckboxGroup.ItemInput />
				</CheckboxGroup.Item>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");

		expect(checkboxGroup).toHaveAttribute("data-invalid");
	});

	it("should have 'data-required' attribute when required", async () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root required>
				<CheckboxGroup.Item id="cats" value="cats">
					<CheckboxGroup.ItemInput />
				</CheckboxGroup.Item>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");

		expect(checkboxGroup).toHaveAttribute("data-required");
	});

	it("should have 'data-disabled' attribute when disabled", async () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root disabled>
				<CheckboxGroup.Item id="cats" value="cats">
					<CheckboxGroup.ItemInput />
				</CheckboxGroup.Item>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");

		expect(checkboxGroup).toHaveAttribute("data-disabled");
	});

	it("should have 'data-readonly' attribute when readonly", async () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root readOnly>
				<CheckboxGroup.Item id="cats" value="cats">
					<CheckboxGroup.ItemInput />
				</CheckboxGroup.Item>
			</CheckboxGroup.Root>
		));

		const checkboxGroup = getByRole("group");

		expect(checkboxGroup).toHaveAttribute("data-readonly");
	});

	it("sets 'aria-orientation' by default", () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).toHaveAttribute("aria-orientation", "vertical");
	});

	it("sets 'aria-orientation' based on the 'orientation' prop", () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root orientation="horizontal">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).toHaveAttribute("aria-orientation", "horizontal");
	});

	it("sets 'aria-invalid' when 'validationState=invalid'", () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root validationState="invalid">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).toHaveAttribute("aria-invalid", "true");
	});

	it("passes through 'aria-errormessage'", () => {
		const { getByRole } = render(() => (
			<CheckboxGroup.Root validationState="invalid" aria-errormessage="test">
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).toHaveAttribute("aria-invalid", "true");
		expect(checkboxGroup).toHaveAttribute("aria-errormessage", "test");
	});

	it("sets 'aria-required' when 'isRequired' is true", () => {
		const { getByRole, getAllByRole } = render(() => (
			<CheckboxGroup.Root required>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).toHaveAttribute("aria-required", "true");

		const inputs = getAllByRole("checkbox");

		for (const input of inputs) {
			expect(input).not.toHaveAttribute("aria-required");
		}
	});

	it("sets 'aria-disabled' and makes checkboxs disabled when 'isDisabled' is true", async () => {
		const groupOnChangeSpy = vi.fn();

		const { getByRole, getAllByRole, getByLabelText } = render(() => (
			<CheckboxGroup.Root disabled onChange={groupOnChangeSpy}>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).toHaveAttribute("aria-disabled", "true");

		const inputs = getAllByRole("checkbox") as HTMLInputElement[];

		expect(inputs[0]).toHaveAttribute("disabled");
		expect(inputs[1]).toHaveAttribute("disabled");
		expect(inputs[2]).toHaveAttribute("disabled");

		const dragons = getByLabelText("Dragons");

		fireEvent.click(dragons);
		await Promise.resolve();

		expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
		expect(inputs[2].checked).toBeFalsy();
	});

	it("can have a single disabled checkbox", async () => {
		const groupOnChangeSpy = vi.fn();

		const { getByText, getAllByRole } = render(() => (
			<CheckboxGroup.Root onChange={groupOnChangeSpy}>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
				<div>
					<CheckboxGroup.Item id="dogs" value="dogs">
						<CheckboxGroup.ItemInput />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Dogs</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Item value="cats" disabled>
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

		expect(inputs[0]).not.toHaveAttribute("disabled");
		expect(inputs[1]).toHaveAttribute("disabled");
		expect(inputs[2]).not.toHaveAttribute("disabled");

		const dogsLabel = getByText("Dogs") as HTMLLabelElement;
		const catsLabel = getByText("Cats") as HTMLLabelElement;

		fireEvent.click(catsLabel);
		await Promise.resolve();

		expect(inputs[1].checked).toBeFalsy();

		expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
		expect(inputs[0].checked).toBeFalsy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeFalsy();

		fireEvent.click(dogsLabel);
		await Promise.resolve();

		expect(groupOnChangeSpy).toHaveBeenCalledTimes(1);
		expect(groupOnChangeSpy).toHaveBeenCalledWith("dogs");
		expect(inputs[0].checked).toBeTruthy();
		expect(inputs[1].checked).toBeFalsy();
		expect(inputs[2].checked).toBeFalsy();
	});

	it("doesn't set 'aria-disabled' or make checkboxs disabled by default", () => {
		const { getByRole, getAllByRole } = render(() => (
			<CheckboxGroup.Root>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).not.toHaveAttribute("aria-disabled");

		const inputs = getAllByRole("checkbox") as HTMLInputElement[];

		expect(inputs[0]).not.toHaveAttribute("disabled");
		expect(inputs[1]).not.toHaveAttribute("disabled");
		expect(inputs[2]).not.toHaveAttribute("disabled");
	});

	it("doesn't set 'aria-disabled' or make checkboxs disabled when 'isDisabled' is false", () => {
		const { getByRole, getAllByRole } = render(() => (
			<CheckboxGroup.Root disabled={false}>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).not.toHaveAttribute("aria-disabled");

		const inputs = getAllByRole("checkbox") as HTMLInputElement[];

		expect(inputs[0]).not.toHaveAttribute("disabled");
		expect(inputs[1]).not.toHaveAttribute("disabled");
		expect(inputs[2]).not.toHaveAttribute("disabled");
	});

	it("sets 'aria-readonly=true' on checkbox group", async () => {
		const groupOnChangeSpy = vi.fn();
		const { getByRole, getAllByRole, getByLabelText } = render(() => (
			<CheckboxGroup.Root readOnly onChange={groupOnChangeSpy}>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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

		expect(checkboxGroup).toHaveAttribute("aria-readonly", "true");
		expect(inputs[2].checked).toBeFalsy();

		const dragons = getByLabelText("Dragons");

		fireEvent.click(dragons);
		await Promise.resolve();

		expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
		expect(inputs[2].checked).toBeFalsy();
	});

	it("should not update state for readonly checkbox group", async () => {
		const groupOnChangeSpy = vi.fn();

		const { getAllByRole, getByLabelText } = render(() => (
			<CheckboxGroup.Root readOnly onChange={groupOnChangeSpy}>
				<CheckboxGroup.Label>Favorite Pet</CheckboxGroup.Label>
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
		const dragons = getByLabelText("Dragons");

		fireEvent.click(dragons);
		await Promise.resolve();

		expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
		expect(inputs[2].checked).toBeFalsy();
	});

	describe("Checkbox", () => {
		it("should generate default ids", () => {
			const { getByTestId } = render(() => (
				<CheckboxGroup.Root>
					<CheckboxGroup.Item data-testid="checkbox" value="cats">
						<CheckboxGroup.ItemInput data-testid="input" />
						<CheckboxGroup.ItemControl data-testid="control" />
						<CheckboxGroup.ItemLabel data-testid="label">
							Cats
						</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</CheckboxGroup.Root>
			));

			const checkbox = getByTestId("checkbox");
			const input = getByTestId("input");
			const control = getByTestId("control");
			const label = getByTestId("label");

			expect(checkbox.id).toBeDefined();
			expect(input.id).toBe(`${checkbox.id}-input`);
			expect(control.id).toBe(`${checkbox.id}-control`);
			expect(label.id).toBe(`${checkbox.id}-label`);
		});

		it("should generate ids based on checkbox id", () => {
			const { getByTestId } = render(() => (
				<CheckboxGroup.Root>
					<CheckboxGroup.Item data-testid="checkbox" value="cats" id="foo">
						<CheckboxGroup.ItemInput data-testid="input" />
						<CheckboxGroup.ItemControl data-testid="control" />
						<CheckboxGroup.ItemLabel data-testid="label">
							Cats
						</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</CheckboxGroup.Root>
			));

			const checkbox = getByTestId("checkbox");
			const input = getByTestId("input");
			const control = getByTestId("control");
			const label = getByTestId("label");

			expect(checkbox.id).toBe("foo");
			expect(input.id).toBe("foo-input");
			expect(control.id).toBe("foo-control");
			expect(label.id).toBe("foo-label");
		});

		it("supports custom ids", () => {
			const { getByTestId } = render(() => (
				<CheckboxGroup.Root>
					<CheckboxGroup.Item
						data-testid="checkbox"
						value="cats"
						id="custom-checkbox-id"
					>
						<CheckboxGroup.ItemInput data-testid="input" id="custom-input-id" />
						<CheckboxGroup.ItemControl
							data-testid="control"
							id="custom-control-id"
						/>
						<CheckboxGroup.ItemLabel data-testid="label" id="custom-label-id">
							Cats
						</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</CheckboxGroup.Root>
			));

			const checkbox = getByTestId("checkbox");
			const input = getByTestId("input");
			const control = getByTestId("control");
			const label = getByTestId("label");

			expect(checkbox.id).toBe("custom-checkbox-id");
			expect(input.id).toBe("custom-input-id");
			expect(control.id).toBe("custom-control-id");
			expect(label.id).toBe("custom-label-id");
		});

		it("supports 'aria-label'", () => {
			const { getByRole } = render(() => (
				<CheckboxGroup.Root>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput aria-label="Label" />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</CheckboxGroup.Root>
			));

			const checkbox = getByRole("checkbox");

			expect(checkbox).toHaveAttribute("aria-label", "Label");
		});

		it("supports 'aria-labelledby'", () => {
			const { getByRole, getByTestId } = render(() => (
				<CheckboxGroup.Root>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput aria-labelledby="foo" />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel data-testid="checkbox-label">
							Cats
						</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</CheckboxGroup.Root>
			));

			const checkboxLabel = getByTestId("checkbox-label");
			const checkbox = getByRole("checkbox");

			expect(checkbox).toHaveAttribute(
				"aria-labelledby",
				`foo ${checkboxLabel.id}`,
			);
		});

		it("should combine 'aria-label' and 'aria-labelledby'", () => {
			const { getByRole, getByTestId } = render(() => (
				<CheckboxGroup.Root>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput aria-label="Label" aria-labelledby="foo" />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel data-testid="checkbox-label">
							Cats
						</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</CheckboxGroup.Root>
			));

			const checkboxLabel = getByTestId("checkbox-label");
			const checkbox = getByRole("checkbox");

			expect(checkbox).toHaveAttribute(
				"aria-labelledby",
				`foo ${checkboxLabel.id} ${checkbox.id}`,
			);
		});

		it("supports 'aria-describedby'", () => {
			const { getByRole } = render(() => (
				<CheckboxGroup.Root>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput aria-describedby="foo" />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
				</CheckboxGroup.Root>
			));

			const checkbox = getByRole("checkbox");

			expect(checkbox).toHaveAttribute("aria-describedby", "foo");
		});

		it("should combine 'aria-describedby' from both checkbox and checkbox group", () => {
			const { getByRole, getByTestId } = render(() => (
				<CheckboxGroup.Root>
					<CheckboxGroup.Item id="cats" value="cats">
						<CheckboxGroup.ItemInput aria-describedby="foo" />
						<CheckboxGroup.ItemControl />
						<CheckboxGroup.ItemLabel>Cats</CheckboxGroup.ItemLabel>
					</CheckboxGroup.Item>
					<CheckboxGroup.Description data-testid="description">
						Description
					</CheckboxGroup.Description>
				</CheckboxGroup.Root>
			));

			const checkbox = getByRole("checkbox");
			const description = getByTestId("description");

			expect(checkbox).toHaveAttribute(
				"aria-describedby",
				`foo ${description.id}`,
			);
		});

		describe("indicator", () => {
			it("should not display indicator by default", async () => {
				const { queryByTestId } = render(() => (
					<CheckboxGroup.Root>
						<CheckboxGroup.Item id="cats" value="cats">
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl>
								<CheckboxGroup.ItemIndicator data-testid="indicator" />
							</CheckboxGroup.ItemControl>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				expect(queryByTestId("indicator")).toBeNull();
			});

			it("should display indicator when 'selected'", async () => {
				const { getByRole, queryByTestId, getByTestId } = render(() => (
					<CheckboxGroup.Root>
						<CheckboxGroup.Item id="cats" value="cats">
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl>
								<CheckboxGroup.ItemIndicator data-testid="indicator" />
							</CheckboxGroup.ItemControl>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				const input = getByRole("checkbox") as HTMLInputElement;

				expect(input.checked).toBeFalsy();
				expect(queryByTestId("indicator")).toBeNull();

				fireEvent.click(input);
				await Promise.resolve();

				expect(input.checked).toBeTruthy();
				expect(getByTestId("indicator")).toBeInTheDocument();
			});

			it("should display indicator when 'forceMount'", async () => {
				const { getByTestId } = render(() => (
					<CheckboxGroup.Root>
						<CheckboxGroup.Item id="cats" value="cats">
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl>
								<CheckboxGroup.ItemIndicator
									data-testid="indicator"
									forceMount
								/>
							</CheckboxGroup.ItemControl>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				expect(getByTestId("indicator")).toBeInTheDocument();
			});
		});

		describe("data-attributes", () => {
			it("should have 'data-valid' attribute on checkbox elements when checkbox group is valid", async () => {
				const { getAllByTestId } = render(() => (
					<CheckboxGroup.Root
						validationState="valid"
						values={[{ id: "cats", value: "cats" }]}
					>
						<CheckboxGroup.Item data-testid="checkbox-root" value="cats">
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl data-testid="checkbox-control">
								<CheckboxGroup.ItemIndicator data-testid="checkbox-indicator" />
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel data-testid="checkbox-label">
								Cats
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				const elements = getAllByTestId(/^checkbox/);

				for (const el of elements) {
					expect(el).toHaveAttribute("data-valid");
				}
			});

			it("should have 'data-invalid' attribute on checkboxs when checkbox group is invalid", async () => {
				const { getAllByTestId } = render(() => (
					<CheckboxGroup.Root
						validationState="invalid"
						values={[{ id: "cats", value: "cats" }]}
					>
						<CheckboxGroup.Item data-testid="checkbox-root" value="cats">
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl data-testid="checkbox-control">
								<CheckboxGroup.ItemIndicator data-testid="checkbox-indicator" />
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel data-testid="checkbox-label">
								Cats
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				const elements = getAllByTestId(/^checkbox/);

				for (const el of elements) {
					expect(el).toHaveAttribute("data-invalid");
				}
			});

			it("should have 'data-required' attribute on checkboxs when checkbox group is required", async () => {
				const { getAllByTestId } = render(() => (
					<CheckboxGroup.Root values={[{ id: "cats", value: "cats" }]} required>
						<CheckboxGroup.Item data-testid="checkbox-root" value="cats">
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl data-testid="checkbox-control">
								<CheckboxGroup.ItemIndicator data-testid="checkbox-indicator" />
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel data-testid="checkbox-label">
								Cats
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				const elements = getAllByTestId(/^checkbox/);

				for (const el of elements) {
					expect(el).toHaveAttribute("data-required");
				}
			});

			it("should have 'data-readonly' attribute on checkboxs when checkbox group is readonly", async () => {
				const { getAllByTestId } = render(() => (
					<CheckboxGroup.Root values={[{ id: "cats", value: "cats" }]} readOnly>
						<CheckboxGroup.Item data-testid="checkbox-root" value="cats">
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl data-testid="checkbox-control">
								<CheckboxGroup.ItemIndicator data-testid="checkbox-indicator" />
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel data-testid="checkbox-label">
								Cats
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				const elements = getAllByTestId(/^checkbox/);

				for (const el of elements) {
					expect(el).toHaveAttribute("data-readonly");
				}
			});

			it("should have 'data-disabled' attribute on checkboxs when checkbox group is disabled", async () => {
				const { getAllByTestId } = render(() => (
					<CheckboxGroup.Root disabled values={[{ id: "cats", value: "cats" }]}>
						<CheckboxGroup.Item data-testid="checkbox-root" value="cats">
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl data-testid="checkbox-control">
								<CheckboxGroup.ItemIndicator data-testid="checkbox-indicator" />
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel data-testid="checkbox-label">
								Cats
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				const elements = getAllByTestId(/^checkbox/);

				for (const el of elements) {
					expect(el).toHaveAttribute("data-disabled");
				}
			});

			it("should have 'data-disabled' attribute on single disabled checkbox", async () => {
				const { getAllByTestId } = render(() => (
					<CheckboxGroup.Root values={[{ id: "cats", value: "cats" }]}>
						<CheckboxGroup.Item
							data-testid="checkbox-root"
							value="cats"
							disabled
						>
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl data-testid="checkbox-control">
								<CheckboxGroup.ItemIndicator data-testid="checkbox-indicator" />
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel data-testid="checkbox-label">
								Cats
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				const elements = getAllByTestId(/^checkbox/);

				for (const el of elements) {
					expect(el).toHaveAttribute("data-disabled");
				}
			});

			it("should have 'data-checked' attribute on checked checkbox", async () => {
				const { getAllByTestId } = render(() => (
					<CheckboxGroup.Root values={[{ id: "cats", value: "cats" }]}>
						<CheckboxGroup.Item data-testid="checkbox-root" value="cats">
							<CheckboxGroup.ItemInput />
							<CheckboxGroup.ItemControl data-testid="checkbox-control">
								<CheckboxGroup.ItemIndicator data-testid="checkbox-indicator" />
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel data-testid="checkbox-label">
								Cats
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					</CheckboxGroup.Root>
				));

				const elements = getAllByTestId(/^checkbox/);

				for (const el of elements) {
					expect(el).toHaveAttribute("data-checked");
				}
			});
		});
	});
});
