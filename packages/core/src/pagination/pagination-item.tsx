import {composeEventHandlers, mergeDefaultProps, mergeRefs, OverrideComponentProps} from "@kobalte/utils";
import {AsChildProp, Polymorphic} from "../polymorphic";
import {usePaginationContext} from "./pagination-context";
import {splitProps} from "solid-js";

export interface PaginationItemOptions extends AsChildProp {
  /** The page number of this item. */
  page: number;
}

export interface PaginationItemProps extends OverrideComponentProps<"button", PaginationItemOptions> {}


export function PaginationItem(props: PaginationItemProps) {
  let ref: HTMLButtonElement | undefined;

  const context = usePaginationContext();

  props = mergeDefaultProps(
    {
      type: "button",
    },
    props
    );

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "page",
    "onClick",
    ]);

  const id = () => local.id ?? context.generateItemId(local.page);

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    context.setPage(local.page);
  };

  return (
    <li>
      <Polymorphic
        fallback="button"
        ref={mergeRefs(el => (ref = el), local.ref)}
        id={id()}
        aria-current={context.page() === local.page ? "page" : undefined}
        onClick={composeEventHandlers([local.onClick, onClick])}
        {...others}
      />
    </li>
    );
}
