/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/dismissable/src/dismissable-layer.ts
 */

import { contains, getDocument, mergeRefs } from "@kobalte/utils";
import { type ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	createEffect,
	createMemo,
	omit,
	onSettled,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type FocusOutsideEvent,
	type InteractOutsideEvent,
	type PointerDownOutsideEvent,
	interactOutside,
} from "@solid-primitives/interaction";
import { createShortcut } from "@solid-primitives/keyboard";
import {
	DismissableLayerContext,
	type DismissableLayerContextValue,
	useOptionalDismissableLayerContext,
} from "./dismissable-layer-context";
import { layerStack } from "./layer-stack";

export interface DismissableLayerOptions {
	/**
	 * When `true`, hover/focus/click interactions will be disabled on elements outside
	 * the layer. Users will need to click twice on outside elements to
	 * interact with them: once to close the layer, and again to trigger the element.
	 */
	disableOutsidePointerEvents?: boolean;

	/** A list of elements that should not dismiss the layer when interacted with. */
	excludedElements?: Array<Accessor<HTMLElement | undefined>>;

	/**
	 * Event handler called when the escape key is down.
	 * Can be prevented.
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;

	/**
	 * Event handler called when a `pointerdown` event happens outside the layer.
	 * Can be prevented.
	 */
	onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

	/**
	 * Event handler called when the focus moves outside the layer.
	 * Can be prevented.
	 */
	onFocusOutside?: (event: FocusOutsideEvent) => void;

	/**
	 * Event handler called when an interaction happens outside the layer.
	 * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
	 * Can be prevented.
	 */
	onInteractOutside?: (event: InteractOutsideEvent) => void;

	/** Handler called when the layer should be dismissed. */
	onDismiss?: () => void;

	/** Whether to ignore the "top most layer" check on interact outside. */
	bypassTopMostLayerCheck?: boolean;
}

export interface DismissableLayerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: T | ((el: T) => void);
}

export interface DismissableLayerRenderProps
	extends DismissableLayerCommonProps {}

export type DismissableLayerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DismissableLayerOptions &
	Partial<DismissableLayerCommonProps<ElementOf<T>>>;

export function DismissableLayer<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DismissableLayerProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const parentContext = useOptionalDismissableLayerContext();
	const others = omit(props as DismissableLayerProps, "ref", "disableOutsidePointerEvents", "excludedElements", "onEscapeKeyDown", "onPointerDownOutside", "onFocusOutside", "onInteractOutside", "onDismiss", "bypassTopMostLayerCheck");
	const isPointerBlocking = createMemo(() => props.disableOutsidePointerEvents);
	const nestedLayers = new Set<Element>([]);

	const registerNestedLayer = (element: Element) => {
		nestedLayers.add(element);

		const parentUnregister = parentContext?.registerNestedLayer(element);

		return () => {
			nestedLayers.delete(element);
			parentUnregister?.();
		};
	};

	const shouldExcludeElement = (element: Element) => {
		if (!ref) {
			return false;
		}

		return (
			props.excludedElements?.some((node) => contains(node(), element)) ||
			[...nestedLayers].some((layer) => contains(layer, element))
		);
	};

	const onPointerDownOutside = (e: PointerDownOutsideEvent) => {
		if (!ref || layerStack.isBelowPointerBlockingLayer(ref)) {
			return;
		}

		if (!props.bypassTopMostLayerCheck && !layerStack.isTopMostLayer(ref)) {
			return;
		}

		props.onPointerDownOutside?.(e);
		props.onInteractOutside?.(e);

		if (!e.defaultPrevented) {
			props.onDismiss?.();
		}
	};

	const onFocusOutside = (e: FocusOutsideEvent) => {
		props.onFocusOutside?.(e);
		props.onInteractOutside?.(e);

		if (!e.defaultPrevented) {
			props.onDismiss?.();
		}
	};

	const interactOutsideRef = interactOutside({
		shouldExcludeElement,
		onPointerDownOutside,
		onFocusOutside,
	});
	createShortcut(["Escape"], (e) => {
		if (!e || !ref || !layerStack.isTopMostLayer(ref)) {
			return;
		}

		props.onEscapeKeyDown?.(e);

		if (!e.defaultPrevented && props.onDismiss) {
			e.preventDefault();
			props.onDismiss();
		}
	}, { preventDefault: false });

	onSettled(() => {
		if (!ref) {
			return;
		}

		layerStack.addLayer({
			node: ref,
			isPointerBlocking: isPointerBlocking(),
			dismiss: props.onDismiss,
		});

		const unregisterFromParentLayer = parentContext?.registerNestedLayer(ref);

		layerStack.assignPointerEventToLayers();

		layerStack.disableBodyPointerEvents(ref);

		return () => {
			if (!ref) {
				return;
			}

			layerStack.removeLayer(ref);

			unregisterFromParentLayer?.();

			// Re-assign pointer event to remaining layers.
			layerStack.assignPointerEventToLayers();

			layerStack.restoreBodyPointerEvents(ref);
		};
	});

	createEffect(
		() => ({ ref, disabled: isPointerBlocking() }),
		({ ref, disabled: disableOutsidePointerEvents }) => {
			if (!ref) return;

			const layer = layerStack.find(ref);

			if (layer && layer.isPointerBlocking !== disableOutsidePointerEvents) {
				// Keep layer in sync with the prop.
				layer.isPointerBlocking = disableOutsidePointerEvents;

				// Update layers pointer-events since this layer "isPointerBlocking" has changed.
				layerStack.assignPointerEventToLayers();
			}

			if (disableOutsidePointerEvents) {
				layerStack.disableBodyPointerEvents(ref);
			}

			return () => {
				layerStack.restoreBodyPointerEvents(ref);
			};
		},
		{ defer: true },
	);

	const context: DismissableLayerContextValue = {
		registerNestedLayer,
	};

	// TODO: restore <Polymorphic> once @solidjs/web Dynamic/spread passes ref callbacks correctly
	return (
		<DismissableLayerContext value={context}>
			<div
				ref={mergeRefs(el => { ref = el; }, interactOutsideRef as (el: HTMLElement) => void, props.ref as any)}
				{...(others as any)}
			>
				{(others as any).children}
			</div>
		</DismissableLayerContext>
	);
}
