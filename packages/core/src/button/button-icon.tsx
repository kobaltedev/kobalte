/*!
 * Portions of this file are based on code from chakra-ui.
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/7d7e04d53d871e324debe0a2cb3ff44d7dbf3bca/packages/components/button/src/button-icon.tsx
 */

import { clsx } from "clsx";
import { ComponentProps, splitProps } from "solid-js";

import { useButtonContext } from "./button-context";

export const ButtonIcon = (props: ComponentProps<"span">) => {
  const buttonContext = useButtonContext();

  const [local, others] = splitProps(props, ["class"]);

  return (
    <span
      aria-hidden={true}
      class={clsx(buttonContext.classNames().icon, local.class)}
      {...others}
    />
  );
};
