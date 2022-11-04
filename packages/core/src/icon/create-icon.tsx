/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/icon/src/create-icon.tsx
 */

import { JSX } from "solid-js";

import { createPolymorphicComponent } from "../utils";
import { Icon, IconProps } from "./icon";

interface CreateIconOptions {
  /**
   * The icon `svg` viewBox.
   * @default "0 0 24 24"
   */
  viewBox?: string;

  // `path` needs to be a function that return JSX because in SolidJS JSX create real DOM element.
  // Because if `path` is just a JSX.Element, the same generated DOM element will be moved to the next call of the component that use it.
  /** A function that return the `svg` path or group element. */
  path: () => JSX.Element | JSX.Element[];

  /** Default props automatically passed to the component. */
  defaultProps?: IconProps;
}

export function createIcon(options: CreateIconOptions) {
  const { viewBox = "0 0 24 24", defaultProps = {} } = options;

  return createPolymorphicComponent<"svg", IconProps>(props => (
    <Icon viewBox={viewBox} {...defaultProps} {...props}>
      {options.path}
    </Icon>
  ));
}
