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

import * as Checkbox from ".";

describe("Checkbox", () => {
	installPointerEvent();

	const onChangeSpy = vi.fn();

	afterEach(() => {
		onChangeSpy.mockClear();
	});

	it("should generate default ids", () => {
		const { getByTestId } = render(() => (
			<Checkbox.Root data-testid="checkbox">
				<Checkbox.Input data-testid="input" />
				<Checkbox.Control data-testid="control">
					<Checkbox.Indicator data-testid="indicator" forceMount />
				</Checkbox.Control>
				<Checkbox.Label data-testid="label">Label</Checkbox.Label>
			</Checkbox.Root>
		));

		const checkboxRoot = getByTestId("checkbox");
		const input = getByTestId("input");
		const control = getByTestId("control");
		const indicator = getByTestId("indicator");
		const label = getByTestId("label");

		expect(checkboxRoot.id).toBeDefined();
		expect(input.id).toBe(`${checkboxRoot.id}-input`);
		expect(control.id).toBe(`${checkboxRoot.id}-control`);
		expect(indicator.id).toBe(`${checkboxRoot.id}-indicator`);
		expect(label.id).toBe(`${checkboxRoot.id}-label`);
	});

	it("should generate ids based on checkbox id", () => {
		const { getByTestId } = render(() => (
			<Checkbox.Root data-testid="checkbox" id="foo">
				<Checkbox.Input data-testid="input" />
				<Checkbox.Control data-testid="control">
					<Checkbox.Indicator data-testid="indicator" forceMount />
				</Checkbox.Control>
				<Checkbox.Label data-testid="label">Label</Checkbox.Label>
			</Checkbox.Root>
		));

		const checkboxRoot = getByTestId("checkbox");
		const input = getByTestId("input");
		const control = getByTestId("control");
		const indicator = getByTestId("indicator");
		const label = getByTestId("label");

		expect(checkboxRoot.id).toBe("foo");
		expect(input.id).toBe("foo-input");
		expect(control.id).toBe("foo-control");
		expect(indicator.id).toBe("foo-indicator");
		expect(label.id).toBe("foo-label");
	});

	it("supports custom ids", () => {
		const { getByTestId } = render(() => (
			<Checkbox.Root data-testid="checkbox" id="custom-checkbox-id">
				<Checkbox.Input data-testid="input" id="custom-input-id" />
				<Checkbox.Control data-testid="control" id="custom-control-id">
					<Checkbox.Indicator
						data-testid="indicator"
						id="custom-indicator-id"
						forceMount
					/>
				</Checkbox.Control>
				<Checkbox.Label data-testid="label" id="custom-label-id">
					Label
				</Checkbox.Label>
			</Checkbox.Root>
		));

		const checkboxRoot = getByTestId("checkbox");
		const input = getByTestId("input");
		const control = getByTestId("control");
		const indicator = getByTestId("indicator");
		const label = getByTestId("label");

		expect(checkboxRoot.id).toBe("custom-checkbox-id");
		expect(input.id).toBe("custom-input-id");
		expect(control.id).toBe("custom-control-id");
		expect(indicator.id).toBe("custom-indicator-id");
		expect(label.id).toBe("custom-label-id");
	});

	it("should set input type to checkbox", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox");

		expect(input).toHaveAttribute("type", "checkbox");
	});

	it("should have default value of 'on'", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.value).toBe("on");
	});

	it("supports custom value", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root value="custom">
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.value).toBe("custom");
	});

	it("ensure default unchecked can be checked", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root onChange={onChangeSpy}>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.checked).toBeFalsy();
		expect(onChangeSpy).not.toHaveBeenCalled();

		fireEvent.click(input);
		await Promise.resolve();

		expect(input.checked).toBeTruthy();
		expect(onChangeSpy.mock.calls[0][0]).toBe(true);

		fireEvent.click(input);
		await Promise.resolve();

		expect(onChangeSpy.mock.calls[1][0]).toBe(false);
	});

	it("can be default checked", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root defaultChecked onChange={onChangeSpy}>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.checked).toBeTruthy();

		fireEvent.click(input);
		await Promise.resolve();

		expect(input.checked).toBeFalsy();
		expect(onChangeSpy.mock.calls[0][0]).toBe(false);
	});

	it("can be controlled checked", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root checked onChange={onChangeSpy}>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.checked).toBeTruthy();

		fireEvent.click(input);
		await Promise.resolve();

		expect(input.checked).toBeTruthy();
		expect(onChangeSpy.mock.calls[0][0]).toBe(false);
	});

	it("can be controlled unchecked", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root checked={false} onChange={onChangeSpy}>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.checked).toBeFalsy();

		fireEvent.click(input);
		await Promise.resolve();

		expect(input.checked).toBeFalsy();
		expect(onChangeSpy.mock.calls[0][0]).toBe(true);
	});

	it("can be indeterminate", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root indeterminate onChange={onChangeSpy}>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.indeterminate).toBeTruthy();
		expect(input.checked).toBeFalsy();

		fireEvent.click(input);
		await Promise.resolve();

		expect(input.indeterminate).toBeTruthy();
		expect(input.checked).toBeTruthy();
		expect(onChangeSpy).toHaveBeenCalled();
		expect(onChangeSpy.mock.calls[0][0]).toBe(true);

		fireEvent.click(input);
		await Promise.resolve();

		expect(input.indeterminate).toBeTruthy();
		expect(input.checked).toBeFalsy();
		expect(onChangeSpy.mock.calls[1][0]).toBe(false);
	});

	it("can be checked by clicking on the control", async () => {
		const { getByRole, getByTestId } = render(() => (
			<Checkbox.Root onChange={onChangeSpy}>
				<Checkbox.Input />
				<Checkbox.Control data-testid="control" />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const control = getByTestId("control");

		expect(input.checked).toBeFalsy();

		fireEvent.click(control);
		await Promise.resolve();

		expect(input.checked).toBeTruthy();
		expect(onChangeSpy.mock.calls[0][0]).toBe(true);
	});

	it("can be checked by pressing the Space key on the control", async () => {
		const { getByRole, getByTestId } = render(() => (
			<Checkbox.Root onChange={onChangeSpy}>
				<Checkbox.Input />
				<Checkbox.Control data-testid="control" />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const control = getByTestId("control");

		expect(input.checked).toBeFalsy();

		fireEvent.keyDown(control, { key: " " });
		fireEvent.keyUp(control, { key: " " });
		await Promise.resolve();

		expect(input.checked).toBeTruthy();
		expect(onChangeSpy.mock.calls[0][0]).toBe(true);
	});

	it("can be disabled", async () => {
		const { getByRole, getByTestId } = render(() => (
			<Checkbox.Root disabled onChange={onChangeSpy}>
				<Checkbox.Input />
				<Checkbox.Label data-testid="label">Label</Checkbox.Label>
			</Checkbox.Root>
		));

		const label = getByTestId("label");
		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.disabled).toBeTruthy();
		expect(input.checked).toBeFalsy();

		// I don't know why but `fireEvent` on the input fire the click even if the input is disabled.
		fireEvent.click(label);
		await Promise.resolve();

		expect(input.checked).toBeFalsy();
		expect(onChangeSpy).not.toHaveBeenCalled();
	});

	it("can be invalid", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root validationState="invalid" onChange={onChangeSpy}>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-invalid", "true");
	});

	it("passes through 'aria-errormessage'", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root validationState="invalid" onChange={onChangeSpy}>
				<Checkbox.Input aria-errormessage="test" />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(input).toHaveAttribute("aria-errormessage", "test");
	});

	it("supports visible label", async () => {
		const { getByRole, getByText } = render(() => (
			<Checkbox.Root>
				<Checkbox.Label>Label</Checkbox.Label>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const label = getByText("Label");

		expect(input).toHaveAttribute("aria-labelledby", label.id);
		expect(label).toBeInstanceOf(HTMLLabelElement);
		expect(label).toHaveAttribute("for", input.id);
	});

	it("supports 'aria-labelledby'", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root>
				<Checkbox.Input aria-labelledby="foo" />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-labelledby", "foo");
	});

	it("should combine 'aria-labelledby' if visible label is also provided", async () => {
		const { getByRole, getByText } = render(() => (
			<Checkbox.Root>
				<Checkbox.Label>Label</Checkbox.Label>
				<Checkbox.Input aria-labelledby="foo" />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const label = getByText("Label");

		expect(input).toHaveAttribute("aria-labelledby", `foo ${label.id}`);
	});

	it("supports 'aria-label'", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root>
				<Checkbox.Input aria-label="My Label" />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-label", "My Label");
	});

	it("should combine 'aria-labelledby' if visible label and 'aria-label' is also provided", async () => {
		const { getByRole, getByText } = render(() => (
			<Checkbox.Root>
				<Checkbox.Label>Label</Checkbox.Label>
				<Checkbox.Input aria-label="bar" aria-labelledby="foo" />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const label = getByText("Label");

		expect(input).toHaveAttribute(
			"aria-labelledby",
			`foo ${label.id} ${input.id}`,
		);
	});

	it("supports visible description", async () => {
		const { getByRole, getByText } = render(() => (
			<Checkbox.Root>
				<Checkbox.Input />
				<Checkbox.Description>Description</Checkbox.Description>
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const description = getByText("Description");

		expect(description.id).toBeDefined();
		expect(input.id).toBeDefined();
		expect(input).toHaveAttribute("aria-describedby", description.id);

		// check that generated ids are unique
		expect(description.id).not.toBe(input.id);
	});

	it("supports 'aria-describedby'", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root>
				<Checkbox.Input aria-describedby="foo" />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-describedby", "foo");
	});

	it("should combine 'aria-describedby' if visible description", async () => {
		const { getByRole, getByText } = render(() => (
			<Checkbox.Root>
				<Checkbox.Input aria-describedby="foo" />
				<Checkbox.Description>Description</Checkbox.Description>
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const description = getByText("Description");

		expect(input).toHaveAttribute("aria-describedby", `${description.id} foo`);
	});

	it("supports visible error message when invalid", async () => {
		const { getByRole, getByText } = render(() => (
			<Checkbox.Root validationState="invalid">
				<Checkbox.Input />
				<Checkbox.ErrorMessage>ErrorMessage</Checkbox.ErrorMessage>
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const errorMessage = getByText("ErrorMessage");

		expect(errorMessage.id).toBeDefined();
		expect(input.id).toBeDefined();
		expect(input).toHaveAttribute("aria-describedby", errorMessage.id);

		// check that generated ids are unique
		expect(errorMessage.id).not.toBe(input.id);
	});

	it("should not be described by error message when not invalid", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root>
				<Checkbox.Input />
				<Checkbox.ErrorMessage>ErrorMessage</Checkbox.ErrorMessage>
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input).not.toHaveAttribute("aria-describedby");
	});

	it("should combine 'aria-describedby' if visible error message when invalid", () => {
		const { getByRole, getByText } = render(() => (
			<Checkbox.Root validationState="invalid">
				<Checkbox.Input aria-describedby="foo" />
				<Checkbox.ErrorMessage>ErrorMessage</Checkbox.ErrorMessage>
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const errorMessage = getByText("ErrorMessage");

		expect(input).toHaveAttribute("aria-describedby", `${errorMessage.id} foo`);
	});

	it("should combine 'aria-describedby' if visible description and error message when invalid", () => {
		const { getByRole, getByText } = render(() => (
			<Checkbox.Root validationState="invalid">
				<Checkbox.Input aria-describedby="foo" />
				<Checkbox.Description>Description</Checkbox.Description>
				<Checkbox.ErrorMessage>ErrorMessage</Checkbox.ErrorMessage>
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;
		const description = getByText("Description");
		const errorMessage = getByText("ErrorMessage");

		expect(input).toHaveAttribute(
			"aria-describedby",
			`${description.id} ${errorMessage.id} foo`,
		);
	});

	it("can be readonly", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root checked readOnly onChange={onChangeSpy}>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.checked).toBeTruthy();
		expect(input).toHaveAttribute("aria-readonly", "true");

		fireEvent.click(input);
		await Promise.resolve();

		expect(input.checked).toBeTruthy();
		expect(onChangeSpy).not.toHaveBeenCalled();
	});

	it("supports uncontrolled readonly", async () => {
		const { getByRole } = render(() => (
			<Checkbox.Root readOnly onChange={onChangeSpy}>
				<Checkbox.Input />
			</Checkbox.Root>
		));

		const input = getByRole("checkbox") as HTMLInputElement;

		expect(input.checked).toBeFalsy();

		fireEvent.click(input);
		await Promise.resolve();

		expect(input.checked).toBeFalsy();
		expect(onChangeSpy).not.toHaveBeenCalled();
	});

	describe("indicator", () => {
		it("should not display indicator by default", async () => {
			const { queryByTestId } = render(() => (
				<Checkbox.Root>
					<Checkbox.Input />
					<Checkbox.Control>
						<Checkbox.Indicator data-testid="indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			expect(queryByTestId("indicator")).toBeNull();
		});

		it("should display indicator when 'checked'", async () => {
			const { getByRole, queryByTestId, getByTestId } = render(() => (
				<Checkbox.Root>
					<Checkbox.Input />
					<Checkbox.Control>
						<Checkbox.Indicator data-testid="indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			const input = getByRole("checkbox") as HTMLInputElement;

			expect(input.checked).toBeFalsy();
			expect(queryByTestId("indicator")).toBeNull();

			fireEvent.click(input);
			await Promise.resolve();

			expect(input.checked).toBeTruthy();
			expect(getByTestId("indicator")).toBeInTheDocument();

			fireEvent.click(input);
			await Promise.resolve();

			expect(input.checked).toBeFalsy();
			//			expect(queryByTestId("indicator")).toBeNull(); // TODO: fix vitest delays
		});

		it("should display indicator when 'indeterminate'", async () => {
			const { getByTestId } = render(() => (
				<Checkbox.Root indeterminate>
					<Checkbox.Input />
					<Checkbox.Control>
						<Checkbox.Indicator data-testid="indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			expect(getByTestId("indicator")).toBeInTheDocument();
		});

		it("should display indicator when 'forceMount'", async () => {
			const { getByTestId } = render(() => (
				<Checkbox.Root>
					<Checkbox.Input />
					<Checkbox.Control>
						<Checkbox.Indicator data-testid="indicator" forceMount />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			expect(getByTestId("indicator")).toBeInTheDocument();
		});
	});

	describe("data-attributes", () => {
		it("should have 'data-valid' attribute when checkbox is valid", async () => {
			const { getAllByTestId } = render(() => (
				<Checkbox.Root data-testid="checkbox-root" validationState="valid">
					<Checkbox.Input />
					<Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
					<Checkbox.Control data-testid="checkbox-control">
						<Checkbox.Indicator data-testid="checkbox-indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			const elements = getAllByTestId(/^checkbox/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-valid");
			}
		});

		it("should have 'data-invalid' attribute when checkbox is invalid", async () => {
			const { getAllByTestId } = render(() => (
				<Checkbox.Root data-testid="checkbox-root" validationState="invalid">
					<Checkbox.Input />
					<Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
					<Checkbox.Control data-testid="checkbox-control">
						<Checkbox.Indicator data-testid="checkbox-indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			const elements = getAllByTestId(/^checkbox/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-invalid");
			}
		});

		it("should have 'data-checked' attribute when checkbox is checked", async () => {
			const { getAllByTestId } = render(() => (
				<Checkbox.Root data-testid="checkbox-root" checked>
					<Checkbox.Input />
					<Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
					<Checkbox.Control data-testid="checkbox-control">
						<Checkbox.Indicator data-testid="checkbox-indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			const elements = getAllByTestId(/^checkbox/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-checked");
			}
		});

		it("should have 'data-indeterminate' attribute when checkbox is indeterminate", async () => {
			const { getAllByTestId } = render(() => (
				<Checkbox.Root data-testid="checkbox-root" indeterminate>
					<Checkbox.Input />
					<Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
					<Checkbox.Control data-testid="checkbox-control">
						<Checkbox.Indicator data-testid="checkbox-indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			const elements = getAllByTestId(/^checkbox/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-indeterminate");
			}
		});

		it("should have 'data-required' attribute when checkbox is required", async () => {
			const { getAllByTestId } = render(() => (
				<Checkbox.Root data-testid="checkbox-root" required>
					<Checkbox.Input />
					<Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
					<Checkbox.Control data-testid="checkbox-control">
						<Checkbox.Indicator data-testid="checkbox-indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			const elements = getAllByTestId(/^checkbox/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-required");
			}
		});

		it("should have 'data-disabled' attribute when checkbox is disabled", async () => {
			const { getAllByTestId } = render(() => (
				<Checkbox.Root data-testid="checkbox-root" disabled>
					<Checkbox.Input />
					<Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
					<Checkbox.Control data-testid="checkbox-control">
						<Checkbox.Indicator data-testid="checkbox-indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			const elements = getAllByTestId(/^checkbox/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-disabled");
			}
		});

		it("should have 'data-readonly' attribute when checkbox is read only", async () => {
			const { getAllByTestId } = render(() => (
				<Checkbox.Root data-testid="checkbox-root" readOnly>
					<Checkbox.Input />
					<Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
					<Checkbox.Control data-testid="checkbox-control">
						<Checkbox.Indicator data-testid="checkbox-indicator" />
					</Checkbox.Control>
				</Checkbox.Root>
			));

			const elements = getAllByTestId(/^checkbox/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-readonly");
			}
		});
	});
});
