import { combineProps, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext, useDialogPortalContext } from "../dialog";
import { createSelectableList } from "../list";
import { createFocusRing, createFocusTrapRegion, createOverlay } from "../primitives";
import { useMenuContext } from "./menu-context";
import { HoverCardPanel } from "../hover-card/hover-card-panel";

export interface MenuPanelProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   * It inherits from `Select.Portal`.
   */
  forceMount?: boolean;
}

export const MenuPanel = createPolymorphicComponent<"div", MenuPanelProps>(props => {
  let ref: HTMLDivElement | undefined;

  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("panel"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "forceMount"]);

  const selectableList = createSelectableList(
    {
      selectionManager: context.listState().selectionManager,
      collection: context.listState().collection,
      autoFocus: context.autoFocus,
      deferAutoFocus: true, // ensure all menu items are mounted and collection is not empty before trying to auto focus.
      shouldFocusWrap: true,
    },
    () => ref
  );

  const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing({
    within: true,
  });

  createEffect(() => onCleanup(context.registerPanel(local.id!)));

  return (
    <HoverCardPanel
      id={local.id}
      role="menu"
      tabIndex={selectableList.tabIndex()}
      aria-labelledby={context.triggerId()}
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      {...combineProps(
        { ref: el => (ref = el) },
        others,
        selectableList.handlers,
        focusRingHandlers
      )}
    />
  );
});
