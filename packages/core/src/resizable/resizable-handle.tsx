/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2023-2025 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/resizable
 */

import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	createEffect,
	createMemo,
	createSignal,
	omit,
	Show,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useResizableInternalContext } from "./resizable-context";
import {
	fixToPrecision,
	registerHandle,
	resolveSize,
	splitPanels,
	unregisterHandle,
	type DragTarget,
	type HandleCallbacks,
	type HoverState,
	type ResizableHandleInstance,
} from "./resizable-lib";

export interface ResizableHandleOptions {
	/**
	 * Whether the handle allows intersection at its start edge (left/top).
	 * @defaultValue true
	 */
	startIntersection?: boolean;
	/**
	 * Whether the handle allows intersection at its end edge (right/bottom).
	 * @defaultValue true
	 */
	endIntersection?: boolean;
	/**
	 * Whether Alt-key resize mode is enabled. `'only'` makes it the exclusive resize method.
	 * @defaultValue true
	 */
	altKey?: boolean | "only";
	/** Fired when the handle starts being dragged. Call `event.preventDefault()` to cancel. */
	onHandleDragStart?: (event: PointerEvent) => void;
	/** Fired while the handle is being dragged. Call `event.preventDefault()` to cancel. */
	onHandleDrag?: (event: CustomEvent) => void;
	/** Fired when the handle drag ends. */
	onHandleDragEnd?: (event: PointerEvent | TouchEvent | MouseEvent) => void;
}

export interface ResizableHandleCommonProps<T extends HTMLElement = HTMLElement> {
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties | string;
	disabled: boolean | undefined;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onKeyUp: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseEnter: JSX.EventHandlerUnion<T, MouseEvent>;
	onMouseLeave: JSX.EventHandlerUnion<T, MouseEvent>;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	children: JSX.Element;
}

export interface ResizableHandleRenderProps extends ResizableHandleCommonProps {
	role: "separator";
	"aria-controls": string | undefined;
	"aria-orientation": "horizontal" | "vertical";
	"aria-valuemax": number | undefined;
	"aria-valuemin": number | undefined;
	"aria-valuenow": number | undefined;
	"data-active": "" | undefined;
	"data-dragging": "" | undefined;
	"data-orientation": "horizontal" | "vertical";
	"data-kb-resizable-handle": "";
}

export type ResizableHandleProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ResizableHandleOptions & Partial<ResizableHandleCommonProps<ElementOf<T>>>;

type ResolvedHandleProps = ResizableHandleOptions &
	Partial<ResizableHandleCommonProps> & {
		startIntersection: boolean;
		endIntersection: boolean;
		altKey: boolean | "only";
	};

/**
 * A drag handle placed between two `<Resizable.Panel>` elements.
 *
 * @data `data-kb-resizable-handle` - Present on every handle element.
 * @data `data-active` - Present when the handle is active (hovered, focused, or being dragged).
 * @data `data-dragging` - Present while the handle is being dragged.
 * @data `data-orientation` - The orientation of the resizable.
 */
export function ResizableHandle<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, ResizableHandleProps<T>>,
) {
	const p = mergeDefaultProps(
		{
			startIntersection: true,
			endIntersection: true,
			altKey: true as boolean | "only",
		},
		props as ResizableHandleProps,
	) as ResolvedHandleProps;

	const others = omit(
		p,
		"startIntersection",
		"endIntersection",
		"altKey",
		"onHandleDragStart",
		"onHandleDrag",
		"onHandleDragEnd",
		"ref",
		"style",
		"disabled",
		"children",
		"onMouseEnter",
		"onMouseLeave",
		"onKeyDown",
		"onKeyUp",
		"onFocus",
		"onBlur",
		"onPointerDown",
	);

	const [ref, setRef] = createSignal<HTMLElement | null>(null);

	const [hoveredAsIntersection, setHoveredAsIntersection] = createSignal(false);
	const [hovered, setHovered] = createSignal<HoverState>(null);
	const [focused, setFocused] = createSignal(false);
	const [active, setActive] = createSignal(false);
	const [dragging, setDragging] = createSignal(false);

	const [startIntersection, setStartIntersection] =
		createSignal<ResizableHandleInstance | null>(null);
	const [endIntersection, setEndIntersection] =
		createSignal<ResizableHandleInstance | null>(null);

	const context = useResizableInternalContext();

	const ariaInformation = createMemo(() => {
		const handle = ref();
		if (!handle) return undefined;

		const panels = context.panels();
		const [precedingPanels, followingPanels] = splitPanels({
			panels,
			focusedElement: handle,
		});

		const ariaControls = precedingPanels[precedingPanels.length - 1]?.data.id;
		const ariaValueMax = fixToPrecision(
			followingPanels.reduce(
				(acc, panel) =>
					acc - resolveSize(panel.data.minSize, context.rootSize()),
				1,
			),
		);
		const ariaValueMin = fixToPrecision(
			precedingPanels.reduce(
				(acc, panel) =>
					acc + resolveSize(panel.data.minSize, context.rootSize()),
				0,
			),
		);
		const ariaValueNow = fixToPrecision(
			precedingPanels.reduce(
				(acc, panel) => acc + panel.size(),
				0,
			),
		);

		return { ariaControls, ariaValueMax, ariaValueMin, ariaValueNow };
	});

	let globalHandleCallbacks: HandleCallbacks | null = null;

	// Register the handle once the element is mounted (and re-register if disabled changes).
	createEffect(
		() => ({ el: ref(), disabled: p.disabled }),
		({ el, disabled }) => {
			if (disabled === true || !el) return;

			const globalHandle: ResizableHandleInstance = {
				element: el,
				orientation: context.orientation(),
				handleCursorStyle: context.handleCursorStyle,
				altKey: p.altKey,
				startIntersection: {
					handle: startIntersection,
					setHandle: (h) => {
						if (p.startIntersection !== true) return;
						setStartIntersection(h);
					},
				},
				endIntersection: {
					handle: endIntersection,
					setHandle: (h) => {
						if (p.endIntersection !== true) return;
						setEndIntersection(h);
					},
				},
				hovered,
				focused,
				hoveredAsIntersection,
				setHoveredAsIntersection,
				active,
				setActive,
				dragging,
				setDragging,
				onDrag: (delta: number, altKey: boolean) => {
					if (p.onHandleDrag !== undefined) {
						const dragEvent = new CustomEvent("drag", { cancelable: true });
						p.onHandleDrag(dragEvent);
						if (dragEvent.defaultPrevented) return;
					}
					context.onDrag(el, delta, altKey);
				},
				onDragEnd: (event) => {
					p.onHandleDragEnd?.(event);
					context.onDragEnd();
				},
			};

			globalHandleCallbacks = registerHandle(globalHandle);
			return () => {
				unregisterHandle(globalHandle);
				globalHandleCallbacks = null;
			};
		},
	);

	// Notify the handle manager whenever hover state changes.
	createEffect(
		() => hovered(),
		(newHovered) => {
			globalHandleCallbacks?.onHoveredChange(newHovered);
		},
	);

	const onMouseEnter: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
		callHandler(e, p.onMouseEnter as any);
		if (p.disabled === true) return;
		setHovered("handle");
	};

	const onMouseLeave: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
		callHandler(e, p.onMouseLeave as any);
		setHovered(null);
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = (e) => {
		callHandler(e, p.onKeyDown as any);
		if (dragging()) return;
		const el = ref();
		if (!el) return;
		const useAltKey =
			p.altKey === "only" || (p.altKey !== false && e.altKey);
		context.onKeyDown(el, e, useAltKey);
	};

	const onKeyUp: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = (e) => {
		callHandler(e, p.onKeyUp as any);
		if (e.key !== "Tab") return;
		setFocused(true);
	};

	const onFocus: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = (e) => {
		callHandler(e, p.onFocus as any);
		if (hovered()) return;
		setFocused(true);
		setActive(true);
	};

	const onBlur: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = (e) => {
		callHandler(e, p.onBlur as any);
		setFocused(false);
		if (hovered()) return;
		setActive(false);
	};

	const onPointerDown: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = (e) => {
		callHandler(e, p.onPointerDown as any);
		if (callHandler(e, p.onHandleDragStart as any)) return;

		const targetElement = e.target as HTMLElement;
		targetElement.setPointerCapture(e.pointerId);

		let target: DragTarget = "handle";
		if (targetElement.hasAttribute("data-kb-resizable-handle-start-intersection")) {
			target = "startIntersection";
		}
		if (targetElement.hasAttribute("data-kb-resizable-handle-end-intersection")) {
			target = "endIntersection";
		}
		globalHandleCallbacks?.onDragStart(e, target);
	};

	return (
		<button
			ref={mergeRefs(setRef, p.ref as any)}
			type="button"
			style={combineStyle(
				{
					position: "relative",
					cursor: context.handleCursorStyle() ? "inherit" : undefined,
					"touch-action": "none",
					"flex-shrink": 0,
				},
				p.style,
			)}
			disabled={p.disabled}
			onBlur={onBlur}
			onFocus={onFocus}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onPointerDown={onPointerDown}
			role="separator"
			aria-controls={ariaInformation()?.ariaControls}
			aria-orientation={context.orientation()}
			aria-valuemax={ariaInformation()?.ariaValueMax}
			aria-valuemin={ariaInformation()?.ariaValueMin}
			aria-valuenow={ariaInformation()?.ariaValueNow}
			data-active={active() ? "" : undefined}
			data-dragging={dragging() ? "" : undefined}
			data-orientation={context.orientation()}
			data-kb-resizable-handle=""
			{...others}
		>
			<Show when={startIntersection()}>
				<div
					data-kb-resizable-handle-start-intersection
					onMouseEnter={() => setHovered("startIntersection")}
					onMouseLeave={(e) => {
						if (ref()?.contains(e.relatedTarget as HTMLElement)) {
							setHovered("handle");
						} else {
							setHovered(null);
						}
					}}
					style={{
						position: "absolute",
						"aspect-ratio": "1 / 1",
						top: 0,
						left: 0,
						height: context.orientation() === "horizontal" ? undefined : "100%",
						width: context.orientation() === "horizontal" ? "100%" : undefined,
						transform:
							context.orientation() === "horizontal"
								? "translate3d(0, -100%, 0)"
								: "translate3d(-100%, 0, 0)",
						"z-index": 1,
					}}
				/>
			</Show>
			{p.children}
			<Show when={endIntersection()}>
				<div
					data-kb-resizable-handle-end-intersection
					onMouseEnter={() => setHovered("endIntersection")}
					onMouseLeave={(e) => {
						if (ref()?.contains(e.relatedTarget as HTMLElement)) {
							setHovered("handle");
						} else {
							setHovered(null);
						}
					}}
					style={{
						position: "absolute",
						"aspect-ratio": "1 / 1",
						bottom: 0,
						right: 0,
						height: context.orientation() === "horizontal" ? undefined : "100%",
						width: context.orientation() === "horizontal" ? "100%" : undefined,
						transform:
							context.orientation() === "horizontal"
								? "translate3d(0, 100%, 0)"
								: "translate3d(100%, 0, 0)",
						"z-index": 1,
					}}
				/>
			</Show>
		</button>
	);
}
