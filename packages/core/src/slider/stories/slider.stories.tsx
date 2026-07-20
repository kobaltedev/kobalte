import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	Fill,
	Input,
	Label,
	Root,
	Thumb,
	Track,
	ValueLabel,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Slider",
	tags: ["autodocs"],
});

export default meta;

/** Single horizontal thumb at the default value. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<div class={style.root}>
			<Root defaultValue={[40]} class={style.sliderColumn}>
				<div class={style.labelRow}>
					<Label>Volume</Label>
					<ValueLabel />
				</div>
				<Track class={style.track}>
					<Fill class={style.fill} />
					<Thumb class={style.thumb}>
						<Input />
					</Thumb>
				</Track>
			</Root>
		</div>
	),
});

/** Controlled slider driven by a signal. */
function ControlledDemo() {
	const [value, setValue] = createSignal([25]);
	return (
		<div class={style.root}>
			<Root value={value()} onChange={setValue} class={style.sliderColumn}>
				<div class={style.labelRow}>
					<Label>Brightness</Label>
					<ValueLabel />
				</div>
				<Track class={style.track}>
					<Fill class={style.fill} />
					<Thumb class={style.thumb}>
						<Input />
					</Thumb>
				</Track>
			</Root>
			<p class={style.stateText}>
				Signal value: <strong>{value()[0]}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Range slider with two thumbs. */
export const RangeSlider = meta.story({
	name: "Range Slider",
	render: () => (
		<Root
			defaultValue={[20, 80]}
			minStepsBetweenThumbs={5}
			getValueLabel={({ values }) => `$${values[0]} – $${values[1]}`}
			class={`${style.sliderColumn} ${style.root}`}
		>
			<div class={style.labelRow}>
				<Label>Price range</Label>
				<ValueLabel />
			</div>
			<Track class={style.track}>
				<Fill class={style.fill} />
				<Thumb class={style.thumb}>
					<Input />
				</Thumb>
				<Thumb class={style.thumb}>
					<Input />
				</Thumb>
			</Track>
		</Root>
	),
});

/** Step size of 10. */
export const StepSize = meta.story({
	name: "Step Size",
	render: () => (
		<Root
			defaultValue={[50]}
			step={10}
			class={`${style.sliderColumn} ${style.root}`}
		>
			<div class={style.labelRow}>
				<Label>Opacity</Label>
				<ValueLabel />
			</div>
			<Track class={style.track}>
				<Fill class={style.fill} />
				<Thumb class={style.thumb}>
					<Input />
				</Thumb>
			</Track>
		</Root>
	),
});

/** Disabled slider — not interactive. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			defaultValue={[60]}
			disabled
			class={`${style.sliderColumn} ${style.root}`}
		>
			<div class={style.labelRow}>
				<Label>Locked</Label>
				<ValueLabel />
			</div>
			<Track class={style.trackDisabled}>
				<Fill class={style.fillDisabled} />
				<Thumb class={style.thumbDisabled}>
					<Input />
				</Thumb>
			</Track>
		</Root>
	),
});

/** Vertical orientation. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root
			defaultValue={[60]}
			orientation="vertical"
			class={style.verticalContainer}
		>
			<Label class={style.verticalLabel}>Level</Label>
			<Track class={style.verticalTrack}>
				<Fill class={style.verticalFill} />
				<Thumb class={style.thumb}>
					<Input />
				</Thumb>
			</Track>
			<ValueLabel class={style.verticalValueLabel} />
		</Root>
	),
});

/** Validation state — shows error message. */
export const WithValidation = meta.story({
	name: "With Validation",
	render: () => (
		<Root
			defaultValue={[15]}
			validationState="invalid"
			class={`${style.sliderColumn} ${style.root}`}
		>
			<div class={style.labelRow}>
				<Label>Threshold</Label>
				<ValueLabel />
			</div>
			<Track class={style.track}>
				<Fill class={style.fillInvalid} />
				<Thumb class={`${style.thumbInvalid}`}>
					<Input />
				</Thumb>
			</Track>
			<Description class={style.description}>Set a value above 20.</Description>
			<ErrorMessage class={style.errorMessage}>
				Value must be at least 20.
			</ErrorMessage>
		</Root>
	),
});
