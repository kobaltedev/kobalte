import type { JSX } from "solid-js";
import {
	type PinInputContextValue,
	usePinInputContext,
} from "./pin-input-root-provider";

export type PinInputContextProps = {
	children: (context: PinInputContextValue) => JSX.Element;
};

export const PinInputContext = (props: PinInputContextProps) =>
	props.children(usePinInputContext());
