import { composeEventHandlers, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";

export interface PaginationPreviousOptions extends AsChildProp {}

export interface PaginationPreviousProps
  extends OverrideComponentProps<"button", PaginationPreviousOptions> {}

export function PaginationPrevious(props: PaginationPreviousProps) {
  const context = usePaginationContext();

  props = mergeDefaultProps(
    {
      type: "button",
    },
    props,
  );

  const [local, others] = splitProps(props, ["onClick"]);

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
    context.setPage(context.page() - 1);
  };

  const isDisabled = () => context.page() === 1;

  return (
    <li>
      <Polymorphic
        as="button"
        tabIndex={isDisabled() || context.page() === 1 ? "-1" : undefined}
        disabled={isDisabled()}
        aria-disabled={isDisabled() || undefined}
        data-disabled={isDisabled() ? "" : undefined}
        onClick={composeEventHandlers([local.onClick, onClick])}
        {...others}
      />
    </li>
  );
}
