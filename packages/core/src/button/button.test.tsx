import {
  checkAccessibility,
  itHasSemanticClass,
  itIsPolymorphic,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import { render, screen } from "solid-testing-library";

import { Button } from "./button";
import { ButtonProps } from "./types";

const defaultProps: ButtonProps = {};

describe("Button", () => {
  checkAccessibility([<Button>Button</Button>]);
  itIsPolymorphic(Button as any, defaultProps);
  itRendersChildren(Button as any, defaultProps);
  itSupportsClass(Button as any, defaultProps);
  itHasSemanticClass(Button as any, defaultProps, "kb-button");
  itSupportsRef(Button as any, defaultProps, HTMLButtonElement);
  itSupportsStyle(Button as any, defaultProps);

  it("should have attribute 'role=button' when it's not a native button nor an 'a' tag", () => {
    render(() => (
      <Button as="div" data-testid="button">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("role", "button");
  });

  it("should not have attribute 'role=button' when its a native button", () => {
    render(() => <Button data-testid="button">Button</Button>);

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("role");
  });

  it("should not have attribute 'role=button' when its an <a> tag", () => {
    render(() => (
      <Button as="a" data-testid="button">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("role");
  });

  it("should have attribute 'type' based on prop", () => {
    render(() => (
      <Button type="submit" data-testid="button">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button") as HTMLButtonElement;

    expect(button.type).toBe("submit");
  });

  it("should have attribute 'type=button' by default when its a native button", () => {
    render(() => <Button data-testid="button">Button</Button>);

    const button = screen.getByTestId("button") as HTMLButtonElement;

    expect(button.type).toBe("button");
  });

  it("should not have attribute 'type' by default when its not a native button", () => {
    render(() => (
      <Button as="div" data-testid="button">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    // @ts-ignore
    expect(button.type).toBeUndefined();
  });

  it("should have attribute 'tabindex=0' when its not a native button", () => {
    render(() => (
      <Button as="div" data-testid="button">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("tabindex", "0");
  });

  it("should not have attribute 'tabindex' when its a native button", () => {
    render(() => <Button data-testid="button">Button</Button>);

    const button = screen.getByTestId("button");

    expect(button).not.toHaveAttribute("tabindex");
  });

  it("should renders left and right icons if they are provided", () => {
    render(() => <Button rightIcon="right-icon" leftIcon="left-icon" />);

    expect(screen.getByText("right-icon")).toBeInTheDocument();
    expect(screen.getByText("left-icon")).toBeInTheDocument();
  });

  it("should sets attribute 'disabled' based on 'isDisabled' prop", () => {
    render(() => (
      <Button isDisabled data-testid="button">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toBeDisabled();
  });

  it("should sets attribute 'data-loading' based on 'isLoading' prop", () => {
    render(() => (
      <Button isLoading data-testid="button">
        Button
      </Button>
    ));

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("data-loading");
  });

  it("should show loader when 'isLoading' prop is true", () => {
    const { container } = render(() => (
      <Button isLoading data-testid="button">
        Button
      </Button>
    ));

    expect(container.querySelector(".hope-Button-loaderWrapper")).toBeInTheDocument();
  });

  it("should show loading text when 'isLoading' prop is true and a loading text is provided", () => {
    render(() => (
      <Button isLoading loadingText="Loading..." data-testid="button">
        Button
      </Button>
    ));

    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("should hide button text content when 'isLoading' prop is true", () => {
    render(() => (
      <Button isLoading data-testid="button">
        Button
      </Button>
    ));

    expect(screen.getByText("Button")).not.toBeVisible();
  });
});
