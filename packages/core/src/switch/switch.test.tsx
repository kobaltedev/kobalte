/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/switch/test/Switch.test.js
 */

import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen } from "@solidjs/testing-library";

import * as Switch from ".";

describe("Switch", () => {
  installPointerEvent();

  const onChangeSpy = jest.fn();

  afterEach(() => {
    onChangeSpy.mockClear();
  });

  it("should generate default ids", () => {
    render(() => (
      <Switch.Root data-testid="switch">
        <Switch.Input data-testid="input" />
        <Switch.Control data-testid="control">
          <Switch.Thumb data-testid="thumb" />
        </Switch.Control>
        <Switch.Label data-testid="label">Label</Switch.Label>
      </Switch.Root>
    ));

    const switchRoot = screen.getByTestId("switch");
    const input = screen.getByTestId("input");
    const control = screen.getByTestId("control");
    const thumb = screen.getByTestId("thumb");
    const label = screen.getByTestId("label");

    expect(switchRoot.id).toBeDefined();
    expect(input.id).toBe(`${switchRoot.id}-input`);
    expect(control.id).toBe(`${switchRoot.id}-control`);
    expect(thumb.id).toBe(`${switchRoot.id}-thumb`);
    expect(label.id).toBe(`${switchRoot.id}-label`);
  });

  it("should generate ids based on switch id", () => {
    render(() => (
      <Switch.Root data-testid="switch" id="foo">
        <Switch.Input data-testid="input" />
        <Switch.Control data-testid="control">
          <Switch.Thumb data-testid="thumb" />
        </Switch.Control>
        <Switch.Label data-testid="label">Label</Switch.Label>
      </Switch.Root>
    ));

    const switchRoot = screen.getByTestId("switch");
    const input = screen.getByTestId("input");
    const control = screen.getByTestId("control");
    const thumb = screen.getByTestId("thumb");
    const label = screen.getByTestId("label");

    expect(switchRoot.id).toBe("foo");
    expect(input.id).toBe("foo-input");
    expect(control.id).toBe("foo-control");
    expect(thumb.id).toBe("foo-thumb");
    expect(label.id).toBe("foo-label");
  });

  it("supports custom ids", () => {
    render(() => (
      <Switch.Root data-testid="switch" id="custom-switch-id">
        <Switch.Input data-testid="input" id="custom-input-id" />
        <Switch.Control data-testid="control" id="custom-control-id">
          <Switch.Thumb data-testid="thumb" id="custom-thumb-id" />
        </Switch.Control>
        <Switch.Label data-testid="label" id="custom-label-id">
          Label
        </Switch.Label>
      </Switch.Root>
    ));

    const switchRoot = screen.getByTestId("switch");
    const input = screen.getByTestId("input");
    const control = screen.getByTestId("control");
    const thumb = screen.getByTestId("thumb");
    const label = screen.getByTestId("label");

    expect(switchRoot.id).toBe("custom-switch-id");
    expect(input.id).toBe("custom-input-id");
    expect(control.id).toBe("custom-control-id");
    expect(thumb.id).toBe("custom-thumb-id");
    expect(label.id).toBe("custom-label-id");
  });

  it("should set input type to checkbox", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch");

    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("should set input role to switch", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch");

    expect(input).toHaveAttribute("role", "switch");
  });

  it("should have default value of 'on'", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.value).toBe("on");
  });

  it("supports custom value", async () => {
    render(() => (
      <Switch.Root value="custom">
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.value).toBe("custom");
  });

  it("ensure default unchecked can be checked", async () => {
    render(() => (
      <Switch.Root onChange={onChangeSpy}>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

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
    render(() => (
      <Switch.Root defaultChecked onChange={onChangeSpy}>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.checked).toBeTruthy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy.mock.calls[0][0]).toBe(false);
  });

  it("can be controlled checked", async () => {
    render(() => (
      <Switch.Root checked onChange={onChangeSpy}>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.checked).toBeTruthy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeTruthy();
    expect(onChangeSpy.mock.calls[0][0]).toBe(false);
  });

  it("can be controlled unchecked", async () => {
    render(() => (
      <Switch.Root checked={false} onChange={onChangeSpy}>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.checked).toBeFalsy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy.mock.calls[0][0]).toBe(true);
  });

  it("can be checked by clicking on the control", async () => {
    render(() => (
      <Switch.Root onChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Control data-testid="control" />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const control = screen.getByTestId("control");

    expect(input.checked).toBeFalsy();

    fireEvent.click(control);
    await Promise.resolve();

    expect(input.checked).toBeTruthy();
    expect(onChangeSpy.mock.calls[0][0]).toBe(true);
  });

  it("can be checked by pressing the Space key on the control", async () => {
    render(() => (
      <Switch.Root onChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Control data-testid="control" />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const control = screen.getByTestId("control");

    expect(input.checked).toBeFalsy();

    fireEvent.keyDown(control, { key: " " });
    fireEvent.keyUp(control, { key: " " });
    await Promise.resolve();

    expect(input.checked).toBeTruthy();
    expect(onChangeSpy.mock.calls[0][0]).toBe(true);
  });

  it("can be disabled", async () => {
    render(() => (
      <Switch.Root disabled onChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Label data-testid="label">Label</Switch.Label>
      </Switch.Root>
    ));

    const label = screen.getByTestId("label");
    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.disabled).toBeTruthy();
    expect(input.checked).toBeFalsy();

    // I don't know why but `fireEvent` on the input fire the click even if the input is disabled.
    // fireEvent.click(input);
    fireEvent.click(label);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it("can be invalid", async () => {
    render(() => (
      <Switch.Root validationState="invalid" onChange={onChangeSpy}>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("passes through 'aria-errormessage'", async () => {
    render(() => (
      <Switch.Root validationState="invalid" onChange={onChangeSpy}>
        <Switch.Input aria-errormessage="test" />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", "test");
  });

  it("supports visible label", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Label>Label</Switch.Label>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const label = screen.getByText("Label");

    expect(input).toHaveAttribute("aria-labelledby", label.id);
    expect(label).toBeInstanceOf(HTMLLabelElement);
    expect(label).toHaveAttribute("for", input.id);
  });

  it("supports 'aria-labelledby'", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Input aria-labelledby="foo" />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-labelledby", "foo");
  });

  it("should combine 'aria-labelledby' if visible label is also provided", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Label>Label</Switch.Label>
        <Switch.Input aria-labelledby="foo" />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const label = screen.getByText("Label");

    expect(input).toHaveAttribute("aria-labelledby", `foo ${label.id}`);
  });

  it("supports 'aria-label'", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Input aria-label="My Label" />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-label", "My Label");
  });

  it("should combine 'aria-labelledby' if visible label and 'aria-label' is also provided", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Label>Label</Switch.Label>
        <Switch.Input aria-label="bar" aria-labelledby="foo" />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const label = screen.getByText("Label");

    expect(input).toHaveAttribute("aria-labelledby", `foo ${label.id} ${input.id}`);
  });

  it("supports visible description", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Input />
        <Switch.Description>Description</Switch.Description>
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const description = screen.getByText("Description");

    expect(description.id).toBeDefined();
    expect(input.id).toBeDefined();
    expect(input).toHaveAttribute("aria-describedby", description.id);

    // check that generated ids are unique
    expect(description.id).not.toBe(input.id);
  });

  it("supports 'aria-describedby'", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Input aria-describedby="foo" />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-describedby", "foo");
  });

  it("should combine 'aria-describedby' if visible description", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Input aria-describedby="foo" />
        <Switch.Description>Description</Switch.Description>
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const description = screen.getByText("Description");

    expect(input).toHaveAttribute("aria-describedby", `${description.id} foo`);
  });

  it("supports visible error message when invalid", async () => {
    render(() => (
      <Switch.Root validationState="invalid">
        <Switch.Input />
        <Switch.ErrorMessage>ErrorMessage</Switch.ErrorMessage>
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const errorMessage = screen.getByText("ErrorMessage");

    expect(errorMessage.id).toBeDefined();
    expect(input.id).toBeDefined();
    expect(input).toHaveAttribute("aria-describedby", errorMessage.id);

    // check that generated ids are unique
    expect(errorMessage.id).not.toBe(input.id);
  });

  it("should not be described by error message when not invalid", async () => {
    render(() => (
      <Switch.Root>
        <Switch.Input />
        <Switch.ErrorMessage>ErrorMessage</Switch.ErrorMessage>
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("should combine 'aria-describedby' if visible error message when invalid", () => {
    render(() => (
      <Switch.Root validationState="invalid">
        <Switch.Input aria-describedby="foo" />
        <Switch.ErrorMessage>ErrorMessage</Switch.ErrorMessage>
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const errorMessage = screen.getByText("ErrorMessage");

    expect(input).toHaveAttribute("aria-describedby", `${errorMessage.id} foo`);
  });

  it("should combine 'aria-describedby' if visible description and error message when invalid", () => {
    render(() => (
      <Switch.Root validationState="invalid">
        <Switch.Input aria-describedby="foo" />
        <Switch.Description>Description</Switch.Description>
        <Switch.ErrorMessage>ErrorMessage</Switch.ErrorMessage>
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;
    const description = screen.getByText("Description");
    const errorMessage = screen.getByText("ErrorMessage");

    expect(input).toHaveAttribute("aria-describedby", `${description.id} ${errorMessage.id} foo`);
  });

  it("can be read only", async () => {
    render(() => (
      <Switch.Root checked readOnly onChange={onChangeSpy}>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.checked).toBeTruthy();
    expect(input).toHaveAttribute("aria-readonly", "true");

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeTruthy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it("supports uncontrolled read only", async () => {
    render(() => (
      <Switch.Root readOnly onChange={onChangeSpy}>
        <Switch.Input />
      </Switch.Root>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.checked).toBeFalsy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  describe("data-attributes", () => {
    it("should have 'data-valid' attribute when switch is valid", async () => {
      render(() => (
        <Switch.Root data-testid="switch-root" validationState="valid">
          <Switch.Input />
          <Switch.Label data-testid="switch-label">Label</Switch.Label>
          <Switch.Control data-testid="switch-control">
            <Switch.Thumb data-testid="switch-thumb" />
          </Switch.Control>
        </Switch.Root>
      ));

      const elements = screen.getAllByTestId(/^switch/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-valid");
      }
    });

    it("should have 'data-invalid' attribute when switch is invalid", async () => {
      render(() => (
        <Switch.Root data-testid="switch-root" validationState="invalid">
          <Switch.Input />
          <Switch.Label data-testid="switch-label">Label</Switch.Label>
          <Switch.Control data-testid="switch-control">
            <Switch.Thumb data-testid="switch-thumb" />
          </Switch.Control>
        </Switch.Root>
      ));

      const elements = screen.getAllByTestId(/^switch/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-invalid");
      }
    });

    it("should have 'data-checked' attribute when switch is checked", async () => {
      render(() => (
        <Switch.Root data-testid="switch-root" checked>
          <Switch.Input />
          <Switch.Label data-testid="switch-label">Label</Switch.Label>
          <Switch.Control data-testid="switch-control">
            <Switch.Thumb data-testid="switch-thumb" />
          </Switch.Control>
        </Switch.Root>
      ));

      const elements = screen.getAllByTestId(/^switch/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-checked");
      }
    });

    it("should have 'data-required' attribute when switch is required", async () => {
      render(() => (
        <Switch.Root data-testid="switch-root" required>
          <Switch.Input />
          <Switch.Label data-testid="switch-label">Label</Switch.Label>
          <Switch.Control data-testid="switch-control">
            <Switch.Thumb data-testid="switch-thumb" />
          </Switch.Control>
        </Switch.Root>
      ));

      const elements = screen.getAllByTestId(/^switch/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-required");
      }
    });

    it("should have 'data-disabled' attribute when switch is disabled", async () => {
      render(() => (
        <Switch.Root data-testid="switch-root" disabled>
          <Switch.Input />
          <Switch.Label data-testid="switch-label">Label</Switch.Label>
          <Switch.Control data-testid="switch-control">
            <Switch.Thumb data-testid="switch-thumb" />
          </Switch.Control>
        </Switch.Root>
      ));

      const elements = screen.getAllByTestId(/^switch/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-disabled");
      }
    });

    it("should have 'data-readonly' attribute when switch is read only", async () => {
      render(() => (
        <Switch.Root data-testid="switch-root" readOnly>
          <Switch.Input />
          <Switch.Label data-testid="switch-label">Label</Switch.Label>
          <Switch.Control data-testid="switch-control">
            <Switch.Thumb data-testid="switch-thumb" />
          </Switch.Control>
        </Switch.Root>
      ));

      const elements = screen.getAllByTestId(/^switch/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-readonly");
      }
    });
  });
});
