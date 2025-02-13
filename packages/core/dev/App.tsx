import { ColorWheel } from "../src/color-wheel";

export default function App() {
	return (
		<>
			<ColorWheel class="ColorWheelRoot" thickness={30}>
				<ColorWheel.Track class="ColorWheelTrack">
					<ColorWheel.Thumb class="ColorWheelThumb">
						<ColorWheel.Input />
					</ColorWheel.Thumb>
				</ColorWheel.Track>
			</ColorWheel>
		</>
	);
}
