import {composeEventHandlers, mergeDefaultProps, OverrideComponentProps} from "@kobalte/utils";
import {AsChildProp, Polymorphic} from "../polymorphic";
import {usePaginationContext} from "./pagination-context";
import {splitProps} from "solid-js";

export interface PaginationItemOptions extends AsChildProp {
  /** The page number of this item. (1-indexed) */
  page: number;
}

export interface PaginationItemProps extends OverrideComponentProps<"button", PaginationItemOptions> {}


export function PaginationItem(props: PaginationItemProps) {
  const context = usePaginationContext();

  props = mergeDefaultProps(
    {
      type: "button",
    },
    props
    );

  const [local, others] = splitProps(props, [
    "page",
    "onClick",
    ]);


  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    context.setPage(local.page);
  };

  return (
    <li>
      <Polymorphic
        fallback="button"
        aria-current={context.page() === local.page ? "page" : undefined}
        onClick={composeEventHandlers([local.onClick, onClick])}
        {...others}
      />
    </li>
    );
}
