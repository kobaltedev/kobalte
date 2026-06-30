/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2023-2025 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/resizable
 */

import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	createEffect,
	createMemo,
	createSignal,
	omit,
	type Setter,
	untrack,
} from "solid-js";
import { createControllableSignal } from "../primitives";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	ResizableContext,
	ResizableInternalContext,
	type ResizableContextValue,
	type ResizableInternalContextValue,
	type ResizableSize,
	type ResizeStrategy,
} from "./resizable-context";
import {
	deltaResize,
	fixToPrecision,
	resizePanel,
	resolveSize,
	splitPanels,
	type ResizablePanelData,
	type ResizablePanelInstance,
} from "./resizable-lib";

export interface ResizableRootOptions {
	/**
	 * Orientation of the resizable layout.
	 * @defaultValue "horizontal"
	 */
	orientation?: "horizontal" | "vertical";
	/** Controlled panel sizes as fractions (0–1). */
	sizes?: number[];
	/** Fired when panel sizes change. */
	onSizesChange?: (sizes: number[]) => void;
	/**
	 * Initial sizes. Overridden by `initialSize` on individual `<Resizable.Panel>` components.
	 */
	initialSizes?: ResizableSize[];
	/**
	 * Delta applied when resizing with arrow keys.
	 * @defaultValue 0.1
	 */
	keyboardDelta?: ResizableSize;
	/**
	 * Whether the component manages the global cursor style during resize.
	 * @defaultValue true
	 */
	handleCursorStyle?: boolean;
}

export interface ResizableRootCommonProps<T extends HTMLElement = HTMLElement> {
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties | string;
	children: JSX.Element | ((props: ResizableRootChildrenProps) => JSX.Element);
}

export interface ResizableRootRenderProps extends ResizableRootCommonProps {
	"data-orientation": "horizontal" | "vertical";
	"data-kb-resizable-root": "";
}

export type ResizableRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ResizableRootOptions & Partial<ResizableRootCommonProps<ElementOf<T>>>;

export interface ResizableRootChildrenProps {
	/** Current orientation of the layout. */
	orientation: "horizontal" | "vertical";
	/** Current panel sizes as fractions (0–1). */
	sizes: number[];
	/** Directly set all panel sizes. */
	setSizes: Setter<number[]>;
	/** Delta applied per arrow-key press. */
	keyboardDelta: ResizableSize;
	/** Whether the global cursor style is managed during resize. */
	handleCursorStyle: boolean;
	/** Resize panel at `panelIndex` to the given size. */
	resize: (panelIndex: number, size: ResizableSize, strategy?: ResizeStrategy) => void;
	/** Collapse panel at `panelIndex` to its `collapsedSize`. */
	collapse: (panelIndex: number, strategy?: ResizeStrategy) => void;
	/** Expand panel at `panelIndex` from its collapsed state. */
	expand: (panelIndex: number, strategy?: ResizeStrategy) => void;
}

/**
 * Wrapper that manages the resizable layout and coordinates panels and handles.
 *
 * **Credit:** Resize algorithms and handle interaction adapted from
 * [corvu/resizable](https://github.com/corvudev/corvu/tree/main/packages/resizable)
 * by Jasmin Noetzli (MIT).
 *
 * @data `data-kb-resizable-root` - Present on every root element.
 * @data `data-orientation` - The orientation of the resizable.
 */
type ResolvedRootProps = ResizableRootOptions &
	Partial<ResizableRootCommonProps> & {
		orientation: "horizontal" | "vertical";
		initialSizes: ResizableSize[];
		keyboardDelta: ResizableSize;
		handleCursorStyle: boolean;
	};

export function ResizableRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ResizableRootProps<T>>,
) {
	const p = mergeDefaultProps(
		{
			orientation: "horizontal" as "horizontal" | "vertical",
			initialSizes: [] as ResizableSize[],
			keyboardDelta: 0.1 as ResizableSize,
			handleCursorStyle: true,
		},
		props as ResizableRootProps,
	) as ResolvedRootProps;

	const others = omit(
		p,
		"orientation",
		"sizes",
		"onSizesChange",
		"initialSizes",
		"keyboardDelta",
		"handleCursorStyle",
		"ref",
		"style",
		"children",
	);

	const [sizes, setSizes] = createControllableSignal<number[]>({
		value: () => p.sizes,
		defaultValue: () => [],
		onChange: p.onSizesChange,
	}) as unknown as [import("solid-js").Accessor<number[]>, Setter<number[]>];

	const [ref, setRef] = createSignal<HTMLElement | null>(null);
	const [rootSize, setRootSize] = createSignal(0);

	createEffect(
		() => ({ el: ref(), orientation: p.orientation }),
		({ el, orientation }) => {
			if (!el) return;
			const measure = () => {
				setRootSize(
					orientation === "horizontal" ? el.offsetWidth : el.offsetHeight,
				);
			};
			measure();
			const obs = new ResizeObserver(measure);
			obs.observe(el);
			return () => obs.disconnect();
		},
	);

	const [panels, setPanels] = createSignal<ResizablePanelInstance[]>([]);
	// Mutable sync shadow of panels() — same fix as liveSizes. Both panels
	// register in the same flush cycle, so panels() is stale ([]) for the
	// second registration, making both compute panelIndex=0 and reversing
	// sizesToIds order.
	let livePanels: ResizablePanelInstance[] = [];
	const sizesToIds: string[] = [];

	// Mutable sync shadow of the sizes signal. In Solid 2.0 all writes are
	// auto-batched (microtask), so two panels registering in the same flush
	// cycle would both see the pre-flush sizes() value. liveSizes is updated
	// synchronously inside registerPanel/unregisterPanel so sequential
	// registrations chain correctly without waiting for a flush.
	let liveSizes: number[] = [];

	// Keep liveSizes in sync when sizes are driven from outside (controlled mode).
	createEffect(
		() => sizes(),
		(newSizes) => { liveSizes = [...newSizes]; },
	);

	const registerPanel = (panelData: ResizablePanelData): ResizablePanelInstance => {
		// Use livePanels (not panels()) — panels() is stale when multiple
		// panels register in the same flush cycle.
		const panelIndex = livePanels.filter(
			(panel) =>
				!!(
					panelData.element.compareDocumentPosition(panel.data.element) &
					Node.DOCUMENT_POSITION_PRECEDING
				),
		).length;

		const idExists =
			sizesToIds[panelIndex] === undefined ||
			sizesToIds[panelIndex] === panelData.id;
		// Use liveSizes (not sizes()) so we see updates from panels that
		// registered earlier in this same flush cycle.
		const sizeExists = liveSizes[panelIndex] !== undefined;

		let panelSize: number | null = null;
		if (panelData.initialSize !== undefined) {
			panelSize = resolveSize(panelData.initialSize, rootSize());
		} else if (p.initialSizes[panelIndex] !== undefined && idExists) {
			panelSize = resolveSize(p.initialSizes[panelIndex]!, rootSize());
		}
		panelSize = panelSize ?? 0.5;

		// Compute on liveSizes, update it synchronously, then queue the signal.
		let newSizes = [...liveSizes];
		const previousTotal = newSizes.reduce((s, x) => s + x, 0);

		if (((idExists && !sizeExists) || !idExists) && previousTotal === 1) {
			const offsetPerPanel = panelSize! / newSizes.length;
			newSizes = newSizes.map((s) => s - offsetPerPanel);
		}

		if (idExists) {
			if (!sizeExists) newSizes[panelIndex] = panelSize!;
			sizesToIds[panelIndex] = panelData.id;
		} else {
			newSizes.splice(panelIndex, 0, panelSize!);
			sizesToIds.splice(panelIndex, 0, panelData.id);
		}

		liveSizes = newSizes;
		setSizes([...newSizes]);

		const panelSizeMemo = createMemo(() => {
			const index = sizesToIds.indexOf(panelData.id);
			// Guard against transitional undefined during batched flush.
			return sizes()[index] ?? 0;
		});

		createEffect(
			() => panelSizeMemo(),
			(size) => { panelData.onResize?.(size); },
		);

		const panel: ResizablePanelInstance = {
			data: panelData,
			size: panelSizeMemo,
			resize: (size, strategy) =>
				resize(sizesToIds.indexOf(panelData.id), size, strategy),
			collapse: (strategy) =>
				collapse(sizesToIds.indexOf(panelData.id), strategy),
			expand: (strategy) =>
				expand(sizesToIds.indexOf(panelData.id), strategy),
		};

		livePanels = [...livePanels, panel].sort((a, b) =>
			a.data.element.compareDocumentPosition(b.data.element) &
			Node.DOCUMENT_POSITION_FOLLOWING
				? -1
				: 1,
		);
		setPanels((prev) => {
			const next = [...prev, panel];
			next.sort((a, b) =>
				a.data.element.compareDocumentPosition(b.data.element) &
				Node.DOCUMENT_POSITION_FOLLOWING
					? -1
					: 1,
			);
			return next;
		});

		return panel;
	};

	const unregisterPanel = (id: string) => {
		livePanels = livePanels.filter((panel) => panel.data.id !== id);
		setPanels((prev) => prev.filter((panel) => panel.data.id !== id));
		const idx = sizesToIds.indexOf(id);
		sizesToIds.splice(idx, 1);
		let newSizes = [...liveSizes];
		newSizes.splice(idx, 1);
		const total = newSizes.reduce((s, x) => s + x, 0);
		const offsetPerPanel = (total - 1) / newSizes.length;
		newSizes = newSizes.map((s) => s + offsetPerPanel);
		liveSizes = newSizes;
		setSizes([...newSizes]);
	};

	const resize = (
		panelIndex: number,
		size: ResizableSize,
		strategy?: ResizeStrategy,
	) => {
		untrack(() => {
			const panel = panels()[panelIndex];
			if (!panel) return;
			const minSize = resolveSize(panel.data.minSize, rootSize());
			const maxSize = resolveSize(panel.data.maxSize, rootSize());
			const newSize = resolveSize(size, rootSize());
			const allowed = Math.max(minSize, Math.min(newSize, maxSize));
			const delta = allowed - sizes()[panelIndex]!;
			resizePanel({
				deltaPercentage: delta,
				strategy: strategy ?? "both",
				panel,
				panels: panels(),
				initialSizes: panels().map((panel) => panel.size()),
				// collapsible: true so resize can expand a previously-collapsed panel.
				// The delta is already clamped to [minSize, maxSize] via `allowed`,
				// so resize cannot accidentally collapse a non-collapsed panel.
				collapsible: true,
				resizableData: {
					rootSize: rootSize(),
					orientation: p.orientation,
					setSizes,
				},
			});
		});
	};

	const collapse = (panelIndex: number, strategy?: ResizeStrategy) => {
		untrack(() => {
			const panel = panels()[panelIndex];
			if (!panel) return;
			const panelSize = sizes()[panelIndex]!;
			const collapsedSize = resolveSize(
				panel.data.collapsedSize ?? 0,
				rootSize(),
			);
			if (!panel.data.collapsible || panelSize === collapsedSize) return;
			resizePanel({
				deltaPercentage: collapsedSize - panelSize,
				strategy: strategy ?? "both",
				panel,
				panels: panels(),
				initialSizes: panels().map((panel) => panel.size()),
				collapsible: true,
				resizableData: {
					rootSize: rootSize(),
					orientation: p.orientation,
					setSizes,
				},
			});
		});
	};

	const expand = (panelIndex: number, strategy?: ResizeStrategy) => {
		untrack(() => {
			const panel = panels()[panelIndex];
			if (!panel) return;
			const panelSize = sizes()[panelIndex]!;
			const collapsedSize = resolveSize(
				panel.data.collapsedSize ?? 0,
				rootSize(),
			);
			if (!panel.data.collapsible || panelSize !== collapsedSize) return;
			const minSize = resolveSize(panel.data.minSize, rootSize());
			resizePanel({
				deltaPercentage: minSize - panelSize,
				strategy: strategy ?? "both",
				panel,
				panels: panels(),
				initialSizes: panels().map((panel) => panel.size()),
				collapsible: true,
				resizableData: {
					rootSize: rootSize(),
					orientation: p.orientation,
					setSizes,
				},
			});
		});
	};

	let initialSizes: number[] | null = null;
	let altKeyCache = false;

	const onDrag = (handle: HTMLElement, delta: number, altKey: boolean) => {
		if (initialSizes === null || altKeyCache !== altKey) {
			initialSizes = panels().map((panel) => panel.size());
			altKeyCache = altKey;
		}
		deltaResize({
			deltaPercentage: delta / rootSize(),
			altKey,
			handle,
			panels: panels(),
			initialSizes,
			resizableData: {
				rootSize: rootSize(),
				handleCursorStyle: p.handleCursorStyle,
				orientation: p.orientation,
				setSizes,
			},
		});
	};

	const onKeyDown = (
		handle: HTMLElement,
		event: KeyboardEvent,
		altKey: boolean,
	) => {
		if (event.key === "Enter") {
			const [precedingPanels, followingPanels] = splitPanels({
				panels: panels(),
				focusedElement: handle,
			});
			let collapsiblePanel = precedingPanels[precedingPanels.length - 1];
			if (!collapsiblePanel || !collapsiblePanel.data.collapsible) {
				collapsiblePanel = followingPanels[0];
				if (!collapsiblePanel || !collapsiblePanel.data.collapsible) return;
			}
			const size = collapsiblePanel.size();
			const collapsedSize = resolveSize(
				collapsiblePanel.data.collapsedSize ?? 0,
				rootSize(),
			);
			if (size === collapsedSize) {
				collapsiblePanel.expand("following");
			} else {
				collapsiblePanel.collapse("following");
			}
			return;
		}

		let deltaPercentage: number | null = null;
		if (
			(p.orientation === "horizontal" && event.key === "ArrowLeft") ||
			(p.orientation === "vertical" && event.key === "ArrowUp") ||
			event.key === "Home"
		) {
			deltaPercentage =
				event.shiftKey || event.key === "Home"
					? -1
					: -resolveSize(p.keyboardDelta, rootSize());
		} else if (
			(p.orientation === "horizontal" && event.key === "ArrowRight") ||
			(p.orientation === "vertical" && event.key === "ArrowDown") ||
			event.key === "End"
		) {
			deltaPercentage =
				event.shiftKey || event.key === "End"
					? 1
					: resolveSize(p.keyboardDelta, rootSize());
		}

		if (deltaPercentage === null) return;
		event.preventDefault();

		deltaResize({
			deltaPercentage,
			altKey,
			handle,
			panels: panels(),
			initialSizes: panels().map((panel) => panel.size()),
			resizableData: {
				rootSize: rootSize(),
				handleCursorStyle: false,
				orientation: p.orientation,
				setSizes,
			},
		});
	};

	const childrenProps: ResizableRootChildrenProps = {
		get orientation() {
			return p.orientation;
		},
		get sizes() {
			return sizes();
		},
		setSizes,
		get keyboardDelta() {
			return p.keyboardDelta;
		},
		get handleCursorStyle() {
			return p.handleCursorStyle;
		},
		resize,
		collapse,
		expand,
	};

	const ctxValue: ResizableContextValue = {
		orientation: () => p.orientation,
		sizes,
		setSizes,
		keyboardDelta: () => p.keyboardDelta,
		handleCursorStyle: () => p.handleCursorStyle,
		resize,
		collapse,
		expand,
	};

	const internalCtxValue: ResizableInternalContextValue = {
		...ctxValue,
		rootSize,
		panels,
		registerPanel,
		unregisterPanel,
		onDrag,
		onDragEnd: () => { initialSizes = null; },
		onKeyDown,
	};

	return (
		<ResizableContext value={ctxValue}>
			<ResizableInternalContext value={internalCtxValue}>
				<div
					ref={mergeRefs(setRef, p.ref as any)}
					style={combineStyle(
						{
							display: "flex",
							"flex-direction": p.orientation === "horizontal" ? "row" : "column",
							overflow: "hidden",
						},
						p.style,
					)}
					data-orientation={p.orientation}
					data-kb-resizable-root=""
					{...others}
				>
					{typeof p.children === "function"
						? (p.children as (props: ResizableRootChildrenProps) => JSX.Element)(
								childrenProps,
							)
						: p.children}
				</div>
			</ResizableInternalContext>
		</ResizableContext>
	);
}
