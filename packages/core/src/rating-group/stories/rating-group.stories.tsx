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
} from "../index";

const meta = preview.meta({
	title: "Components/RatingGroup",
	tags: ["autodocs"],
});

export default meta;

const itemClass =
	"relative flex cursor-pointer items-center justify-center w-8 h-8 text-2xl select-none transition-transform duration-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1 rounded data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";

function Star(props: { highlighted: boolean }) {
	return (
		<span
			aria-hidden="true"
			class={props.highlighted ? "text-yellow-400" : "text-slate-300"}
		>
			★
		</span>
	);
}

function HalfStar(props: { highlighted: boolean; half: boolean }) {
	return (
		<span
			aria-hidden="true"
			class={props.highlighted ? "text-yellow-400" : "text-slate-300"}
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
		<Root class="flex flex-col gap-2 font-sans">
			<Control class="flex gap-1">
				{FIVE_STARS.map(() => (
					<Item class={itemClass}>
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
		<Root class="flex flex-col gap-2 font-sans" defaultValue={3}>
			<Control class="flex gap-1">
				{FIVE_STARS.map(() => (
					<Item class={itemClass}>
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
		<Root class="flex flex-col gap-1 font-sans" defaultValue={4}>
			<Label class="text-sm font-medium text-slate-700">Your rating</Label>
			<Control class="flex gap-1">
				{FIVE_STARS.map(() => (
					<Item class={itemClass}>
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
		<Root
			class="flex flex-col gap-1 font-sans"
			required
			validationState="invalid"
		>
			<Label class="text-sm font-medium text-slate-700">
				Rate your experience
			</Label>
			<Control class="flex gap-1">
				{FIVE_STARS.map(() => (
					<Item class={itemClass}>
						<ItemLabel />
						<ItemControl>
							{(state) => <Star highlighted={state.highlighted()} />}
						</ItemControl>
					</Item>
				))}
			</Control>
			<Description class="text-xs text-slate-500">
				1 = poor · 5 = excellent
			</Description>
			<ErrorMessage class="text-xs text-red-600">
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
		<Root class="flex flex-col gap-2 font-sans" defaultValue={3.5} allowHalf>
			<Label class="text-sm font-medium text-slate-700">Precision rating</Label>
			<Control class="flex gap-1">
				{FIVE_STARS.map(() => (
					<Item class={itemClass}>
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
		<Root class="flex flex-col gap-2 font-sans" defaultValue={3} disabled>
			<Label class="text-sm font-medium text-slate-400">
				Rating (disabled)
			</Label>
			<Control class="flex gap-1">
				{FIVE_STARS.map(() => (
					<Item class={itemClass}>
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
		<Root class="flex flex-col gap-2 font-sans" defaultValue={4} readOnly>
			<Label class="text-sm font-medium text-slate-700">Average rating</Label>
			<Control class="flex gap-1">
				{FIVE_STARS.map(() => (
					<Item class={`${itemClass} cursor-default`}>
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
		<div class="flex flex-col gap-3 font-sans">
			<Root class="flex flex-col gap-1" value={value()} onChange={setValue}>
				<Label class="text-sm font-medium text-slate-700">Leave a review</Label>
				<Control class="flex gap-1">
					{FIVE_STARS.map(() => (
						<Item class={itemClass}>
							<ItemLabel />
							<ItemControl>
								{(state) => <Star highlighted={state.highlighted()} />}
							</ItemControl>
						</Item>
					))}
				</Control>
				<HiddenInput />
			</Root>
			<p class="text-xs text-slate-500">
				{value() > 0
					? `${value()} star${value() !== 1 ? "s" : ""} — ${labels[value()]}`
					: "No rating selected"}
			</p>
			<button
				type="button"
				class="self-start rounded px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
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
