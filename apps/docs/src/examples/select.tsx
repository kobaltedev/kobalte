// import { createVirtualizer } from "@tanstack/solid-virtual";
import { createSignal, For } from "solid-js";

import { CaretSortIcon, CheckIcon, CrossIcon } from "../components";
import style from "./select.module.css";

const STRING_OPTIONS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

import { Select } from "@kobalte/core/select";

export function BasicExample() {
	return (
		<Select
			options={STRING_OPTIONS}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Select.Item item={props.item} class={style.select__item}>
					<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
					<Select.ItemIndicator class={style["select__item-indicator"]}>
						<CheckIcon />
					</Select.ItemIndicator>
				</Select.Item>
			)}
		>
			<Select.Trigger class={style.select__trigger} aria-label="Fruit">
				<Select.Value<string> class={style.select__value}>
					{(state) => state.selectedOption()}
				</Select.Value>
				<Select.Icon class={style.select__icon}>
					<CaretSortIcon />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class={style.select__content}>
					<Select.Listbox class={style.select__listbox} />
				</Select.Content>
			</Select.Portal>
		</Select>
	);
}

export function DefaultValueExample() {
	return (
		<Select
			defaultValue="Blueberry"
			options={STRING_OPTIONS}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Select.Item item={props.item} class={style.select__item}>
					<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
					<Select.ItemIndicator class={style["select__item-indicator"]}>
						<CheckIcon />
					</Select.ItemIndicator>
				</Select.Item>
			)}
		>
			<Select.Trigger class={style.select__trigger} aria-label="Fruit">
				<Select.Value<string> class={style.select__value}>
					{(state) => state.selectedOption()}
				</Select.Value>
				<Select.Icon class={style.select__icon}>
					<CaretSortIcon />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class={style.select__content}>
					<Select.Listbox class={style.select__listbox} />
				</Select.Content>
			</Select.Portal>
		</Select>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal("Blueberry");

	return (
		<>
			<Select
				value={value()}
				onChange={setValue}
				options={STRING_OPTIONS}
				placeholder="Select a fruit…"
				itemComponent={(props) => (
					<Select.Item item={props.item} class={style.select__item}>
						<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
						<Select.ItemIndicator class={style["select__item-indicator"]}>
							<CheckIcon />
						</Select.ItemIndicator>
					</Select.Item>
				)}
			>
				<Select.Trigger class={style.select__trigger} aria-label="Fruit">
					<Select.Value<string> class={style.select__value}>
						{(state) => state.selectedOption()}
					</Select.Value>
					<Select.Icon class={style.select__icon}>
						<CaretSortIcon />
					</Select.Icon>
				</Select.Trigger>
				<Select.Portal>
					<Select.Content class={style.select__content}>
						<Select.Listbox class={style.select__listbox} />
					</Select.Content>
				</Select.Portal>
			</Select>
			<p
				style={{
					"font-size": "14px",
					"margin-top": "16px",
					"margin-bottom": 0,
				}}
			>
				Your favorite fruit is: {value()}.
			</p>
		</>
	);
}

export function DescriptionExample() {
	return (
		<Select
			options={STRING_OPTIONS}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Select.Item item={props.item} class={style.select__item}>
					<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
					<Select.ItemIndicator class={style["select__item-indicator"]}>
						<CheckIcon />
					</Select.ItemIndicator>
				</Select.Item>
			)}
		>
			<Select.Trigger class={style.select__trigger} aria-label="Fruit">
				<Select.Value<string> class={style.select__value}>
					{(state) => state.selectedOption()}
				</Select.Value>
				<Select.Icon class={style.select__icon}>
					<CaretSortIcon />
				</Select.Icon>
			</Select.Trigger>
			<Select.Description class={style.select__description}>
				Choose the fruit you like the most.
			</Select.Description>
			<Select.Portal>
				<Select.Content class={style.select__content}>
					<Select.Listbox class={style.select__listbox} />
				</Select.Content>
			</Select.Portal>
		</Select>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal("Grapes");

	return (
		<Select
			value={value()}
			onChange={setValue}
			validationState={value() !== "Apple" ? "invalid" : "valid"}
			options={STRING_OPTIONS}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Select.Item item={props.item} class={style.select__item}>
					<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
					<Select.ItemIndicator class={style["select__item-indicator"]}>
						<CheckIcon />
					</Select.ItemIndicator>
				</Select.Item>
			)}
		>
			<Select.Trigger class={style.select__trigger} aria-label="Fruit">
				<Select.Value<string> class={style.select__value}>
					{(state) => state.selectedOption()}
				</Select.Value>
				<Select.Icon class={style.select__icon}>
					<CaretSortIcon />
				</Select.Icon>
			</Select.Trigger>
			<Select.ErrorMessage class={style["select__error-message"]}>
				Hmm, I prefer apples.
			</Select.ErrorMessage>
			<Select.Portal>
				<Select.Content class={style.select__content}>
					<Select.Listbox class={style.select__listbox} />
				</Select.Content>
			</Select.Portal>
		</Select>
	);
}

export function HTMLFormExample() {
	let formRef: HTMLFormElement | undefined;

	const onSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const formData = new FormData(formRef);

		alert(JSON.stringify(Object.fromEntries(formData), null, 2));
	};

	return (
		<form
			ref={formRef}
			onSubmit={onSubmit}
			style={{
				display: "flex",
				"flex-direction": "column",
				"align-items": "center",
				gap: "24px",
			}}
		>
			<Select
				name="fruit"
				options={STRING_OPTIONS}
				placeholder="Select a fruit…"
				itemComponent={(props) => (
					<Select.Item item={props.item} class={style.select__item}>
						<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
						<Select.ItemIndicator class={style["select__item-indicator"]}>
							<CheckIcon />
						</Select.ItemIndicator>
					</Select.Item>
				)}
			>
				<Select.HiddenSelect />
				<Select.Trigger class={style.select__trigger} aria-label="Fruit">
					<Select.Value<string> class={style.select__value}>
						{(state) => state.selectedOption()}
					</Select.Value>
					<Select.Icon class={style.select__icon}>
						<CaretSortIcon />
					</Select.Icon>
				</Select.Trigger>
				<Select.Portal>
					<Select.Content class={style.select__content}>
						<Select.Listbox class={style.select__listbox} />
					</Select.Content>
				</Select.Portal>
			</Select>
			<div style={{ display: "flex", gap: "8px" }}>
				<button type="reset" class="kb-button">
					Reset
				</button>
				<button type="button" class="kb-button-primary">
					Submit
				</button>
			</div>
		</form>
	);
}

interface Food {
	value: string;
	label: string;
	disabled: boolean;
}

const OBJECT_OPTIONS: Food[] = [
	{ value: "apple", label: "Apple", disabled: false },
	{ value: "banana", label: "Banana", disabled: false },
	{ value: "blueberry", label: "Blueberry", disabled: false },
	{ value: "grapes", label: "Grapes", disabled: true },
	{ value: "pineapple", label: "Pineapple", disabled: false },
];

export function ObjectExample() {
	return (
		<Select
			options={OBJECT_OPTIONS}
			optionValue="value"
			optionTextValue="label"
			optionDisabled="disabled"
			placeholder="Select a food…"
			itemComponent={(props) => (
				<Select.Item item={props.item} class={style.select__item}>
					<Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
					<Select.ItemIndicator class={style["select__item-indicator"]}>
						<CheckIcon />
					</Select.ItemIndicator>
				</Select.Item>
			)}
		>
			<Select.Trigger class={style.select__trigger} aria-label="Food">
				<Select.Value<Food> class={style.select__value}>
					{(state) => state.selectedOption().label}
				</Select.Value>
				<Select.Icon class={style.select__icon}>
					<CaretSortIcon />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class={style.select__content}>
					<Select.Listbox class={style.select__listbox} />
				</Select.Content>
			</Select.Portal>
		</Select>
	);
}

interface Category {
	label: string;
	options: Food[];
}

const GROUP_OBJECT_OPTIONS: Category[] = [
	{
		label: "Fruits",
		options: [
			{ value: "apple", label: "Apple", disabled: false },
			{ value: "banana", label: "Banana", disabled: false },
			{ value: "blueberry", label: "Blueberry", disabled: false },
			{ value: "grapes", label: "Grapes", disabled: true },
			{ value: "pineapple", label: "Pineapple", disabled: false },
		],
	},
	{
		label: "Meat",
		options: [
			{ value: "beef", label: "Beef", disabled: false },
			{ value: "chicken", label: "Chicken", disabled: false },
			{ value: "lamb", label: "Lamb", disabled: false },
			{ value: "pork", label: "Pork", disabled: false },
		],
	},
];

export function OptionGroupExample() {
	return (
		<Select<Food, Category>
			options={GROUP_OBJECT_OPTIONS}
			optionValue="value"
			optionTextValue="label"
			optionDisabled="disabled"
			optionGroupChildren="options"
			placeholder="Select a food…"
			itemComponent={(props) => (
				<Select.Item item={props.item} class={style.select__item}>
					<Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
					<Select.ItemIndicator class={style["select__item-indicator"]}>
						<CheckIcon />
					</Select.ItemIndicator>
				</Select.Item>
			)}
			sectionComponent={(props) => (
				<Select.Section class={style.select__section}>
					{props.section.rawValue.label}
				</Select.Section>
			)}
		>
			<Select.Trigger class={style.select__trigger} aria-label="Food">
				<Select.Value<Food> class={style.select__value}>
					{(state) => state.selectedOption().label}
				</Select.Value>
				<Select.Icon class={style.select__icon}>
					<CaretSortIcon />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class={style.select__content}>
					<Select.Listbox class={style.select__listbox} />
				</Select.Content>
			</Select.Portal>
		</Select>
	);
}

export function MultipleSelectionExample() {
	const [values, setValues] = createSignal(["Blueberry", "Grapes"]);

	return (
		<>
			<Select<string>
				multiple
				value={values()}
				onChange={setValues}
				options={STRING_OPTIONS}
				placeholder="Select some fruits…"
				itemComponent={(props) => (
					<Select.Item item={props.item} class={style.select__item}>
						<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
						<Select.ItemIndicator class={style["select__item-indicator"]}>
							<CheckIcon />
						</Select.ItemIndicator>
					</Select.Item>
				)}
			>
				<Select.Trigger
					class={`${style.select__trigger} ${style.select__trigger_multi}`}
					aria-label="Fruits"
					as="div"
				>
					<Select.Value<string> class={style.select__value}>
						{(state) => (
							<>
								<div
									style={{
										display: "flex",
										"align-items": "center",
										gap: "8px",
										"flex-wrap": "wrap",
									}}
								>
									<For each={state.selectedOptions()}>
										{(option) => (
											<span
												style={{
													"background-color": "hsl(240 6% 97%)",
													"font-size": "14px",
													padding: "2px 8px",
													"border-radius": "6px",
													display: "inline-flex",
													"align-items": "center",
													gap: "8px",
												}}
												onPointerDown={(e) => e.stopPropagation()}
											>
												{option}
												<button
													type="button"
													onClick={() => state.remove(option)}
													style={{
														"border-radius": "9999px",
														padding: "4px",
														cursor: "pointer",
														background: "none",
														border: "none",
													}}
												>
													<CrossIcon
														style={{ width: "12px", height: "12px" }}
													/>
												</button>
											</span>
										)}
									</For>
								</div>
								<button
									type="button"
									onPointerDown={(e) => e.stopPropagation()}
									onClick={state.clear}
									style={{
										"margin-left": "auto",
										"margin-right": "8px",
										"border-radius": "9999px",
										padding: "4px",
										cursor: "pointer",
										background: "none",
										border: "none",
									}}
								>
									<CrossIcon style={{ width: "14px", height: "14px" }} />
								</button>
							</>
						)}
					</Select.Value>
					<Select.Icon class={style.select__icon}>
						<CaretSortIcon />
					</Select.Icon>
				</Select.Trigger>
				<Select.Portal>
					<Select.Content class={style.select__content}>
						<Select.Listbox class={style.select__listbox} />
					</Select.Content>
				</Select.Portal>
			</Select>
			<p
				style={{
					"font-size": "14px",
					"margin-top": "16px",
					"margin-bottom": 0,
				}}
			>
				Your favorite fruits are: {values().join(", ")}.
			</p>
		</>
	);
}

// Virtualized example (needs `@tanstack/solid-virtual`, which is not compatible
// with Solid 2 yet — uncomment once it is).
//
// interface Item {
// 	value: string;
// 	label: string;
// 	disabled: boolean;
// }
//
// function SelectContent(props: { options: Item[] }) {
// 	let listboxRef: HTMLUListElement | undefined;
//
// 	const virtualizer = createVirtualizer({
// 		count: props.options.length,
// 		getScrollElement: () => listboxRef,
// 		getItemKey: (index: number) => props.options[index].value,
// 		estimateSize: () => 32,
// 		enableSmoothScroll: false,
// 		overscan: 5,
// 	});
//
// 	return (
// 		<Select.Content class={style.select__content}>
// 			<Select.Listbox
// 				ref={listboxRef}
// 				scrollToItem={(key) =>
// 					virtualizer.scrollToIndex(
// 						props.options.findIndex((option) => option.value === key),
// 					)
// 				}
// 				class={style.select__listbox}
// 				style={{ height: "200px", width: "100%", overflow: "auto" }}
// 			>
// 				{(items) => (
// 					<div
// 						style={{
// 							height: `${virtualizer.getTotalSize()}px`,
// 							width: "100%",
// 							position: "relative",
// 						}}
// 					>
// 						<For each={virtualizer.getVirtualItems()}>
// 							{(virtualRow) => {
// 								const item = items().getItem(virtualRow.key);
//
// 								if (item) {
// 									return (
// 										<Select.Item
// 											item={item}
// 											class={style.select__item}
// 											style={{
// 												position: "absolute",
// 												top: 0,
// 												left: 0,
// 												width: "100%",
// 												height: `${virtualRow.size}px`,
// 												transform: `translateY(${virtualRow.start}px)`,
// 											}}
// 										>
// 											<Select.ItemLabel>{item.rawValue.label}</Select.ItemLabel>
// 											<Select.ItemIndicator
// 												class={style["select__item-indicator"]}
// 											>
// 												<CheckIcon />
// 											</Select.ItemIndicator>
// 										</Select.Item>
// 									);
// 								}
// 							}}
// 						</For>
// 					</div>
// 				)}
// 			</Select.Listbox>
// 		</Select.Content>
// 	);
// }
//
// export function VirtualizedExample() {
// 	const options: Item[] = Array.from({ length: 100_000 }, (_, i) => ({
// 		value: `${i}`,
// 		label: `Item #${i + 1}`,
// 		disabled: false,
// 	}));
//
// 	return (
// 		<Select
// 			virtualized
// 			options={options}
// 			optionValue="value"
// 			optionTextValue="label"
// 			optionDisabled="disabled"
// 			placeholder="Select an item…"
// 		>
// 			<Select.Trigger class={style.select__trigger} aria-label="Food">
// 				<Select.Value<Item> class={style.select__value}>
// 					{(state) => state.selectedOption().label}
// 				</Select.Value>
// 				<Select.Icon class={style.select__icon}>
// 					<CaretSortIcon />
// 				</Select.Icon>
// 			</Select.Trigger>
// 			<Select.Portal>
// 				<SelectContent options={options} />
// 			</Select.Portal>
// 		</Select>
// 	);
// }
