import {
  checkAccessibility,
  createPointerEvent,
  installPointerEvent,
  itIsPolymorphic,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { fireEvent, render, screen } from "solid-testing-library";

import * as Button from ".";

const defaultProps: Button.ButtonRootOptions = {};

describe("Button", () => {
  installPointerEvent();

  checkAccessibility([<Button.Root>Button</Button.Root>]);
  itIsPolymorphic(Button.Root as any, defaultProps);
  itRendersChildren(Button.Root as any, defaultProps);
  itSupportsClass(Button.Root as any, defaultProps);
  itSupportsRef(Button.Root as any, defaultProps, HTMLButtonElement);
  itSupportsStyle(Button.Root as any, defaultProps);

  it("should have attribute 'type=button' by default", () => {
    render(() => <Button.Root data-testid="button">Button</Button.Root>);

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("type", "button");
  });

  it("should not have attribute 'type=button' by default when it's not a 'button' tag", () => {
    render(() => (
      <Button.Root data-testid="button" as="div">
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("type", "button");
  });

  it("should keep attribute 'type' when provided", () => {
    render(() => (
      <Button.Root data-testid="button" as="input" type="submit">
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("type", "submit");
  });

  it("should not have attribute 'role=button' when it's a native button", () => {
    render(() => <Button.Root data-testid="button">Button</Button.Root>);

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("role", "button");
  });

  it("should not have attribute 'role=button' when it's an 'a' tag with 'href'", () => {
    render(() => (
      <Button.Root data-testid="button" as="a" href="https://kobalte.dev">
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("role", "button");
  });

  it("should have attribute 'role=button' when it's not a native button", () => {
    render(() => (
      <Button.Root data-testid="button" as="div">
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("role", "button");
  });

  it("should have attribute 'role=button' when it's an 'a' tag without 'href'", () => {
    render(() => (
      <Button.Root data-testid="button" as="a">
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("role", "button");
  });

  it("should have attribute 'tabindex=0' when it's not a native button", () => {
    render(() => (
      <Button.Root data-testid="button" as="div">
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex=0' when it's an 'a' tag with 'href'", () => {
    render(() => (
      <Button.Root data-testid="button" as="a" href="https://kobalte.dev">
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex=0' when it's disabled", () => {
    render(() => (
      <Button.Root data-testid="button" as="div" isDisabled>
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("tabindex", "0");
  });

  it("should have correct 'disabled' attribute when disabled and it's a native button", () => {
    render(() => (
      <Button.Root data-testid="button" isDisabled>
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("disabled");
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("should have correct 'disabled' attribute when disabled and it's an input", () => {
    render(() => (
      <Button.Root data-testid="button" as="input" isDisabled>
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("disabled");
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("should have correct 'disabled' attribute when disabled and it's not a native button nor input", () => {
    render(() => (
      <Button.Root data-testid="button" as="div" isDisabled>
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("disabled");
    expect(button).toHaveAttribute("aria-disabled");
  });

  it("should not have attribute 'data-active' and 'data-disabled'  by default", async () => {
    render(() => <Button.Root data-testid="button">Button</Button.Root>);

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("data-active");
    expect(button).not.toHaveAttribute("data-disabled");
  });

  it("should have attribute 'data-active' when pressed", async () => {
    render(() => <Button.Root data-testid="button">Button</Button.Root>);

    const button = screen.getByTestId("button");

    fireEvent(button, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
    await Promise.resolve();

    expect(button).toHaveAttribute("data-active");
  });

  it("should have attribute 'data-disabled' when disabled", () => {
    render(() => (
      <Button.Root data-testid="button" isDisabled>
        Button
      </Button.Root>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("data-disabled");
  });
});
