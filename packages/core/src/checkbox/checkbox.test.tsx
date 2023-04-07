/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/checkbox/test/Checkbox.test.js
 */

import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen } from "@solidjs/testing-library";

import * as Checkbox from ".";

describe("Checkbox", () => {
  installPointerEvent();

  const onChangeSpy = jest.fn();

  afterEach(() => {
    onChangeSpy.mockClear();
  });

  it("should generate default ids", () => {
    render(() => (
      <Checkbox.Root data-testid="checkbox">
        <Checkbox.Input data-testid="input" />
        <Checkbox.Control data-testid="control">
          <Checkbox.Indicator data-testid="indicator" forceMount />
        </Checkbox.Control>
        <Checkbox.Label data-testid="label">Label</Checkbox.Label>
      </Checkbox.Root>
    ));

    const checkboxRoot = screen.getByTestId("checkbox");
    const input = screen.getByTestId("input");
    const control = screen.getByTestId("control");
    const indicator = screen.getByTestId("indicator");
    const label = screen.getByTestId("label");

    expect(checkboxRoot.id).toBeDefined();
    expect(input.id).toBe(`${checkboxRoot.id}-input`);
    expect(control.id).toBe(`${checkboxRoot.id}-control`);
    expect(indicator.id).toBe(`${checkboxRoot.id}-indicator`);
    expect(label.id).toBe(`${checkboxRoot.id}-label`);
  });

  it("should generate ids based on checkbox id", () => {
    render(() => (
      <Checkbox.Root data-testid="checkbox" id="foo">
        <Checkbox.Input data-testid="input" />
        <Checkbox.Control data-testid="control">
          <Checkbox.Indicator data-testid="indicator" forceMount />
        </Checkbox.Control>
        <Checkbox.Label data-testid="label">Label</Checkbox.Label>
      </Checkbox.Root>
    ));

    const checkboxRoot = screen.getByTestId("checkbox");
    const input = screen.getByTestId("input");
    const control = screen.getByTestId("control");
    const indicator = screen.getByTestId("indicator");
    const label = screen.getByTestId("label");

    expect(checkboxRoot.id).toBe("foo");
    expect(input.id).toBe("foo-input");
    expect(control.id).toBe("foo-control");
    expect(indicator.id).toBe("foo-indicator");
    expect(label.id).toBe("foo-label");
  });

  it("supports custom ids", () => {
    render(() => (
      <Checkbox.Root data-testid="checkbox" id="custom-checkbox-id">
        <Checkbox.Input data-testid="input" id="custom-input-id" />
        <Checkbox.Control data-testid="control" id="custom-control-id">
          <Checkbox.Indicator data-testid="indicator" id="custom-indicator-id" forceMount />
        </Checkbox.Control>
        <Checkbox.Label data-testid="label" id="custom-label-id">
          Label
        </Checkbox.Label>
      </Checkbox.Root>
    ));

    const checkboxRoot = screen.getByTestId("checkbox");
    const input = screen.getByTestId("input");
    const control = screen.getByTestId("control");
    const indicator = screen.getByTestId("indicator");
    const label = screen.getByTestId("label");

    expect(checkboxRoot.id).toBe("custom-checkbox-id");
    expect(input.id).toBe("custom-input-id");
    expect(control.id).toBe("custom-control-id");
    expect(indicator.id).toBe("custom-indicator-id");
    expect(label.id).toBe("custom-label-id");
  });

  it("should set input type to checkbox", async () => {
    render(() => (
      <Checkbox.Root>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox");

    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("should have default value of 'on'", async () => {
    render(() => (
      <Checkbox.Root>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
  });

  it("supports custom value", async () => {
    render(() => (
      <Checkbox.Root value="custom">
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("custom");
  });

  it("ensure default unchecked can be checked", async () => {
    render(() => (
      <Checkbox.Root onChange={onChangeSpy}>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
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
      <Checkbox.Root defaultChecked onChange={onChangeSpy}>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input.checked).toBeTruthy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy.mock.calls[0][0]).toBe(false);
  });

  it("can be controlled checked", async () => {
    render(() => (
      <Checkbox.Root checked onChange={onChangeSpy}>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input.checked).toBeTruthy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeTruthy();
    expect(onChangeSpy.mock.calls[0][0]).toBe(false);
  });

  it("can be controlled unchecked", async () => {
    render(() => (
      <Checkbox.Root checked={false} onChange={onChangeSpy}>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input.checked).toBeFalsy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy.mock.calls[0][0]).toBe(true);
  });

  it("can be indeterminate", async () => {
    render(() => (
      <Checkbox.Root indeterminate onChange={onChangeSpy}>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
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

  it("can be disabled", async () => {
    render(() => (
      <Checkbox.Root disabled onChange={onChangeSpy}>
        <Checkbox.Input />
        <Checkbox.Label data-testid="label">Label</Checkbox.Label>
      </Checkbox.Root>
    ));

    const label = screen.getByTestId("label");
    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input.disabled).toBeTruthy();
    expect(input.checked).toBeFalsy();

    // I don't know why but `fireEvent` on the input fire the click even if the input is disabled.
    fireEvent.click(label);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it("can be invalid", async () => {
    render(() => (
      <Checkbox.Root validationState="invalid" onChange={onChangeSpy}>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("passes through 'aria-errormessage'", async () => {
    render(() => (
      <Checkbox.Root validationState="invalid" onChange={onChangeSpy}>
        <Checkbox.Input aria-errormessage="test" />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", "test");
  });

  it("supports 'aria-label'", () => {
    render(() => (
      <Checkbox.Root>
        <Checkbox.Input aria-label="Label" />
        <Checkbox.Control />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input).toHaveAttribute("aria-label", "Label");
  });

  it("supports 'aria-labelledby'", () => {
    render(() => (
      <Checkbox.Root>
        <Checkbox.Input aria-labelledby="foo" />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input).toHaveAttribute("aria-labelledby", "foo");
  });

  it("should combine 'aria-label' and 'aria-labelledby'", () => {
    render(() => (
      <Checkbox.Root>
        <Checkbox.Input aria-label="Label" aria-labelledby="foo" />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input).toHaveAttribute("aria-labelledby", `foo ${input.id}`);
  });

  it("supports 'aria-describedby'", () => {
    render(() => (
      <Checkbox.Root>
        <Checkbox.Input aria-describedby="foo" />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-describedby", "foo");
  });

  it("can be read only", async () => {
    render(() => (
      <Checkbox.Root checked readOnly onChange={onChangeSpy}>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input.checked).toBeTruthy();
    expect(input).toHaveAttribute("aria-readonly", "true");

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeTruthy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it("supports uncontrolled read only", async () => {
    render(() => (
      <Checkbox.Root readOnly onChange={onChangeSpy}>
        <Checkbox.Input />
      </Checkbox.Root>
    ));

    const input = screen.getByRole("checkbox") as HTMLInputElement;

    expect(input.value).toBe("on");
    expect(input.checked).toBeFalsy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  describe("indicator", () => {
    it("should not display indicator by default", async () => {
      render(() => (
        <Checkbox.Root>
          <Checkbox.Input />
          <Checkbox.Control>
            <Checkbox.Indicator data-testid="indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      expect(screen.queryByTestId("indicator")).toBeNull();
    });

    it("should display indicator when 'checked'", async () => {
      render(() => (
        <Checkbox.Root>
          <Checkbox.Input />
          <Checkbox.Control>
            <Checkbox.Indicator data-testid="indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      const input = screen.getByRole("checkbox") as HTMLInputElement;

      expect(input.checked).toBeFalsy();
      expect(screen.queryByTestId("indicator")).toBeNull();

      fireEvent.click(input);
      await Promise.resolve();

      expect(input.checked).toBeTruthy();
      expect(screen.getByTestId("indicator")).toBeInTheDocument();

      fireEvent.click(input);
      await Promise.resolve();

      expect(input.checked).toBeFalsy();
      expect(screen.queryByTestId("indicator")).toBeNull();
    });

    it("should display indicator when 'indeterminate'", async () => {
      render(() => (
        <Checkbox.Root indeterminate>
          <Checkbox.Input />
          <Checkbox.Control>
            <Checkbox.Indicator data-testid="indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      expect(screen.getByTestId("indicator")).toBeInTheDocument();
    });

    it("should display indicator when 'forceMount'", async () => {
      render(() => (
        <Checkbox.Root>
          <Checkbox.Input />
          <Checkbox.Control>
            <Checkbox.Indicator data-testid="indicator" forceMount />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      expect(screen.getByTestId("indicator")).toBeInTheDocument();
    });
  });

  describe("data-attributes", () => {
    it("should have 'data-valid' attribute when checkbox is valid", async () => {
      render(() => (
        <Checkbox.Root data-testid="checkbox-root" validationState="valid">
          <Checkbox.Input />
          <Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
          <Checkbox.Control data-testid="checkbox-control">
            <Checkbox.Indicator data-testid="checkbox-indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      const elements = screen.getAllByTestId(/^checkbox/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-valid");
      }
    });

    it("should have 'data-invalid' attribute when checkbox is invalid", async () => {
      render(() => (
        <Checkbox.Root data-testid="checkbox-root" validationState="invalid">
          <Checkbox.Input />
          <Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
          <Checkbox.Control data-testid="checkbox-control">
            <Checkbox.Indicator data-testid="checkbox-indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      const elements = screen.getAllByTestId(/^checkbox/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-invalid");
      }
    });

    it("should have 'data-checked' attribute when checkbox is checked", async () => {
      render(() => (
        <Checkbox.Root data-testid="checkbox-root" checked>
          <Checkbox.Input />
          <Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
          <Checkbox.Control data-testid="checkbox-control">
            <Checkbox.Indicator data-testid="checkbox-indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      const elements = screen.getAllByTestId(/^checkbox/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-checked");
      }
    });

    it("should have 'data-indeterminate' attribute when checkbox is indeterminate", async () => {
      render(() => (
        <Checkbox.Root data-testid="checkbox-root" indeterminate>
          <Checkbox.Input />
          <Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
          <Checkbox.Control data-testid="checkbox-control">
            <Checkbox.Indicator data-testid="checkbox-indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      const elements = screen.getAllByTestId(/^checkbox/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-indeterminate");
      }
    });

    it("should have 'data-required' attribute when checkbox is required", async () => {
      render(() => (
        <Checkbox.Root data-testid="checkbox-root" required>
          <Checkbox.Input />
          <Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
          <Checkbox.Control data-testid="checkbox-control">
            <Checkbox.Indicator data-testid="checkbox-indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      const elements = screen.getAllByTestId(/^checkbox/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-required");
      }
    });

    it("should have 'data-disabled' attribute when checkbox is disabled", async () => {
      render(() => (
        <Checkbox.Root data-testid="checkbox-root" disabled>
          <Checkbox.Input />
          <Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
          <Checkbox.Control data-testid="checkbox-control">
            <Checkbox.Indicator data-testid="checkbox-indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      const elements = screen.getAllByTestId(/^checkbox/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-disabled");
      }
    });

    it("should have 'data-readonly' attribute when checkbox is read only", async () => {
      render(() => (
        <Checkbox.Root data-testid="checkbox-root" readOnly>
          <Checkbox.Input />
          <Checkbox.Label data-testid="checkbox-label">Label</Checkbox.Label>
          <Checkbox.Control data-testid="checkbox-control">
            <Checkbox.Indicator data-testid="checkbox-indicator" />
          </Checkbox.Control>
        </Checkbox.Root>
      ));

      const elements = screen.getAllByTestId(/^checkbox/);

      for (const el of elements) {
        expect(el).toHaveAttribute("data-readonly");
      }
    });
  });
});
