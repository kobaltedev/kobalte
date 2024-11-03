

import {
	Label,
	type LabelCommonProps,
	type LabelOptions,
	type LabelProps,
} from "./chip-label";

import {
	type ChipCommonProps,
	type ChipRootOptions,
	type ChipRootProps,
	Chip as Root,
} from "./chip-root";

export type {
	LabelCommonProps,
	LabelOptions,
	LabelProps,
	ChipCommonProps,
	ChipRootOptions,
	ChipRootProps,
};

export { Root, Label };

export const Chip = Object.assign(Root, {
	Label,
});
