import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useBreadcrumbsContext } from "./breadcrumbs-context";

/**
 * The visual separator between each breadcrumb items.
 * It will not be visible by screen readers.
 */
export const BreadcrumbsSeparator = createPolymorphicComponent<"span">(props => {
  const context = useBreadcrumbsContext();

  props = mergeDefaultProps({ as: "span" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Dynamic component={local.as} children={context.separator()} aria-hidden="true" {...others} />
  );
});
