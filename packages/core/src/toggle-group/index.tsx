import type {
	ToggleGroupItemCommonProps,
	ToggleGroupItemOptions,
	ToggleGroupItemProps,
	ToggleGroupItemRenderProps,
} from "./toggle-group-item.tsx";
import { ToggleGroupItem as Item } from "./toggle-group-item.tsx";
import type {
	ToggleGroupRootCommonProps,
	ToggleGroupRootOptions,
	ToggleGroupRootProps,
	ToggleGroupRootRenderProps,
} from "./toggle-group-root.tsx";
import { ToggleGroup as Root } from "./toggle-group-root.tsx";

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
 * API will most change
 */
export {
	type ToggleGroupContextValue,
	useToggleGroupContext,
} from "./toggle-group-context.tsx";
