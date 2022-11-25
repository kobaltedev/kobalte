/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/label/test/useLabel.test.js
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/label/test/useField.test.js
 */

import { render, screen } from "solid-testing-library";

import { FormControl } from "./form-control";

describe("FormControl", () => {
  it("should define accessible relation between label and field with correct attributes", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Label data-testid="label">Label</FormControl.Label>
        <FormControl.Field data-testid="field" />
      </FormControl>
    ));

    const label = screen.getByTestId("label");
    const field = screen.getByTestId("field");

    expect(label.id).toBeDefined();
    expect(field.id).toBeDefined();
    expect(label).toHaveAttribute("for", field.id);
    expect(field).toHaveAttribute("aria-labelledby", label.id);

    // check that generated ids are unique
    expect(label.id).not.toBe(field.id);
  });

  it("should work with 'aria-labelledby'", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Field data-testid="field" aria-labelledby="foo" />
      </FormControl>
    ));

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("aria-labelledby", "foo");
  });

  it("should combine 'aria-labelledby' if visible label is also provided", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Label data-testid="label">Label</FormControl.Label>
        <FormControl.Field data-testid="field" aria-labelledby="foo" />
      </FormControl>
    ));

    const label = screen.getByTestId("label");
    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("aria-labelledby", `foo ${label.id}`);
  });

  it("should combine 'aria-labelledby' if visible label and 'aria-label' is also provided", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Label data-testid="label">Label</FormControl.Label>
        <FormControl.Field data-testid="field" aria-label="bar" aria-labelledby="foo" />
      </FormControl>
    ));

    const label = screen.getByTestId("label");
    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("aria-labelledby", `foo ${label.id} ${field.id}`);
  });

  it("should work without a visible label but 'aria-label'", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Field data-testid="field" aria-label="Label" />
      </FormControl>
    ));

    const field = screen.getByTestId("field");

    expect(field).not.toHaveAttribute("aria-labelledby");
    expect(field).toHaveAttribute("aria-label", "Label");
  });

  it("should work without a visible label but both 'aria-label' and 'aria-labelledby'", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Field data-testid="field" aria-label="Label" aria-labelledby="foo" />
      </FormControl>
    ));

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("aria-labelledby", `foo ${field.id}`);
    expect(field).toHaveAttribute("aria-label", "Label");
  });

  it("should not have a 'for' attribute when the label element is not an HTMLLabelElement", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Label data-testid="label" as="span">
          Label
        </FormControl.Label>
        <FormControl.Field data-testid="field" />
      </FormControl>
    ));

    const label = screen.getByTestId("label");
    const field = screen.getByTestId("field");

    expect(label).not.toHaveAttribute("for");
    expect(field).toHaveAttribute("aria-labelledby", label.id);
  });

  it("should define accessible relation between field and description with correct attributes", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Field data-testid="field" />
        <FormControl.Description data-testid="description">Description</FormControl.Description>
      </FormControl>
    ));

    const field = screen.getByTestId("field");
    const description = screen.getByTestId("description");

    expect(description.id).toBeDefined();
    expect(field.id).toBeDefined();
    expect(field).toHaveAttribute("aria-describedby", description.id);

    // check that generated ids are unique
    expect(description.id).not.toBe(field.id);
  });

  it("should work with 'aria-describedby'", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Field data-testid="field" aria-describedby="foo" />
      </FormControl>
    ));

    const field = screen.getByTestId("field");

    expect(field).toHaveAttribute("aria-describedby", "foo");
  });

  it("should combine 'aria-describedby' if visible description", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Field data-testid="field" aria-describedby="foo" />
        <FormControl.Description data-testid="description">Description</FormControl.Description>
      </FormControl>
    ));

    const field = screen.getByTestId("field");
    const description = screen.getByTestId("description");

    expect(field).toHaveAttribute("aria-describedby", `${description.id} foo`);
  });

  it("should define accessible relation between field and error message with correct attributes when form control is invalid", () => {
    render(() => (
      <FormControl data-testid="form-control" validationState="invalid">
        <FormControl.Field data-testid="field" />
        <FormControl.ErrorMessage data-testid="error-message">
          ErrorMessage
        </FormControl.ErrorMessage>
      </FormControl>
    ));

    const field = screen.getByTestId("field");
    const error = screen.getByTestId("error-message");

    expect(error.id).toBeDefined();
    expect(field.id).toBeDefined();
    expect(field).toHaveAttribute("aria-describedby", error.id);

    // check that generated ids are unique
    expect(error.id).not.toBe(field.id);
  });

  it("should not be described by error message if form control is not invalid", () => {
    render(() => (
      <FormControl data-testid="form-control">
        <FormControl.Field data-testid="field" />
        <FormControl.ErrorMessage data-testid="error-message">
          ErrorMessage
        </FormControl.ErrorMessage>
      </FormControl>
    ));

    const field = screen.getByTestId("field");

    expect(field).not.toHaveAttribute("aria-describedby");
  });

  it("should combine 'aria-describedby' if visible error message", () => {
    render(() => (
      <FormControl data-testid="form-control" validationState="invalid">
        <FormControl.Field data-testid="field" aria-describedby="foo" />
        <FormControl.ErrorMessage data-testid="error-message">
          ErrorMessage
        </FormControl.ErrorMessage>
      </FormControl>
    ));

    const field = screen.getByTestId("field");
    const error = screen.getByTestId("error-message");

    expect(field).toHaveAttribute("aria-describedby", `${error.id} foo`);
  });

  it("should combine 'aria-describedby' if visible description and error message", () => {
    render(() => (
      <FormControl data-testid="form-control" validationState="invalid">
        <FormControl.Field data-testid="field" aria-describedby="foo" />
        <FormControl.Description data-testid="description">Description</FormControl.Description>
        <FormControl.ErrorMessage data-testid="error-message">
          ErrorMessage
        </FormControl.ErrorMessage>
      </FormControl>
    ));

    const field = screen.getByTestId("field");
    const description = screen.getByTestId("description");
    const error = screen.getByTestId("error-message");

    expect(field).toHaveAttribute("aria-describedby", `${description.id} ${error.id} foo`);
  });

  describe("ids", () => {
    it("should generate default ids", () => {
      render(() => (
        <FormControl data-testid="form-control" validationState="invalid">
          <FormControl.Label data-testid="label">Label</FormControl.Label>
          <FormControl.Field data-testid="field" />
          <FormControl.Description data-testid="description">Description</FormControl.Description>
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const label = screen.getByTestId("label");
      const field = screen.getByTestId("field");
      const description = screen.getByTestId("description");
      const error = screen.getByTestId("error-message");

      expect(formControl.id).toBeDefined();
      expect(label.id).toBe(`${formControl.id}-label`);
      expect(field.id).toBe(`${formControl.id}-field`);
      expect(description.id).toBe(`${formControl.id}-description`);
      expect(error.id).toBe(`${formControl.id}-error-message`);
    });

    it("should generate ids based on form control id", () => {
      render(() => (
        <FormControl data-testid="form-control" id="foo" validationState="invalid">
          <FormControl.Label data-testid="label">Label</FormControl.Label>
          <FormControl.Field data-testid="field" />
          <FormControl.Description data-testid="description">Description</FormControl.Description>
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const label = screen.getByTestId("label");
      const field = screen.getByTestId("field");
      const description = screen.getByTestId("description");
      const error = screen.getByTestId("error-message");

      expect(formControl.id).toBe("foo");
      expect(label.id).toBe(`foo-label`);
      expect(field.id).toBe(`foo-field`);
      expect(description.id).toBe(`foo-description`);
      expect(error.id).toBe(`foo-error-message`);
    });

    it("supports custom ids", () => {
      render(() => (
        <FormControl
          data-testid="form-control"
          id="custom-form-control-id"
          validationState="invalid"
        >
          <FormControl.Label data-testid="label" id="custom-label-id">
            Label
          </FormControl.Label>
          <FormControl.Field data-testid="field" id="custom-field-id" />
          <FormControl.Description data-testid="description" id="custom-description-id">
            Description
          </FormControl.Description>
          <FormControl.ErrorMessage data-testid="error-message" id="custom-error-message-id">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const label = screen.getByTestId("label");
      const field = screen.getByTestId("field");
      const description = screen.getByTestId("description");
      const error = screen.getByTestId("error-message");

      expect(formControl.id).toBe("custom-form-control-id");
      expect(label.id).toBe(`custom-label-id`);
      expect(field.id).toBe(`custom-field-id`);
      expect(description.id).toBe(`custom-description-id`);
      expect(error.id).toBe(`custom-error-message-id`);
    });
  });

  describe("data-attributes", () => {
    it("should not have 'data-*' attributes by default", () => {
      render(() => (
        <FormControl data-testid="form-control">
          <FormControl.Label data-testid="label">Label</FormControl.Label>
          <FormControl.Field data-testid="field" />
          <FormControl.Description data-testid="description">Description</FormControl.Description>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const label = screen.getByTestId("label");
      const field = screen.getByTestId("field");
      const description = screen.getByTestId("description");

      for (const el of [formControl, label, field, description]) {
        expect(el).not.toHaveAttribute("data-valid");
        expect(el).not.toHaveAttribute("data-invalid");
        expect(el).not.toHaveAttribute("data-required");
        expect(el).not.toHaveAttribute("data-disabled");
        expect(el).not.toHaveAttribute("data-readonly");
      }
    });

    it("should have 'data-valid' attribute when form control is valid", () => {
      render(() => (
        <FormControl data-testid="form-control" validationState="valid">
          <FormControl.Label data-testid="label">Label</FormControl.Label>
          <FormControl.Field data-testid="field" />
          <FormControl.Description data-testid="description">Description</FormControl.Description>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const label = screen.getByTestId("label");
      const field = screen.getByTestId("field");
      const description = screen.getByTestId("description");

      for (const el of [formControl, label, field, description]) {
        expect(el).toHaveAttribute("data-valid");
      }
    });

    it("should have 'data-invalid' attribute when form control is invalid", () => {
      render(() => (
        <FormControl data-testid="form-control" validationState="invalid">
          <FormControl.Label data-testid="label">Label</FormControl.Label>
          <FormControl.Field data-testid="field" />
          <FormControl.Description data-testid="description">Description</FormControl.Description>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const label = screen.getByTestId("label");
      const field = screen.getByTestId("field");
      const description = screen.getByTestId("description");

      for (const el of [formControl, label, field, description]) {
        expect(el).toHaveAttribute("data-invalid");
      }
    });

    it("should have 'data-required' attribute when form control is required", () => {
      render(() => (
        <FormControl data-testid="form-control" isRequired>
          <FormControl.Label data-testid="label">Label</FormControl.Label>
          <FormControl.Field data-testid="field" />
          <FormControl.Description data-testid="description">Description</FormControl.Description>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const label = screen.getByTestId("label");
      const field = screen.getByTestId("field");
      const description = screen.getByTestId("description");

      for (const el of [formControl, label, field, description]) {
        expect(el).toHaveAttribute("data-required");
      }
    });

    it("should have 'data-disabled' attribute when form control is disabled", () => {
      render(() => (
        <FormControl data-testid="form-control" isDisabled>
          <FormControl.Label data-testid="label">Label</FormControl.Label>
          <FormControl.Field data-testid="field" />
          <FormControl.Description data-testid="description">Description</FormControl.Description>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const label = screen.getByTestId("label");
      const field = screen.getByTestId("field");
      const description = screen.getByTestId("description");

      for (const el of [formControl, label, field, description]) {
        expect(el).toHaveAttribute("data-disabled");
      }
    });

    it("should have 'data-readonly' attribute when form control is readonly", () => {
      render(() => (
        <FormControl data-testid="form-control" isReadOnly>
          <FormControl.Label data-testid="label">Label</FormControl.Label>
          <FormControl.Field data-testid="field" />
          <FormControl.Description data-testid="description">Description</FormControl.Description>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const label = screen.getByTestId("label");
      const field = screen.getByTestId("field");
      const description = screen.getByTestId("description");

      for (const el of [formControl, label, field, description]) {
        expect(el).toHaveAttribute("data-readonly");
      }
    });

    it("should add 'data-invalid' attribute on error message when form control is invalid", () => {
      render(() => (
        <FormControl data-testid="form-control" validationState="invalid">
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const error = screen.getByTestId("error-message");

      expect(error).toHaveAttribute("data-invalid");
      expect(error).not.toHaveAttribute("data-required");
      expect(error).not.toHaveAttribute("data-disabled");
      expect(error).not.toHaveAttribute("data-readonly");
    });

    it("should add 'data-required' attribute on error message when form control is invalid", () => {
      render(() => (
        <FormControl data-testid="form-control" validationState="invalid" isRequired>
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const error = screen.getByTestId("error-message");

      expect(error).toHaveAttribute("data-required");
    });

    it("should add 'data-disabled' attribute on error message when form control is invalid", () => {
      render(() => (
        <FormControl data-testid="form-control" validationState="invalid" isDisabled>
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const error = screen.getByTestId("error-message");

      expect(error).toHaveAttribute("data-disabled");
    });

    it("should add 'data-readonly' attribute on error message when form control is invalid", () => {
      render(() => (
        <FormControl data-testid="form-control" validationState="invalid" isReadOnly>
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const error = screen.getByTestId("error-message");

      expect(error).toHaveAttribute("data-readonly");
    });
  });

  describe("isField", () => {
    it("should define accessible relation between label and the form control as field with correct attributes", () => {
      render(() => (
        <FormControl data-testid="form-control" isField>
          <FormControl.Label data-testid="label" as="span">
            Label
          </FormControl.Label>
        </FormControl>
      ));

      const label = screen.getByTestId("label");
      const formControl = screen.getByTestId("form-control");

      expect(label.id).toBeDefined();
      expect(formControl.id).toBeDefined();
      expect(formControl).toHaveAttribute("aria-labelledby", label.id);

      // check that generated ids are unique
      expect(label.id).not.toBe(formControl.id);
    });

    it("should work with 'aria-labelledby'", () => {
      render(() => <FormControl data-testid="form-control" isField aria-labelledby="foo" />);

      const formControl = screen.getByTestId("form-control");

      expect(formControl).toHaveAttribute("aria-labelledby", "foo");
    });

    it("should combine 'aria-labelledby' if visible label is also provided", () => {
      render(() => (
        <FormControl data-testid="form-control" isField aria-labelledby="foo">
          <FormControl.Label data-testid="label">Label</FormControl.Label>
        </FormControl>
      ));

      const label = screen.getByTestId("label");
      const formControl = screen.getByTestId("form-control");

      expect(formControl).toHaveAttribute("aria-labelledby", `foo ${label.id}`);
    });

    it("should combine 'aria-labelledby' if visible label and 'aria-label' is also provided", () => {
      render(() => (
        <FormControl data-testid="form-control" isField aria-label="bar" aria-labelledby="foo">
          <FormControl.Label data-testid="label">Label</FormControl.Label>
        </FormControl>
      ));

      const label = screen.getByTestId("label");
      const formControl = screen.getByTestId("form-control");

      expect(formControl).toHaveAttribute("aria-labelledby", `foo ${label.id} ${formControl.id}`);
    });

    it("should work without a visible label but 'aria-label'", () => {
      render(() => <FormControl data-testid="form-control" isField aria-label="Label" />);

      const formControl = screen.getByTestId("form-control");

      expect(formControl).not.toHaveAttribute("aria-labelledby");
      expect(formControl).toHaveAttribute("aria-label", "Label");
    });

    it("should work without a visible label but both 'aria-label' and 'aria-labelledby'", () => {
      render(() => (
        <FormControl data-testid="form-control" isField aria-label="Label" aria-labelledby="foo" />
      ));

      const formControl = screen.getByTestId("form-control");

      expect(formControl).toHaveAttribute("aria-labelledby", `foo ${formControl.id}`);
      expect(formControl).toHaveAttribute("aria-label", "Label");
    });

    it("should define accessible relation between form control as field and description with correct attributes", () => {
      render(() => (
        <FormControl data-testid="form-control" isField>
          <FormControl.Description data-testid="description">Description</FormControl.Description>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const description = screen.getByTestId("description");

      expect(description.id).toBeDefined();
      expect(formControl.id).toBeDefined();
      expect(formControl).toHaveAttribute("aria-describedby", description.id);

      // check that generated ids are unique
      expect(description.id).not.toBe(formControl.id);
    });

    it("should work with 'aria-describedby'", () => {
      render(() => <FormControl data-testid="form-control" isField aria-describedby="foo" />);

      const formControl = screen.getByTestId("form-control");

      expect(formControl).toHaveAttribute("aria-describedby", "foo");
    });

    it("should combine 'aria-describedby' if visible description", () => {
      render(() => (
        <FormControl data-testid="form-control" isField aria-describedby="foo">
          <FormControl.Description data-testid="description">Description</FormControl.Description>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const description = screen.getByTestId("description");

      expect(formControl).toHaveAttribute("aria-describedby", `${description.id} foo`);
    });

    it("should define accessible relation between form control as field and error message with correct attributes when form control is invalid", () => {
      render(() => (
        <FormControl data-testid="form-control" isField validationState="invalid">
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const error = screen.getByTestId("error-message");

      expect(error.id).toBeDefined();
      expect(formControl.id).toBeDefined();
      expect(formControl).toHaveAttribute("aria-describedby", error.id);

      // check that generated ids are unique
      expect(error.id).not.toBe(formControl.id);
    });

    it("should not be described by error message if form control is not invalid", () => {
      render(() => (
        <FormControl data-testid="form-control" isField>
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");

      expect(formControl).not.toHaveAttribute("aria-describedby");
    });

    it("should combine 'aria-describedby' if visible error message", () => {
      render(() => (
        <FormControl
          data-testid="form-control"
          isField
          validationState="invalid"
          aria-describedby="foo"
        >
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const error = screen.getByTestId("error-message");

      expect(formControl).toHaveAttribute("aria-describedby", `${error.id} foo`);
    });

    it("should combine 'aria-describedby' if visible description and error message", () => {
      render(() => (
        <FormControl
          data-testid="form-control"
          isField
          validationState="invalid"
          aria-describedby="foo"
        >
          <FormControl.Description data-testid="description">Description</FormControl.Description>
          <FormControl.ErrorMessage data-testid="error-message">
            ErrorMessage
          </FormControl.ErrorMessage>
        </FormControl>
      ));

      const formControl = screen.getByTestId("form-control");
      const description = screen.getByTestId("description");
      const error = screen.getByTestId("error-message");

      expect(formControl).toHaveAttribute("aria-describedby", `${description.id} ${error.id} foo`);
    });
  });
});
