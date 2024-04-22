import { installPointerEvent } from "@kobalte/tests";
import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import * as TextField from ".";

describe("TextField", () => {
	installPointerEvent();

	it("can have a default value", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole } = render(() => (
			<TextField.Root defaultValue="cat" onChange={onChangeSpy}>
				<TextField.Label>Favorite Pet</TextField.Label>
				<TextField.Input />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(onChangeSpy).not.toHaveBeenCalled();
		expect(input.value).toBe("cat");

		await userEvent.type(input, "s");

		expect(onChangeSpy).toHaveBeenCalledWith("cats");
		expect(input.value).toBe("cats");
	});

	it("value can be controlled", async () => {
		const onChangeSpy = vi.fn();
		const { getByRole } = render(() => (
			<TextField.Root value="cat" onChange={onChangeSpy}>
				<TextField.Label>Favorite Pet</TextField.Label>
				<TextField.Input />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(onChangeSpy).not.toHaveBeenCalled();
		expect(input.value).toBe("cat");

		await userEvent.type(input, "s");

		expect(onChangeSpy).toHaveBeenCalledWith("cats");

		// "cat" because `value` is controlled.
		expect(input.value).toBe("cat");
	});

	it("name can be controlled", async () => {
		const { getByRole } = render(() => (
			<TextField.Root name="favorite-pet">
				<TextField.Label>Favorite Pet</TextField.Label>
				<TextField.Input />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).toHaveAttribute("name", "favorite-pet");
	});

	it("supports visible label", async () => {
		const { getByRole, getByText } = render(() => (
			<TextField.Root>
				<TextField.Label>Favorite Pet</TextField.Label>
				<TextField.Input />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		const label = getByText("Favorite Pet");

		expect(input).toHaveAttribute("aria-labelledby", label.id);
		expect(label).toBeInstanceOf(HTMLLabelElement);
		expect(label).toHaveAttribute("for", input.id);
	});

	it("supports 'aria-labelledby'", async () => {
		const { getByRole } = render(() => (
			<TextField.Root>
				<TextField.Input aria-labelledby="foo" />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-labelledby", "foo");
	});

	it("should combine 'aria-labelledby' if visible label is also provided", async () => {
		const { getByRole, getByText } = render(() => (
			<TextField.Root>
				<TextField.Label>Favorite Pet</TextField.Label>
				<TextField.Input aria-labelledby="foo" />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		const label = getByText("Favorite Pet");

		expect(input).toHaveAttribute("aria-labelledby", `foo ${label.id}`);
	});

	it("supports 'aria-label'", async () => {
		const { getByRole } = render(() => (
			<TextField.Root>
				<TextField.Input aria-label="My Favorite Pet" />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-label", "My Favorite Pet");
	});

	it("should combine 'aria-labelledby' if visible label and 'aria-label' is also provided", async () => {
		const { getByRole, getByText } = render(() => (
			<TextField.Root>
				<TextField.Label>Favorite Pet</TextField.Label>
				<TextField.Input aria-label="bar" aria-labelledby="foo" />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		const label = getByText("Favorite Pet");

		expect(input).toHaveAttribute(
			"aria-labelledby",
			`foo ${label.id} ${input.id}`,
		);
	});

	it("supports visible description", async () => {
		const { getByRole, getByText } = render(() => (
			<TextField.Root>
				<TextField.Input />
				<TextField.Description>Description</TextField.Description>
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		const description = getByText("Description");

		expect(description.id).toBeDefined();
		expect(input.id).toBeDefined();
		expect(input).toHaveAttribute("aria-describedby", description.id);

		// check that generated ids are unique
		expect(description.id).not.toBe(input.id);
	});

	it("supports 'aria-describedby'", async () => {
		const { getByRole } = render(() => (
			<TextField.Root>
				<TextField.Input aria-describedby="foo" />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-describedby", "foo");
	});

	it("should combine 'aria-describedby' if visible description", async () => {
		const { getByRole, getByText } = render(() => (
			<TextField.Root>
				<TextField.Input aria-describedby="foo" />
				<TextField.Description>Description</TextField.Description>
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		const description = getByText("Description");

		expect(input).toHaveAttribute("aria-describedby", `${description.id} foo`);
	});

	it("supports visible error message when invalid", async () => {
		const { getByRole, getByText } = render(() => (
			<TextField.Root validationState="invalid">
				<TextField.Input />
				<TextField.ErrorMessage>ErrorMessage</TextField.ErrorMessage>
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		const errorMessage = getByText("ErrorMessage");

		expect(errorMessage.id).toBeDefined();
		expect(input.id).toBeDefined();
		expect(input).toHaveAttribute("aria-describedby", errorMessage.id);

		// check that generated ids are unique
		expect(errorMessage.id).not.toBe(input.id);
	});

	it("should not be described by error message when not invalid", async () => {
		const { getByRole } = render(() => (
			<TextField.Root>
				<TextField.Input />
				<TextField.ErrorMessage>ErrorMessage</TextField.ErrorMessage>
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).not.toHaveAttribute("aria-describedby");
	});

	it("should combine 'aria-describedby' if visible error message when invalid", () => {
		const { getByRole, getByText } = render(() => (
			<TextField.Root validationState="invalid">
				<TextField.Input aria-describedby="foo" />
				<TextField.ErrorMessage>ErrorMessage</TextField.ErrorMessage>
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		const errorMessage = getByText("ErrorMessage");

		expect(input).toHaveAttribute("aria-describedby", `${errorMessage.id} foo`);
	});

	it("should combine 'aria-describedby' if visible description and error message when invalid", () => {
		const { getByRole, getByText } = render(() => (
			<TextField.Root validationState="invalid">
				<TextField.Input aria-describedby="foo" />
				<TextField.Description>Description</TextField.Description>
				<TextField.ErrorMessage>ErrorMessage</TextField.ErrorMessage>
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		const description = getByText("Description");
		const errorMessage = getByText("ErrorMessage");

		expect(input).toHaveAttribute(
			"aria-describedby",
			`${description.id} ${errorMessage.id} foo`,
		);
	});

	it("should not have form control 'data-*' attributes by default", () => {
		const { getByRole, getByTestId } = render(() => (
			<TextField.Root data-testid="textfield">
				<TextField.Input />
			</TextField.Root>
		));

		const textField = getByTestId("textfield");
		const input = getByRole("textbox") as HTMLInputElement;

		for (const el of [textField, input]) {
			expect(el).not.toHaveAttribute("data-valid");
			expect(el).not.toHaveAttribute("data-invalid");
			expect(el).not.toHaveAttribute("data-required");
			expect(el).not.toHaveAttribute("data-disabled");
			expect(el).not.toHaveAttribute("data-readonly");
		}
	});

	it("should have 'data-valid' attribute when valid", () => {
		const { getByRole, getByTestId } = render(() => (
			<TextField.Root data-testid="textfield" validationState="valid">
				<TextField.Input />
			</TextField.Root>
		));

		const textField = getByTestId("textfield");
		const input = getByRole("textbox") as HTMLInputElement;

		for (const el of [textField, input]) {
			expect(el).toHaveAttribute("data-valid");
		}
	});

	it("should have 'data-invalid' attribute when invalid", () => {
		const { getByRole, getByTestId } = render(() => (
			<TextField.Root data-testid="textfield" validationState="invalid">
				<TextField.Input />
			</TextField.Root>
		));

		const textField = getByTestId("textfield");
		const input = getByRole("textbox") as HTMLInputElement;

		for (const el of [textField, input]) {
			expect(el).toHaveAttribute("data-invalid");
		}
	});

	it("should have 'data-required' attribute when required", () => {
		const { getByRole, getByTestId } = render(() => (
			<TextField.Root data-testid="textfield" required>
				<TextField.Input />
			</TextField.Root>
		));

		const textField = getByTestId("textfield");
		const input = getByRole("textbox") as HTMLInputElement;

		for (const el of [textField, input]) {
			expect(el).toHaveAttribute("data-required");
		}
	});

	it("should have 'data-disabled' attribute when disabled", () => {
		const { getByRole, getByTestId } = render(() => (
			<TextField.Root data-testid="textfield" disabled>
				<TextField.Input />
			</TextField.Root>
		));

		const textField = getByTestId("textfield");
		const input = getByRole("textbox") as HTMLInputElement;

		for (const el of [textField, input]) {
			expect(el).toHaveAttribute("data-disabled");
		}
	});

	it("should have 'data-readonly' attribute when readonly", () => {
		const { getByRole, getByTestId } = render(() => (
			<TextField.Root data-testid="textfield" readOnly>
				<TextField.Input />
			</TextField.Root>
		));

		const textField = getByTestId("textfield");
		const input = getByRole("textbox") as HTMLInputElement;

		for (const el of [textField, input]) {
			expect(el).toHaveAttribute("data-readonly");
		}
	});

	it("sets 'aria-invalid' on input when 'validationState=invalid'", () => {
		const { getByRole } = render(() => (
			<TextField.Root validationState="invalid">
				<TextField.Input />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).toHaveAttribute("aria-invalid", "true");
	});

	it("input should not have 'required', 'disabled' or 'readonly' attributes by default", () => {
		const { getByRole } = render(() => (
			<TextField.Root>
				<TextField.Input />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).not.toHaveAttribute("required");
		expect(input).not.toHaveAttribute("disabled");
		expect(input).not.toHaveAttribute("readonly");
	});

	it("sets 'required' and 'aria-required' on input when 'isRequired' is true", () => {
		const { getByRole } = render(() => (
			<TextField.Root required>
				<TextField.Input />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).toHaveAttribute("required");
		expect(input).toHaveAttribute("aria-required", "true");
	});

	it("sets 'disabled' and 'aria-disabled' on input when 'isDisabled' is true", () => {
		const { getByRole } = render(() => (
			<TextField.Root disabled>
				<TextField.Input />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).toHaveAttribute("disabled");
		expect(input).toHaveAttribute("aria-disabled", "true");
	});

	it("sets 'readonly' and 'aria-readonly' on input when 'isReadOnly' is true", () => {
		const { getByRole } = render(() => (
			<TextField.Root readOnly>
				<TextField.Input />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;

		expect(input).toHaveAttribute("readonly");
		expect(input).toHaveAttribute("aria-readonly", "true");
	});

	it("should have 'aria-multiline' set to false on textarea when 'submitOnEnter' is true", () => {
		const { getByRole } = render(() => (
			<TextField.Root>
				<TextField.TextArea submitOnEnter />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		expect(input).toHaveAttribute("aria-multiline", "false");
	});

	it("should not have 'aria-multiline' on textarea when 'submitOnEnter' is false", () => {
		const { getByRole } = render(() => (
			<TextField.Root>
				<TextField.TextArea />
			</TextField.Root>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		expect(input).not.toHaveAttribute("aria-multiline");
	});

	// Skipped: requestSubmit is not implemented
	it.skip("form is submitted when 'submitOnEnter' is true and user presses the enter key", async () => {
		const onSubmit = vi.fn();
		const { getByRole } = render(() => (
			<form onSubmit={onSubmit}>
				<TextField.Root>
					<TextField.TextArea submitOnEnter />
				</TextField.Root>
			</form>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		await userEvent.type(input, "abc{enter}");
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it("form is not submitted when 'submitOnEnter' is true and the user presses shift + enter at the same time", async () => {
		const onSubmit = vi.fn();

		const { getByRole } = render(() => (
			<form onSubmit={onSubmit}>
				<TextField.Root>
					<TextField.TextArea submitOnEnter />
				</TextField.Root>
			</form>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		await userEvent.type(input, "{Shift>}enter{/Shift}");
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("form is not submitted when 'submitOnEnter' is not set and user presses the enter key", async () => {
		const onSubmit = vi.fn();

		const { getByRole } = render(() => (
			<form onSubmit={onSubmit}>
				<TextField.Root>
					<TextField.TextArea />
				</TextField.Root>
			</form>
		));

		const input = getByRole("textbox") as HTMLInputElement;
		await userEvent.type(input, "{enter}");
		expect(onSubmit).not.toHaveBeenCalled();
	});
});
