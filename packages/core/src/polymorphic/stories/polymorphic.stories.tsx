import { createSignal, type ValidComponent } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Button } from "../../button/index";
import { Polymorphic, type PolymorphicProps } from "../polymorphic";

const meta = preview.meta({
	title: "Primitives/Polymorphic",
	tags: ["autodocs"],
});

export default meta;


/**
 * Render any HTML element by changing the `as` prop. All forwarded attributes
 * (ARIA, data-*, tabIndex, href, etc.) are passed straight through to the DOM.
 */
export const NativeElement = meta.story({
	name: "Native Element",
	args: {
		tag: "button",
		label: "Polymorphic element",
	},
	argTypes: {
		tag: { control: "select", options: ["div", "button", "a", "span", "section", "p", "h3"] },
		label: { control: "text" },
	},
	render: (args) => (
		<Polymorphic
			as={args.tag as unknown as ValidComponent}
			class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium font-sans border border-slate-200 bg-slate-50 text-slate-900 no-underline cursor-pointer"
		>
			{args.label}
			<code class="px-1.5 py-0.5 rounded text-xs font-mono bg-blue-100 text-blue-800">
				&lt;{args.tag}&gt;
			</code>
		</Polymorphic>
	),
});


interface CardProps {
	variant?: "primary" | "secondary";
	children?: any;
	class?: string;
	[key: string]: any;
}

function Card(props: CardProps) {
	return (
		<div
			class={`rounded-lg px-5 py-3 text-sm font-sans font-medium ${
				props.variant === "primary"
					? "bg-blue-500 text-white"
					: "bg-slate-100 text-slate-900"
			}`}
			{...props}
		/>
	);
}

/** The `as` prop accepts any Solid component. Props exclusive to that component
 * (like `variant`) are forwarded and handled by the target component. */
export const AsCustomComponent = meta.story({
	name: "As Custom Component",
	args: { variant: "primary" as "primary" | "secondary" },
	argTypes: {
		variant: { control: "select", options: ["primary", "secondary"] },
	},
	render: (args) => (
		<Polymorphic as={Card} variant={args.variant}>
			{args.variant === "primary" ? "Primary Card" : "Secondary Card"}
		</Polymorphic>
	),
});


/** Standard HTML attributes — `id`, `data-*`, `aria-*`, `tabIndex` — all pass
 * through unchanged to the underlying DOM node. Click the button to inspect them. */
export const PropForwarding = meta.story({
	name: "Prop Forwarding",
	render: () => {
		let ref: HTMLButtonElement | undefined;
		const [info, setInfo] = createSignal("");

		return (
			<div class="flex flex-col gap-3 font-sans">
				<Polymorphic
					as="button"
					id="poly-button"
					data-testid="poly-button"
					data-custom="hello"
					aria-label="A labelled polymorphic button"
					tabIndex={0}
					class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-slate-200 bg-slate-50 text-slate-900 cursor-pointer"
					ref={ref}
					onClick={() =>
						setInfo(`id=${ref?.id}  data-custom=${ref?.dataset.custom}  tagName=${ref?.tagName}`)
					}
				>
					Click to inspect forwarded attrs
				</Polymorphic>
				{info() && (
					<code class="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">
						{info()}
					</code>
				)}
			</div>
		);
	},
});


/** In Solid 2.0, `class` accepts a string, object, or array. All forms pass
 * through `Polymorphic` unchanged; signals update the DOM in-place. */
export const ReactiveClass = meta.story({
	name: "Reactive class Prop",
	render: () => {
		const [active, setActive] = createSignal(false);

		return (
			<div class="flex flex-col gap-3 font-sans">
				<Polymorphic
					as="button"
					class={[
						"inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border transition-colors",
						active()
							? "bg-blue-500 text-white border-blue-500"
							: "bg-slate-50 text-slate-900 border-slate-200",
					]}
					onClick={() => setActive(v => !v)}
				>
					Toggle active — {active() ? "on" : "off"}
				</Polymorphic>
				<p class="text-xs text-slate-500 m-0">
					class array + reactive condition — DOM updates without re-mounting.
				</p>
			</div>
		);
	},
});


/** The `ref` prop captures the underlying DOM element, giving direct access to
 * imperative APIs like `getBoundingClientRect`. */
export const RefAccess = meta.story({
	name: "Ref Access",
	render: () => {
		let el: HTMLDivElement | undefined;
		const [info, setInfo] = createSignal("");

		return (
			<div class="flex flex-col gap-3 font-sans">
				<Polymorphic
					as="div"
					ref={el}
					class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-slate-200 bg-slate-50 text-slate-900 cursor-pointer w-fit"
					onClick={() =>
						setInfo(`tagName=${el?.tagName}  width=${el?.getBoundingClientRect().width.toFixed(0)}px`)
					}
				>
					Click to inspect ref
				</Polymorphic>
				{info() && (
					<code class="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">
						{info()}
					</code>
				)}
			</div>
		);
	},
});


/** The `as` prop is fully reactive — switch the rendered tag without unmounting. */
export const DynamicAs = meta.story({
	name: "Dynamic As",
	render: () => {
		const options = ["div", "button", "a", "span"] as const;
		const [tag, setTag] = createSignal<(typeof options)[number]>("div");

		return (
			<div class="flex flex-col gap-4 font-sans">
				<div class="flex gap-2">
					{options.map(t => (
						<button
							type="button"
							onClick={() => setTag(t)}
							class={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
								tag() === t
									? "bg-blue-500 text-white border-blue-500"
									: "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
							}`}
						>
							{t}
						</button>
					))}
				</div>
				<Polymorphic
					as={tag()}
					class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-slate-200 bg-slate-50 text-slate-900"
				>
					Rendered as <code class="font-mono text-blue-700">&lt;{tag()}&gt;</code>
				</Polymorphic>
			</div>
		);
	},
});


/** Kobalte's `Button` defaults to `as="button"`. Override with the control below
 * to switch the rendered element while preserving accessibility semantics. */
export const ButtonAsElement = meta.story({
	name: "Kobalte Button → as",
	args: { as: "button" as string },
	argTypes: {
		as: { control: "select", options: ["button", "a", "div"] },
	},
	render: (args) => (
		<Button
			as={args.as as unknown as ValidComponent}
			href={args.as === "a" ? "https://kobalte.dev" : undefined}
			target={args.as === "a" ? "_blank" : undefined}
			rel={args.as === "a" ? "noopener noreferrer" : undefined}
			class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium font-sans border border-slate-200 bg-white text-slate-900 no-underline"
		>
			as=&quot;{args.as}&quot;
			<code class="px-1.5 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-600">
				{args.as}
			</code>
		</Button>
	),
});


/** A consumer-authored typed polymorphic helper built on top of `PolymorphicProps`.
 * The component accepts its own props alongside the chosen element's native props. */
export const TypedPolymorphic = meta.story({
	name: "Typed Polymorphic Component",
	args: { intent: "default" as "default" | "action" },
	argTypes: {
		intent: { control: "select", options: ["default", "action"] },
	},
	render: (args) => {
		function Block<T extends ValidComponent>(
			props: PolymorphicProps<T, { intent?: "default" | "action" }>,
		) {
			return (
				<Polymorphic
					{...props}
					as={props.as!}
					class={`inline-flex items-center px-4 py-2 rounded-md text-sm font-sans font-medium border transition-colors ${
						props.intent === "action"
							? "bg-blue-500 text-white border-blue-500"
							: "bg-slate-100 text-slate-900 border-slate-200"
					}`}
				/>
			);
		}

		const intentClass = `inline-flex items-center px-4 py-2 rounded-md text-sm font-sans font-medium border transition-colors ${
			args.intent === "action"
				? "bg-blue-500 text-white border-blue-500"
				: "bg-slate-100 text-slate-900 border-slate-200"
		}`;

		return (
			<div class="flex gap-3 font-sans flex-wrap">
				<Polymorphic as="div" class={intentClass}>Native div</Polymorphic>
				<Block as={Button} intent={args.intent} onClick={() => alert("Block button clicked")}>
					Kobalte Button
				</Block>
			</div>
		);
	},
});


/** `Polymorphic` throws synchronously when `as` is omitted. Toggle the button to
 * mount the broken component and observe the caught error. */
export const MissingAsProp = meta.story({
	name: "Missing as Prop",
	render: () => {
		const [show, setShow] = createSignal(false);

		return (
			<div class="flex flex-col gap-3 font-sans">
				<button
					type="button"
					class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-slate-200 bg-slate-50 text-slate-900 cursor-pointer w-fit"
					onClick={() => setShow(v => !v)}
				>
					{show() ? "Unmount" : "Mount with missing as"}
				</button>
				{show() &&
					(() => {
						try {
							// @ts-expect-error: intentionally missing as to demo error
							return <Polymorphic>broken</Polymorphic>;
						} catch (e: unknown) {
							return (
								<p class="text-sm text-red-600 mt-1 m-0">
									Error: {(e as Error).message}
								</p>
							);
						}
					})()}
			</div>
		);
	},
});
