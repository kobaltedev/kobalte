/*!
 * Portions of this file are based on code from chakra-ui.
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/7d7e04d53d871e324debe0a2cb3ff44d7dbf3bca/packages/components/button/src/icon-button.tsx
 */

import { createPolymorphicComponent } from "../utils";
import { Button } from "./button";
import { IconButtonProps } from "./types";

/**
 * IconButton composes the Button component except that it renders only an icon.
 * Since IconButton only renders an icon, you must pass the aria-label prop, so screen readers can give meaning to the button.
 */
export const IconButton = createPolymorphicComponent<"button", IconButtonProps>(props => {
  return <Button isIconOnly {...props} />;
});
