/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/ea6376900d54af536dbb7b71b4fefd6ec2ce9dc0/packages/react/menubar/src/Menubar.tsx
 */

import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createUniqueId } from "solid-js";

import { AsChildProp } from "../polymorphic";
import { MenubarContext } from "./menubar-context";

type Direction = "ltr" | "rtl";

export interface MenubarRootOptions extends AsChildProp {
  /** The value of the menu that should be open when initially rendered. Use when you do not need to control the value state. */
  defaultValue?: string;

  /** The controlled value of the menu to open. Should be used in conjunction with onValueChange. */
  value?: string;

  /** Event handler called when the value changes. */
  onValueChange?: string;

  /** When true, keyboard navigation will loop from last item to first, and vice versa. */
  loop?: boolean;

  /** The reading direction. If omitted, uses LTR (left-to-right) reading mode. */
  dir?: Direction;
}

export interface MenubarRootProps extends OverrideComponentProps<"div", MenubarRootOptions> {}

/**
 * A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
 */
export function MenubarRoot(props: MenubarRootProps) {
  const defaultId = `menubar-${createUniqueId()}`;

  props = mergeDefaultProps({ id: defaultId }, props);

  return (
    <MenubarContext.Provider value={context}>
      <Polymorphic
        as="div"
        style={{
          // prevent iOS context menu from appearing
          "-webkit-touch-callout": "none",
          ...local.style,
        }}
        data-disabled={local.disabled ? "" : undefined}
        {...others}
      />
    </MenubarContext.Provider>
  );
}
