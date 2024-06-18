/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/HiddenSelect.tsx
 */

import type { ComponentProps } from "solid-js";

import { HiddenSelectBase } from "./hidden-select-base";
import { useSelectContext } from "./select-context";

export type SelectHiddenSelectProps = ComponentProps<"select">;

export function SelectHiddenSelect(props: SelectHiddenSelectProps) {
	const context = useSelectContext();

	return (
		<HiddenSelectBase
			collection={context.listState().collection()}
			selectionManager={context.listState().selectionManager()}
			isOpen={context.isOpen()}
			isMultiple={context.isMultiple()}
			isVirtualized={context.isVirtualized()}
			focusTrigger={() => context.triggerRef()?.focus()}
			{...props}
		/>
	);
}
