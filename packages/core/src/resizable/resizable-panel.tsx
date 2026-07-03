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
	createUniqueId,
	omit,
	untrack,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useResizableInternalContext } from "./resizable-context";
import {
	ResizablePanelContext,
	type ResizablePanelContextValue,
} from "./resizable-panel-context";
import {
	resolveSize,
	type ResizablePanelInstance,
	type ResizableSize,
	type ResizeStrategy,
} from "./resizable-lib";

export interface ResizablePanelOptions {
	/**
	 * Initial size as a fraction (0–1) or pixel string. Prefer fractions for SSR to avoid layout shifts.
	 */
	initialSize?: ResizableSize;
	/**
	 * Minimum size.
	 * @defaultValue 0
	 */
	minSize?: ResizableSize;
	/**
	 * Maximum size.
	 * @defaultValue 1
	 */
	maxSize?: ResizableSize;
	/**
	 * Whether this panel can be fully collapsed.
	 * @defaultValue false
	 */
	collapsible?: boolean;
	/**
	 * Size the panel collapses to.
	 * @defaultValue 0
	 */
	collapsedSize?: ResizableSize;
	/**
	 * How much the user must overdrag to trigger collapse.
	 * @defaultValue 0.05
	 */
	collapseThreshold?: ResizableSize;
	/** Fired when the panel is resized. */
	onResize?: (size: number) => void;
	/** Fired when the panel collapses. */
	onCollapse?: (size: number) => void;
	/** Fired when the panel expands. */
	onExpand?: (size: number) => void;
	/**
	 * The `id` attribute of the panel element.
	 * @defaultValue `createUniqueId()`
	 */
	panelId?: string;
}

export interface ResizablePanelCommonProps<T extends HTMLElement = HTMLElement> {
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties | string;
	children: JSX.Element | ((props: ResizablePanelChildrenProps) => JSX.Element);
}

export interface ResizablePanelRenderProps extends ResizablePanelCommonProps {
	id: string;
	"data-collapsed": "" | undefined;
	"data-expanded": "" | undefined;
	"data-orientation": "horizontal" | "vertical";
	"data-kb-resizable-panel": "";
}

export type ResizablePanelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ResizablePanelOptions & Partial<ResizablePanelCommonProps<ElementOf<T>>>;

export interface ResizablePanelChildrenProps {
	/** Current size of this panel as a fraction (0–1). */
	size: number;
	/** Configured minimum size. */
	minSize: ResizableSize;
	/** Configured maximum size. */
	maxSize: ResizableSize;
	/** Whether the panel can be fully collapsed. */
	collapsible: boolean;
	/** Size the panel collapses to. */
	collapsedSize: ResizableSize;
	/** Overdrag threshold required to trigger collapse. */
	collapseThreshold: ResizableSize;
	/** Whether the panel is currently collapsed. */
	collapsed: boolean;
	/** Resize this panel to a specific size. */
	resize: (size: ResizableSize, strategy?: ResizeStrategy) => void;
	/** Collapse this panel to its `collapsedSize`. */
	collapse: (strategy?: ResizeStrategy) => void;
	/** Expand this panel from its collapsed state. */
	expand: (strategy?: ResizeStrategy) => void;
	/** The HTML `id` attribute of the panel element. */
	panelId: string;
}

/**
 * A panel inside `<Resizable.Root>`. Its `flex-basis` is driven by the root's size state.
 *
 * @data `data-kb-resizable-panel` - Present on every panel element.
 * @data `data-orientation` - The orientation of the resizable.
 * @data `data-collapsed` - Present when the panel is collapsed.
 * @data `data-expanded` - Present when a collapsible panel is expanded.
 */
type ResolvedPanelProps = ResizablePanelOptions &
	Partial<ResizablePanelCommonProps> & {
		initialSize: ResizableSize | undefined;
		minSize: ResizableSize;
		maxSize: ResizableSize;
		collapsible: boolean;
		collapsedSize: ResizableSize;
		collapseThreshold: ResizableSize;
		panelId: string;
	};

export function ResizablePanel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ResizablePanelProps<T>>,
) {
	const p = mergeDefaultProps(
		{
			initialSize: undefined as ResizableSize | undefined,
			minSize: 0 as ResizableSize,
			maxSize: 1 as ResizableSize,
			collapsible: false,
			collapsedSize: 0 as ResizableSize,
			collapseThreshold: 0.05 as ResizableSize,
			panelId: createUniqueId(),
		},
		props as ResizablePanelProps,
	) as ResolvedPanelProps;

	const others = omit(
		p,
		"initialSize",
		"minSize",
		"maxSize",
		"collapsible",
		"collapsedSize",
		"collapseThreshold",
		"onResize",
		"onCollapse",
		"onExpand",
		"panelId",
		"ref",
		"style",
		"children",
	);

	const [ref, setRef] = createSignal<HTMLElement | null>(null);
	const context = useResizableInternalContext();
	const [panelInstance, setPanelInstance] = createSignal<ResizablePanelInstance | null>(null);

	createEffect(
		() => ref(),
		(el): (() => void) | void => {
			if (!el) return;
			const instance = untrack(() =>
				context.registerPanel({
					id: p.panelId,
					element: el,
					initialSize: p.initialSize,
					minSize: p.minSize,
					maxSize: p.maxSize,
					collapsible: p.collapsible,
					collapsedSize: p.collapsedSize,
					collapseThreshold: p.collapseThreshold,
					onResize: p.onResize,
				}),
			);
			setPanelInstance(instance);
			return () => {
				context.unregisterPanel(instance.data.id);
				setPanelInstance(null);
			};
		},
	);

	const panelSize = () => {
		const instance = panelInstance();
		if (!instance) {
			return typeof p.initialSize === "number" ? p.initialSize : 1;
		}
		return instance.size();
	};

	const collapsed = createMemo<boolean>((prev = false) => {
		const instance = panelInstance();
		if (!p.collapsible) return false;

		const isCollapsed = instance
			? instance.size() ===
				resolveSize(p.collapsedSize, context.rootSize())
			: false;

		if (instance && prev !== isCollapsed) {
			if (isCollapsed) p.onCollapse?.(instance.size());
			else p.onExpand?.(instance.size());
		}

		return isCollapsed;
	});

	const resize = (size: ResizableSize, strategy?: ResizeStrategy) => {
		const instance = panelInstance();
		if (!instance) {
			console.warn("[kobalte]: Cannot resize a Resizable.Panel before it is mounted.");
			return;
		}
		instance.resize(size, strategy ?? "both");
	};

	const collapse = (strategy?: ResizeStrategy) => {
		const instance = panelInstance();
		if (!instance) {
			console.warn("[kobalte]: Cannot collapse a Resizable.Panel before it is mounted.");
			return;
		}
		instance.collapse(strategy ?? "both");
	};

	const expand = (strategy?: ResizeStrategy) => {
		const instance = panelInstance();
		if (!instance) {
			console.warn("[kobalte]: Cannot expand a Resizable.Panel before it is mounted.");
			return;
		}
		instance.expand(strategy ?? "both");
	};

	const childrenProps: ResizablePanelChildrenProps = {
		get size() { return panelSize(); },
		get minSize() { return p.minSize; },
		get maxSize() { return p.maxSize; },
		get collapsible() { return p.collapsible; },
		get collapsedSize() { return p.collapsedSize; },
		get collapseThreshold() { return p.collapseThreshold; },
		get collapsed() { return collapsed(); },
		resize,
		collapse,
		expand,
		get panelId() { return p.panelId; },
	};

	const ctxValue: ResizablePanelContextValue = {
		size: panelSize,
		minSize: () => p.minSize,
		maxSize: () => p.maxSize,
		collapsible: () => p.collapsible,
		collapsedSize: () => p.collapsedSize,
		collapseThreshold: () => p.collapseThreshold,
		collapsed,
		resize,
		collapse,
		expand,
		panelId: () => p.panelId,
	};

	return (
		<ResizablePanelContext value={ctxValue}>
			<div
				ref={mergeRefs(setRef, p.ref as any)}
				id={p.panelId}
				style={combineStyle(
					p.style,
					{
						// flex-basis must come after user style — combineStyle gives
						// the last argument priority, and flex-basis drives layout.
						"flex-basis": `${panelSize() * 100}%`,
						"flex-shrink": 0,
						overflow: "hidden",
					},
				)}
				data-collapsed={collapsed() ? "" : undefined}
				data-expanded={p.collapsible && !collapsed() ? "" : undefined}
				data-orientation={context.orientation()}
				data-kb-resizable-panel=""
				{...others}
			>
				{typeof p.children === "function"
					? (p.children as (props: ResizablePanelChildrenProps) => JSX.Element)(
							childrenProps,
						)
					: p.children}
			</div>
		</ResizablePanelContext>
	);
}
