/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/breadcrumbs/src/useBreadcrumbs.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createLocalizedStringFormatter } from "../i18n";
import { BREADCRUMBS_INTL_MESSAGES } from "./breadcrumbs.intl";
import { BreadcrumbsContext, BreadcrumbsContextValue } from "./breadcrumbs-context";

export interface BreadcrumbsRootOptions {
  /**
   * The visual separator between each breadcrumb item.
   * It will be used as the default children of `Breadcrumbs.Separator`.
   */
  separator?: string | JSX.Element;
}

/**
 * Breadcrumbs show hierarchy and navigational context for a user’s location within an application.
 */
export const BreadcrumbsRoot = createPolymorphicComponent<"nav", BreadcrumbsRootOptions>(props => {
  props = mergeDefaultProps(
    {
      as: "nav",
      separator: "/",
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "separator"]);

  const formatter = createLocalizedStringFormatter(() => BREADCRUMBS_INTL_MESSAGES);

  const context: BreadcrumbsContextValue = {
    separator: () => local.separator,
  };

  return (
    <BreadcrumbsContext.Provider value={context}>
      <Dynamic component={local.as} aria-label={formatter().format("breadcrumbs")} {...others} />
    </BreadcrumbsContext.Provider>
  );
});
