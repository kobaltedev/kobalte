import type { Accessor } from "solid-js";

import {
	type CreateControllableSignalProps,
	createControllableSignal,
} from "../primitives";
import { Selection } from "./types";

/**
 * Creates a simple reactive `Selection` state with a getter, setter and a fallback value of an empty selection,
 * that can be controlled with `value` and `onChange` props.
 */
export function createControllableSelectionSignal(
	props: CreateControllableSignalProps<Selection>,
) {
	const [_value, setValue] = createControllableSignal(props);

	const value: Accessor<Selection> = () => _value() ?? new Selection();

	return [value, setValue] as const;
}
