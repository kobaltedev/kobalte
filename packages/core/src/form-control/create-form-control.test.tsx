/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/label/test/useLabel.test.js
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/label/test/useField.test.js
 */

import { render } from "@solidjs/testing-library";
import type { ParentProps } from "solid-js";

import {
	type CreateFormControlProps,
	createFormControl,
} from "./create-form-control";
import { FormControlContext } from "./form-control-context";
import { FormControlDescription } from "./form-control-description";
import { FormControlErrorMessage } from "./form-control-error-message";
import { FormControlLabel } from "./form-control-label";

function FormControl(props: ParentProps<CreateFormControlProps>) {
	const { formControlContext } = createFormControl(props);

	return (
		<FormControlContext.Provider value={formControlContext}>
			{props.children}
		</FormControlContext.Provider>
	);
}

describe("createFormControl", () => {
	describe("ids", () => {
		it("should generate default ids", () => {
			const { getByText } = render(() => (
				<FormControl validationState="invalid">
					<FormControlLabel>Label</FormControlLabel>
					<FormControlDescription>Description</FormControlDescription>
					<FormControlErrorMessage>ErrorMessage</FormControlErrorMessage>
				</FormControl>
			));

			const label = getByText("Label");
			const description = getByText("Description");
			const error = getByText("ErrorMessage");

			expect(label.id).toMatch(/^.*-label$/);
			expect(description.id).toMatch(/^.*-description$/);
			expect(error.id).toMatch(/^.*-error-message$/);
		});

		it("should generate ids based on form control id", () => {
			const { getByText } = render(() => (
				<FormControl id="foo" validationState="invalid">
					<FormControlLabel>Label</FormControlLabel>
					<FormControlDescription>Description</FormControlDescription>
					<FormControlErrorMessage>ErrorMessage</FormControlErrorMessage>
				</FormControl>
			));

			const label = getByText("Label");
			const description = getByText("Description");
			const error = getByText("ErrorMessage");

			expect(label.id).toBe("foo-label");
			expect(description.id).toBe("foo-description");
			expect(error.id).toBe("foo-error-message");
		});

		it("supports custom ids", () => {
			const { getByText } = render(() => (
				<FormControl id="custom-form-control-id" validationState="invalid">
					<FormControlLabel id="custom-label-id">Label</FormControlLabel>
					<FormControlDescription id="custom-description-id">
						Description
					</FormControlDescription>
					<FormControlErrorMessage id="custom-error-message-id">
						ErrorMessage
					</FormControlErrorMessage>
				</FormControl>
			));

			const label = getByText("Label");
			const description = getByText("Description");
			const error = getByText("ErrorMessage");

			expect(label.id).toBe("custom-label-id");
			expect(description.id).toBe("custom-description-id");
			expect(error.id).toBe("custom-error-message-id");
		});
	});

	describe("data-attributes", () => {
		it("should not have 'data-*' attributes by default", () => {
			const { getByText } = render(() => (
				<FormControl>
					<FormControlLabel>Label</FormControlLabel>
					<FormControlDescription>Description</FormControlDescription>
				</FormControl>
			));

			const label = getByText("Label");
			const description = getByText("Description");

			for (const el of [label, description]) {
				expect(el).not.toHaveAttribute("data-valid");
				expect(el).not.toHaveAttribute("data-invalid");
				expect(el).not.toHaveAttribute("data-required");
				expect(el).not.toHaveAttribute("data-disabled");
				expect(el).not.toHaveAttribute("data-readonly");
			}
		});

		it("should have 'data-valid' attribute when form control is valid", () => {
			const { getByText } = render(() => (
				<FormControl validationState="valid">
					<FormControlLabel>Label</FormControlLabel>
					<FormControlDescription>Description</FormControlDescription>
				</FormControl>
			));

			const label = getByText("Label");
			const description = getByText("Description");

			for (const el of [label, description]) {
				expect(el).toHaveAttribute("data-valid");
			}
		});

		it("should have 'data-invalid' attribute when form control is invalid", () => {
			const { getByText } = render(() => (
				<FormControl validationState="invalid">
					<FormControlLabel>Label</FormControlLabel>
					<FormControlDescription>Description</FormControlDescription>
				</FormControl>
			));

			const label = getByText("Label");
			const description = getByText("Description");

			for (const el of [label, description]) {
				expect(el).toHaveAttribute("data-invalid");
			}
		});

		it("should have 'data-required' attribute when form control is required", () => {
			const { getByText } = render(() => (
				<FormControl required>
					<FormControlLabel>Label</FormControlLabel>
					<FormControlDescription>Description</FormControlDescription>
				</FormControl>
			));

			const label = getByText("Label");
			const description = getByText("Description");

			for (const el of [label, description]) {
				expect(el).toHaveAttribute("data-required");
			}
		});

		it("should have 'data-disabled' attribute when form control is disabled", () => {
			const { getByText } = render(() => (
				<FormControl disabled>
					<FormControlLabel>Label</FormControlLabel>
					<FormControlDescription>Description</FormControlDescription>
				</FormControl>
			));

			const label = getByText("Label");
			const description = getByText("Description");

			for (const el of [label, description]) {
				expect(el).toHaveAttribute("data-disabled");
			}
		});

		it("should have 'data-readonly' attribute when form control is readonly", () => {
			const { getByText } = render(() => (
				<FormControl readOnly>
					<FormControlLabel>Label</FormControlLabel>
					<FormControlDescription>Description</FormControlDescription>
				</FormControl>
			));

			const label = getByText("Label");
			const description = getByText("Description");

			for (const el of [label, description]) {
				expect(el).toHaveAttribute("data-readonly");
			}
		});

		it("should add 'data-invalid' attribute on error message when form control is invalid", () => {
			const { getByText } = render(() => (
				<FormControl validationState="invalid">
					<FormControlErrorMessage>ErrorMessage</FormControlErrorMessage>
				</FormControl>
			));

			const error = getByText("ErrorMessage");

			expect(error).toHaveAttribute("data-invalid");
			expect(error).not.toHaveAttribute("data-required");
			expect(error).not.toHaveAttribute("data-disabled");
			expect(error).not.toHaveAttribute("data-readonly");
		});

		it("should add 'data-required' attribute on error message when form control is invalid", () => {
			const { getByText } = render(() => (
				<FormControl validationState="invalid" required>
					<FormControlErrorMessage>ErrorMessage</FormControlErrorMessage>
				</FormControl>
			));

			const error = getByText("ErrorMessage");

			expect(error).toHaveAttribute("data-required");
		});

		it("should add 'data-disabled' attribute on error message when form control is invalid", () => {
			const { getByText } = render(() => (
				<FormControl validationState="invalid" disabled>
					<FormControlErrorMessage>ErrorMessage</FormControlErrorMessage>
				</FormControl>
			));

			const error = getByText("ErrorMessage");

			expect(error).toHaveAttribute("data-disabled");
		});

		it("should add 'data-readonly' attribute on error message when form control is invalid", () => {
			const { getByText } = render(() => (
				<FormControl validationState="invalid" readOnly>
					<FormControlErrorMessage>ErrorMessage</FormControlErrorMessage>
				</FormControl>
			));

			const error = getByText("ErrorMessage");

			expect(error).toHaveAttribute("data-readonly");
		});
	});
});
