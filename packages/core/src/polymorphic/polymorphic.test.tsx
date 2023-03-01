import { fireEvent, render, screen } from "solid-testing-library";

import { As, Polymorphic } from "./polymorphic";

describe("Polymorphic", () => {
  describe("style", () => {
    it("should apply Polymorphic string 'style' on child", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style="background-color:red">
          <As component="button" type="button">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply Polymorphic string 'style' on child when child's 'style' is undefined", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style="background-color:red">
          <As component="button" type="button" style={undefined}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply child's string 'style' on child", () => {
      render(() => (
        <Polymorphic fallbackComponent="div">
          <As component="button" type="button" style="background-color:red">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply child's string 'style' on child when Polymorphic 'style' is undefined", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style={undefined}>
          <As component="button" type="button" style="background-color:red">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply both Polymorphic and child's string 'style' on child", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style="background-color:red">
          <As component="button" type="button" style="color:white">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red;color:white");
    });

    it("support overriding same style attribute by child when using string 'sytle'", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style="background-color:red">
          <As component="button" type="button" style="background-color:blue">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:blue");
    });

    it("should apply Polymorphic object 'style' on child", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style={{ "background-color": "red" }}>
          <As component="button" type="button">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply Polymorphic object 'style' on child when child's style is undefined", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style={{ "background-color": "red" }}>
          <As component="button" type="button" style={undefined}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply child's object 'style' on child", () => {
      render(() => (
        <Polymorphic fallbackComponent="div">
          <As component="button" type="button" style={{ "background-color": "red" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply child's object 'style' on child when Polymorphic 'style' is undefined", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style={undefined}>
          <As component="button" type="button" style={{ "background-color": "red" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red");
    });

    it("should apply both Polymorphic and child's object 'style' on child", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style={{ "background-color": "red" }}>
          <As component="button" type="button" style={{ color: "white" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:red;color:white");
    });

    it("support overriding same style attribute by child when using object 'sytle'", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style={{ "background-color": "red" }}>
          <As component="button" type="button" style={{ "background-color": "blue" }}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveStyle("background-color:blue");
    });

    it("support mixing object and string 'style'", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" style="background-color:red;padding:14px">
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
        <Polymorphic fallbackComponent="div" class="foo">
          <As component="button" type="button">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveClass("foo");
    });

    it("should apply Polymorphic 'class' on child when child's 'class' is undefined", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" class="foo">
          <As component="button" type="button" class={undefined}>
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveClass("foo");
    });

    it("should apply child's 'class' on child", () => {
      render(() => (
        <Polymorphic fallbackComponent="div">
          <As component="button" type="button" class="foo">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveClass("foo");
    });

    it("should apply child's 'class' on child when Polymorphic 'class' is undefined", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" class={undefined}>
          <As component="button" type="button" class="foo">
            Click me
          </As>
        </Polymorphic>
      ));

      expect(screen.getByRole("button")).toHaveClass("foo");
    });

    it("should apply both Polymorphic and child's 'class' on child", () => {
      render(() => (
        <Polymorphic fallbackComponent="div" class="foo">
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
        <Polymorphic fallbackComponent="div" onClick={onPolymorphicClickSpy}>
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
        <Polymorphic fallbackComponent="div">
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
        <Polymorphic fallbackComponent="div" onClick={onPolymorphicClickSpy}>
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
        <Polymorphic fallbackComponent="div" onClick={onPolymorphicClickSpy}>
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
        <Polymorphic fallbackComponent="div" onClick={undefined}>
          <As component="button" type="button" onClick={onChildClickSpy}>
            Click me
          </As>
        </Polymorphic>
      ));

      fireEvent.click(screen.getByRole("button"));

      expect(onChildClickSpy).toBeCalledTimes(1);
    });
  });
});
