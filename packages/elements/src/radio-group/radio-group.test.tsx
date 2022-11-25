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
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radioGroup).toBeInTheDocument();
    expect(radios.length).toBe(3);

    const groupName = radios[0].getAttribute("name");
    expect(radios[0]).toHaveAttribute("name", groupName);
    expect(radios[1]).toHaveAttribute("name", groupName);
    expect(radios[2]).toHaveAttribute("name", groupName);

    expect(radios[0].value).toBe("dogs");
    expect(radios[1].value).toBe("cats");
    expect(radios[2].value).toBe("dragons");

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith("dragons");

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeTruthy();
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
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radioGroup).toBeTruthy();
    expect(radios.length).toBe(3);
    expect(onChangeSpy).not.toHaveBeenCalled();

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeTruthy();
    expect(radios[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith("dragons");

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeTruthy();
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

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeTruthy();
    expect(radios[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith("dragons");

    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();

    // false because `value` is controlled
    expect(radios[2].checked).toBeFalsy();
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

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).toHaveAttribute("name", "test-name");
    expect(radios[1]).toHaveAttribute("name", "test-name");
    expect(radios[2]).toHaveAttribute("name", "test-name");
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

  it("passes through (aria-errormessage'", () => {
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

    const radios = screen.getAllByRole("radio");

    for (const radio of radios) {
      expect(radio).not.toHaveAttribute("aria-required");
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

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).toHaveAttribute("disabled");
    expect(radios[1]).toHaveAttribute("disabled");
    expect(radios[2]).toHaveAttribute("disabled");

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(radios[2].checked).toBeFalsy();
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

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).not.toHaveAttribute("disabled");
    expect(radios[1]).toHaveAttribute("disabled");
    expect(radios[2]).not.toHaveAttribute("disabled");

    // have to click label or it won't work
    const dogsLabel = screen.getByLabelText("Dogs").parentElement as HTMLLabelElement;
    const catsLabel = screen.getByLabelText("Cats").parentElement as HTMLLabelElement;

    fireEvent.click(catsLabel);
    await Promise.resolve();

    expect(radios[1].checked).toBeFalsy();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(radios[0].checked).toBeFalsy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeFalsy();

    fireEvent.click(dogsLabel);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(1);
    expect(groupOnChangeSpy).toHaveBeenCalledWith("dogs");
    expect(radios[0].checked).toBeTruthy();
    expect(radios[1].checked).toBeFalsy();
    expect(radios[2].checked).toBeFalsy();
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

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).not.toHaveAttribute("disabled");
    expect(radios[1]).not.toHaveAttribute("disabled");
    expect(radios[2]).not.toHaveAttribute("disabled");
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

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radios[0]).not.toHaveAttribute("disabled");
    expect(radios[1]).not.toHaveAttribute("disabled");
    expect(radios[2]).not.toHaveAttribute("disabled");
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

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];

    expect(radioGroup).toHaveAttribute("aria-readonly", "true");
    expect(radios[2].checked).toBeFalsy();

    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(radios[2].checked).toBeFalsy();
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

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    const dragons = screen.getByLabelText("Dragons");

    fireEvent.click(dragons);
    await Promise.resolve();

    expect(groupOnChangeSpy).toHaveBeenCalledTimes(0);
    expect(radios[2].checked).toBeFalsy();
  });

  describe("data-attributes", () => {
    it("should have 'data-valid' attribute on radios when radio group is valid", async () => {
      render(() => (
        <RadioGroup validationState="valid">
          <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
          <div>
            <Radio data-testid="dogs-radio" value="dogs">
              <Radio.Input data-testid="dogs-radio-input" />
              <Radio.Control data-testid="dogs-radio-control" />
              <Radio.Label data-testid="dogs-radio-label">Dogs</Radio.Label>
            </Radio>
            <Radio data-testid="cats-radio" value="cats">
              <Radio.Input data-testid="cats-radio-input" />
              <Radio.Control data-testid="cats-radio-control" />
              <Radio.Label data-testid="cats-radio-label">Cats</Radio.Label>
            </Radio>
            <Radio data-testid="dragons-radio" value="dragons">
              <Radio.Input data-testid="dragons-radio-input" />
              <Radio.Control data-testid="dragons-radio-control" />
              <Radio.Label data-testid="dragons-radio-label">Dragons</Radio.Label>
            </Radio>
          </div>
        </RadioGroup>
      ));

      const radioElements = screen.getAllByTestId(/^(dogs|cats|dragons)/);

      for (const el of radioElements) {
        expect(el).toHaveAttribute("data-valid");
      }
    });

    it("should have 'data-invalid' attribute on radios when radio group is invalid", async () => {
      render(() => (
        <RadioGroup validationState="invalid">
          <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
          <div>
            <Radio data-testid="dogs-radio" value="dogs">
              <Radio.Input data-testid="dogs-radio-input" />
              <Radio.Control data-testid="dogs-radio-control" />
              <Radio.Label data-testid="dogs-radio-label">Dogs</Radio.Label>
            </Radio>
            <Radio data-testid="cats-radio" value="cats">
              <Radio.Input data-testid="cats-radio-input" />
              <Radio.Control data-testid="cats-radio-control" />
              <Radio.Label data-testid="cats-radio-label">Cats</Radio.Label>
            </Radio>
            <Radio data-testid="dragons-radio" value="dragons">
              <Radio.Input data-testid="dragons-radio-input" />
              <Radio.Control data-testid="dragons-radio-control" />
              <Radio.Label data-testid="dragons-radio-label">Dragons</Radio.Label>
            </Radio>
          </div>
        </RadioGroup>
      ));

      const radioElements = screen.getAllByTestId(/^(dogs|cats|dragons)/);

      for (const el of radioElements) {
        expect(el).toHaveAttribute("data-invalid");
      }
    });

    it("should have 'data-checked' attribute on checked radio", async () => {
      render(() => (
        <RadioGroup defaultValue="cats">
          <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
          <div>
            <Radio data-testid="dogs-radio" value="dogs">
              <Radio.Input data-testid="dogs-radio-input" />
              <Radio.Control data-testid="dogs-radio-control" />
              <Radio.Label data-testid="dogs-radio-label">Dogs</Radio.Label>
            </Radio>
            <Radio data-testid="cats-radio" value="cats">
              <Radio.Input data-testid="cats-radio-input" />
              <Radio.Control data-testid="cats-radio-control" />
              <Radio.Label data-testid="cats-radio-label">Cats</Radio.Label>
            </Radio>
            <Radio data-testid="dragons-radio" value="dragons">
              <Radio.Input data-testid="dragons-radio-input" />
              <Radio.Control data-testid="dragons-radio-control" />
              <Radio.Label data-testid="dragons-radio-label">Dragons</Radio.Label>
            </Radio>
          </div>
        </RadioGroup>
      ));

      const dogsElements = screen.getAllByTestId(/^dogs/);
      const catsElements = screen.getAllByTestId(/^cats/);
      const dragonsElements = screen.getAllByTestId(/^dragons/);

      for (const el of dogsElements) {
        expect(el).not.toHaveAttribute("data-checked");
      }

      for (const el of catsElements) {
        expect(el).toHaveAttribute("data-checked");
      }

      for (const el of dragonsElements) {
        expect(el).not.toHaveAttribute("data-checked");
      }
    });

    it("should have 'data-disabled' attribute on radios when radio group is disabled", async () => {
      render(() => (
        <RadioGroup isDisabled>
          <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
          <div>
            <Radio data-testid="dogs-radio" value="dogs">
              <Radio.Input data-testid="dogs-radio-input" />
              <Radio.Control data-testid="dogs-radio-control" />
              <Radio.Label data-testid="dogs-radio-label">Dogs</Radio.Label>
            </Radio>
            <Radio data-testid="cats-radio" value="cats">
              <Radio.Input data-testid="cats-radio-input" />
              <Radio.Control data-testid="cats-radio-control" />
              <Radio.Label data-testid="cats-radio-label">Cats</Radio.Label>
            </Radio>
            <Radio data-testid="dragons-radio" value="dragons">
              <Radio.Input data-testid="dragons-radio-input" />
              <Radio.Control data-testid="dragons-radio-control" />
              <Radio.Label data-testid="dragons-radio-label">Dragons</Radio.Label>
            </Radio>
          </div>
        </RadioGroup>
      ));

      const radioElements = screen.getAllByTestId(/^(dogs|cats|dragons)/);

      for (const el of radioElements) {
        expect(el).toHaveAttribute("data-disabled");
      }
    });

    it("should have 'data-disabled' attribute on single disabled radio", async () => {
      render(() => (
        <RadioGroup>
          <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
          <div>
            <Radio data-testid="dogs-radio" value="dogs">
              <Radio.Input data-testid="dogs-radio-input" />
              <Radio.Control data-testid="dogs-radio-control" />
              <Radio.Label data-testid="dogs-radio-label">Dogs</Radio.Label>
            </Radio>
            <Radio data-testid="cats-radio" value="cats" isDisabled>
              <Radio.Input data-testid="cats-radio-input" />
              <Radio.Control data-testid="cats-radio-control" />
              <Radio.Label data-testid="cats-radio-label">Cats</Radio.Label>
            </Radio>
            <Radio data-testid="dragons-radio" value="dragons">
              <Radio.Input data-testid="dragons-radio-input" />
              <Radio.Control data-testid="dragons-radio-control" />
              <Radio.Label data-testid="dragons-radio-label">Dragons</Radio.Label>
            </Radio>
          </div>
        </RadioGroup>
      ));

      const dogsElements = screen.getAllByTestId(/^dogs/);
      const catsElements = screen.getAllByTestId(/^cats/);
      const dragonsElements = screen.getAllByTestId(/^dragons/);

      for (const el of dogsElements) {
        expect(el).not.toHaveAttribute("data-disabled");
      }

      for (const el of catsElements) {
        expect(el).toHaveAttribute("data-disabled");
      }

      for (const el of dragonsElements) {
        expect(el).not.toHaveAttribute("data-disabled");
      }
    });

    it("should have 'data-hover' attribute on hovered radio", async () => {
      render(() => (
        <RadioGroup>
          <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
          <div>
            <Radio data-testid="dogs-radio" value="dogs">
              <Radio.Input data-testid="dogs-radio-input" />
              <Radio.Control data-testid="dogs-radio-control" />
              <Radio.Label data-testid="dogs-radio-label">Dogs</Radio.Label>
            </Radio>
            <Radio data-testid="cats-radio" value="cats">
              <Radio.Input data-testid="cats-radio-input" />
              <Radio.Control data-testid="cats-radio-control" />
              <Radio.Label data-testid="cats-radio-label">Cats</Radio.Label>
            </Radio>
            <Radio data-testid="dragons-radio" value="dragons">
              <Radio.Input data-testid="dragons-radio-input" />
              <Radio.Control data-testid="dragons-radio-control" />
              <Radio.Label data-testid="dragons-radio-label">Dragons</Radio.Label>
            </Radio>
          </div>
        </RadioGroup>
      ));

      const catsRadioRoot = screen.getByTestId("cats-radio");
      const catsElements = screen.getAllByTestId(/^cats/);

      fireEvent(catsRadioRoot, createPointerEvent("pointerenter", { pointerType: "mouse" }));
      await Promise.resolve();

      for (const el of catsElements) {
        expect(el).toHaveAttribute("data-hover");
      }

      fireEvent(catsRadioRoot, createPointerEvent("pointerleave", { pointerType: "mouse" }));
      await Promise.resolve();

      for (const el of catsElements) {
        expect(el).not.toHaveAttribute("data-hover");
      }
    });

    it("should have 'data-focus' attribute on focused radio", async () => {
      render(() => (
        <RadioGroup>
          <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
          <div>
            <Radio data-testid="dogs-radio" value="dogs">
              <Radio.Input data-testid="dogs-radio-input" />
              <Radio.Control data-testid="dogs-radio-control" />
              <Radio.Label data-testid="dogs-radio-label">Dogs</Radio.Label>
            </Radio>
            <Radio data-testid="cats-radio" value="cats">
              <Radio.Input data-testid="cats-radio-input" />
              <Radio.Control data-testid="cats-radio-control" />
              <Radio.Label data-testid="cats-radio-label">Cats</Radio.Label>
            </Radio>
            <Radio data-testid="dragons-radio" value="dragons">
              <Radio.Input data-testid="dragons-radio-input" />
              <Radio.Control data-testid="dragons-radio-control" />
              <Radio.Label data-testid="dragons-radio-label">Dragons</Radio.Label>
            </Radio>
          </div>
        </RadioGroup>
      ));

      const catsRadioInput = screen.getByTestId("cats-radio-input");
      const catsElements = screen.getAllByTestId(/^cats/);

      catsRadioInput.focus();
      await Promise.resolve();

      for (const el of catsElements) {
        expect(el).toHaveAttribute("data-focus");
      }

      catsRadioInput.blur();
      await Promise.resolve();

      for (const el of catsElements) {
        expect(el).not.toHaveAttribute("data-focus");
      }
    });

    it.skip("should have 'data-focus-visible' attribute on keyboard focused radio", async () => {
      render(() => (
        <RadioGroup>
          <RadioGroup.Label>Favorite Pet</RadioGroup.Label>
          <div>
            <Radio data-testid="dogs-radio" value="dogs">
              <Radio.Input data-testid="dogs-radio-input" />
              <Radio.Control data-testid="dogs-radio-control" />
              <Radio.Label data-testid="dogs-radio-label">Dogs</Radio.Label>
            </Radio>
            <Radio data-testid="cats-radio" value="cats">
              <Radio.Input data-testid="cats-radio-input" />
              <Radio.Control data-testid="cats-radio-control" />
              <Radio.Label data-testid="cats-radio-label">Cats</Radio.Label>
            </Radio>
            <Radio data-testid="dragons-radio" value="dragons">
              <Radio.Input data-testid="dragons-radio-input" />
              <Radio.Control data-testid="dragons-radio-control" />
              <Radio.Label data-testid="dragons-radio-label">Dragons</Radio.Label>
            </Radio>
          </div>
        </RadioGroup>
      ));

      const catsRadioInput = screen.getByTestId("cats-radio-input");
      const catsElements = screen.getAllByTestId(/^cats/);

      fireEvent.keyDown(catsRadioInput, { key: "Tab" });
      await Promise.resolve();

      for (const el of catsElements) {
        expect(el).toHaveAttribute("data-focus-visible");
      }

      fireEvent(document.body, createPointerEvent("pointerdown", { pointerType: "mouse" }));
      await Promise.resolve();

      for (const el of catsElements) {
        expect(el).not.toHaveAttribute("data-focus-visible");
      }
    });
  });
});
