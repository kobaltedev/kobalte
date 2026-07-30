import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Control,
	Description,
	ErrorMessage,
	HiddenInput,
	Item,
	ItemControl,
	ItemLabel,
	Label,
	Root,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Rating",
	tags: ["autodocs"],
});

export default meta;

function Star(props: { highlighted: boolean }) {
	return (
		<span
			aria-hidden="true"
			class={
				props.highlighted
					? style["rating__star-highlighted"]
					: style["rating__star-default"]
			}
		>
			★
		</span>
	);
}

function HalfStar(props: { highlighted: boolean; half: boolean }) {
	return (
		<span
			aria-hidden="true"
			class={
				props.highlighted
					? style["rating__star-highlighted"]
					: style["rating__star-default"]
			}
		>
			{props.half ? "⯨" : "★"}
		</span>
	);
}

const FIVE_STARS = [0, 1, 2, 3, 4] as const;

/** Five-star rating with no default selection. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.rating__root}>
			<Control class={style.rating__control}>
				{FIVE_STARS.map(() => (
					<Item class={style.rating__item}>
						<ItemLabel />
						<ItemControl>
							{(state) => <Star highlighted={state.highlighted()} />}
						</ItemControl>
					</Item>
				))}
			</Control>
			<HiddenInput />
		</Root>
	),
});

/** `defaultValue` pre-selects a rating on mount. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={style.rating__root} defaultValue={3}>
			<Control class={style.rating__control}>
				{FIVE_STARS.map(() => (
					<Item class={style.rating__item}>
						<ItemLabel />
						<ItemControl>
							{(state) => <Star highlighted={state.highlighted()} />}
						</ItemControl>
					</Item>
				))}
			</Control>
			<HiddenInput />
		</Root>
	),
});

/** A `Label` ties a visible heading to the group for screen readers. */
export const WithLabel = meta.story({
	name: "With Label",
	render: () => (
		<Root class={style.rating__root} defaultValue={4}>
			<Label class={style.rating__label}>Your rating</Label>
			<Control class={style.rating__control}>
				{FIVE_STARS.map(() => (
					<Item class={style.rating__item}>
						<ItemLabel />
						<ItemControl>
							{(state) => <Star highlighted={state.highlighted()} />}
						</ItemControl>
					</Item>
				))}
			</Control>
			<HiddenInput />
		</Root>
	),
});

/** `Description` adds supporting text; `ErrorMessage` surfaces a validation error. */
export const WithDescription = meta.story({
	name: "With Description",
	render: () => (
		<Root class={style.rating__root} required validationState="invalid">
			<Label class={style.rating__label}>Rate your experience</Label>
			<Control class={style.rating__control}>
				{FIVE_STARS.map(() => (
					<Item class={style.rating__item}>
						<ItemLabel />
						<ItemControl>
							{(state) => <Star highlighted={state.highlighted()} />}
						</ItemControl>
					</Item>
				))}
			</Control>
			<Description class={style.rating__description}>
				1 = poor · 5 = excellent
			</Description>
			<ErrorMessage class={style["rating__error-message"]}>
				A rating is required.
			</ErrorMessage>
			<HiddenInput />
		</Root>
	),
});

/** `allowHalf` enables 0.5-step ratings — hover the left half of a star. */
export const HalfRating = meta.story({
	name: "Half Rating",
	render: () => (
		<Root class={style.rating__root} defaultValue={3.5} allowHalf>
			<Label class={style.rating__label}>Precision rating</Label>
			<Control class={style.rating__control}>
				{FIVE_STARS.map(() => (
					<Item class={style.rating__item}>
						<ItemLabel />
						<ItemControl>
							{(state) => (
								<HalfStar
									highlighted={state.highlighted()}
									half={state.half()}
								/>
							)}
						</ItemControl>
					</Item>
				))}
			</Control>
			<HiddenInput />
		</Root>
	),
});

/** `disabled` prevents all interaction and dims the group. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={style.rating__root} defaultValue={3} disabled>
			<Label class={style["rating__label-disabled"]}>Rating (disabled)</Label>
			<Control class={style.rating__control}>
				{FIVE_STARS.map(() => (
					<Item class={style.rating__item}>
						<ItemLabel />
						<ItemControl>
							{(state) => <Star highlighted={state.highlighted()} />}
						</ItemControl>
					</Item>
				))}
			</Control>
			<HiddenInput />
		</Root>
	),
});

/** `readOnly` displays the current value without allowing changes. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={style.rating__root} defaultValue={4} readOnly>
			<Label class={style.rating__label}>Average rating</Label>
			<Control class={style.rating__control}>
				{FIVE_STARS.map(() => (
					<Item class={[style.rating__item, style["rating__item-readonly"]]}>
						<ItemLabel />
						<ItemControl>
							{(state) => <Star highlighted={state.highlighted()} />}
						</ItemControl>
					</Item>
				))}
			</Control>
		</Root>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal(0);
	const labels = ["", "Terrible", "Bad", "OK", "Good", "Great"] as const;
	return (
		<div class={style.rating__root}>
			<Root class={style.rating__root} value={value()} onChange={setValue}>
				<Label class={style.rating__label}>Leave a review</Label>
				<Control class={style.rating__control}>
					{FIVE_STARS.map(() => (
						<Item class={style.rating__item}>
							<ItemLabel />
							<ItemControl>
								{(state) => <Star highlighted={state.highlighted()} />}
							</ItemControl>
						</Item>
					))}
				</Control>
				<HiddenInput />
			</Root>
			<p class={style["rating__status-text"]}>
				{value() > 0
					? `${value()} star${value() !== 1 ? "s" : ""} — ${labels[value()]}`
					: "No rating selected"}
			</p>
			<button
				type="button"
				class={style["rating__clear-btn"]}
				onClick={() => setValue(0)}
			>
				Clear
			</button>
		</div>
	);
}

/** `value` + `onChange` give full external control over the selected rating. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
