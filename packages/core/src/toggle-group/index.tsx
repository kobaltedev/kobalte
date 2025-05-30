import type {
	ToggleGroupItemCommonProps,
	ToggleGroupItemOptions,
	ToggleGroupItemProps,
	ToggleGroupItemRenderProps,
} from "./toggle-group-item";
import { ToggleGroupItem as Item } from "./toggle-group-item";
import type {
	ToggleGroupRootCommonProps,
	ToggleGroupRootOptions,
	ToggleGroupRootProps,
	ToggleGroupRootRenderProps,
} from "./toggle-group-root";
import { ToggleGroup as Root } from "./toggle-group-root";

export { Item, Root };
export type {
	ToggleGroupItemOptions,
	ToggleGroupItemCommonProps,
	ToggleGroupItemRenderProps,
	ToggleGroupItemProps,
	ToggleGroupRootOptions,
	ToggleGroupRootCommonProps,
	ToggleGroupRootRenderProps,
	ToggleGroupRootProps,
};

export const ToggleGroup = Object.assign(Root, {
	Item,
});

/**
 * API will most probably change
 */
export {
	useToggleGroupContext,
	type ToggleGroupContextValue,
} from "./toggle-group-context";
