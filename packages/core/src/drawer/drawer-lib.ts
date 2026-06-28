/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/tree/main/packages/drawer
 */

export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerSize = number | `${number}px`;

export type ResolvedSnapPoint = {
	value: DrawerSize;
	offset: number;
};

type ResolvedSnapPointWithBreakPoints = ResolvedSnapPoint & {
	upperBreakPoint?: number;
	lowerBreakPoint?: number;
};

/** Resolves a snap point (fraction 0-1 or `Npx`) to a pixel offset from the open edge. */
export function resolveSnapPoint(
	snapPoint: DrawerSize,
	drawerSize: number,
	index?: number,
	breakPoints?: (DrawerSize | null)[],
): ResolvedSnapPointWithBreakPoints {
	if (index === undefined || breakPoints === undefined) {
		return { value: snapPoint, offset: resolvePoint(snapPoint, drawerSize) };
	}

	const upperBreakPoint =
		breakPoints[index - 1] != null
			? resolvePoint(breakPoints[index - 1]!, drawerSize)
			: undefined;

	const lowerBreakPoint =
		breakPoints[index] != null
			? resolvePoint(breakPoints[index]!, drawerSize)
			: undefined;

	return {
		value: snapPoint,
		offset: resolvePoint(snapPoint, drawerSize),
		lowerBreakPoint,
		upperBreakPoint,
	};
}

export function resolvePoint(point: DrawerSize, drawerSize: number): number {
	if (typeof point === "number") return drawerSize - point * drawerSize;
	if (!point.endsWith("px"))
		throw new Error(
			`[kobalte]: Drawer snap/break points must be a fraction (0–1) or a string ending with 'px'. Got "${point}"`,
		);
	return drawerSize - parseInt(point, 10);
}

export function findClosestSnapPoint(
	snapPoints: ResolvedSnapPointWithBreakPoints[],
	offset: number,
	offsetWithVelocity: number,
	allowSkipping: boolean,
): ResolvedSnapPointWithBreakPoints {
	const target = allowSkipping ? offsetWithVelocity : offset;
	const upper = findNearby("upper", snapPoints, target);
	const lower = findNearby("lower", snapPoints, target);

	if (!upper) return lower!;
	if (!lower) return upper;

	if (
		lower.upperBreakPoint === undefined ||
		upper.lowerBreakPoint === undefined
	) {
		return Math.abs(lower.offset - offsetWithVelocity) <
			Math.abs(upper.offset - offsetWithVelocity)
			? lower
			: upper;
	}

	return offsetWithVelocity < upper.lowerBreakPoint ? lower : upper;
}

function findNearby(
	side: "upper" | "lower",
	snapPoints: ResolvedSnapPointWithBreakPoints[],
	offset: number,
): ResolvedSnapPointWithBreakPoints | undefined {
	return snapPoints.reduce<ResolvedSnapPointWithBreakPoints | undefined>(
		(prev, cur) => {
			if (side === "upper") {
				if (cur.offset >= offset && (!prev || cur.offset < prev.offset))
					return cur;
			} else {
				if (cur.offset <= offset && (!prev || cur.offset > prev.offset))
					return cur;
			}
			return prev;
		},
		undefined,
	);
}

/**
 * Returns false if the pointer-down target (or any ancestor up to `stopAt`)
 * is an interactive element (button, link, text input, textarea, select, contenteditable)
 * or has `data-no-drag`. Interactive elements handle their own pointer events and should
 * not be hijacked by the drag system — this prevents a race where clicking a CloseButton
 * briefly sets pointerDown=true, a tiny pointer movement triggers a snap, and the ensuing
 * transition-state race leaves the drawer stuck mounted with pointer-events:none on the body.
 */
export function locationIsDraggable(
	location: HTMLElement,
	stopAt: HTMLElement,
	pointerType: string,
): boolean {
	let el: HTMLElement | null = location;
	let stopReached = false;

	do {
		if (
			el.hasAttribute("data-no-drag") ||
			el.tagName === "BUTTON" ||
			el.tagName === "A" ||
			el.tagName === "TEXTAREA" ||
			el.hasAttribute("contenteditable") ||
			(el.tagName === "INPUT" && (el as HTMLInputElement).type !== "range") ||
			(el.tagName === "SELECT" && pointerType === "mouse")
		) {
			return false;
		}
		if (el === stopAt) {
			stopReached = true;
		} else {
			el = el.parentElement;
		}
	} while (el && !stopReached);

	return true;
}

/** Runs `fn` after the browser has painted (double-rAF). */
export function afterPaint(fn: () => void): void {
	requestAnimationFrame(() => requestAnimationFrame(fn));
}
