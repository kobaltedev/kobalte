import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useBreadcrumbsContext } from "./breadcrumbs-context";

export interface BreadcrumbsSeparatorProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * The visual separator between each breadcrumb items.
 * It will not be visible by screen readers.
 */
export function BreadcrumbsSeparator(props: BreadcrumbsSeparatorProps) {
  const context = useBreadcrumbsContext();

  return <Polymorphic as="span" children={context.separator()} aria-hidden="true" {...props} />;
}
