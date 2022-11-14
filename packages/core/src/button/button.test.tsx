import {
  checkAccessibility,
  itIsPolymorphic,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { render, screen } from "solid-testing-library";

import { Button, ButtonProps } from "./button";

const defaultProps: ButtonProps = {};

describe("Button", () => {
  checkAccessibility([<Button>Button</Button>]);
  itIsPolymorphic(Button as any, defaultProps);
  itRendersChildren(Button as any, defaultProps);
  itSupportsClass(Button as any, defaultProps);
  itSupportsRef(Button as any, defaultProps, HTMLButtonElement);
  itSupportsStyle(Button as any, defaultProps);

  it("should have attribute 'type=button' by default", () => {
    render(() => <Button data-testid="button">Button</Button>);

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("type", "button");
  });

  it("should not have attribute 'type=button' by default when it's not a 'button' tag", () => {
    render(() => (
      <Button data-testid="button" as="div">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("type", "button");
  });

  it("should keep attribute 'type' when provided", () => {
    render(() => (
      <Button data-testid="button" as="input" type="submit">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("type", "submit");
  });

  it("should not have attribute 'role=button' when it's a native button", () => {
    render(() => <Button data-testid="button">Button</Button>);

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("role", "button");
  });

  it("should not have attribute 'role=button' when it's an 'a' tag with 'href'", () => {
    render(() => (
      <Button data-testid="button" as="a" href="https://kobalte.dev">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("role", "button");
  });

  it("should have attribute 'role=button' when it's not a native button", () => {
    render(() => (
      <Button data-testid="button" as="div">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("role", "button");
  });

  it("should have attribute 'role=button' when it's an 'a' tag without 'href'", () => {
    render(() => (
      <Button data-testid="button" as="a">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("role", "button");
  });

  it("should have attribute 'tabindex=0' when it's not a native button", () => {
    render(() => (
      <Button data-testid="button" as="div">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex=0' when it's an 'a' tag with 'href'", () => {
    render(() => (
      <Button data-testid="button" as="a" href="https://kobalte.dev">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex=0' when it's disabled", () => {
    render(() => (
      <Button data-testid="button" as="div" disabled>
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("tabindex", "0");
  });

  it("should have correct 'disabled' attribute when disabled and it's a native button", () => {
    render(() => (
      <Button data-testid="button" disabled>
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("disabled");
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("should have correct 'disabled' attribute when disabled and it's an input", () => {
    render(() => (
      <Button data-testid="button" as="input" disabled>
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("disabled");
    expect(button).not.toHaveAttribute("aria-disabled");
  });

  it("should have correct 'disabled' attribute when disabled and it's not a native button nor input", () => {
    render(() => (
      <Button data-testid="button" as="div" disabled>
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("disabled");
    expect(button).toHaveAttribute("aria-disabled");
  });

  //TODO: add react-aria useButton tests adaptation
});
