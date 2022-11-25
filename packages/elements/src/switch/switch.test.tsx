/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/switch/test/Switch.test.js
 */

import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen } from "solid-testing-library";

import { Switch } from "./switch";

describe("Switch", () => {
  installPointerEvent();

  const onChangeSpy = jest.fn();

  afterEach(() => {
    onChangeSpy.mockClear();
  });

  it("should generate default ids", () => {
    render(() => (
      <Switch data-testid="switch">
        <Switch.Input data-testid="input" />
        <Switch.Control data-testid="control" />
        <Switch.Label data-testid="label">Label</Switch.Label>
      </Switch>
    ));

    const switchRoot = screen.getByTestId("switch");
    const input = screen.getByTestId("input");
    const control = screen.getByTestId("control");
    const label = screen.getByTestId("label");

    expect(switchRoot.id).toBeDefined();
    expect(input.id).toBe(`${switchRoot.id}-input`);
    expect(control.id).toBe(`${switchRoot.id}-control`);
    expect(label.id).toBe(`${switchRoot.id}-label`);
  });

  it("should generate ids based on switch id", () => {
    render(() => (
      <Switch data-testid="switch" id="foo">
        <Switch.Input data-testid="input" />
        <Switch.Control data-testid="control" />
        <Switch.Label data-testid="label">Label</Switch.Label>
      </Switch>
    ));

    const switchRoot = screen.getByTestId("switch");
    const input = screen.getByTestId("input");
    const control = screen.getByTestId("control");
    const label = screen.getByTestId("label");

    expect(switchRoot.id).toBe("foo");
    expect(input.id).toBe("foo-input");
    expect(control.id).toBe("foo-control");
    expect(label.id).toBe("foo-label");
  });

  it("supports custom ids", () => {
    render(() => (
      <Switch data-testid="switch" id="custom-switch-id">
        <Switch.Input data-testid="input" id="custom-input-id" />
        <Switch.Control data-testid="control" id="custom-control-id" />
        <Switch.Label data-testid="label" id="custom-label-id">
          Label
        </Switch.Label>
      </Switch>
    ));

    const switchRoot = screen.getByTestId("switch");
    const input = screen.getByTestId("input");
    const control = screen.getByTestId("control");
    const label = screen.getByTestId("label");

    expect(switchRoot.id).toBe("custom-switch-id");
    expect(input.id).toBe("custom-input-id");
    expect(control.id).toBe("custom-control-id");
    expect(label.id).toBe("custom-label-id");
  });

  it("should set input type to checkbox", async () => {
    render(() => (
      <Switch>
        <Switch.Input />
        <Switch.Label>Label</Switch.Label>
        <Switch.Control />
      </Switch>
    ));

    const input = screen.getByRole("switch");

    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("ensure default unchecked can be checked", async () => {
    render(() => (
      <Switch onCheckedChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Label>Label</Switch.Label>
        <Switch.Control />
      </Switch>
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
      <Switch defaultIsChecked onCheckedChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Label>Label</Switch.Label>
        <Switch.Control />
      </Switch>
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
      <Switch isChecked onCheckedChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Label>Label</Switch.Label>
        <Switch.Control />
      </Switch>
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
      <Switch isChecked={false} onCheckedChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Label>Label</Switch.Label>
        <Switch.Control />
      </Switch>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.checked).toBeFalsy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy.mock.calls[0][0]).toBe(true);
  });

  it("can be disabled", async () => {
    render(() => (
      <Switch isDisabled onCheckedChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Label data-testid="label">Label</Switch.Label>
        <Switch.Control />
      </Switch>
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

  it("supports 'aria-label'", () => {
    render(() => (
      <Switch aria-label="Label">
        <Switch.Input />
        <Switch.Control />
      </Switch>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-label", "Label");
  });

  it("supports 'aria-labelledby'", () => {
    render(() => (
      <Switch aria-labelledby="foo">
        <Switch.Input />
        <Switch.Control />
      </Switch>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-labelledby", "foo");
  });

  it("should combine 'aria-label' and 'aria-labelledby'", () => {
    render(() => (
      <Switch aria-label="Label" aria-labelledby="foo">
        <Switch.Input />
        <Switch.Control />
      </Switch>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-labelledby", `foo ${input.id}`);
  });

  it("supports 'aria-describedby'", () => {
    render(() => (
      <Switch aria-describedby="foo">
        <Switch.Input />
        <Switch.Control />
      </Switch>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-describedby", "foo");
  });

  it("can be read only", async () => {
    render(() => (
      <Switch isChecked isReadOnly onCheckedChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Label>Label</Switch.Label>
        <Switch.Control />
      </Switch>
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
      <Switch isReadOnly onCheckedChange={onChangeSpy}>
        <Switch.Input />
        <Switch.Label>Label</Switch.Label>
        <Switch.Control />
      </Switch>
    ));

    const input = screen.getByRole("switch") as HTMLInputElement;

    expect(input.checked).toBeFalsy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });
});
