import { Show, createSignal } from "solid-js";

import { VolumeOffIcon, VolumeOnIcon } from "../components";
import style from "./toggle-button.module.css";

import { ToggleButton } from "@kobalte/core/toggle-button";

export function BasicExample() {
	return (
		<ToggleButton class={style["toggle-button"]} aria-label="Mute">
			{(state) => (
				<Show
					when={state.pressed()}
					fallback={<VolumeOnIcon style={{ width: "24px", height: "24px" }} />}
				>
					<VolumeOffIcon style={{ width: "24px", height: "24px" }} />
				</Show>
			)}
		</ToggleButton>
	);
}

export function DefaultPressedExample() {
	return (
		<ToggleButton
			class={style["toggle-button"]}
			aria-label="Mute"
			defaultPressed
		>
			{(state) => (
				<Show
					when={state.pressed()}
					fallback={<VolumeOnIcon style={{ width: "24px", height: "24px" }} />}
				>
					<VolumeOffIcon style={{ width: "24px", height: "24px" }} />
				</Show>
			)}
		</ToggleButton>
	);
}

export function ControlledExample() {
	const [pressed, setPressed] = createSignal(false);

	return (
		<>
			<ToggleButton
				class={style["toggle-button"]}
				aria-label="Mute"
				pressed={pressed()}
				onChange={setPressed}
			>
				{(state) => (
					<Show
						when={state.pressed()}
						fallback={
							<VolumeOnIcon style={{ width: "24px", height: "24px" }} />
						}
					>
						<VolumeOffIcon style={{ width: "24px", height: "24px" }} />
					</Show>
				)}
			</ToggleButton>
			<p
				style={{ "font-size": "14px", "margin-top": "8px", "margin-bottom": 0 }}
			>
				The microphone is {pressed() ? "muted" : "active"}.
			</p>
		</>
	);
}
