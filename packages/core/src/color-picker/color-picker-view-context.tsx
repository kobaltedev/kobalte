import { Accessor, createContext, createEffect, createSignal, useContext } from "solid-js";
import { Color, ColorChannel } from "./utils/convert";
import { createStore } from "solid-js/store";
import { useColorPickerContext } from "./color-picker-context";

/**
 * This context enables area components to change the context color mode
 */
interface ColorPickerViewContextValue {
	provider: Accessor<Color>;
	data: Accessor<number[] | undefined>;
	setChannel: (channel: ColorChannel, value: number) => void;
	setColor: (newColor: number[]) => void;
}

const ColorPickerViewContext = createContext<ColorPickerViewContextValue>();

export const useColorPickerViewContext = function() {
	return useContext(ColorPickerViewContext)
}

export interface ColorPickerAreaContextProviderProps {
	children: any;
	provider: Color;
	onChange?: (data: number[]) => void;
}

export function ColorPickerAreaContextProvider(props: ColorPickerAreaContextProviderProps) {
	const [provider, setProvider] = createSignal(props.provider);
	const [data, setData] = createStore<number[]>([]);
	const parent = useColorPickerViewContext();
	const picker = useColorPickerContext();
	const setChannel = (channel: ColorChannel, newValue: number) => {
		if (channel == "alpha") {
			picker.setAlpha(newValue);
			return;
		}
		const indexOfModifiedChannel = provider().channels.indexOf(channel);
		if (indexOfModifiedChannel === -1) {
			throw new Error(`[kobalte]: color picker area of type ${provider().constructor.name} does not support channel ${channel}`);
		}
		setData(indexOfModifiedChannel, newValue);
		if (parent) {
			const coreData = provider().toCoreColor(data);
			parent.setColor(parent.provider().fromCoreColor(coreData));
		}
		props?.onChange?.(data);
	};
	const setColor = (newColor: number[]) => {
		setData(newColor);
		if (parent) {
			const coreData = provider().toCoreColor(data);
			parent.setColor(parent.provider().fromCoreColor(coreData));
		}
		props?.onChange?.(data);
	};
	if (parent) {
		createEffect(() => {
			const newParentData = provider().toCoreColor(parent.data()!);
			const newCurrentData = provider().toCoreColor(data);
			if (newCurrentData !== data) {
				setData(provider().fromCoreColor(newParentData));
			}
		});
	}

	return (
		<ColorPickerViewContext.Provider value={{ provider, data: () => data, setChannel, setColor }}>
			{props.children}
		</ColorPickerViewContext.Provider>
	);
}

