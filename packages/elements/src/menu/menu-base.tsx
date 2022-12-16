import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentProps, splitProps } from "solid-js";

import { HoverCard, HoverCardProps } from "../hover-card";
import { createListState } from "../list";
import { createDisclosure, createRegisterId, focusSafely } from "../primitives";
import {
  createDomCollection,
  useOptionalDomCollectionContext,
} from "../primitives/create-dom-collection";
import { FocusStrategy } from "../selection";
import { MenuContext, MenuContextValue, useOptionalMenuContext } from "./menu-context";
import { MenuItemModel } from "./types";

export interface MenuBaseProps
  extends Omit<
    HoverCardProps,
    "closeOnHoverOutside" | "closeOnInteractOutside" | "closeDelay" | "openDelay"
  > {
  /** Handler that is called when the user activates a menu item. */
  onAction?: (key: string) => void;
}

/**
 * Contains all the parts of a dropdown menu and provide context for its children.
 */
export function MenuBase(props: ParentProps<MenuBaseProps>) {
  const parentDomCollectionContext = useOptionalDomCollectionContext();
  const parentMenuContext = useOptionalMenuContext();
  const defaultId = `menu-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      placement: "bottom-start",
      closeOnEsc: true,
      isModal: parentMenuContext?.isModal() ?? true,
      preventScroll: parentMenuContext?.preventScroll() ?? true,
      trapFocus: parentMenuContext?.trapFocus() ?? true,
      autoFocus: true,
      restoreFocus: true,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "id",
    "children",
    "isOpen",
    "defaultIsOpen",
    "onOpenChange",
    "onAction",
  ]);

  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [panelRef, setPanelRef] = createSignal<HTMLDivElement>();
  const [triggerId, setTriggerId] = createSignal<string>();
  const [panelId, setPanelId] = createSignal<string>();

  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy | boolean | undefined>(true);

  const [items, setItems] = createSignal<MenuItemModel[]>([]);

  const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });

  const disclosureState = createDisclosure({
    isOpen: () => local.isOpen,
    defaultIsOpen: () => local.defaultIsOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const listState = createListState({
    selectionMode: "none",
    dataSource: items,
  });

  const open = (focusStrategy?: FocusStrategy) => {
    setFocusStrategy(focusStrategy);
    disclosureState.open();
  };

  const close = (deep?: boolean) => {
    disclosureState.close();

    if (deep) {
      parentMenuContext?.close(deep);
    }
  };

  const toggle = (focusStrategy?: FocusStrategy) => {
    if (disclosureState.isOpen()) {
      close();
    } else {
      setFocusStrategy(focusStrategy);
      open(focusStrategy);
    }
  };

  const focusPanel = () => {
    const panel = panelRef();

    if (panel) {
      focusSafely(panel);
    }
  };

  const context: MenuContextValue = {
    isOpen: () => disclosureState.isOpen(),
    isModal: () => others.isModal!,
    preventScroll: () => others.preventScroll!,
    trapFocus: () => others.trapFocus!,
    autoFocus: focusStrategy,
    listState: () => listState,
    parentMenuContext: () => parentMenuContext,
    triggerId,
    panelId,
    setTriggerRef,
    setPanelRef,
    open,
    close,
    toggle,
    focusPanel,
    onAction: key => local.onAction?.(key),
    registerItemToParentDomCollection: parentDomCollectionContext?.registerItem,
    generateId: createGenerateId(() => local.id!),
    registerTrigger: createRegisterId(setTriggerId),
    registerPanel: createRegisterId(setPanelId),
  };

  return (
    <DomCollectionProvider>
      <MenuContext.Provider value={context}>
        <HoverCard
          id={local.id}
          isOpen={disclosureState.isOpen()}
          onOpenChange={disclosureState.setIsOpen}
          anchorRef={triggerRef}
          closeOnInteractOutside={true}
          closeOnHoverOutside={parentMenuContext != null}
          openDelay={0}
          closeDelay={0}
          {...others}
        >
          {local.children}
        </HoverCard>
      </MenuContext.Provider>
    </DomCollectionProvider>
  );
}
