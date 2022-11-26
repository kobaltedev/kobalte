/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/radio/test/Radio.test.js
 */

import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen } from "solid-testing-library";

import { Radio } from "./radio";
import { RadioGroup } from "./radio-group";

describe("RadioGroup", () => {
  installPointerEvent();

  it("handles defaults", async () => {
    const onChangeSpy = jest.fn();

    render(() => (
      <RadioGroup onValueChange={onChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });
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
      <RadioGroup defaultValue="cats" onValueChange={onChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });
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
      <RadioGroup value="cats" onValueChange={onChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
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
    expect(inputs[1].checked).toBeFalsy();

    // false because `value` is controlled
    expect(inputs[2].checked).toBeFalsy();
  });

  it("name can be controlled", () => {
    render(() => (
      <RadioGroup name="test-name">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(inputs[0]).toHaveAttribute("name", "test-name");
    expect(inputs[1]).toHaveAttribute("name", "test-name");
    expect(inputs[2]).toHaveAttribute("name", "test-name");
  });

  it("supports labeling", () => {
    render(() => (
      <RadioGroup>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    const labelId = radioGroup.getAttribute("aria-labelledby");

    expect(labelId).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const label = document.getElementById(labelId!);

    expect(label).toHaveTextContent("Favorite Pet");
  });

  it("supports 'aria-label'", () => {
    render(() => (
      <RadioGroup aria-label="My Favorite Pet">
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-label", "My Favorite Pet");
  });

  it("sets 'aria-orientation' by default", () => {
    render(() => (
      <RadioGroup>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets 'aria-orientation' based on the 'orientation' prop", () => {
    render(() => (
      <RadioGroup orientation="horizontal">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("sets 'aria-invalid' when 'validationState=invalid'", () => {
    render(() => (
      <RadioGroup validationState="invalid">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-invalid", "true");
  });

  it("passes through 'aria-errormessage'", () => {
    render(() => (
      <RadioGroup validationState="invalid" aria-errormessage="test">
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-invalid", "true");
    expect(radioGroup).toHaveAttribute("aria-errormessage", "test");
  });

  it("sets 'aria-required' when 'isRequired' is true", () => {
    render(() => (
      <RadioGroup isRequired>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).toHaveAttribute("aria-required", "true");

    const inputs = screen.getAllByRole("radio");

    for (const input of inputs) {
      expect(input).not.toHaveAttribute("aria-required");
    }
  });

  it("sets 'aria-disabled' and makes radios disabled when 'isDisabled' is true", async () => {
    const groupOnChangeSpy = jest.fn();

    render(() => (
      <RadioGroup isDisabled onValueChange={groupOnChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

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
      <RadioGroup onValueChange={groupOnChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats" isDisabled>
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
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
      <RadioGroup>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).not.toHaveAttribute("aria-disabled");

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(inputs[0]).not.toHaveAttribute("disabled");
    expect(inputs[1]).not.toHaveAttribute("disabled");
    expect(inputs[2]).not.toHaveAttribute("disabled");
  });

  it("doesn't set 'aria-disabled' or make radios disabled when 'isDisabled' is false", () => {
    render(() => (
      <RadioGroup isDisabled={false}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

    expect(radioGroup).not.toHaveAttribute("aria-disabled");

    const inputs = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(inputs[0]).not.toHaveAttribute("disabled");
    expect(inputs[1]).not.toHaveAttribute("disabled");
    expect(inputs[2]).not.toHaveAttribute("disabled");
  });

  it("sets 'aria-readonly=true' on radio group", async () => {
    const groupOnChangeSpy = jest.fn();
    render(() => (
      <RadioGroup isReadOnly onValueChange={groupOnChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
    ));

    const radioGroup = screen.getByRole("radiogroup", { exact: true });

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
      <RadioGroup isReadOnly onValueChange={groupOnChangeSpy}>
        <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
        <div>
          <Radio value="dogs">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dogs</Radio.Label>
          </Radio>
          <Radio value="cats">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <Radio value="dragons">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Dragons</Radio.Label>
          </Radio>
        </div>
      </RadioGroup>
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
        <RadioGroup>
          <Radio data-testid="radio" value="cats">
            <Radio.Input data-testid="input" />
            <Radio.Control data-testid="control" />
            <Radio.Label data-testid="label">Cats</Radio.Label>
          </Radio>
        </RadioGroup>
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
        <RadioGroup>
          <Radio data-testid="radio" value="cats" id="foo">
            <Radio.Input data-testid="input" />
            <Radio.Control data-testid="control" />
            <Radio.Label data-testid="label">Cats</Radio.Label>
          </Radio>
        </RadioGroup>
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
        <RadioGroup>
          <Radio data-testid="radio" value="cats" id="custom-radio-id">
            <Radio.Input data-testid="input" id="custom-input-id" />
            <Radio.Control data-testid="control" id="custom-control-id" />
            <Radio.Label data-testid="label" id="custom-label-id">
              Cats
            </Radio.Label>
          </Radio>
        </RadioGroup>
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
        <RadioGroup>
          <Radio value="cats" aria-label="Label">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
        </RadioGroup>
      ));

      const radio = screen.getByRole("radio");

      expect(radio).toHaveAttribute("aria-label", "Label");
    });

    it("supports 'aria-labelledby'", () => {
      render(() => (
        <RadioGroup>
          <Radio value="cats" aria-labelledby="foo">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
        </RadioGroup>
      ));

      const radio = screen.getByRole("radio");

      expect(radio).toHaveAttribute("aria-labelledby", "foo");
    });

    it("should combine 'aria-label' and 'aria-labelledby'", () => {
      render(() => (
        <RadioGroup>
          <Radio value="cats" aria-label="Label" aria-labelledby="foo">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
        </RadioGroup>
      ));

      const radio = screen.getByRole("radio");

      expect(radio).toHaveAttribute("aria-labelledby", `foo ${radio.id}`);
    });

    it("supports 'aria-describedby'", () => {
      render(() => (
        <RadioGroup>
          <Radio value="cats" aria-describedby="foo">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
        </RadioGroup>
      ));

      const radio = screen.getByRole("radio");

      expect(radio).toHaveAttribute("aria-describedby", "foo");
    });

    it("should combine 'aria-describedby' from both radio and radio group", () => {
      render(() => (
        <RadioGroup>
          <Radio value="cats" aria-describedby="foo">
            <Radio.Input />
            <Radio.Control />
            <Radio.Label>Cats</Radio.Label>
          </Radio>
          <RadioGroup.Description data-testid="description">Description</RadioGroup.Description>
        </RadioGroup>
      ));

      const radio = screen.getByRole("radio");
      const description = screen.getByTestId("description");

      expect(radio).toHaveAttribute("aria-describedby", `foo ${description.id}`);
    });

    describe("data-attributes", () => {
      it("should have 'data-valid' attribute on radio elments when radio group is valid", async () => {
        render(() => (
          <RadioGroup validationState="valid" value="cats">
            <Radio data-testid="radio-root" value="cats">
              <Radio.Input data-testid="radio-input" />
              <Radio.Control data-testid="radio-control">
                <Radio.Indicator data-testid="radio-indicator" />
              </Radio.Control>
              <Radio.Label data-testid="radio-label">Cats</Radio.Label>
            </Radio>
          </RadioGroup>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-valid");
        }
      });

      it("should have 'data-invalid' attribute on radios when radio group is invalid", async () => {
        render(() => (
          <RadioGroup validationState="invalid" value="cats">
            <Radio data-testid="radio-root" value="cats">
              <Radio.Input data-testid="radio-input" />
              <Radio.Control data-testid="radio-control">
                <Radio.Indicator data-testid="radio-indicator" />
              </Radio.Control>
              <Radio.Label data-testid="radio-label">Cats</Radio.Label>
            </Radio>
          </RadioGroup>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-invalid");
        }
      });

      it("should have 'data-checked' attribute on checked radio", async () => {
        render(() => (
          <RadioGroup value="cats">
            <Radio data-testid="radio-root" value="cats">
              <Radio.Input data-testid="radio-input" />
              <Radio.Control data-testid="radio-control">
                <Radio.Indicator data-testid="radio-indicator" />
              </Radio.Control>
              <Radio.Label data-testid="radio-label">Cats</Radio.Label>
            </Radio>
          </RadioGroup>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-checked");
        }
      });

      it("should have 'data-disabled' attribute on radios when radio group is disabled", async () => {
        render(() => (
          <RadioGroup isDisabled value="cats">
            <Radio data-testid="radio-root" value="cats">
              <Radio.Input data-testid="radio-input" />
              <Radio.Control data-testid="radio-control">
                <Radio.Indicator data-testid="radio-indicator" />
              </Radio.Control>
              <Radio.Label data-testid="radio-label">Cats</Radio.Label>
            </Radio>
          </RadioGroup>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-disabled");
        }
      });

      it("should have 'data-disabled' attribute on single disabled radio", async () => {
        render(() => (
          <RadioGroup value="cats">
            <Radio data-testid="radio-root" value="cats" isDisabled>
              <Radio.Input data-testid="radio-input" />
              <Radio.Control data-testid="radio-control">
                <Radio.Indicator data-testid="radio-indicator" />
              </Radio.Control>
              <Radio.Label data-testid="radio-label">Cats</Radio.Label>
            </Radio>
          </RadioGroup>
        ));

        const elements = screen.getAllByTestId(/^radio/);

        for (const el of elements) {
          expect(el).toHaveAttribute("data-disabled");
        }
      });

      it("should have 'data-hover' attribute on hovered radio", async () => {
        render(() => (
          <RadioGroup value="cats">
            <Radio data-testid="radio-root" value="cats">
              <Radio.Input data-testid="radio-input" />
              <Radio.Control data-testid="radio-control">
                <Radio.Indicator data-testid="radio-indicator" />
              </Radio.Control>
              <Radio.Label data-testid="radio-label">Cats</Radio.Label>
            </Radio>
          </RadioGroup>
        ));

        const radioRoot = screen.getByTestId("radio-root");
        const elements = screen.getAllByTestId(/^radio/);

        fireEvent(radioRoot, createPointerEvent("pointerenter", { pointerType: "mouse" }));
        await Promise.resolve();

        for (const el of elements) {
          expect(el).toHaveAttribute("data-hover");
        }

        fireEvent(radioRoot, createPointerEvent("pointerleave", { pointerType: "mouse" }));
        await Promise.resolve();

        for (const el of elements) {
          expect(el).not.toHaveAttribute("data-hover");
        }
      });

      it("should have 'data-focus' attribute on focused radio", async () => {
        render(() => (
          <RadioGroup value="cats">
            <Radio data-testid="radio-root" value="cats">
              <Radio.Input data-testid="radio-input" />
              <Radio.Control data-testid="radio-control">
                <Radio.Indicator data-testid="radio-indicator" />
              </Radio.Control>
              <Radio.Label data-testid="radio-label">Cats</Radio.Label>
            </Radio>
          </RadioGroup>
        ));

        const radioInput = screen.getByTestId("radio-input");
        const elements = screen.getAllByTestId(/^radio/);

        radioInput.focus();
        await Promise.resolve();

        for (const el of elements) {
          expect(el).toHaveAttribute("data-focus");
        }

        radioInput.blur();
        await Promise.resolve();

        for (const el of elements) {
          expect(el).not.toHaveAttribute("data-focus");
        }
      });
    });
  });
});
