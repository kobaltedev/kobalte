/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/breadcrumbs/src/useBreadcrumbItem.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import * as Link from "../link";

export interface BreadcrumbsLinkOptions extends Link.LinkRootOptions {
  /** Whether the breadcrumb link represents the current page. */
  isCurrent?: boolean;

  /** Whether the breadcrumb link is disabled. */
  isDisabled?: boolean;
}

/**
 * The breadcrumbs link.
 */
export const BreadcrumbsLink = createPolymorphicComponent<"a", BreadcrumbsLinkOptions>(props => {
  props = mergeDefaultProps({ as: "a" }, props);

  const [local, others] = splitProps(props, ["isCurrent", "isDisabled", "aria-current"]);

  const ariaCurrent = () => {
    if (!local.isCurrent) {
      return undefined;
    }

    return local["aria-current"] || "page";
  };

  return (
    <Link.Root
      isDisabled={local.isDisabled || local.isCurrent}
      aria-current={ariaCurrent()}
      data-current={local.isCurrent ? "" : undefined}
      {...others}
    />
  );
});
