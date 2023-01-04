/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/context-menu/src/ContextMenu.tsx
 */

import {
  callHandler,
  combineProps,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useMenuContext } from "../menu/menu-context";
import { useMenuRootContext } from "../menu/menu-root-context";
import { createLongPress } from "../primitives";
import { useContextMenuContext } from "./context-menu-context";

export interface ContextMenuTriggerOptions {
  /** Whether the context menu trigger is disabled. */
  isDisabled?: boolean;

  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export const ContextMenuTrigger = createPolymorphicComponent<"div", ContextMenuTriggerOptions>(
  props => {
    const rootContext = useMenuRootContext();
    const menuContext = useMenuContext();
    const context = useContextMenuContext();

    props = mergeDefaultProps(
      {
        as: "div",
        id: rootContext.generateId("trigger"),
      },
      props
    );

    const [local, others] = splitProps(props, [
      "as",
      "ref",
      "style",
      "isDisabled",
      "onContextMenu",
    ]);

    const onContextMenu: JSX.EventHandlerUnion<any, MouseEvent> = e => {
      // If trigger is disabled, enable the native Context Menu.
      if (local.isDisabled) {
        callHandler(e, local.onContextMenu);
        return;
      }

      e.preventDefault();

      context.setAnchorRect({ x: e.clientX, y: e.clientY });

      if (menuContext.isOpen()) {
        // If the menu is already open, focus the menu itself.
        menuContext.focusContent();
      } else {
        menuContext.open(true);
      }
    };

    const { longPressHandlers } = createLongPress({
      isDisabled: () => local.isDisabled,
      threshold: 700,
      onLongPress: e => {
        if (e.pointerType === "touch" || e.pointerType === "pen") {
          menuContext.open(false);
        }
      },
    });

    return (
      <Dynamic
        component={local.as}
        ref={mergeRefs(menuContext.setTriggerRef, local.ref)}
        style={{
          // prevent iOS context menu from appearing
          "-webkit-touch-callout": "none",
          ...local.style,
        }}
        data-expanded={menuContext.isOpen() ? "" : undefined}
        data-disabled={local.isDisabled ? "" : undefined}
        onContextMenu={onContextMenu}
        {...combineProps(others, longPressHandlers)}
      />
    );
  }
);
