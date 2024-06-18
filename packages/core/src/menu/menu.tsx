/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */

import {
	focusWithoutScrolling,
	mergeDefaultProps,
	removeItemFromArray,
} from "@kobalte/utils";
import {
	type Accessor,
	type ParentProps,
	Show,
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	splitProps,
} from "solid-js";

import createPresence from "solid-presence";
import { createListState } from "../list";
import { useOptionalMenubarContext } from "../menubar/menubar-context";
import { useOptionalNavigationMenuContext } from "../navigation-menu/navigation-menu-context";
import { Popper, type PopperRootOptions } from "../popper";
import type { Placement } from "../popper/utils";
import {
	type CollectionItemWithRef,
	createDisclosureState,
	createHideOutside,
	createRegisterId,
} from "../primitives";
import {
	createDomCollection,
	useOptionalDomCollectionContext,
} from "../primitives/create-dom-collection";
import type { FocusStrategy } from "../selection";
import {
	MenuContext,
	type MenuContextValue,
	type MenuDataSet,
	useOptionalMenuContext,
} from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";
import { type GraceIntent, type Side, isPointerInGraceArea } from "./utils";

export interface MenuOptions
	extends Omit<
		PopperRootOptions,
		"anchorRef" | "contentRef" | "onCurrentPlacementChange"
	> {
	/** The controlled open state of the menu. */
	open?: boolean;

	/**
	 * The default open state when initially rendered.
	 * Useful when you do not need to control the open state.
	 */
	defaultOpen?: boolean;

	/** Event handler called when the open state of the menu changes. */
	onOpenChange?: (isOpen: boolean) => void;
}

export interface MenuProps extends ParentProps<MenuOptions> {}

/**
 * Container for menu items and nested menu, provide context for its children.
 */
export function Menu(props: MenuProps) {
	const rootContext = useMenuRootContext();
	const parentDomCollectionContext = useOptionalDomCollectionContext();
	const parentMenuContext = useOptionalMenuContext();
	const optionalMenubarContext = useOptionalMenubarContext();
	const optionalNavigationMenuContext = useOptionalNavigationMenuContext();

	const mergedProps = mergeDefaultProps(
		{
			placement:
				rootContext.orientation() === "horizontal"
					? "bottom-start"
					: "right-start",
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, [
		"open",
		"defaultOpen",
		"onOpenChange",
	]);

	let pointerGraceTimeoutId = 0;
	let pointerGraceIntent: GraceIntent | null = null;
	let pointerDir: Side = "right";

	const [triggerId, setTriggerId] = createSignal<string>();
	const [contentId, setContentId] = createSignal<string>();

	const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
	const [contentRef, setContentRef] = createSignal<HTMLDivElement>();

	const [focusStrategy, setFocusStrategy] = createSignal<
		FocusStrategy | boolean
	>(true);
	const [currentPlacement, setCurrentPlacement] = createSignal<Placement>(
		others.placement!,
	);
	const [nestedMenus, setNestedMenus] = createSignal<HTMLElement[]>([]);

	const [items, setItems] = createSignal<CollectionItemWithRef[]>([]);

	const { DomCollectionProvider } = createDomCollection({
		items,
		onItemsChange: setItems,
	});

	const disclosureState = createDisclosureState({
		open: () => local.open,
		defaultOpen: () => local.defaultOpen,
		onOpenChange: (isOpen) => local.onOpenChange?.(isOpen),
	});

	const { present: contentPresent } = createPresence({
		show: () => rootContext.forceMount() || disclosureState.isOpen(),
		element: () => contentRef() ?? null,
	});

	const listState = createListState({
		selectionMode: "none",
		dataSource: items,
	});

	const open = (focusStrategy: FocusStrategy | boolean) => {
		setFocusStrategy(focusStrategy);
		disclosureState.open();
	};

	const close = (recursively = false) => {
		disclosureState.close();

		if (recursively && parentMenuContext) {
			parentMenuContext.close(true);
		}
	};

	const toggle = (focusStrategy: FocusStrategy | boolean) => {
		setFocusStrategy(focusStrategy);
		disclosureState.toggle();
	};

	const _focusContent = () => {
		const content = contentRef();

		if (content) {
			focusWithoutScrolling(content);
			listState.selectionManager().setFocused(true);
			listState.selectionManager().setFocusedKey(undefined);
		}
	};

	const focusContent = () => {
		if (optionalNavigationMenuContext != null)
			setTimeout(() => _focusContent());
		else _focusContent();
	};

	const registerNestedMenu = (element: HTMLElement) => {
		setNestedMenus((prev) => [...prev, element]);

		const parentUnregister = parentMenuContext?.registerNestedMenu(element);

		return () => {
			setNestedMenus((prev) => removeItemFromArray(prev, element));
			parentUnregister?.();
		};
	};

	const isPointerMovingToSubmenu = (e: PointerEvent) => {
		const isMovingTowards = pointerDir === pointerGraceIntent?.side;
		return isMovingTowards && isPointerInGraceArea(e, pointerGraceIntent?.area);
	};

	const onItemEnter = (e: PointerEvent) => {
		if (isPointerMovingToSubmenu(e)) {
			e.preventDefault();
		}
	};

	const onItemLeave = (e: PointerEvent) => {
		if (isPointerMovingToSubmenu(e)) {
			return;
		}

		focusContent();
	};

	const onTriggerLeave = (e: PointerEvent) => {
		if (isPointerMovingToSubmenu(e)) {
			e.preventDefault();
		}
	};

	// aria-hide everything except the content (better supported equivalent to setting aria-modal)
	createHideOutside({
		isDisabled: () => {
			// Apply only on root menu when opened and modal.
			return !(
				parentMenuContext == null &&
				disclosureState.isOpen() &&
				rootContext.isModal()
			);
		},
		targets: () =>
			[contentRef(), ...nestedMenus()].filter(Boolean) as Element[],
	});

	createEffect(() => {
		const contentEl = contentRef();

		if (!contentEl || !parentMenuContext) {
			return;
		}

		const parentUnregister = parentMenuContext.registerNestedMenu(contentEl);

		onCleanup(() => {
			parentUnregister();
		});
	});

	createEffect(() => {
		if (parentMenuContext !== undefined) return;
		optionalMenubarContext?.registerMenu(rootContext.value()!, [
			contentRef()!,
			...nestedMenus(),
		]);
	});

	createEffect(() => {
		if (parentMenuContext !== undefined || optionalMenubarContext === undefined)
			return;
		if (optionalMenubarContext.value() === rootContext.value()!) {
			triggerRef()?.focus();
			if (optionalMenubarContext.autoFocusMenu()) open(true);
		} else close();
	});

	createEffect(() => {
		if (parentMenuContext !== undefined || optionalMenubarContext === undefined)
			return;
		if (disclosureState.isOpen())
			optionalMenubarContext.setValue(rootContext.value()!);
	});

	onCleanup(() => {
		if (parentMenuContext !== undefined) return;
		optionalMenubarContext?.unregisterMenu(rootContext.value()!);
	});

	const dataset: Accessor<MenuDataSet> = createMemo(() => ({
		"data-expanded": disclosureState.isOpen() ? "" : undefined,
		"data-closed": !disclosureState.isOpen() ? "" : undefined,
	}));

	const context: MenuContextValue = {
		dataset,
		isOpen: disclosureState.isOpen,
		contentPresent,
		nestedMenus,
		currentPlacement,
		pointerGraceTimeoutId: () => pointerGraceTimeoutId,
		autoFocus: focusStrategy,
		listState: () => listState,
		parentMenuContext: () => parentMenuContext,
		triggerRef,
		contentRef,
		triggerId,
		contentId,
		setTriggerRef,
		setContentRef,
		open,
		close,
		toggle,
		focusContent,
		onItemEnter,
		onItemLeave,
		onTriggerLeave,
		setPointerDir: (dir: Side) => (pointerDir = dir),
		setPointerGraceTimeoutId: (id: number) => (pointerGraceTimeoutId = id),
		setPointerGraceIntent: (intent: GraceIntent | null) =>
			(pointerGraceIntent = intent),
		registerNestedMenu,
		registerItemToParentDomCollection: parentDomCollectionContext?.registerItem,
		registerTriggerId: createRegisterId(setTriggerId),
		registerContentId: createRegisterId(setContentId),
	};

	return (
		<DomCollectionProvider>
			<MenuContext.Provider value={context}>
				<Show
					when={optionalNavigationMenuContext === undefined}
					fallback={others.children}
				>
					<Popper
						anchorRef={triggerRef}
						contentRef={contentRef}
						onCurrentPlacementChange={setCurrentPlacement}
						{...others}
					/>
				</Show>
			</MenuContext.Provider>
		</DomCollectionProvider>
	);
}
