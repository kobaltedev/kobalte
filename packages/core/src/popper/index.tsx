import {
	PopperArrow as Arrow,
	type PopperArrowCommonProps,
	type PopperArrowOptions,
	type PopperArrowProps,
	type PopperArrowRenderProps,
} from "./popper-arrow";
import { PopperContext as Context, usePopperContext } from "./popper-context";
import {
	type PopperPositionerCommonProps,
	type PopperPositionerOptions,
	type PopperPositionerProps,
	type PopperPositionerRenderProps,
	PopperPositioner as Positioner,
} from "./popper-positioner";
import {
	type PopperRootOptions,
	type PopperRootProps,
	PopperRoot as Root,
} from "./popper-root";

export type {
	PopperArrowOptions,
	PopperArrowCommonProps,
	PopperArrowRenderProps,
	PopperArrowProps,
	PopperPositionerOptions,
	PopperPositionerCommonProps,
	PopperPositionerRenderProps,
	PopperPositionerProps,
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
export { usePopperContext, type PopperContextValue } from "./popper-context";
