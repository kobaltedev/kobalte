/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";

import { createControllableSignal } from "../primitives";
import { MenuGroup } from "./menu-group";
import { MenuRadioGroupContext, MenuRadioGroupContextValue } from "./menu-radio-group-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuRadioGroupOptions {
  /** The controlled value of the item radio to check. */
  value?: string;

  /**
   * The value of the item radio that should be checked when initially rendered.
   * Useful when you do not need to control the state of the menu radio group.
   */
  defaultValue?: string;

  /** Event handler called when the value changes. */
  onValueChange?: (value: string) => void;

  /** Whether the menu radio group is disabled. */
  isDisabled?: boolean;
}

/**
 * A container used to group multiple `Menu.RadioItem`s and manage the selection.
 */
export const MenuRadioGroup = /*#__PURE__*/ createPolymorphicComponent<
  "div",
  MenuRadioGroupOptions
>(props => {
  const rootContext = useMenuRootContext();

  const defaultId = rootContext.generateId(`radiogroup-${createUniqueId()}`);

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "value",
    "defaultValue",
    "onValueChange",
    "isDisabled",
  ]);

  const [selected, setSelected] = createControllableSignal<string>({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: value => local.onValueChange?.(value),
  });

  const context: MenuRadioGroupContextValue = {
    isDisabled: () => local.isDisabled,
    isSelectedValue: (value: string) => value === selected(),
    setSelectedValue: setSelected,
  };

  return (
    <MenuRadioGroupContext.Provider value={context}>
      <MenuGroup {...others} />
    </MenuRadioGroupContext.Provider>
  );
});
