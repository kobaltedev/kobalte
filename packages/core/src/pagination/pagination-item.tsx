import { composeEventHandlers, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";

export interface PaginationItemOptions extends AsChildProp {
  /** The page number of this item. (1-indexed) */
  page: number;
}

export interface PaginationItemProps
  extends OverrideComponentProps<"button", PaginationItemOptions> {}

export function PaginationItem(props: PaginationItemProps) {
  const context = usePaginationContext();

  const [local, others] = splitProps(props, ["page", "onClick"]);

  const isCurrent = () => {
    return context.page() === local.page;
  };

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
    context.setPage(local.page);
  };

  return (
    <li>
      <Polymorphic
        as="button"
        aria-current={isCurrent() ? "page" : undefined}
        data-current={isCurrent() ? "" : undefined}
        onClick={composeEventHandlers([local.onClick, onClick])}
        {...others}
      />
    </li>
  );
}
