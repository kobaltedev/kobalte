import { Accessor, createContext, createSignal, useContext } from "solid-js";
import { Color, ColorChannel } from "./utils/convert";

/**
 * This context enables area components to change the context color.
 */
interface ColorPickerAreaContextValue {
	provider: Accessor<Color>;
	set: (channel: ColorChannel, value: number) => void;
}

const ColorPickerAreaContext = createContext<ColorPickerAreaContextValue>();

export const useColorPickerAreaContext = function() {
	return useContext(ColorPickerAreaContext)
}

export function ColorPickerContextProvider(props: { children: any; value: Color }) {
	const [provider,setProvider] = createSignal(props.value);
	const parent = useColorPickerAreaContext();
	const set = (channel: ColorChannel, newValue: number) => {
		const color = provider();
	};
}

