import { createPolymorphicComponent, focusWithoutScrolling } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { MenuContent, MenuContentOptions } from "../menu";
import { useMenuRootContext } from "../menu/menu-root-context";
import { useMenuContext } from "../menu/menu-context";
import { InteractOutsideEvent } from "../primitives";

export const DropdownMenuContent = createPolymorphicComponent<"div", MenuContentOptions>(props => {
  const rootContext = useMenuRootContext();
  const subContext = useMenuContext();

  const [local, others] = splitProps(props, ["onCloseAutoFocus", "onInteractOutside"]);

  let hasInteractedOutside = false;

  const onCloseAutoFocus = (e: Event) => {
    local.onCloseAutoFocus?.(e);

    if (!hasInteractedOutside) {
      focusWithoutScrolling(subContext.triggerRef());
    }

    hasInteractedOutside = false;

    // Always prevent autofocus because we either focus manually or want user agent focus
    e.preventDefault();
  };

  const onInteractOutside = (e: InteractOutsideEvent) => {
    local.onInteractOutside?.(e);

    if (!rootContext.isModal() || e.detail.isContextMenu) {
      hasInteractedOutside = true;
    }
  };

  return (
    <MenuContent
      onCloseAutoFocus={onCloseAutoFocus}
      onInteractOutside={onInteractOutside}
      {...others}
    />
  );
});
