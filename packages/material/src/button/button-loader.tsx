/*!
 * Portions of this file are based on code from chakra-ui.
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/7d7e04d53d871e324debe0a2cb3ff44d7dbf3bca/packages/components/button/src/button-spinner.tsx
 */

import { clsx } from "clsx";
import { ComponentProps, Show, splitProps } from "solid-js";

import { SpinnerIcon } from "../icon/icon-set";
import { useButtonContext } from "./button-context";

export const ButtonLoader = (props: ComponentProps<"div">) => {
  const buttonContext = useButtonContext();

  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={clsx(buttonContext.classNames().loaderWrapper, local.class)} {...others}>
      <Show
        when={local.children}
        fallback={<SpinnerIcon class={buttonContext.classNames().loaderIcon} />}
      >
        {local.children}
      </Show>
    </div>
  );
};
