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

/** Single-select accordion. Use the Controls panel to toggle `collapsible` and `multiple`. */
export const Default = meta.story({
	name: "Default",
	args: {
		collapsible: true,
		multiple: false,
	},
	argTypes: {
		collapsible: {
			control: "boolean",
			description:
				"When single-select, allow the open item to be closed by clicking its trigger again.",
		},
		multiple: {
			control: "boolean",
			description: "Allow multiple items to be open simultaneously.",
		},
	},
	render: (args) => (
		<AccordionRoot
			collapsible={args.collapsible}
			multiple={args.multiple}
			class={rootClass}
		>
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
			<Item
				value="item-1"
				question="First item"
				answer="Content for the first item."
			/>
			<Item
				value="item-2"
				question="Second item (pre-opened)"
				answer="This item was open on mount via defaultValue."
			/>
			<Item
				value="item-3"
				question="Third item"
				answer="Content for the third item."
			/>
		</AccordionRoot>
	),
});

/** Use the Controls panel to pick which item is disabled. Keyboard focus order skips it too. */
export const WithDisabledItem = meta.story({
	name: "With Disabled Item",
	args: {
		disabledItem: "item-2",
	},
	argTypes: {
		disabledItem: {
			control: "select",
			options: ["none", "item-1", "item-2", "item-3"],
			description: "Which item is disabled.",
		},
	},
	render: (args) => (
		<AccordionRoot collapsible class={rootClass}>
			<Item
				value="item-1"
				disabled={args.disabledItem === "item-1"}
				question="First item"
				answer="Content for the first item."
			/>
			<Item
				value="item-2"
				disabled={args.disabledItem === "item-2"}
				question="Second item"
				answer="Content for the second item."
			/>
			<Item
				value="item-3"
				disabled={args.disabledItem === "item-3"}
				question="Third item"
				answer="Content for the third item."
			/>
		</AccordionRoot>
	),
});

/**
 * Smooth expand/collapse using the CSS `grid-template-rows` trick.
 * `forceMount` keeps content in the DOM so the exit animation plays before unmount.
 * `data-[expanded]` / `data-[closed]` on the content element drive the transition.
 */
export const Animated = meta.story({
	name: "Animated",
	render: () => (
		<AccordionRoot collapsible class={rootClass}>
			<AnimatedItem
				value="item-1"
				question="Is it accessible?"
				answer="Yes. It adheres to the WAI-ARIA Disclosure pattern."
			/>
			<AnimatedItem
				value="item-2"
				question="Is it unstyled?"
				answer="Yes. It's unstyled by default, giving you full control over the look and feel."
			/>
			<AnimatedItem
				value="item-3"
				question="Can it be animated?"
				answer="Yes! Use forceMount + a CSS grid-template-rows transition on the content element."
			/>
		</AccordionRoot>
	),
});

function AnimatedItem(props: ItemProps) {
	return (
		<AccordionItem value={props.value} forceMount>
			<AccordionHeader class="flex">
				<AccordionTrigger class={triggerClass}>
					<span>{props.question}</span>
					<Chevron />
				</AccordionTrigger>
			</AccordionHeader>
			<AccordionContent class="grid bg-slate-50 transition-[grid-template-rows] duration-300 ease-out data-[expanded]:grid-rows-[1fr] data-[closed]:grid-rows-[0fr]">
				<div class="overflow-hidden">
					<p class="px-4 py-3 text-sm text-slate-600 leading-relaxed m-0">
						{props.answer}
					</p>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
}

/**
 * Pass `value` for fully controlled state.
 * The Controls panel drives which items are open — clicking triggers has no effect
 * because no `onChange` is wired, demonstrating the controlled contract.
 */
export const Controlled = meta.story({
	name: "Controlled",
	args: {
		item1: false,
		item2: false,
		item3: false,
	},
	argTypes: {
		item1: { control: "boolean", description: "First item open." },
		item2: { control: "boolean", description: "Second item open." },
		item3: { control: "boolean", description: "Third item open." },
	},
	render: (args) => (
		<AccordionRoot
			value={[
				...(args.item1 ? ["item-1"] : []),
				...(args.item2 ? ["item-2"] : []),
				...(args.item3 ? ["item-3"] : []),
			]}
			multiple
			class={rootClass}
		>
			<Item
				value="item-1"
				question="First item"
				answer="Content for the first item."
			/>
			<Item
				value="item-2"
				question="Second item"
				answer="Content for the second item."
			/>
			<Item
				value="item-3"
				question="Third item"
				answer="Content for the third item."
			/>
		</AccordionRoot>
	),
});
