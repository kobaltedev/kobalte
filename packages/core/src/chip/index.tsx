import {
	type ChipDeleteCommonProps,
	type ChipDeleteOptions,
	type ChipDeleteProps,
	type ChipDeleteRenderProps,
	ChipDelete as Delete,
} from "./chip-delete";
import {
	type ChipRootCommonProps,
	type ChipRootOptions,
	type ChipRootProps,
	type ChipRootRenderProps,
	ChipRoot as Root,
} from "./chip-root";

export type {
	ChipDeleteCommonProps,
	ChipDeleteOptions,
	ChipDeleteProps,
	ChipDeleteRenderProps,
	ChipRootCommonProps,
	ChipRootOptions,
	ChipRootProps,
	ChipRootRenderProps,
};
export { Delete, Root };

export const Chip = Object.assign(Root, {
	Delete,
});

/**
 * API will most probably change
 */
export { type ChipContextValue, useChipContext } from "./chip-context";
