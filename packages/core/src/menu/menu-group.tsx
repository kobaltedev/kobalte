/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e6808d1b5e80cef7af7e63974f658043593b2e1e/packages/@react-aria/menu/src/useMenuSection.ts
 */

import { createGenerateId, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createRegisterId } from "../primitives";
import { useMenuRootContext } from "./menu-root-context";
import { MenuGroupContext, MenuGroupContextValue } from "./menu-group-context";

/**
 * A container used to group multiple `Menu.Item`s.
 */
export const MenuGroup = createPolymorphicComponent<"div">(props => {
  const rootContext = useMenuRootContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: rootContext.generateId(`group-${createUniqueId()}`),
    },
    props
  );

  const [local, others] = splitProps(props, ["as"]);

  const [labelId, setLabelId] = createSignal<string>();

  const context: MenuGroupContextValue = {
    generateId: createGenerateId(() => others.id!),
    registerLabelId: createRegisterId(setLabelId),
  };

  return (
    <MenuGroupContext.Provider value={context}>
      <Dynamic component={local.as} role="group" aria-labelledby={labelId()} {...others} />
    </MenuGroupContext.Provider>
  );
});
