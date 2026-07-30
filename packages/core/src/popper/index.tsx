import {
	PopperArrow as Arrow,
	type PopperArrowCommonProps,
	type PopperArrowOptions,
	type PopperArrowProps,
	type PopperArrowRenderProps,
} from "./popper-arrow.tsx";
import {
	PopperContext as Context,
	usePopperContext,
} from "./popper-context.tsx";
import {
	type PopperPositionerCommonProps,
	type PopperPositionerOptions,
	type PopperPositionerProps,
	type PopperPositionerRenderProps,
	PopperPositioner as Positioner,
} from "./popper-positioner.tsx";
import {
	type PopperRootOptions,
	type PopperRootProps,
	PopperRoot as Root,
} from "./popper-root.tsx";

export type {
	PopperArrowCommonProps,
	PopperArrowOptions,
	PopperArrowProps,
	PopperArrowRenderProps,
	PopperPositionerCommonProps,
	PopperPositionerOptions,
	PopperPositionerProps,
	PopperPositionerRenderProps,
	PopperRootOptions,
	PopperRootProps,
};
export { Arrow, Context, Positioner, Root };

export const Popper = Object.assign(Root, {
	Arrow,
	Context,
	usePopperContext,
	Positioner,
});

/**
 * API will most probably change
 */
export {
	type PopperContextValue,
	usePopperContext,
} from "./popper-context.tsx";
