/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/b14ac1fff0cdaf45d1ea3e65c28c320ac0f743f2/packages/react/slot/src/Slot.test.tsx
 */

import { ComponentProps, JSX, splitProps } from "solid-js";
import { fireEvent, render, screen } from "@solidjs/testing-library";

import { As, AsChildProp, Polymorphic } from "./polymorphic";

type ButtonExampleProps = ComponentProps<"button"> & {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
};

function ButtonExample(props: ButtonExampleProps & AsChildProp) {
  const [local, others] = splitProps(props, ["leftIcon", "rightIcon", "children"]);

  return (
    <Polymorphic as="button" {...others}>
      {local.leftIcon}
      {local.children}
      {local.rightIcon}
    </Polymorphic>
  );
}

describe("Polymorphic", () => {
  describe("render", () => {
    it("should render the fallback if no 'asChild' prop", () => {
      render(() => (
        <Polymorphic data-testid="polymorphic" as="button">
          Button
        </Polymorphic>
      ));

      const polymorphic = screen.getByTestId("polymorphic");

      expect(polymorphic).toBeInstanceOf(HTMLButtonElement);
    });

    it("should render the component from 'As' when 'asChild' prop is true and the only direct child is 'As'", () => {
      render(() => (
        <Polymorphic data-testid="polymorphic" as="button" asChild>
          <As component="a">Link</As>
        </Polymorphic>
      ));

      const polymorphic = screen.getByTestId("polymorphic");

      expect(polymorphic).toBeInstanceOf(HTMLAnchorElement);
    });

    it("should render the component from 'As' when 'asChild' prop is true and one of the direct children is 'As'", () => {
      render(() => (
        <Polymorphic data-testid="polymorphic" as="button" asChild>
          <span>before</span>
          <As component="a">Link</As>
          <span>after</span>
        </Polymorphic>
      ));

      const polymorphic = screen.getByTestId("polymorphic");

      expect(polymorphic).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe("style", () => {
    it("should apply Polymorphic string 'style' on child", () => {
      render(() => (
        <Polymorphic as="div" style={{ "background-color": "red" }} asChild>
          <As component="button" type="button">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply Polymorphic string 'style' on child when child's 'style' is undefined", () => {
      render(() => (
        <Polymorphic as="div" style={{ "background-color": "red" }} asChild>
          <As component="button" type="button" style={undefined}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply child's string 'style' on child", () => {
      render(() => (
        <Polymorphic as="div" asChild>
          <As component="button" type="button" style={{ "background-color": "red" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply child's string 'style' on child when Polymorphic 'style' is undefined", () => {
      render(() => (
        <Polymorphic as="div" style={undefined} asChild>
          <As component="button" type="button" style={{ "background-color": "red" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply both Polymorphic and child's string 'style' on child", () => {
      render(() => (
        <Polymorphic as="div" style={{ "background-color": "red" }} asChild>
          <As component="button" type="button" style={{ color: "white" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red;color:white");
    });

    it("support overriding same style attribute by child when using string 'sytle'", () => {
      render(() => (
        <Polymorphic as="div" style={{ "background-color": "red" }} asChild>
          <As component="button" type="button" style={{ "background-color": "blue" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:blue");
    });

    it("should apply Polymorphic object 'style' on child", () => {
      render(() => (
        <Polymorphic as="div" style={{ "background-color": "red" }} asChild>
          <As component="button" type="button">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply Polymorphic object 'style' on child when child's style is undefined", () => {
      render(() => (
        <Polymorphic as="div" style={{ "background-color": "red" }} asChild>
          <As component="button" type="button" style={undefined}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply child's object 'style' on child", () => {
      render(() => (
        <Polymorphic as="div" asChild>
          <As component="button" type="button" style={{ "background-color": "red" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply child's object 'style' on child when Polymorphic 'style' is undefined", () => {
      render(() => (
        <Polymorphic as="div" style={undefined} asChild>
          <As component="button" type="button" style={{ "background-color": "red" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply both Polymorphic and child's object 'style' on child", () => {
      render(() => (
        <Polymorphic as="div" style={{ "background-color": "red" }} asChild>
          <As component="button" type="button" style={{ color: "white" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red;color:white");
    });

    it("support overriding same style attribute by child when using object 'sytle'", () => {
      render(() => (
        <Polymorphic as="div" style={{ "background-color": "red" }} asChild>
          <As component="button" type="button" style={{ "background-color": "blue" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:blue");
    });

    it("support mixing object and string 'style'", () => {
      render(() => (
        <Polymorphic as="div" style={{ "background-color": "red", padding: "14px" }} asChild>
          <As
            component="button"
            type="button"
            style={{ "background-color": "blue", "font-size": "18px" }}
          >
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle(
        "background-color:blue;padding:14px;font-size:18px"
      );
    });
  });

  describe("class", () => {
    it("should apply Polymorphic 'class' on child", () => {
      render(() => (
        <Polymorphic as="div" class="foo" asChild>
          <As component="button" type="button">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveClass("foo");
    });

    it("should apply Polymorphic 'class' on child when child's 'class' is undefined", () => {
      render(() => (
        <Polymorphic as="div" class="foo" asChild>
          <As component="button" type="button" class={undefined}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveClass("foo");
    });

    it("should apply child's 'class' on child", () => {
      render(() => (
        <Polymorphic as="div" asChild>
          <As component="button" type="button" class="foo">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveClass("foo");
    });

    it("should apply child's 'class' on child when Polymorphic 'class' is undefined", () => {
      render(() => (
        <Polymorphic as="div" class={undefined} asChild>
          <As component="button" type="button" class="foo">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveClass("foo");
    });

    it("should apply both Polymorphic and child's 'class' on child", () => {
      render(() => (
        <Polymorphic as="div" class="foo" asChild>
          <As component="button" type="button" class="bar">
            Click me
          </As>
        </Polymorphic>
      ));

      const button = screen.getByRole("button");

      expect(button).toHaveClass("foo");
      expect(button).toHaveClass("bar");
    });
  });

  describe("handlers", () => {
    it("should call the 'onClick' passed to the Polymorphic", () => {
      const onPolymorphicClickSpy = jest.fn();

      render(() => (
        <Polymorphic as="div" onClick={onPolymorphicClickSpy} asChild>
          <As component="button" type="button">
            Click me
          </As>
        </Polymorphic>
      ));

      fireEvent.click(screen.getByRole("button"));

      expect(onPolymorphicClickSpy).toBeCalledTimes(1);
    });

    it("should call the child's 'onClick'", () => {
      const onChildClickSpy = jest.fn();

      render(() => (
        <Polymorphic as="div" asChild>
          <As component="button" type="button" onClick={onChildClickSpy}>
            Click me
          </As>
        </Polymorphic>
      ));

      fireEvent.click(screen.getByRole("button"));

      expect(onChildClickSpy).toBeCalledTimes(1);
    });

    it("should call both the Polymorphic and child's 'onClick' when provided", () => {
      const onPolymorphicClickSpy = jest.fn();
      const onChildClickSpy = jest.fn();

      render(() => (
        <Polymorphic as="div" onClick={onPolymorphicClickSpy} asChild>
          <As component="button" type="button" onClick={onChildClickSpy}>
            Click me
          </As>
        </Polymorphic>
      ));

      fireEvent.click(screen.getByRole("button"));

      expect(onChildClickSpy).toBeCalledTimes(1);
      expect(onPolymorphicClickSpy).toBeCalledTimes(1);
    });

    it("should call the Polymorphic 'onClick' even if child's 'onClick' is undefined", () => {
      const onPolymorphicClickSpy = jest.fn();

      render(() => (
        <Polymorphic as="div" onClick={onPolymorphicClickSpy} asChild>
          <As component="button" type="button" onClick={undefined}>
            Click me
          </As>
        </Polymorphic>
      ));

      fireEvent.click(screen.getByRole("button"));

      expect(onPolymorphicClickSpy).toBeCalledTimes(1);
    });

    it("should call the child's 'onClick' even if Polymorphic 'onClick' is undefined", () => {
      const onChildClickSpy = jest.fn();

      render(() => (
        <Polymorphic as="div" onClick={undefined} asChild>
          <As component="button" type="button" onClick={onChildClickSpy}>
            Click me
          </As>
        </Polymorphic>
      ));

      fireEvent.click(screen.getByRole("button"));

      expect(onChildClickSpy).toBeCalledTimes(1);
    });
  });

  describe("With slottable content", () => {
    it("should render a button with icon on the left/right when no 'asChild' prop", () => {
      render(() => (
        <ButtonExample leftIcon={<span>left</span>} rightIcon={<span>right</span>}>
          Button <em>text</em>
        </ButtonExample>
      ));

      const button = screen.getByRole("button");

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button).toContainHTML("<span>left</span>Button <em>text</em><span>right</span>");
    });

    it("should render a link with icon on the left/right when 'asChild' prop is true and content is 'As'", () => {
      render(() => (
        <ButtonExample leftIcon={<span>left</span>} rightIcon={<span>right</span>} asChild>
          <As component="a" href="https://kobalte.dev">
            Button <em>text</em>
          </As>
        </ButtonExample>
      ));

      const link = screen.getByRole("link");

      expect(link).toBeInstanceOf(HTMLAnchorElement);
      expect(link).toHaveAttribute("href", "https://kobalte.dev");
      expect(link).toContainHTML("<span>left</span>Button <em>text</em><span>right</span>");
    });
  });
});
