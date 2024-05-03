import { fireEvent, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";

import * as NumberField from ".";
import { I18nProvider } from "../i18n";

describe("NumberField", () => {
	it("can have a default value", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole } = render(() => (
			<NumberField.Root defaultValue={4} onChange={onChangeSpy}>
				<NumberField.Label>Favorite Number</NumberField.Label>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(onChangeSpy).not.toHaveBeenCalled();
		expect(input.value).toBe("4");

		await userEvent.type(input, "0");

		expect(onChangeSpy).toHaveBeenCalledWith("40");
		expect(input.value).toBe("40");
	});

	it("value can be controlled", async () => {
		const onChangeSpy = vi.fn();
		const { getByRole } = render(() => (
			<NumberField.Root value={4} onChange={onChangeSpy}>
				<NumberField.Label>Favorite Number</NumberField.Label>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(onChangeSpy).not.toHaveBeenCalled();
		expect(input.value).toBe("4");

		await userEvent.type(input, "0");

		expect(onChangeSpy).toHaveBeenCalledWith("40");

		// "4" because `value` is controlled.
		expect(input.value).toBe("4");
	});

	it("name can be controlled", async () => {
		const { getByTestId } = render(() => (
			<NumberField.Root name="favorite-number">
				<NumberField.Label>Favorite Number</NumberField.Label>
				<NumberField.HiddenInput data-testId="hidden-input" />
			</NumberField.Root>
		));

		const input = getByTestId("hidden-input") as HTMLInputElement;

		expect(input).toHaveAttribute("name", "favorite-number");
	});

	it("supports visible label", async () => {
		const { getByRole, getByText } = render(() => (
			<NumberField.Root>
				<NumberField.Label>Favorite Number</NumberField.Label>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const label = getByText("Favorite Number");

		expect(input).toHaveAttribute("aria-labelledby", label.id);
		expect(label).toBeInstanceOf(HTMLLabelElement);
		expect(label).toHaveAttribute("for", input.id);
	});

	it("supports 'aria-labelledby'", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root>
				<NumberField.Input aria-labelledby="foo" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-labelledby", "foo");
	});

	it("should combine 'aria-labelledby' if visible label is also provided", async () => {
		const { getByRole, getByText } = render(() => (
			<NumberField.Root>
				<NumberField.Label>Favorite Number</NumberField.Label>
				<NumberField.Input aria-labelledby="foo" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const label = getByText("Favorite Number");

		expect(input).toHaveAttribute("aria-labelledby", `foo ${label.id}`);
	});

	it("supports 'aria-label'", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root>
				<NumberField.Input aria-label="My Favorite Number" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-label", "My Favorite Number");
	});

	it("should combine 'aria-labelledby' if visible label and 'aria-label' is also provided", async () => {
		const { getByRole, getByText } = render(() => (
			<NumberField.Root>
				<NumberField.Label>Favorite Number</NumberField.Label>
				<NumberField.Input aria-label="bar" aria-labelledby="foo" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const label = getByText("Favorite Number");

		expect(input).toHaveAttribute(
			"aria-labelledby",
			`foo ${label.id} ${input.id}`,
		);
	});

	it("supports visible description", async () => {
		const { getByRole, getByText } = render(() => (
			<NumberField.Root>
				<NumberField.Input />
				<NumberField.Description>Description</NumberField.Description>
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const description = getByText("Description");

		expect(description.id).toBeDefined();
		expect(input.id).toBeDefined();
		expect(input).toHaveAttribute("aria-describedby", description.id);

		// check that generated ids are unique
		expect(description.id).not.toBe(input.id);
	});

	it("supports 'aria-describedby'", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root>
				<NumberField.Input aria-describedby="foo" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-describedby", "foo");
	});

	it("should combine 'aria-describedby' if visible description", async () => {
		const { getByRole, getByText } = render(() => (
			<NumberField.Root>
				<NumberField.Input aria-describedby="foo" />
				<NumberField.Description>Description</NumberField.Description>
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const description = getByText("Description");

		expect(input).toHaveAttribute("aria-describedby", `${description.id} foo`);
	});

	it("supports visible error message when invalid", async () => {
		const { getByRole, getByText } = render(() => (
			<NumberField.Root validationState="invalid">
				<NumberField.Input />
				<NumberField.ErrorMessage>ErrorMessage</NumberField.ErrorMessage>
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const errorMessage = getByText("ErrorMessage");

		expect(errorMessage.id).toBeDefined();
		expect(input.id).toBeDefined();
		expect(input).toHaveAttribute("aria-describedby", errorMessage.id);

		// check that generated ids are unique
		expect(errorMessage.id).not.toBe(input.id);
	});

	it("should not be described by error message when not invalid", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root>
				<NumberField.Input />
				<NumberField.ErrorMessage>ErrorMessage</NumberField.ErrorMessage>
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input).not.toHaveAttribute("aria-describedby");
	});

	it("should combine 'aria-describedby' if visible error message when invalid", () => {
		const { getByRole, getByText } = render(() => (
			<NumberField.Root validationState="invalid">
				<NumberField.Input aria-describedby="foo" />
				<NumberField.ErrorMessage>ErrorMessage</NumberField.ErrorMessage>
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const errorMessage = getByText("ErrorMessage");

		expect(input).toHaveAttribute("aria-describedby", `${errorMessage.id} foo`);
	});

	it("should combine 'aria-describedby' if visible description and error message when invalid", () => {
		const { getByRole, getByText } = render(() => (
			<NumberField.Root validationState="invalid">
				<NumberField.Input aria-describedby="foo" />
				<NumberField.Description>Description</NumberField.Description>
				<NumberField.ErrorMessage>ErrorMessage</NumberField.ErrorMessage>
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const description = getByText("Description");
		const errorMessage = getByText("ErrorMessage");

		expect(input).toHaveAttribute(
			"aria-describedby",
			`${description.id} ${errorMessage.id} foo`,
		);
	});

	it("should not have form control 'data-*' attributes by default", () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root data-testid="NumberField">
				<NumberField.Input />
			</NumberField.Root>
		));

		const field = getByTestId("NumberField");
		const input = getByRole("spinbutton") as HTMLInputElement;

		for (const el of [field, input]) {
			expect(el).not.toHaveAttribute("data-valid");
			expect(el).not.toHaveAttribute("data-invalid");
			expect(el).not.toHaveAttribute("data-required");
			expect(el).not.toHaveAttribute("data-disabled");
			expect(el).not.toHaveAttribute("data-readonly");
		}
	});

	it("should have 'data-valid' attribute when valid", () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root data-testid="NumberField" validationState="valid">
				<NumberField.Input />
			</NumberField.Root>
		));

		const field = getByTestId("NumberField");
		const input = getByRole("spinbutton") as HTMLInputElement;

		for (const el of [field, input]) {
			expect(el).toHaveAttribute("data-valid");
		}
	});

	it("should have 'data-invalid' attribute when invalid", () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root data-testid="NumberField" validationState="invalid">
				<NumberField.Input />
			</NumberField.Root>
		));

		const field = getByTestId("NumberField");
		const input = getByRole("spinbutton") as HTMLInputElement;

		for (const el of [field, input]) {
			expect(el).toHaveAttribute("data-invalid");
		}
	});

	it("should have 'data-required' attribute when required", () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root data-testid="NumberField" required>
				<NumberField.Input />
			</NumberField.Root>
		));

		const field = getByTestId("NumberField");
		const input = getByRole("spinbutton") as HTMLInputElement;

		for (const el of [field, input]) {
			expect(el).toHaveAttribute("data-required");
		}
	});

	it("should have 'data-disabled' attribute when disabled", () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root data-testid="NumberField" disabled>
				<NumberField.Input />
			</NumberField.Root>
		));

		const field = getByTestId("NumberField");
		const input = getByRole("spinbutton") as HTMLInputElement;

		for (const el of [field, input]) {
			expect(el).toHaveAttribute("data-disabled");
		}
	});

	it("should have 'data-readonly' attribute when readonly", () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root data-testid="NumberField" readOnly>
				<NumberField.Input />
			</NumberField.Root>
		));

		const field = getByTestId("NumberField");
		const input = getByRole("spinbutton") as HTMLInputElement;

		for (const el of [field, input]) {
			expect(el).toHaveAttribute("data-readonly");
		}
	});

	it("sets 'aria-invalid' on input when 'validationState=invalid'", () => {
		const { getByRole } = render(() => (
			<NumberField.Root validationState="invalid">
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-invalid", "true");
	});

	it("input should not have 'required', 'disabled' or 'readonly' attributes by default", () => {
		const { getByRole } = render(() => (
			<NumberField.Root>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input).not.toHaveAttribute("required");
		expect(input).not.toHaveAttribute("disabled");
		expect(input).not.toHaveAttribute("readonly");
	});

	it("sets 'required' and 'aria-required' on input when 'isRequired' is true", () => {
		const { getByRole } = render(() => (
			<NumberField.Root required>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input).toHaveAttribute("required");
		expect(input).toHaveAttribute("aria-required", "true");
	});

	it("sets 'disabled' and 'aria-disabled' on input when 'isDisabled' is true", () => {
		const { getByRole } = render(() => (
			<NumberField.Root disabled>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input).toHaveAttribute("disabled");
		expect(input).toHaveAttribute("aria-disabled", "true");
	});

	it("sets 'readonly' and 'aria-readonly' on input when 'isReadOnly' is true", () => {
		const { getByRole } = render(() => (
			<NumberField.Root readOnly>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input).toHaveAttribute("readonly");
		expect(input).toHaveAttribute("aria-readonly", "true");
	});

	it("syncs input and hidden input", async () => {
		const { getByTestId } = render(() => (
			<NumberField.Root defaultValue={4}>
				<NumberField.Input data-testId="visible-input" />
				<NumberField.HiddenInput data-testId="hidden-input" />
			</NumberField.Root>
		));

		const input = getByTestId("visible-input") as HTMLInputElement;
		const hiddenInput = getByTestId("hidden-input") as HTMLInputElement;

		expect(input.value).toBe("4");
		expect(hiddenInput.value).toBe("4");

		await userEvent.type(input, "0");

		expect(input.value).toBe("40");
		expect(hiddenInput.value).toBe("40");
	});

	it("increments by `step` on Arrow Up", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root step={4} defaultValue={0}>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		input.focus();

		fireEvent.keyDown(input, { key: "ArrowUp" });
		fireEvent.keyUp(input, { key: "ArrowUp" });
		await Promise.resolve();

		expect(input.value).toBe("4");

		fireEvent.keyDown(input, { key: "ArrowUp" });
		fireEvent.keyUp(input, { key: "ArrowUp" });
		await Promise.resolve();

		expect(input.value).toBe("8");
	});

	it("decrements by `step` on Arrow Down", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root step={4} defaultValue={8}>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		input.focus();

		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyUp(input, { key: "ArrowDown" });
		await Promise.resolve();

		expect(input.value).toBe("4");

		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyUp(input, { key: "ArrowDown" });
		await Promise.resolve();

		expect(input.value).toBe("0");
	});

	it("increments by `largeStep` on Page Up", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root step={4} defaultValue={0}>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		input.focus();

		fireEvent.keyDown(input, { key: "PageUp" });
		fireEvent.keyUp(input, { key: "PageUp" });
		await Promise.resolve();

		expect(input.value).toBe("40");

		fireEvent.keyDown(input, { key: "PageUp" });
		fireEvent.keyUp(input, { key: "PageUp" });
		await Promise.resolve();

		expect(input.value).toBe("80");
	});

	it("decrements by `largeStep` on Page Down", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root step={4} defaultValue={80}>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		input.focus();

		fireEvent.keyDown(input, { key: "PageDown" });
		fireEvent.keyUp(input, { key: "PageDown" });
		await Promise.resolve();

		expect(input.value).toBe("40");

		fireEvent.keyDown(input, { key: "PageDown" });
		fireEvent.keyUp(input, { key: "PageDown" });
		await Promise.resolve();

		expect(input.value).toBe("0");
	});

	it("max on End", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root maxValue={100}>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		input.focus();

		fireEvent.keyDown(input, { key: "End" });
		fireEvent.keyUp(input, { key: "End" });
		await Promise.resolve();

		expect(input.value).toBe("100");
	});

	it("min on Home", async () => {
		const { getByRole } = render(() => (
			<NumberField.Root minValue={-100}>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		input.focus();

		fireEvent.keyDown(input, { key: "Home" });
		fireEvent.keyUp(input, { key: "Home" });
		await Promise.resolve();

		expect(input.value).toBe("-100");
	});

	it("format on mount", async () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root defaultValue={1000}>
				<NumberField.Input />
				<NumberField.HiddenInput data-testId="hidden-input" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const hiddenInput = getByTestId("hidden-input") as HTMLInputElement;

		expect(input.value).toBe("1,000");
		expect(hiddenInput.value).toBe("1000");
	});

	it("format on change", async () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root defaultValue={1000}>
				<NumberField.Input />
				<NumberField.HiddenInput data-testId="hidden-input" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const hiddenInput = getByTestId("hidden-input") as HTMLInputElement;

		input.focus();

		fireEvent.keyDown(input, { key: "ArrowUp" });
		fireEvent.keyUp(input, { key: "ArrowUp" });
		await Promise.resolve();

		expect(input.value).toBe("1,001");
		expect(hiddenInput.value).toBe("1001");
	});

	it("raw value on change", async () => {
		const spy = vi.fn();

		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root defaultValue={1000} onRawValueChange={spy}>
				<NumberField.Input />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		input.focus();

		fireEvent.keyDown(input, { key: "ArrowUp" });
		fireEvent.keyUp(input, { key: "ArrowUp" });
		await Promise.resolve();

		expect(spy).toHaveBeenCalledWith(1001);
	});

	it("increments on increment trigger", async () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root step={4} defaultValue={0}>
				<NumberField.Input />
				<NumberField.IncrementTrigger data-testId="trigger" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const trigger = getByTestId("trigger") as HTMLButtonElement;

		expect(input.value).toBe("0");

		trigger.click();

		expect(input.value).toBe("4");
	});

	it("decrements on decrement trigger", async () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root step={4} defaultValue={4}>
				<NumberField.Input />
				<NumberField.DecrementTrigger data-testId="trigger" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const trigger = getByTestId("trigger") as HTMLButtonElement;

		expect(input.value).toBe("4");

		trigger.click();

		expect(input.value).toBe("0");
	});

	it("focuses input on trigger", async () => {
		const { getByRole, getByTestId } = render(() => (
			<NumberField.Root>
				<NumberField.Input />
				<NumberField.IncrementTrigger data-testId="trigger" />
			</NumberField.Root>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const trigger = getByTestId("trigger") as HTMLButtonElement;

		trigger.click();

		expect(document.activeElement).toBe(input);
	});

	it("formats decimal value correctly for locale", async () => {
		const { getByRole } = render(() => (
			<I18nProvider locale="de">
				<NumberField.Root value={1.1}>
					<NumberField.Input />
				</NumberField.Root>
			</I18nProvider>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input.value).toBe("1,1");
	});

	it("formats decimal rawValue correctly for locale", async () => {
		const { getByRole } = render(() => (
			<I18nProvider locale="de">
				<NumberField.Root rawValue={1.1}>
					<NumberField.Input />
				</NumberField.Root>
			</I18nProvider>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;

		expect(input.value).toBe("1,1");
	});

	it("increments decimal values correctly for locale", async () => {
		const { getByRole, getByTestId } = render(() => (
			<I18nProvider locale="de">
				<NumberField.Root defaultValue={1.1}>
					<NumberField.Input />
					<NumberField.IncrementTrigger data-testId="trigger" />
				</NumberField.Root>
			</I18nProvider>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const trigger = getByTestId("trigger") as HTMLButtonElement;

		trigger.click();

		expect(input.value).toBe("2");
	});

	it("decrements decimal values correctly for locale", async () => {
		const { getByRole, getByTestId } = render(() => (
			<I18nProvider locale="de">
				<NumberField.Root defaultValue={1.1}>
					<NumberField.Input />
					<NumberField.DecrementTrigger data-testId="trigger" />
				</NumberField.Root>
			</I18nProvider>
		));

		const input = getByRole("spinbutton") as HTMLInputElement;
		const trigger = getByTestId("trigger") as HTMLButtonElement;

		trigger.click();

		expect(input.value).toBe("1");
	});
});
