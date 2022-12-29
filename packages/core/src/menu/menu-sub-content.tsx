import {
  composeEventHandlers,
  contains,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { MenuContent, MenuContentOptions } from "../menu";
import {
  createFocusRing,
  createFocusScope,
  createHideOutside,
  createPreventScroll,
  FocusOutsideEvent,
  focusSafely,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "../primitives";
import { useMenuContext } from "./menu-context";
import { createSelectableList } from "../list";
import { PopperPositioner } from "../popper/popper-positioner";
import { DismissableLayer } from "../dismissable-layer";

export interface MenuSubContentOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Event handler called when the escape key is down.
   * It can be prevented by calling `event.preventDefault`.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Event handler called when a pointer event occurs outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

  /**
   * Event handler called when the focus moves outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onFocusOutside?: (event: FocusOutsideEvent) => void;

  /**
   * Event handler called when an interaction (pointer or focus event) happens outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onInteractOutside?: (event: InteractOutsideEvent) => void;
}

export const MenuSubContent = createPolymorphicComponent<"div", MenuSubContentOptions>(props => {
  let ref: HTMLElement | undefined;

  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("content"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "style",
    "onEscapeKeyDown",
    "onFocusOutside",
    "onKeyDown",
    "onFocusIn",
    "onFocusOut",
    "onMouseDown",
  ]);

  const onEscapeKeyDown = (e: KeyboardEvent) => {
    local.onEscapeKeyDown?.(e);

    // `createSelectableList` prevent escape key down,
    // which prevent our `onDismiss` in `DismissableLayer` to run,
    // so we force "close on escape" here.
    context.close(true);
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    local.onFocusOutside?.(e);

    const target = e.target as HTMLElement | null;

    // We prevent closing when the trigger is focused to avoid triggering a re-open animation
    // on pointer interaction.
    if (!contains(context.triggerRef(), target)) {
      context.close();
    }

    if (context.isModal()) {
      // When focus is trapped, a `focusout` event may still happen.
      // We make sure we don't trigger our `onDismiss` in such case.
      e.preventDefault();
    }

    //context.listState().selectionManager().setFocusedKey(undefined);
  };

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

  const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing();

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  createHideOutside({
    isDisabled: () => !(context.isOpen() && context.isModal()),
    targets: () => {
      const keepVisible = [];

      const parentMenuContent = context.parentMenuContext()?.contentRef();

      if (parentMenuContent) {
        keepVisible.push(parentMenuContent);
      }

      if (ref) {
        keepVisible.push(ref);
      }

      return keepVisible;
    },
  });

  createFocusScope(
    {
      trapFocus: () => context.isOpen() && context.isModal(),
    },
    () => ref
  );

  createEffect(() => onCleanup(context.registerContentId(local.id!)));

  return (
    <Show when={context.shouldMount()}>
      <PopperPositioner>
        <DismissableLayer
          ref={mergeRefs(el => {
            context.setContentRef(el);
            ref = el;
          }, local.ref)}
          role="menu"
          id={local.id}
          tabIndex={selectableList.tabIndex()}
          disableOutsidePointerEvents={false}
          excludedElements={[context.triggerRef]}
          style={{ position: "relative", ...local.style }}
          aria-labelledby={context.triggerId()}
          data-focus={isFocused() ? "" : undefined}
          data-focus-visible={isFocusVisible() ? "" : undefined}
          onEscapeKeyDown={onEscapeKeyDown}
          onFocusOutside={onFocusOutside}
          onDismiss={context.close}
          onKeyDown={composeEventHandlers([local.onKeyDown, selectableList.handlers.onKeyDown])}
          onFocusIn={composeEventHandlers([
            local.onFocusIn,
            selectableList.handlers.onFocusIn,
            focusRingHandlers.onFocusIn,
          ])}
          onFocusOut={composeEventHandlers([
            local.onFocusOut,
            selectableList.handlers.onFocusOut,
            focusRingHandlers.onFocusOut,
          ])}
          onMouseDown={composeEventHandlers([
            local.onMouseDown,
            selectableList.handlers.onMouseDown,
          ])}
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
});
