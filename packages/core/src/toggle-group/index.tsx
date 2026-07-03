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

export type {
	ToggleGroupItemCommonProps,
	ToggleGroupItemOptions,
	ToggleGroupItemProps,
	ToggleGroupItemRenderProps,
	ToggleGroupRootCommonProps,
	ToggleGroupRootOptions,
	ToggleGroupRootProps,
	ToggleGroupRootRenderProps,
};
export { Item, Root };

export const ToggleGroup = Object.assign(Root, {
	Item,
});

/**
 * API will most probably change
 */
export {
	type ToggleGroupContextValue,
	useToggleGroupContext,
} from "./toggle-group-context";
