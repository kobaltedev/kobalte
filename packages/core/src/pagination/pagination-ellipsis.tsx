import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";

export interface PaginationEllipsisOptions extends AsChildProp {}

export interface PaginationEllipsisProps
  extends OverrideComponentProps<"div", PaginationEllipsisOptions> {}

export function PaginationEllipsis(props: PaginationEllipsisProps) {
  return (
    <li>
      <Polymorphic as="div" {...props} />
    </li>
  );
}
