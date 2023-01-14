import {
  checkAccessibility,
  installPointerEvent,
  itIsPolymorphic,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { fireEvent, render, screen } from "solid-testing-library";

import * as ToggleButton from ".";

const defaultProps: ToggleButton.ToggleButtonRootOptions = {};

describe("ToggleButton", () => {
  installPointerEvent();

  checkAccessibility([<ToggleButton.Root>Button</ToggleButton.Root>]);
  itIsPolymorphic(ToggleButton.Root as any, defaultProps);
  itRendersChildren(ToggleButton.Root as any, defaultProps);
  itSupportsClass(ToggleButton.Root as any, defaultProps);
  itSupportsRef(ToggleButton.Root as any, defaultProps, HTMLButtonElement);
  itSupportsStyle(ToggleButton.Root as any, defaultProps);

  it("can be default selected (uncontrolled)", () => {
    render(() => (
      <ToggleButton.Root data-testid="toggle" defaultIsPressed>
        Button
      </ToggleButton.Root>
    ));

    const toggle = screen.getByTestId("toggle");

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-pressed");
  });

  it("can be controlled", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <ToggleButton.Root data-testid="toggle" isPressed onPressedChange={onChangeSpy}>
        Button
      </ToggleButton.Root>
    ));

    const toggle = screen.getByTestId("toggle");

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-pressed");

    fireEvent.click(toggle);
    await Promise.resolve();

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-pressed");
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(false);
  });

  it("should have correct attributes when the toggle button is off (not selected)", () => {
    render(() => <ToggleButton.Root data-testid="toggle">Button</ToggleButton.Root>);

    const toggle = screen.getByTestId("toggle");

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).not.toHaveAttribute("data-pressed");
  });

  it("should have correct attributes when the toggle button is on (selected)", () => {
    render(() => (
      <ToggleButton.Root data-testid="toggle" isPressed>
        Button
      </ToggleButton.Root>
    ));

    const toggle = screen.getByTestId("toggle");

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-pressed");
  });
});
