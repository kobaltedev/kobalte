import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import { HoverCard, HoverCardProps } from "../hover-card";
import { createListState } from "../list";
import { PopoverArrow } from "../popover/popover-arrow";
import { PopoverPortal } from "../popover/popover-portal";
import { PopoverPositioner } from "../popover/popover-positioner";
import { createDisclosure, createRegisterId, focusSafely } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { useOptionalDomCollectionContext } from "../primitives/create-dom-collection/dom-collection-context";
import { FocusStrategy } from "../selection";
import { MenuContext, MenuContextValue, useOptionalMenuContext } from "./menu-context";
import { MenuGroup } from "./menu-group";
import { MenuGroupLabel } from "./menu-group-label";
import { MenuIcon } from "./menu-icon";
import { MenuItem } from "./menu-item";
import { MenuPanel } from "./menu-panel";
import { MenuSub } from "./menu-sub";
import { MenuSubTrigger } from "./menu-sub-trigger";
import { MenuTrigger } from "./menu-trigger";
import { MenuItemModel } from "./types";

type MenuComposite = {
  Trigger: typeof MenuTrigger;
  Icon: typeof MenuIcon;
  Portal: typeof PopoverPortal;
  Positioner: typeof PopoverPositioner;
  Panel: typeof MenuPanel;
  Arrow: typeof PopoverArrow;
  Item: typeof MenuItem;
  Group: typeof MenuGroup;
  GroupLabel: typeof MenuGroupLabel;
  Sub: typeof MenuSub;
  SubTrigger: typeof MenuSubTrigger;
};

export interface MenuProps
  extends Omit<
    HoverCardProps,
    "closeOnHoverOutside" | "closeOnInteractOutside" | "closeDelay" | "openDelay"
  > {
  /** Handler that is called when the user activates a menu item. */
  onAction?: (key: string) => void;
}

export const Menu: ParentComponent<MenuProps> & MenuComposite = props => {
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

  const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();
  const [panelRef, setPanelRef] = createSignal<HTMLButtonElement>();
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

  const focusInPanel = () => {
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
    focusInPanel,
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
          closeOnHoverOutside={true}
          openDelay={0}
          closeDelay={0}
          {...others}
        >
          {local.children}
        </HoverCard>
      </MenuContext.Provider>
    </DomCollectionProvider>
  );
};

Menu.Trigger = MenuTrigger;
Menu.Icon = MenuIcon;
Menu.Portal = PopoverPortal;
Menu.Positioner = PopoverPositioner;
Menu.Panel = MenuPanel;
Menu.Arrow = PopoverArrow;
Menu.Item = MenuItem;
Menu.Group = MenuGroup;
Menu.GroupLabel = MenuGroupLabel;
Menu.Sub = MenuSub;
Menu.SubTrigger = MenuSubTrigger;
