import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Content as AccordionContent,
	Header as AccordionHeader,
	Item as AccordionItem,
	Root as AccordionRoot,
	Trigger as AccordionTrigger,
} from "../index";

const meta = preview.meta({
	title: "Components/Accordion",
	tags: ["autodocs"],
});

export default meta;

function Chevron() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="shrink-0 transition-transform duration-200 group-data-[expanded]:rotate-180"
		>
			<path d="M6 9l6 6 6-6" />
		</svg>
	);
}

const triggerClass =
	"group flex w-full items-center justify-between bg-white px-4 py-3.5 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors data-[expanded]:text-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 cursor-pointer";

const contentClass = "overflow-hidden bg-slate-50";

const rootClass =
	"w-80 divide-y divide-slate-200 rounded-lg border border-slate-200 overflow-hidden font-sans";

interface ItemProps {
	value: string;
	question: string;
	answer: string;
	disabled?: boolean;
}

function Item(props: ItemProps) {
	return (
		<AccordionItem value={props.value} disabled={props.disabled}>
			<AccordionHeader class="flex">
				<AccordionTrigger class={triggerClass}>
					<span>{props.question}</span>
					<Chevron />
				</AccordionTrigger>
			</AccordionHeader>
			<AccordionContent class={contentClass}>
				<p class="px-4 py-3 text-sm text-slate-600 leading-relaxed m-0">
					{props.answer}
				</p>
			</AccordionContent>
		</AccordionItem>
	);
}

/** Single-select accordion. Click a trigger to expand; click again to collapse (`collapsible`). */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<AccordionRoot collapsible class={rootClass}>
			<Item
				value="item-1"
				question="Is it accessible?"
				answer="Yes. It adheres to the WAI-ARIA Disclosure pattern."
			/>
			<Item
				value="item-2"
				question="Is it unstyled?"
				answer="Yes. It's unstyled by default, giving you full control over the look and feel."
			/>
			<Item
				value="item-3"
				question="Can it be animated?"
				answer="Yes! You can animate the Accordion with CSS or JavaScript using the --kb-accordion-content-height CSS variable."
			/>
		</AccordionRoot>
	),
});

/** With `multiple`, any number of items can be open simultaneously. */
export const Multiple = meta.story({
	name: "Multiple",
	render: () => (
		<AccordionRoot multiple collapsible class={rootClass}>
			<Item
				value="item-1"
				question="Section one"
				answer="Content for section one. Multiple items can be expanded at the same time."
			/>
			<Item
				value="item-2"
				question="Section two"
				answer="Content for section two."
			/>
			<Item
				value="item-3"
				question="Section three"
				answer="Content for section three."
			/>
		</AccordionRoot>
	),
});

/** `defaultValue` pre-opens items on mount without controlling state. */
export const DefaultOpen = meta.story({
	name: "Default Open",
	render: () => (
		<AccordionRoot defaultValue={["item-2"]} collapsible class={rootClass}>
			<Item value="item-1" question="First item" answer="Content for the first item." />
			<Item
				value="item-2"
				question="Second item (pre-opened)"
				answer="This item was open on mount via defaultValue."
			/>
			<Item value="item-3" question="Third item" answer="Content for the third item." />
		</AccordionRoot>
	),
});

/** Individual items accept `disabled`. The keyboard focus order skips them too. */
export const WithDisabledItem = meta.story({
	name: "With Disabled Item",
	render: () => (
		<AccordionRoot collapsible class={rootClass}>
			<Item value="item-1" question="Available item" answer="This item is interactive." />
			<Item
				value="item-2"
				disabled
				question="Disabled item"
				answer="You will never read this."
			/>
			<Item value="item-3" question="Another available item" answer="This one works too." />
		</AccordionRoot>
	),
});

/**
 * Pass `value` + `onChange` for fully controlled state.
 * The external buttons drive which items are open.
 */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => {
		const items = [
			{ value: "item-1", question: "First item", answer: "Content for the first item." },
			{ value: "item-2", question: "Second item", answer: "Content for the second item." },
			{ value: "item-3", question: "Third item", answer: "Content for the third item." },
		] as const;

		const [value, setValue] = createSignal<string[]>([]);

		const toggle = (v: string) =>
			setValue((prev) =>
				prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
			);

		return (
			<div class="flex flex-col gap-4 font-sans">
				<div class="flex gap-2">
					{items.map((item) => (
						<button
							type="button"
							onClick={() => toggle(item.value)}
							class={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
								value().includes(item.value)
									? "bg-blue-500 text-white border-blue-500"
									: "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
							}`}
						>
							{item.question.split(" ")[0]}
						</button>
					))}
				</div>
				<AccordionRoot value={value()} onChange={setValue} multiple class={rootClass}>
					{items.map((item) => (
						<Item
							value={item.value}
							question={item.question}
							answer={item.answer}
						/>
					))}
				</AccordionRoot>
			</div>
		);
	},
});

/** Tweak `multiple` and `collapsible` from the Controls panel. */
export const Playground = meta.story({
	name: "Playground",
	args: {
		multiple: false,
		collapsible: true,
	},
	argTypes: {
		multiple: {
			control: "boolean",
			description: "Allow multiple items to be open simultaneously.",
		},
		collapsible: {
			control: "boolean",
			description:
				"When single-select, allow the open item to be closed by clicking its trigger again.",
		},
	},
	render: (args) => (
		<AccordionRoot multiple={args.multiple} collapsible={args.collapsible} class={rootClass}>
			<Item
				value="item-1"
				question="Is it accessible?"
				answer="Yes. It adheres to the WAI-ARIA Disclosure pattern."
			/>
			<Item
				value="item-2"
				question="Is it unstyled?"
				answer="Yes. It's unstyled by default, giving you full control over the look and feel."
			/>
			<Item
				value="item-3"
				question="Can it be animated?"
				answer="Yes! You can animate the Accordion with CSS using --kb-accordion-content-height."
			/>
		</AccordionRoot>
	),
});
