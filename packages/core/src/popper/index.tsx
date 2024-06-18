import {
	PopperArrow as Arrow,
	type PopperArrowCommonProps,
	type PopperArrowOptions,
	type PopperArrowProps,
	type PopperArrowRenderProps,
} from "./popper-arrow";
import {
	PopperContext as Context,
	type PopperContextValue,
	usePopperContext,
} from "./popper-context";
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
	PopperContextValue,
	PopperPositionerOptions,
	PopperPositionerCommonProps,
	PopperPositionerRenderProps,
	PopperPositionerProps,
	PopperRootOptions,
	PopperRootProps,
};
export { Arrow, Context, usePopperContext, Positioner, Root };

export const Popper = Object.assign(Root, {
	Arrow,
	Context,
	usePopperContext,
	Positioner,
});
