import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "solid-testing-library";

import { TextField } from "./text-field";

describe("TextField", () => {
  installPointerEvent();

  it("can have a default value", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <TextField defaultValue="cat" onValueChange={onChangeSpy}>
        <TextField.Label>Favorite Pet</TextField.Label>
        <TextField.Input />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(input.value).toBe("cat");

    await userEvent.type(input, "s");

    expect(onChangeSpy).toHaveBeenCalledWith("cats");
    expect(input.value).toBe("cats");
  });

  it("value can be controlled", async () => {
    const onChangeSpy = jest.fn();
    render(() => (
      <TextField value="cat" onValueChange={onChangeSpy}>
        <TextField.Label>Favorite Pet</TextField.Label>
        <TextField.Input />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(input.value).toBe("cat");

    await userEvent.type(input, "s");

    expect(onChangeSpy).toHaveBeenCalledWith("cats");

    // "cat" because `value` is controlled.
    expect(input.value).toBe("cat");
  });

  it("name can be controlled", async () => {
    render(() => (
      <TextField name="favorite-pet">
        <TextField.Label>Favorite Pet</TextField.Label>
        <TextField.Input />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toHaveAttribute("name", "favorite-pet");
  });

  it("supports visible label", async () => {
    render(() => (
      <TextField>
        <TextField.Label>Favorite Pet</TextField.Label>
        <TextField.Input />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const label = screen.getByText("Favorite Pet");

    expect(input).toHaveAttribute("aria-labelledby", label.id);
    expect(label).toBeInstanceOf(HTMLLabelElement);
    expect(label).toHaveAttribute("for", input.id);
  });

  it("supports 'aria-labelledby'", async () => {
    render(() => (
      <TextField>
        <TextField.Input aria-labelledby="foo" />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-labelledby", "foo");
  });

  it("should combine 'aria-labelledby' if visible label is also provided", async () => {
    render(() => (
      <TextField>
        <TextField.Label>Favorite Pet</TextField.Label>
        <TextField.Input aria-labelledby="foo" />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const label = screen.getByText("Favorite Pet");

    expect(input).toHaveAttribute("aria-labelledby", `foo ${label.id}`);
  });

  it("supports 'aria-label'", async () => {
    render(() => (
      <TextField>
        <TextField.Input aria-label="My Favorite Pet" />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-label", "My Favorite Pet");
  });

  it("should combine 'aria-labelledby' if visible label and 'aria-label' is also provided", async () => {
    render(() => (
      <TextField>
        <TextField.Label>Favorite Pet</TextField.Label>
        <TextField.Input aria-label="bar" aria-labelledby="foo" />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const label = screen.getByText("Favorite Pet");

    expect(input).toHaveAttribute("aria-labelledby", `foo ${label.id} ${input.id}`);
  });

  it("supports visible description", async () => {
    render(() => (
      <TextField>
        <TextField.Input />
        <TextField.Description>Description</TextField.Description>
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const description = screen.getByText("Description");

    expect(description.id).toBeDefined();
    expect(input.id).toBeDefined();
    expect(input).toHaveAttribute("aria-describedby", description.id);

    // check that generated ids are unique
    expect(description.id).not.toBe(input.id);
  });

  it("supports 'aria-describedby'", async () => {
    render(() => (
      <TextField>
        <TextField.Input aria-describedby="foo" />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-describedby", "foo");
  });

  it("should combine 'aria-describedby' if visible description", async () => {
    render(() => (
      <TextField>
        <TextField.Input aria-describedby="foo" />
        <TextField.Description>Description</TextField.Description>
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const description = screen.getByText("Description");

    expect(input).toHaveAttribute("aria-describedby", `${description.id} foo`);
  });

  it("supports visible error message when invalid", async () => {
    render(() => (
      <TextField validationState="invalid">
        <TextField.Input />
        <TextField.ErrorMessage>ErrorMessage</TextField.ErrorMessage>
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const errorMessage = screen.getByText("ErrorMessage");

    expect(errorMessage.id).toBeDefined();
    expect(input.id).toBeDefined();
    expect(input).toHaveAttribute("aria-describedby", errorMessage.id);

    // check that generated ids are unique
    expect(errorMessage.id).not.toBe(input.id);
  });

  it("should not be described by error message when not invalid", async () => {
    render(() => (
      <TextField>
        <TextField.Input />
        <TextField.ErrorMessage>ErrorMessage</TextField.ErrorMessage>
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("should combine 'aria-describedby' if visible error message when invalid", () => {
    render(() => (
      <TextField validationState="invalid">
        <TextField.Input aria-describedby="foo" />
        <TextField.ErrorMessage>ErrorMessage</TextField.ErrorMessage>
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const errorMessage = screen.getByText("ErrorMessage");

    expect(input).toHaveAttribute("aria-describedby", `${errorMessage.id} foo`);
  });

  it("should combine 'aria-describedby' if visible description and error message when invalid", () => {
    render(() => (
      <TextField validationState="invalid">
        <TextField.Input aria-describedby="foo" />
        <TextField.Description>Description</TextField.Description>
        <TextField.ErrorMessage>ErrorMessage</TextField.ErrorMessage>
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    const description = screen.getByText("Description");
    const errorMessage = screen.getByText("ErrorMessage");

    expect(input).toHaveAttribute("aria-describedby", `${description.id} ${errorMessage.id} foo`);
  });

  it("should not have form control 'data-*' attributes by default", () => {
    render(() => (
      <TextField data-testid="textfield">
        <TextField.Input />
      </TextField>
    ));

    const textField = screen.getByTestId("textfield");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    for (const el of [textField, input]) {
      expect(el).not.toHaveAttribute("data-valid");
      expect(el).not.toHaveAttribute("data-invalid");
      expect(el).not.toHaveAttribute("data-required");
      expect(el).not.toHaveAttribute("data-disabled");
      expect(el).not.toHaveAttribute("data-readonly");
    }
  });

  it("should have 'data-valid' attribute when valid", () => {
    render(() => (
      <TextField data-testid="textfield" validationState="valid">
        <TextField.Input />
      </TextField>
    ));

    const textField = screen.getByTestId("textfield");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    for (const el of [textField, input]) {
      expect(el).toHaveAttribute("data-valid");
    }
  });

  it("should have 'data-invalid' attribute when invalid", () => {
    render(() => (
      <TextField data-testid="textfield" validationState="invalid">
        <TextField.Input />
      </TextField>
    ));

    const textField = screen.getByTestId("textfield");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    for (const el of [textField, input]) {
      expect(el).toHaveAttribute("data-invalid");
    }
  });

  it("should have 'data-required' attribute when required", () => {
    render(() => (
      <TextField data-testid="textfield" isRequired>
        <TextField.Input />
      </TextField>
    ));

    const textField = screen.getByTestId("textfield");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    for (const el of [textField, input]) {
      expect(el).toHaveAttribute("data-required");
    }
  });

  it("should have 'data-disabled' attribute when disabled", () => {
    render(() => (
      <TextField data-testid="textfield" isDisabled>
        <TextField.Input />
      </TextField>
    ));

    const textField = screen.getByTestId("textfield");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    for (const el of [textField, input]) {
      expect(el).toHaveAttribute("data-disabled");
    }
  });

  it("should have 'data-readonly' attribute when readonly", () => {
    render(() => (
      <TextField data-testid="textfield" isReadOnly>
        <TextField.Input />
      </TextField>
    ));

    const textField = screen.getByTestId("textfield");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    for (const el of [textField, input]) {
      expect(el).toHaveAttribute("data-readonly");
    }
  });

  it("should have 'data-hover' attribute when input is hovered", async () => {
    render(() => (
      <TextField data-testid="textfield">
        <TextField.Input />
      </TextField>
    ));

    const textField = screen.getByTestId("textfield");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent(input, createPointerEvent("pointerenter", { pointerType: "mouse" }));
    await Promise.resolve();

    for (const el of [textField, input]) {
      expect(el).toHaveAttribute("data-hover");
    }

    fireEvent(input, createPointerEvent("pointerleave", { pointerType: "mouse" }));
    await Promise.resolve();

    for (const el of [textField, input]) {
      expect(el).not.toHaveAttribute("data-hover");
    }
  });

  it("should have 'data-focus' attribute when input is focused", async () => {
    render(() => (
      <TextField data-testid="textfield">
        <TextField.Input />
      </TextField>
    ));

    const textField = screen.getByTestId("textfield");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    input.focus();
    await Promise.resolve();

    for (const el of [textField, input]) {
      expect(el).toHaveAttribute("data-focus");
    }

    input.blur();
    await Promise.resolve();

    for (const el of [textField, input]) {
      expect(el).not.toHaveAttribute("data-v");
    }
  });

  it("sets 'aria-invalid' on input when 'validationState=invalid'", () => {
    render(() => (
      <TextField validationState="invalid">
        <TextField.Input />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("input should not have 'required', 'disabled' or 'readonly' attributes by default", () => {
    render(() => (
      <TextField>
        <TextField.Input />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).not.toHaveAttribute("required");
    expect(input).not.toHaveAttribute("disabled");
    expect(input).not.toHaveAttribute("readonly");
  });

  it("sets 'required' and 'aria-required' on input when 'isRequired' is true", () => {
    render(() => (
      <TextField isRequired>
        <TextField.Input />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("sets 'disabled' and 'aria-disabled' on input when 'isDisabled' is true", () => {
    render(() => (
      <TextField isDisabled>
        <TextField.Input />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toHaveAttribute("disabled");
    expect(input).toHaveAttribute("aria-disabled", "true");
  });

  it("sets 'readonly' and 'aria-readonly' on input when 'isReadOnly' is true", () => {
    render(() => (
      <TextField isReadOnly>
        <TextField.Input />
      </TextField>
    ));

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveAttribute("aria-readonly", "true");
  });
});
