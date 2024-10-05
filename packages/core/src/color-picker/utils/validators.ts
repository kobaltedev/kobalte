import { useColorPickerViewContext } from "../color-picker-view-context";
import { ColorChannel } from "./convert";

export function colorScopeHasChannels(channels: ColorChannel[]) {
	const scope = useColorPickerViewContext()
	if (!scope) {
		throw new Error("[kobalte]: color picker area not found")
	}
	const scopeChannels = Object.values(scope.provider().channels)
	if (!channels.every(channel => scopeChannels.includes(channel))) {
		throw new Error(`[kobalte]: color picker area of type ${scope.provider().constructor.name} does not support channels ${channels.join(", ")}`)
	}
}
