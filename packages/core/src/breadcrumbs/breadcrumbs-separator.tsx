import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useBreadcrumbsContext } from "./breadcrumbs-context";

/**
 * The visual separator between each breadcrumb items.
 * It will not be visible by screen readers.
 */
export function BreadcrumbsSeparator(props: OverrideComponentProps<"span", AsChildProp>) {
  const context = useBreadcrumbsContext();

  return (
    <Polymorphic fallback="span" children={context.separator()} aria-hidden="true" {...props} />
  );
}
