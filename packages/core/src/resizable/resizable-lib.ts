/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2023-2025 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/resizable
 */

import type { Accessor, Setter } from "solid-js";


/** A size value: a fraction (0–1) or a CSS pixel string like `"200px"`. */
export type ResizableSize = number | `${number}px`;

/**
 * Controls which neighbouring panels absorb the size change during a resize.
 * - `"preceding"` — only panels before the target give/receive space.
 * - `"following"` — only panels after the target give/receive space.
 * - `"both"` — space is shared symmetrically across both sides.
 */
export type ResizeStrategy = "preceding" | "following" | "both";

export type ResizablePanelData = {
	id: string;
	element: HTMLElement;
	initialSize: ResizableSize | undefined;
	minSize: ResizableSize;
	maxSize: ResizableSize;
	collapsible: boolean;
	collapsedSize?: ResizableSize;
	collapseThreshold?: ResizableSize;
	onResize?: (size: number) => void;
	onCollapse?: () => void;
	onExpand?: () => void;
};

export type ResizablePanelInstance = {
	data: ResizablePanelData;
	size: Accessor<number>;
	resize: (size: ResizableSize, strategy: ResizeStrategy) => void;
	collapse: (strategy: ResizeStrategy) => void;
	expand: (strategy: ResizeStrategy) => void;
};

export type ResizableHandleInstance = {
	element: HTMLElement;
	orientation: "horizontal" | "vertical";
	altKey: boolean | "only";
	handleCursorStyle: Accessor<boolean>;
	startIntersection: {
		handle: Accessor<ResizableHandleInstance | null>;
		setHandle: (handle: ResizableHandleInstance | null) => void;
	};
	endIntersection: {
		handle: Accessor<ResizableHandleInstance | null>;
		setHandle: (handle: ResizableHandleInstance | null) => void;
	};
	hovered: Accessor<HoverState>;
	focused: Accessor<boolean>;
	hoveredAsIntersection: Accessor<boolean>;
	setHoveredAsIntersection: Setter<boolean>;
	dragging: Accessor<boolean>;
	setDragging: Setter<boolean>;
	active: Accessor<boolean>;
	setActive: Setter<boolean>;
	onDrag: (delta: number, altKey: boolean) => void;
	onDragEnd: (event: PointerEvent | TouchEvent | MouseEvent) => void;
};

export type DragTarget = "handle" | "startIntersection" | "endIntersection";
export type HandleCallbacks = {
	onDragStart: (event: PointerEvent, target: DragTarget) => void;
	onHoveredChange: (state: HoverState) => void;
};

export type HoverState =
	| "handle"
	| "startIntersection"
	| "endIntersection"
	| null;
export type CursorStyle = "horizontal" | "vertical" | "both" | null;


const PRECISION = 6;

export const fixToPrecision = (value: number) =>
	parseFloat(value.toFixed(PRECISION));

export const resolveSize = (size: ResizableSize, rootSize: number) => {
	if (typeof size === "number") return size;
	if (!size.endsWith("px")) {
		throw new Error(
			`[kobalte]: Resizable sizes must be a number or a string ending with 'px'. Got ${size}`,
		);
	}
	return fixToPrecision(parseFloat(size) / rootSize);
};

export const splitPanels = (props: {
	panels: ResizablePanelInstance[];
	focusedElement: Element;
}): [ResizablePanelInstance[], ResizablePanelInstance[]] => {
	const preceding = props.panels.filter(
		(panel) =>
			!!(
				props.focusedElement.compareDocumentPosition(panel.data.element) &
				Node.DOCUMENT_POSITION_PRECEDING
			),
	);
	const following = props.panels.filter(
		(panel) =>
			!!(
				props.focusedElement.compareDocumentPosition(panel.data.element) &
				Node.DOCUMENT_POSITION_FOLLOWING
			),
	);
	return [preceding, following];
};


const getDistributablePercentage = (props: {
	desiredPercentage: number;
	initialSizes: number[];
	collapsible: boolean;
	resizeActions: {
		precedingPanels: ResizablePanelInstance[];
		followingPanels: ResizablePanelInstance[];
		negate?: boolean;
	}[];
	resizableData: { rootSize: number };
}) => {
	let distributablePercentage =
		props.desiredPercentage >= 0 ? Infinity : -Infinity;
	let newSizes = props.initialSizes;

	for (const resizeAction of props.resizeActions) {
		const desiredPercentage =
			resizeAction.negate !== true
				? props.desiredPercentage
				: -props.desiredPercentage;

		let [distributedPreceding, distributedSizesPreceding, collapsedPreceding] =
			distributePercentage({
				desiredPercentage,
				side: "preceding",
				panels: resizeAction.precedingPanels,
				initialSizes: newSizes,
				initialSizesStartIndex: 0,
				collapsible: props.collapsible,
				rootSize: props.resizableData.rootSize,
			});

		let [distributedFollowing, distributedSizesFollowing, collapsedFollowing] =
			distributePercentage({
				desiredPercentage,
				side: "following",
				panels: resizeAction.followingPanels,
				initialSizes: newSizes,
				initialSizesStartIndex: resizeAction.precedingPanels.length,
				collapsible: props.collapsible,
				rootSize: props.resizableData.rootSize,
			});

		if (resizeAction.negate === true) {
			distributedPreceding = -distributedPreceding;
			distributedFollowing = -distributedFollowing;
		}
		if (collapsedPreceding) distributedFollowing = distributedPreceding;
		if (collapsedFollowing) distributedPreceding = distributedFollowing;

		if (props.desiredPercentage >= 0) {
			distributablePercentage = Math.min(
				distributablePercentage,
				Math.min(distributedPreceding, distributedFollowing),
			);
		} else {
			distributablePercentage = Math.max(
				distributablePercentage,
				Math.max(distributedPreceding, distributedFollowing),
			);
		}

		newSizes = [...distributedSizesPreceding, ...distributedSizesFollowing];
	}

	return distributablePercentage;
};

const distributePercentage = (props: {
	desiredPercentage: number;
	side: "preceding" | "following";
	panels: ResizablePanelInstance[];
	initialSizes: number[];
	initialSizesStartIndex: number;
	collapsible: boolean;
	rootSize: number;
}): [number, number[], boolean] => {
	props.desiredPercentage = fixToPrecision(props.desiredPercentage);

	const resizeDirection = getResizeDirection({
		side: props.side,
		desiredPercentage: props.desiredPercentage,
	});
	let distributedPercentage = 0;
	const distributedSizes = props.initialSizes.slice(
		props.initialSizesStartIndex,
		props.initialSizesStartIndex + props.panels.length,
	);

	for (
		let i = props.side === "preceding" ? props.panels.length - 1 : 0;
		props.side === "preceding" ? i >= 0 : i < props.panels.length;
		props.side === "preceding" ? i-- : i++
	) {
		const panel = props.panels[i]!;
		const panelSize = props.initialSizes[i + props.initialSizesStartIndex]!;
		const collapsedSize = resolveSize(
			panel.data.collapsedSize ?? 0,
			props.rootSize,
		);
		if (panel.data.collapsible && panelSize === collapsedSize) continue;

		const availablePercentage = fixToPrecision(
			props.desiredPercentage - distributedPercentage,
		);
		if (availablePercentage === 0) break;

		switch (resizeDirection) {
			case "precedingDecreasing": {
				const minSize = resolveSize(panel.data.minSize, props.rootSize);
				distributedSizes[i] = Math.max(
					minSize,
					panelSize + availablePercentage,
				);
				distributedPercentage += distributedSizes[i]! - panelSize;
				break;
			}
			case "followingDecreasing": {
				const minSize = resolveSize(panel.data.minSize, props.rootSize);
				distributedSizes[i] = Math.max(
					minSize,
					panelSize - availablePercentage,
				);
				distributedPercentage -= distributedSizes[i]! - panelSize;
				break;
			}
			case "precedingIncreasing": {
				const maxSize = resolveSize(panel.data.maxSize, props.rootSize);
				distributedSizes[i] = Math.min(
					maxSize,
					panelSize + availablePercentage,
				);
				distributedPercentage += distributedSizes[i]! - panelSize;
				break;
			}
			case "followingIncreasing": {
				const maxSize = resolveSize(panel.data.maxSize, props.rootSize);
				distributedSizes[i] = Math.min(
					maxSize,
					panelSize - availablePercentage,
				);
				distributedPercentage -= distributedSizes[i]! - panelSize;
				break;
			}
		}
	}

	distributedPercentage = fixToPrecision(distributedPercentage);

	if (!props.collapsible || distributedPercentage === props.desiredPercentage) {
		return [distributedPercentage, distributedSizes, false];
	}

	const panelIndex = props.side === "preceding" ? props.panels.length - 1 : 0;
	const panel = props.panels[panelIndex]!;
	if (!panel.data.collapsible) {
		return [distributedPercentage, distributedSizes, false];
	}

	const availablePercentage = fixToPrecision(
		props.desiredPercentage - distributedPercentage,
	);
	let collapsed = false;

	const panelSize =
		props.initialSizes[panelIndex + props.initialSizesStartIndex]!;
	const minSize = resolveSize(panel.data.minSize, props.rootSize);
	const collapsedSize = resolveSize(
		panel.data.collapsedSize ?? 0,
		props.rootSize,
	);
	const collapseThreshold = Math.min(
		resolveSize(panel.data.collapseThreshold ?? 0, props.rootSize),
		minSize - collapsedSize,
	);
	const isCollapsed = panelSize === collapsedSize;

	if (
		resizeDirection === "precedingDecreasing" &&
		!isCollapsed &&
		Math.abs(availablePercentage) >= collapseThreshold
	) {
		distributedPercentage -= distributedSizes[panelIndex]! - panelSize;
		distributedSizes[panelIndex] = collapsedSize;
		distributedPercentage += distributedSizes[panelIndex]! - panelSize;
		collapsed = true;
	} else if (
		resizeDirection === "precedingIncreasing" &&
		isCollapsed &&
		Math.abs(availablePercentage) >= collapseThreshold
	) {
		distributedSizes[panelIndex] = resolveSize(
			panel.data.minSize,
			props.rootSize,
		);
		if (Math.abs(availablePercentage) >= minSize - collapsedSize) {
			const maxSize = resolveSize(panel.data.maxSize, props.rootSize);
			distributedSizes[panelIndex] = Math.min(
				maxSize,
				panelSize + availablePercentage,
			);
		} else {
			collapsed = true;
		}
		distributedPercentage += distributedSizes[panelIndex]! - panelSize;
	} else if (
		resizeDirection === "followingDecreasing" &&
		!isCollapsed &&
		Math.abs(availablePercentage) >= collapseThreshold
	) {
		distributedPercentage += distributedSizes[panelIndex]! - panelSize;
		distributedSizes[panelIndex] = collapsedSize;
		distributedPercentage -= distributedSizes[panelIndex]! - panelSize;
		collapsed = true;
	} else if (
		resizeDirection === "followingIncreasing" &&
		isCollapsed &&
		Math.abs(availablePercentage) >= collapseThreshold
	) {
		distributedSizes[panelIndex] = resolveSize(
			panel.data.minSize,
			props.rootSize,
		);
		if (Math.abs(availablePercentage) >= minSize - collapsedSize) {
			const maxSize = resolveSize(panel.data.maxSize, props.rootSize);
			distributedSizes[panelIndex] = Math.min(
				maxSize,
				panelSize - availablePercentage,
			);
		} else {
			collapsed = true;
		}
		distributedPercentage -= distributedSizes[panelIndex]! - panelSize;
	}

	return [distributedPercentage, distributedSizes, collapsed];
};

const getResizeDirection = (props: {
	side: "preceding" | "following";
	desiredPercentage: number;
}) => {
	switch (props.side) {
		case "preceding":
			return props.desiredPercentage >= 0
				? "precedingIncreasing"
				: "precedingDecreasing";
		case "following":
			return props.desiredPercentage >= 0
				? "followingDecreasing"
				: "followingIncreasing";
	}
};

const applyResize = (props: {
	initialSizes: number[];
	collapsible: boolean;
	resizeActions: {
		precedingPanels: ResizablePanelInstance[];
		followingPanels: ResizablePanelInstance[];
		deltaPercentage: number;
	}[];
	resizableData: {
		rootSize: number;
		orientation: "horizontal" | "vertical";
		setSizes: Setter<number[]>;
	};
}) => {
	let newSizes = props.initialSizes;

	for (const resizeAction of props.resizeActions) {
		const [, preceding] = distributePercentage({
			desiredPercentage: resizeAction.deltaPercentage,
			side: "preceding",
			panels: resizeAction.precedingPanels,
			initialSizes: newSizes,
			initialSizesStartIndex: 0,
			collapsible: props.collapsible,
			rootSize: props.resizableData.rootSize,
		});
		const [, following] = distributePercentage({
			desiredPercentage: resizeAction.deltaPercentage,
			side: "following",
			panels: resizeAction.followingPanels,
			initialSizes: newSizes,
			initialSizesStartIndex: resizeAction.precedingPanels.length,
			collapsible: props.collapsible,
			rootSize: props.resizableData.rootSize,
		});
		newSizes = [...preceding, ...following];
	}

	newSizes = newSizes.map(fixToPrecision);
	const totalSize = newSizes.reduce((s, x) => s + x, 0);
	if (totalSize !== 1) {
		const offsetPerPanel = (totalSize - 1) / newSizes.length;
		newSizes = newSizes.map((s) => s - offsetPerPanel);
	}

	props.resizableData.setSizes(newSizes.map(fixToPrecision));
};

export const resizePanel = (props: {
	deltaPercentage: number;
	strategy: ResizeStrategy;
	panel: ResizablePanelInstance;
	panels: ResizablePanelInstance[];
	initialSizes: number[];
	collapsible: boolean;
	resizableData: {
		rootSize: number;
		orientation: "horizontal" | "vertical";
		setSizes: Setter<number[]>;
	};
}) => {
	let [precedingPanels, followingPanels] = splitPanels({
		panels: props.panels,
		focusedElement: props.panel.data.element,
	});

	const panelIndex = props.panels.indexOf(props.panel);
	if (panelIndex === 0) props.strategy = "following";
	else if (panelIndex === props.panels.length - 1) props.strategy = "preceding";

	if (props.strategy === "both") {
		const precedingIncluding = [...precedingPanels, props.panel];
		const followingIncluding = [props.panel, ...followingPanels];

		const distributable = getDistributablePercentage({
			desiredPercentage: props.deltaPercentage / 2,
			initialSizes: props.initialSizes,
			collapsible: true,
			resizeActions: [
				{ precedingPanels: precedingIncluding, followingPanels },
				{
					precedingPanels,
					followingPanels: followingIncluding,
					negate: true,
				},
			],
			resizableData: { rootSize: props.resizableData.rootSize },
		});

		applyResize({
			initialSizes: props.initialSizes,
			collapsible: true,
			resizeActions: [
				{
					precedingPanels: precedingIncluding,
					followingPanels,
					deltaPercentage: distributable,
				},
				{
					precedingPanels,
					followingPanels: followingIncluding,
					deltaPercentage: -distributable,
				},
			],
			resizableData: props.resizableData,
		});
	} else {
		precedingPanels =
			props.strategy === "preceding"
				? precedingPanels
				: [...precedingPanels, props.panel];
		followingPanels =
			props.strategy === "following"
				? followingPanels
				: [props.panel, ...followingPanels];

		if (props.strategy === "preceding") props.deltaPercentage = -props.deltaPercentage;

		const distributable = getDistributablePercentage({
			desiredPercentage: props.deltaPercentage,
			initialSizes: props.initialSizes,
			collapsible: props.collapsible,
			resizeActions: [{ precedingPanels, followingPanels }],
			resizableData: { rootSize: props.resizableData.rootSize },
		});

		applyResize({
			initialSizes: props.initialSizes,
			collapsible: true,
			resizeActions: [{ precedingPanels, followingPanels, deltaPercentage: distributable }],
			resizableData: props.resizableData,
		});
	}
};

export const deltaResize = (props: {
	deltaPercentage: number;
	altKey: boolean;
	handle: HTMLElement;
	panels: ResizablePanelInstance[];
	initialSizes: number[];
	resizableData: {
		rootSize: number;
		handleCursorStyle: boolean;
		orientation: "horizontal" | "vertical";
		setSizes: Setter<number[]>;
	};
}) => {
	if (props.altKey && props.panels.length > 2) {
		let panelIndex =
			props.panels.filter(
				(panel) =>
					!!(
						props.handle.compareDocumentPosition(panel.data.element) &
						Node.DOCUMENT_POSITION_PRECEDING
					),
			).length - 1;
		const isPrecedingHandle = panelIndex === 0;
		if (isPrecedingHandle) {
			panelIndex++;
			props.deltaPercentage = -props.deltaPercentage;
		}

		const panel = props.panels[panelIndex]!;
		const panelSize = props.initialSizes[panelIndex]!;
		const minDelta =
			resolveSize(panel.data.minSize, props.resizableData.rootSize) - panelSize;
		const maxDelta =
			resolveSize(panel.data.maxSize, props.resizableData.rootSize) - panelSize;
		const cappedDelta =
			Math.max(minDelta, Math.min(props.deltaPercentage * 2, maxDelta)) / 2;

		const [precedingPanels, followingPanels] = splitPanels({
			panels: props.panels,
			focusedElement: panel.data.element,
		});
		const precedingIncluding = [...precedingPanels, panel];
		const followingIncluding = [panel, ...followingPanels];

		const distributable = getDistributablePercentage({
			desiredPercentage: cappedDelta,
			initialSizes: props.initialSizes,
			collapsible: false,
			resizeActions: [
				{ precedingPanels: precedingIncluding, followingPanels },
				{ precedingPanels, followingPanels: followingIncluding, negate: true },
			],
			resizableData: { rootSize: props.resizableData.rootSize },
		});

		if (props.resizableData.handleCursorStyle) {
			handleResizeConstraints({
				orientation: props.resizableData.orientation,
				desiredPercentage: props.deltaPercentage,
				distributablePercentage: distributable,
				revertConstraints: isPrecedingHandle,
			});
		}

		applyResize({
			initialSizes: props.initialSizes,
			collapsible: false,
			resizeActions: [
				{
					precedingPanels: precedingIncluding,
					followingPanels,
					deltaPercentage: distributable,
				},
				{
					precedingPanels,
					followingPanels: followingIncluding,
					deltaPercentage: -distributable,
				},
			],
			resizableData: props.resizableData,
		});
	} else {
		const [precedingPanels, followingPanels] = splitPanels({
			panels: props.panels,
			focusedElement: props.handle,
		});

		const distributable = getDistributablePercentage({
			desiredPercentage: props.deltaPercentage,
			initialSizes: props.initialSizes,
			collapsible: true,
			resizeActions: [{ precedingPanels, followingPanels }],
			resizableData: { rootSize: props.resizableData.rootSize },
		});

		applyResize({
			initialSizes: props.initialSizes,
			collapsible: true,
			resizeActions: [{ precedingPanels, followingPanels, deltaPercentage: distributable }],
			resizableData: props.resizableData,
		});

		if (props.resizableData.handleCursorStyle) {
			const fixed = fixToPrecision(props.deltaPercentage);
			const fixedDist = fixToPrecision(distributable);

			let betweenCollapse = false;
			const precedingPanel = precedingPanels[precedingPanels.length - 1]!;
			if (precedingPanel.data.collapsible) {
				const collapsedSize = resolveSize(
					precedingPanel.data.collapsedSize ?? 0,
					props.resizableData.rootSize,
				);
				if (
					(precedingPanel.size() === collapsedSize && fixed > fixedDist) ||
					(precedingPanel.size() !== collapsedSize && fixed < fixedDist)
				) {
					betweenCollapse = true;
				}
			}
			const followingPanel = followingPanels[0]!;
			if (followingPanel.data.collapsible) {
				const collapsedSize = resolveSize(
					followingPanel.data.collapsedSize ?? 0,
					props.resizableData.rootSize,
				);
				if (
					(followingPanel.size() === collapsedSize && fixed < fixedDist) ||
					(followingPanel.size() !== collapsedSize && fixed > fixedDist)
				) {
					betweenCollapse = true;
				}
			}

			handleResizeConstraints({
				orientation: props.resizableData.orientation,
				desiredPercentage: props.deltaPercentage,
				distributablePercentage: distributable,
				betweenCollapse,
			});
		}
	}
};


let globalCursorStyle: CursorStyle = null;
let cursorStyleElement: HTMLStyleElement | null = null;
let globalResizeConstraints = 0b0000;
let cachedCursorStyle: string | null = null;

const constraintToCursorMap: Record<number, string> = {
	0b0001: "e-resize",
	0b0010: "w-resize",
	0b0011: "ew-resize",
	0b0100: "s-resize",
	0b1000: "n-resize",
	0b1100: "ns-resize",
	0b0101: "se-resize",
	0b1001: "ne-resize",
	0b0110: "sw-resize",
	0b1010: "nw-resize",
};

const updateCursorStyle = () => {
	if (!globalCursorStyle) {
		if (cursorStyleElement) {
			cachedCursorStyle = null;
			cursorStyleElement.remove();
			cursorStyleElement = null;
		}
		return;
	}

	let cursorStyle: string | null =
		constraintToCursorMap[globalResizeConstraints] ?? null;
	if (cursorStyle === null) {
		switch (globalCursorStyle) {
			case "horizontal":
				cursorStyle = "col-resize";
				break;
			case "vertical":
				cursorStyle = "row-resize";
				break;
			case "both":
				cursorStyle = "move";
				break;
		}
	}

	if (cursorStyle === cachedCursorStyle) return;
	cachedCursorStyle = cursorStyle;

	if (!cursorStyleElement) {
		cursorStyleElement = document.createElement("style");
		document.head.appendChild(cursorStyleElement);
	}
	cursorStyleElement.innerHTML = `*{cursor: ${cursorStyle}!important;}`;
};

const reportResizeConstraints = (
	orientation: "horizontal" | "vertical",
	constraints: number,
) => {
	switch (orientation) {
		case "horizontal":
			if (constraints === 0b01) {
				globalResizeConstraints |= 0b0001;
				globalResizeConstraints &= ~0b0010;
			} else if (constraints === 0b10) {
				globalResizeConstraints |= 0b0010;
				globalResizeConstraints &= ~0b0001;
			} else if (constraints === 0b11) {
				globalResizeConstraints |= 0b0011;
			} else {
				globalResizeConstraints &= ~0b0011;
			}
			break;
		case "vertical":
			if (constraints === 0b01) {
				globalResizeConstraints |= 0b0100;
				globalResizeConstraints &= ~0b1000;
			} else if (constraints === 0b10) {
				globalResizeConstraints |= 0b1000;
				globalResizeConstraints &= ~0b0100;
			} else if (constraints === 0b11) {
				globalResizeConstraints |= 0b1100;
			} else {
				globalResizeConstraints &= ~0b1100;
			}
			break;
	}
	updateCursorStyle();
};

export const resetResizeConstraints = () => {
	globalResizeConstraints = 0b0000;
	updateCursorStyle();
};

export const setGlobalCursorStyle = (cursorStyle: CursorStyle) => {
	globalCursorStyle = cursorStyle;
	updateCursorStyle();
};

export const handleResizeConstraints = (props: {
	orientation: "horizontal" | "vertical";
	desiredPercentage: number;
	distributablePercentage: number;
	revertConstraints?: boolean;
	betweenCollapse?: boolean;
}) => {
	if (
		fixToPrecision(props.distributablePercentage) !==
		fixToPrecision(props.desiredPercentage)
	) {
		let constraints: number;
		if (props.betweenCollapse === true) {
			constraints = 0b11;
		} else if (
			(props.desiredPercentage < props.distributablePercentage &&
				props.revertConstraints !== true) ||
			(props.desiredPercentage > props.distributablePercentage &&
				props.revertConstraints === true)
		) {
			constraints = 0b01;
		} else {
			constraints = 0b10;
		}
		reportResizeConstraints(props.orientation, constraints);
	} else {
		reportResizeConstraints(props.orientation, 0b00);
	}
};


const handles: ResizableHandleInstance[] = [];
let dragStartPos: { x: number; y: number } | null = null;
let globalHovered: HoverState = null;

const INTERSECTION_TOLERANCE = 1;
const equalsWithTolerance = (a: number, b: number) =>
	Math.abs(a - b) <= INTERSECTION_TOLERANCE;

export const registerHandle = (
	handle: ResizableHandleInstance,
): HandleCallbacks => {
	handles.push(handle);

	for (const h of handles) {
		for (const compare of handles) {
			if (h.orientation === compare.orientation || h.element === compare.element)
				continue;

			const hRect = h.element.getBoundingClientRect();
			const cRect = compare.element.getBoundingClientRect();

			if (h.orientation === "horizontal") {
				if (hRect.left > cRect.right || hRect.right < cRect.left) continue;
			}
			if (h.orientation === "vertical") {
				if (hRect.top > cRect.bottom || hRect.bottom < cRect.top) continue;
			}

			const isStart =
				h.orientation === "horizontal"
					? equalsWithTolerance(hRect.top, cRect.bottom)
					: equalsWithTolerance(hRect.left, cRect.right);
			const isEnd =
				h.orientation === "horizontal"
					? equalsWithTolerance(hRect.bottom, cRect.top)
					: equalsWithTolerance(hRect.right, cRect.left);

			if (isStart) h.startIntersection.setHandle(compare);
			if (isEnd) h.endIntersection.setHandle(compare);
		}
	}

	return {
		onDragStart: (event: PointerEvent, target: DragTarget) =>
			onDragStart(handle, event, target),
		onHoveredChange: (state: HoverState) => {
			globalHovered = state;
			const dragging = !!dragStartPos;
			let cursorStyle: CursorStyle | null = null;

			switch (state) {
				case "handle": {
					const startHandle = handle.startIntersection.handle();
					const endHandle = handle.endIntersection.handle();
					if (!dragging) {
						handle.setActive(true);
						startHandle?.setActive(false);
						endHandle?.setActive(false);
					}
					startHandle?.setHoveredAsIntersection(false);
					endHandle?.setHoveredAsIntersection(false);
					cursorStyle = handle.orientation;
					break;
				}
				case "startIntersection": {
					const startHandle = handle.startIntersection.handle();
					if (!dragging) startHandle?.setActive(true);
					startHandle?.setHoveredAsIntersection(true);
					cursorStyle = "both";
					break;
				}
				case "endIntersection": {
					const endHandle = handle.endIntersection.handle();
					if (!dragging) endHandle?.setActive(true);
					endHandle?.setHoveredAsIntersection(true);
					cursorStyle = "both";
					break;
				}
				case null: {
					const startHandle = handle.startIntersection.handle();
					const endHandle = handle.endIntersection.handle();
					if (!dragging && !handle.focused()) {
						handle.setActive(false);
						startHandle?.setActive(false);
						endHandle?.setActive(false);
					}
					startHandle?.setHoveredAsIntersection(false);
					endHandle?.setHoveredAsIntersection(false);
					cursorStyle = null;
					break;
				}
			}

			if (!dragging && handle.handleCursorStyle()) {
				setGlobalCursorStyle(cursorStyle);
			}
		},
	};
};

export const unregisterHandle = (handle: ResizableHandleInstance) => {
	handles.splice(handles.indexOf(handle), 1);
};

const onDragStart = (
	handle: ResizableHandleInstance,
	event: PointerEvent,
	target: DragTarget,
) => {
	dragStartPos = { x: event.clientX, y: event.clientY };
	handle.setDragging(true);
	if (target === "startIntersection") {
		handle.startIntersection.handle()?.setDragging(true);
	}
	if (target === "endIntersection") {
		handle.endIntersection.handle()?.setDragging(true);
	}
	window.addEventListener("pointermove", onPointerMove);
	window.addEventListener("touchmove", onTouchMove);
	window.addEventListener("pointerup", onDragEnd);
	window.addEventListener("touchend", onDragEnd);
	window.addEventListener("contextmenu", onDragEnd);
};

const onPointerMove = (event: PointerEvent) =>
	onMove(event.clientX, event.clientY, event.altKey);

const onTouchMove = (event: TouchEvent) => {
	if (!event.touches[0]) return;
	onMove(event.touches[0].clientX, event.touches[0].clientY, event.altKey);
};

let altKeyCache = false;

const onMove = (x: number, y: number, altKey: boolean) => {
	if (!dragStartPos) return;

	if (handles.some((h) => h.dragging() && h.altKey === "only")) altKey = true;
	if (handles.some((h) => h.dragging() && h.altKey === false)) altKey = false;

	if (altKeyCache !== altKey) {
		dragStartPos = { x, y };
		altKeyCache = altKey;
	}

	for (const handle of handles) {
		if (!handle.dragging()) continue;
		handle.onDrag(
			handle.orientation === "horizontal"
				? x - dragStartPos.x
				: y - dragStartPos.y,
			altKey,
		);
	}
};

const onDragEnd = (event: PointerEvent | TouchEvent | MouseEvent) => {
	for (const handle of handles) {
		if (!handle.dragging()) {
			if (handle.hovered() || handle.focused() || handle.hoveredAsIntersection()) {
				handle.setActive(true);
				if (handle.handleCursorStyle()) {
					setGlobalCursorStyle(handle.orientation);
				}
			}
		} else {
			handle.setDragging(false);
			handle.onDragEnd(event);
			if (!handle.hovered() && !handle.hoveredAsIntersection()) {
				handle.setActive(false);
			}
			if (!globalHovered && handle.handleCursorStyle()) {
				setGlobalCursorStyle(null);
			}
		}
	}

	resetResizeConstraints();
	dragStartPos = null;
	window.removeEventListener("pointermove", onPointerMove);
	window.removeEventListener("touchmove", onTouchMove);
	window.removeEventListener("pointerup", onDragEnd);
	window.removeEventListener("touchend", onDragEnd);
	window.removeEventListener("contextmenu", onDragEnd);
};
