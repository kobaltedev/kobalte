import { combineProps, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import { HoverCardPanel } from "../hover-card/hover-card-panel";
import { createSelectableList } from "../list";
import { createFocusRing } from "../primitives";
import { useMenuContext } from "./menu-context";

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
      deferAutoFocus: true, // ensure all menu items are mounted and collection is not empty before trying to autofocus.
      shouldFocusWrap: true,
      disallowTypeAhead: () => !context.listState().selectionManager().isFocused(),
    },
    () => ref
  );

  const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing({
    within: true,
  });

  const onPointerLeave = () => {
    context.listState().selectionManager().setFocusedKey(undefined);
  };

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
        {
          ref: el => {
            context.setPanelRef(el);
            ref = el;
          },
        },
        others,
        { onPointerLeave },
        selectableList.handlers,
        focusRingHandlers
      )}
    />
  );
});
