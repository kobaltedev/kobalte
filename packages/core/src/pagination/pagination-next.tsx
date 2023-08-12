import { composeEventHandlers, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { usePaginationContext } from "./pagination-context";

export interface PaginationNextOptions extends AsChildProp {}

export interface PaginationNextProps
  extends OverrideComponentProps<"button", PaginationNextOptions> {}

export function PaginationNext(props: PaginationNextProps) {
  const context = usePaginationContext();

  const [local, others] = splitProps(props, ["onClick"]);

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = () => {
    context.setPage(context.page() + 1);
  };

  const isDisabled = () => context.page() === context.count();

  return (
    <li>
      <Polymorphic
        as="button"
        tabIndex={isDisabled() || context.page() === context.count() ? "-1" : undefined}
        disabled={isDisabled()}
        aria-disabled={isDisabled() || undefined}
        data-disabled={isDisabled() ? "" : undefined}
        onClick={composeEventHandlers([local.onClick, onClick])}
        {...others}
      />
    </li>
  );
}
