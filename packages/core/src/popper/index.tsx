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
	PopperPositioner as Positioner,
	type PopperPositionerCommonProps,
	type PopperPositionerOptions,
	type PopperPositionerProps,
	type PopperPositionerRenderProps,
} from "./popper-positioner";
import {
	PopperRoot as Root,
	type PopperRootOptions,
	type PopperRootProps,
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
