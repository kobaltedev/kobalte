/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/radio/test/Radio.test.js
 */

import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen } from "@solidjs/testing-library";

import * as RadioGroup from ".";

describe("RadioGroup", () => {
  installPointerEvent();

  it("handles defaults", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <RadioGroup.Root onChange={onChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radioGroup).toBeInTheDocument();
    expect(inputs.length).toBe(3);

    const groupName = inputs[0].getAttribute("name");
    expect(inputs[0]).toHaveAttribute("name", groupName);
    expect(inputs[1]).toHaveAttribute("name", groupName);
    expect(inputs[2]).toHaveAttribute("name", groupName);

    expect(inputs[0].value).toBe("dogs");
    expect(inputs[1].value).toBe("cats");
    expect(inputs[2].value).toBe("dragons");

    expect(inputs[0].checked).toBeFalsy();
    expect(inputs[1].checked).toBeFalsy();
    expect(inputs[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith("dragons");

    expect(inputs[0].checked).toBeFalsy();
    expect(inputs[1].checked).toBeFalsy();
    expect(inputs[2].checked).toBeTruthy();
  });

  it("can have a default value", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <RadioGroup.Root defaultValue="cats" onChange={onChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radioGroup).toBeTruthy();
    expect(inputs.length).toBe(3);
    expect(onChangeSpy).not.toHaveBeenCalled();

    expect(inputs[0].checked).toBeFalsy();
    expect(inputs[1].checked).toBeTruthy();
    expect(inputs[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith("dragons");

    expect(inputs[0].checked).toBeFalsy();
    expect(inputs[1].checked).toBeFalsy();
    expect(inputs[2].checked).toBeTruthy();
  });

  it("value can be controlled", async () => {
    const onChangeSpy = jest.fn();
    render(() => (
      <RadioGroup.Root value="cats" onChange={onChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(inputs[0].checked).toBeFalsy();
    expect(inputs[1].checked).toBeTruthy();
    expect(inputs[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith("dragons");

    expect(inputs[0].checked).toBeFalsy();
    expect(inputs[1].checked).toBeTruthy();

    // false because `value` is controlled.
    expect(inputs[2].checked).toBeFalsy();
  });

  it("name can be controlled", () => {
    render(() => (
      <RadioGroup.Root name="test-name">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(inputs[0]).toHaveAttribute("name", "test-name");
    expect(inputs[1]).toHaveAttribute("name", "test-name");
    expect(inputs[2]).toHaveAttribute("name", "test-name");
  });

  it("supports visible label", () => {
    render(() => (
      <RadioGroup.Root>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const label = screen.getByText("Favorite Pet");

    expect(radioGroup).toHaveAttribute("aria-labelledby", label.id);
    expect(label).toBeInstanceOf(HTMLSpanElement);
    expect(label).not.toHaveAttribute("for");
  });

  it("supports 'aria-labelledby'", () => {
    render(() => (
      <RadioGroup.Root aria-labelledby="foo">
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("aria-labelledby", "foo");
  });

  it("should combine 'aria-labelledby' if visible label is also provided", () => {
    render(() => (
      <RadioGroup.Root aria-labelledby="foo">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const label = screen.getByText("Favorite Pet");

    expect(radioGroup).toHaveAttribute("aria-labelledby", `foo ${label.id}`);
  });

  it("supports 'aria-label'", () => {
    render(() => (
      <RadioGroup.Root aria-label="My Favorite Pet">
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("aria-label", "My Favorite Pet");
  });

  it("should combine 'aria-labelledby' if visible label and 'aria-label' is also provided", () => {
    render(() => (
      <RadioGroup.Root aria-label="bar" aria-labelledby="foo">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const label = screen.getByText("Favorite Pet");

    expect(radioGroup).toHaveAttribute("aria-labelledby", `foo ${label.id} ${radioGroup.id}`);
  });

  it("supports visible description", () => {
    render(() => (
      <RadioGroup.Root>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
        <RadioGroup.Description>Description</RadioGroup.Description>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const description = screen.getByText("Description");

    expect(description.id).toBeDefined();
    expect(radioGroup.id).toBeDefined();
    expect(radioGroup).toHaveAttribute("aria-describedby", description.id);

    // check that generated ids are unique
    expect(description.id).not.toBe(radioGroup.id);
  });

  it("supports 'aria-describedby'", () => {
    render(() => (
      <RadioGroup.Root aria-describedby="foo">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("aria-describedby", "foo");
  });

  it("should combine 'aria-describedby' if visible description", () => {
    render(() => (
      <RadioGroup.Root aria-describedby="foo">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
        <RadioGroup.Description>Description</RadioGroup.Description>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const description = screen.getByText("Description");

    expect(radioGroup).toHaveAttribute("aria-describedby", `${description.id} foo`);
  });

  it("supports visible error message when invalid", () => {
    render(() => (
      <RadioGroup.Root validationState="invalid">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
        <RadioGroup.ErrorMessage>ErrorMessage</RadioGroup.ErrorMessage>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const errorMessage = screen.getByText("ErrorMessage");

    expect(errorMessage.id).toBeDefined();
    expect(radioGroup.id).toBeDefined();
    expect(radioGroup).toHaveAttribute("aria-describedby", errorMessage.id);

    // check that generated ids are unique
    expect(errorMessage.id).not.toBe(radioGroup.id);
  });

  it("should not be described by error message when not invalid", () => {
    render(() => (
      <RadioGroup.Root>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
        <RadioGroup.ErrorMessage>ErrorMessage</RadioGroup.ErrorMessage>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).not.toHaveAttribute("aria-describedby");
  });

  it("should combine 'aria-describedby' if visible error message when invalid", () => {
    render(() => (
      <RadioGroup.Root validationState="invalid" aria-describedby="foo">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
        <RadioGroup.ErrorMessage>ErrorMessage</RadioGroup.ErrorMessage>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const errorMessage = screen.getByText("ErrorMessage");

    expect(radioGroup).toHaveAttribute("aria-describedby", `${errorMessage.id} foo`);
  });

  it("should combine 'aria-describedby' if visible description and error message when invalid", () => {
    render(() => (
      <RadioGroup.Root validationState="invalid" aria-describedby="foo">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
        <RadioGroup.Description>Description</RadioGroup.Description>
        <RadioGroup.ErrorMessage>ErrorMessage</RadioGroup.ErrorMessage>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");
    const description = screen.getByText("Description");
    const errorMessage = screen.getByText("ErrorMessage");

    expect(radioGroup).toHaveAttribute(
      "aria-describedby",
      `${description.id} ${errorMessage.id} foo`
    );
  });

  it("should not have form control 'data-*' attributes by default", async () => {
    render(() => (
      <RadioGroup.Root>
        <RadioGroup.Item value="cats">
          <RadioGroup.ItemInput />
        </RadioGroup.Item>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).not.toHaveAttribute("data-valid");
    expect(radioGroup).not.toHaveAttribute("data-invalid");
    expect(radioGroup).not.toHaveAttribute("data-required");
    expect(radioGroup).not.toHaveAttribute("data-disabled");
    expect(radioGroup).not.toHaveAttribute("data-readonly");
  });

  it("should have 'data-valid' attribute when valid", async () => {
    render(() => (
      <RadioGroup.Root validationState="valid">
        <RadioGroup.Item value="cats">
          <RadioGroup.ItemInput />
        </RadioGroup.Item>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("data-valid");
  });

  it("should have 'data-invalid' attribute when invalid", async () => {
    render(() => (
      <RadioGroup.Root validationState="invalid">
        <RadioGroup.Item value="cats">
          <RadioGroup.ItemInput />
        </RadioGroup.Item>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("data-invalid");
  });

  it("should have 'data-required' attribute when required", async () => {
    render(() => (
      <RadioGroup.Root required>
        <RadioGroup.Item value="cats">
          <RadioGroup.ItemInput />
        </RadioGroup.Item>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("data-required");
  });

  it("should have 'data-disabled' attribute when disabled", async () => {
    render(() => (
      <RadioGroup.Root disabled>
        <RadioGroup.Item value="cats">
          <RadioGroup.ItemInput />
        </RadioGroup.Item>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("data-disabled");
  });

  it("should have 'data-readonly' attribute when readonly", async () => {
    render(() => (
      <RadioGroup.Root readOnly>
        <RadioGroup.Item value="cats">
          <RadioGroup.ItemInput />
        </RadioGroup.Item>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("data-readonly");
  });

  it("sets 'aria-orientation' by default", () => {
    render(() => (
      <RadioGroup.Root>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets 'aria-orientation' based on the 'orientation' prop", () => {
    render(() => (
      <RadioGroup.Root orientation="horizontal">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("sets 'aria-invalid' when 'validationState=invalid'", () => {
    render(() => (
      <RadioGroup.Root validationState="invalid">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("aria-invalid", "true");
  });

  it("passes through 'aria-errormessage'", () => {
    render(() => (
      <RadioGroup.Root validationState="invalid" aria-errormessage="test">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("aria-invalid", "true");
    expect(radioGroup).toHaveAttribute("aria-errormessage", "test");
  });

  it("sets 'aria-required' when 'isRequired' is true", () => {
    render(() => (
      <RadioGroup.Root required>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("aria-required", "true");

    const inputs = screen.getAllByRole("radio");

    for (const input of inputs) {
      expect(input).not.toHaveAttribute("aria-required");
    }
  });

  it("sets 'aria-disabled' and makes radios disabled when 'isDisabled' is true", async () => {
    const groupOnChangeSpy = jest.fn();

    render(() => (
      <RadioGroup.Root disabled onChange={groupOnChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).toHaveAttribute("aria-disabled", "true");

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(inputs[0]).toHaveAttribute("disabled");
    expect(inputs[1]).toHaveAttribute("disabled");
    expect(inputs[2]).toHaveAttribute("disabled");

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(inputs[2].checked).toBeFalsy();
  });

  it("can have a single disabled radio", async () => {
    const groupOnChangeSpy = jest.fn();

    render(() => (
      <RadioGroup.Root onChange={groupOnChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats" disabled>
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(inputs[0]).not.toHaveAttribute("disabled");
    expect(inputs[1]).toHaveAttribute("disabled");
    expect(inputs[2]).not.toHaveAttribute("disabled");

    // have to click label or it won't work
    const dogsLabel = screen.getByLabelText("Dogs").parentElement as HTMLLabelElement;
    const catsLabel = screen.getByLabelText("Cats").parentElement as HTMLLabelElement;

    fireEvent.click(catsLabel);
    await Promise.resolve();

    expect(inputs[1].checked).toBeFalsy();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(inputs[0].checked).toBeFalsy();
    expect(inputs[1].checked).toBeFalsy();
    expect(inputs[2].checked).toBeFalsy();

    fireEvent.click(dogsLabel);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(1);
    expect(groupOnChangeSpy).toHaveBeenCalledWith("dogs");
    expect(inputs[0].checked).toBeTruthy();
    expect(inputs[1].checked).toBeFalsy();
    expect(inputs[2].checked).toBeFalsy();
  });

  it("doesn't set 'aria-disabled' or make radios disabled by default", () => {
    render(() => (
      <RadioGroup.Root>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).not.toHaveAttribute("aria-disabled");

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(inputs[0]).not.toHaveAttribute("disabled");
    expect(inputs[1]).not.toHaveAttribute("disabled");
    expect(inputs[2]).not.toHaveAttribute("disabled");
  });

  it("doesn't set 'aria-disabled' or make radios disabled when 'isDisabled' is false", () => {
    render(() => (
      <RadioGroup.Root disabled={false}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    expect(radioGroup).not.toHaveAttribute("aria-disabled");

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(inputs[0]).not.toHaveAttribute("disabled");
    expect(inputs[1]).not.toHaveAttribute("disabled");
    expect(inputs[2]).not.toHaveAttribute("disabled");
  });

  it("sets 'aria-readonly=true' on radio group", async () => {
    const groupOnChangeSpy = jest.fn();
    render(() => (
      <RadioGroup.Root readOnly onChange={groupOnChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const radioGroup = screen.getByRole("radiogroup");

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radioGroup).toHaveAttribute("aria-readonly", "true");
    expect(inputs[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(inputs[2].checked).toBeFalsy();
  });

  it("should not update state for readonly radio group", async () => {
    const groupOnChangeSpy = jest.fn();

    render(() => (
      <RadioGroup.Root readOnly onChange={groupOnChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <RadioGroup.Item value="dogs">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dogs</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="dragons">
            <RadioGroup.ItemInput />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Dragons</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </div>
      </RadioGroup.Root>
    ));

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];
    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(inputs[2].checked).toBeFalsy();
  });

  describe("Radio", () => {
    it("should generate default ids", () => {
      render(() => (
        <RadioGroup.Root>
          <RadioGroup.Item data-testid="radio" value="cats">
            <RadioGroup.ItemInput data-testid="input" />
            <RadioGroup.ItemControl data-testid="control" />
            <RadioGroup.ItemLabel data-testid="label">Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      ));

      const radio = screen.getByTestId("radio");
      const input = screen.getByTestId("input");
      const control = screen.getByTestId("control");
      const label = screen.getByTestId("label");

      expect(radio.id).toBeDefined();
      expect(input.id).toBe(`${radio.id}-input`);
      expect(control.id).toBe(`${radio.id}-control`);
      expect(label.id).toBe(`${radio.id}-label`);
    });

    it("should generate ids based on radio id", () => {
      render(() => (
        <RadioGroup.Root>
          <RadioGroup.Item data-testid="radio" value="cats" id="foo">
            <RadioGroup.ItemInput data-testid="input" />
            <RadioGroup.ItemControl data-testid="control" />
            <RadioGroup.ItemLabel data-testid="label">Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      ));

      const radio = screen.getByTestId("radio");
      const input = screen.getByTestId("input");
      const control = screen.getByTestId("control");
      const label = screen.getByTestId("label");

      expect(radio.id).toBe("foo");
      expect(input.id).toBe("foo-input");
      expect(control.id).toBe("foo-control");
      expect(label.id).toBe("foo-label");
    });

    it("supports custom ids", () => {
      render(() => (
        <RadioGroup.Root>
          <RadioGroup.Item data-testid="radio" value="cats" id="custom-radio-id">
            <RadioGroup.ItemInput data-testid="input" id="custom-input-id" />
            <RadioGroup.ItemControl data-testid="control" id="custom-control-id" />
            <RadioGroup.ItemLabel data-testid="label" id="custom-label-id">
              Cats
            </RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      ));

      const radio = screen.getByTestId("radio");
      const input = screen.getByTestId("input");
      const control = screen.getByTestId("control");
      const label = screen.getByTestId("label");

      expect(radio.id).toBe("custom-radio-id");
      expect(input.id).toBe("custom-input-id");
      expect(control.id).toBe("custom-control-id");
      expect(label.id).toBe("custom-label-id");
    });

    it("supports 'aria-label'", () => {
      render(() => (
        <RadioGroup.Root>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput aria-label="Label" />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      ));

      const radio = screen.getByRole("radio");

      expect(radio).toHaveAttribute("aria-label", "Label");
    });

    it("supports 'aria-labelledby'", () => {
      render(() => (
        <RadioGroup.Root>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput aria-labelledby="foo" />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      ));

      const radio = screen.getByRole("radio");

      expect(radio).toHaveAttribute("aria-labelledby", "foo");
    });

    it("should combine 'aria-label' and 'aria-labelledby'", () => {
      render(() => (
        <RadioGroup.Root>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput aria-label="Label" aria-labelledby="foo" />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      ));

      const radio = screen.getByRole("radio");

      expect(radio).toHaveAttribute("aria-labelledby", `foo ${radio.id}`);
    });

    it("supports 'aria-describedby'", () => {
      render(() => (
        <RadioGroup.Root>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput aria-describedby="foo" />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      ));

      const radio = screen.getByRole("radio");

      expect(radio).toHaveAttribute("aria-describedby", "foo");
    });

    it("should combine 'aria-describedby' from both radio and radio group", () => {
      render(() => (
        <RadioGroup.Root>
          <RadioGroup.Item value="cats">
            <RadioGroup.ItemInput aria-describedby="foo" />
            <RadioGroup.ItemControl />
            <RadioGroup.ItemLabel>Cats</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Description data-testid="description">Description</RadioGroup.Description>
        </RadioGroup.Root>
      ));

      const radio = screen.getByRole("radio");
      const description = screen.getByTestId("description");

      expect(radio).toHaveAttribute("aria-describedby", `foo ${description.id}`);
    });

    describe("indicator", () => {
      it("should not display indicator by default", async () => {
        render(() => (
          <RadioGroup.Root>
            <RadioGroup.Item value="cats">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl>
                <RadioGroup.ItemIndicator data-testid="indicator" />
              </RadioGroup.ItemControl>
            </RadioGroup.Item>
          </RadioGroup.Root>
        ));

        expect(screen.queryByTestId("indicator")).toBeNull();
      });

      it("should display indicator when 'selected'", async () => {
        render(() => (
          <RadioGroup.Root>
            <RadioGroup.Item value="cats">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl>
                <RadioGroup.ItemIndicator data-testid="indicator" />
              </RadioGroup.ItemControl>
            </RadioGroup.Item>
          </RadioGroup.Root>
        ));

        const input = screen.getByRole("radio") as HTMLInputElement;

        expect(input.checked).toBeFalsy();
        expect(screen.queryByTestId("indicator")).toBeNull();

        fireEvent.click(input);
        await Promise.resolve();

        expect(input.checked).toBeTruthy();
        expect(screen.getByTestId("indicator")).toBeInTheDocument();
      });

      it("should display indicator when 'forceMount'", async () => {
        render(() => (
          <RadioGroup.Root>
            <RadioGroup.Item value="cats">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl>
                <RadioGroup.ItemIndicator data-testid="indicator" forceMount />
              </RadioGroup.ItemControl>
            </RadioGroup.Item>
          </RadioGroup.Root>
        ));

        expect(screen.getByTestId("indicator")).toBeInTheDocument();
      });
    });

    describe("data-attributes", () => {
      it("should have 'data-valid' attribute on radio elements when radio group is valid", async () => {
        render(() => (
          <RadioGroup.Root validationState="valid" value="cats">
            <RadioGroup.Item data-testid="radio-root" value="cats">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl data-testid="radio-control">
                <RadioGroup.ItemIndicator data-testid="radio-indicator" />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel data-testid="radio-label">Cats</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          </RadioGroup.Root>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-valid");
        }
      });

      it("should have 'data-invalid' attribute on radios when radio group is invalid", async () => {
        render(() => (
          <RadioGroup.Root validationState="invalid" value="cats">
            <RadioGroup.Item data-testid="radio-root" value="cats">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl data-testid="radio-control">
                <RadioGroup.ItemIndicator data-testid="radio-indicator" />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel data-testid="radio-label">Cats</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          </RadioGroup.Root>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-invalid");
        }
      });

      it("should have 'data-checked' attribute on checked radio", async () => {
        render(() => (
          <RadioGroup.Root value="cats">
            <RadioGroup.Item data-testid="radio-root" value="cats">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl data-testid="radio-control">
                <RadioGroup.ItemIndicator data-testid="radio-indicator" />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel data-testid="radio-label">Cats</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          </RadioGroup.Root>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-checked");
        }
      });

      it("should have 'data-disabled' attribute on radios when radio group is disabled", async () => {
        render(() => (
          <RadioGroup.Root disabled value="cats">
            <RadioGroup.Item data-testid="radio-root" value="cats">
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl data-testid="radio-control">
                <RadioGroup.ItemIndicator data-testid="radio-indicator" />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel data-testid="radio-label">Cats</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          </RadioGroup.Root>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-disabled");
        }
      });

      it("should have 'data-disabled' attribute on single disabled radio", async () => {
        render(() => (
          <RadioGroup.Root value="cats">
            <RadioGroup.Item data-testid="radio-root" value="cats" disabled>
              <RadioGroup.ItemInput />
              <RadioGroup.ItemControl data-testid="radio-control">
                <RadioGroup.ItemIndicator data-testid="radio-indicator" />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel data-testid="radio-label">Cats</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          </RadioGroup.Root>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-disabled");
        }
      });
    });
  });
});
