import {
	EventKey,
	callHandler,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Accessor,
	type JSX,
	type ValidComponent,
	createMemo,
	createSignal,
	createUniqueId,
	onMount,
	splitProps,
} from "solid-js";

import { useFormControlContext } from "../form-control";
import { useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type CollectionItemWithRef, createRegisterId } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { useRatingContext } from "./rating-context";
import {
	RatingItemContext,
	type RatingItemContextValue,
	type RatingItemDataSet,
} from "./rating-item-context";
import { getEventPoint, getRelativePoint } from "./utils";

export interface RatingItemOptions {}

export interface RatingItemCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface RatingItemRenderProps
	extends RatingItemCommonProps,
		RatingItemDataSet {
	role: "radio";
	tabIndex: number | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
	"aria-checked": boolean;
}

export type RatingItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingItemOptions & Partial<RatingItemCommonProps<ElementOf<T>>>;

export function RatingItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingItemProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const formControlContext = useFormControlContext();
	const RatingContext = useRatingContext();

	const defaultId = `${formControlContext.generateId("item")}-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as RatingItemProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"aria-labelledby",
		"aria-describedby",
		"onClick",
		"onKeyDown",
		"onPointerMove",
	]);

	createDomCollectionItem<CollectionItemWithRef>({
		getItem: () => ({
			ref: () => ref,
			disabled: formControlContext.isDisabled()!,
			key: others.id,
			textValue: "",
			type: "item",
		}),
	});

	const ariaLabelledBy = () => {
		return (
			[
				local["aria-labelledby"],
				labelId(),
				local["aria-labelledby"] != null && others["aria-label"] != null
					? others.id
					: undefined,
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const ariaDescribedBy = () => {
		return (
			[
				local["aria-describedby"],
				descriptionId(),
				RatingContext.ariaDescribedBy(),
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const { direction } = useLocale();
	const isLTR = () => direction() === "ltr";

	const [labelId, setLabelId] = createSignal<string>();
	const [descriptionId, setDescriptionId] = createSignal<string>();

	const index = () =>
		ref ? RatingContext.items().findIndex((v) => v.ref() === ref) : -1;
	const [value, setValue] = createSignal<number>();
	const newValue = () =>
		RatingContext.isHovering()
			? RatingContext.hoveredValue()!
			: RatingContext.value()!;
	const equal = () => Math.ceil(newValue()!) === value();
	const highlighted = () => value()! <= newValue()! || equal();
	const half = () => equal() && Math.abs(newValue()! - value()!) === 0.5;

	onMount(() => {
		setValue(
			direction() === "ltr"
				? index() + 1
				: RatingContext.items().length - index(),
		);
	});

	const tabIndex = () => {
		if (formControlContext.isDisabled()) return undefined;
		if (formControlContext.isReadOnly()) equal() ? 0 : undefined;
		return equal() ? 0 : -1;
	};

	const focusItem = (index: number) =>
		(RatingContext.items()[Math.round(index)].ref() as HTMLElement).focus();

	const setPrevValue = () => {
		const factor = RatingContext.allowHalf() ? 0.5 : 1;
		const value = Math.max(0, RatingContext.value()! - factor);
		RatingContext.setValue(value);
		focusItem(Math.max(value - 1, 0));
	};

	const setNextValue = () => {
		const factor = RatingContext.allowHalf() ? 0.5 : 1;
		const value = Math.min(
			RatingContext.items().length,
			(RatingContext.value() === -1 ? 0 : RatingContext.value())! + factor,
		);
		RatingContext.setValue(value);
		focusItem(value - 1);
	};

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		const value =
			RatingContext.hoveredValue() === -1
				? index() + 1
				: RatingContext.hoveredValue();
		RatingContext.setValue(value);
		RatingContext.setHoveredValue(-1);
		focusItem(value - 1);
	};

	const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		if (formControlContext.isDisabled() || formControlContext.isReadOnly())
			return;
		callHandler(e, local.onPointerMove);

		const point = getEventPoint(e);
		const relativePoint = getRelativePoint(point, e.currentTarget);
		const percentX = relativePoint.getPercentValue({
			orientation: RatingContext.orientation(),
			dir: direction(),
		});
		const isMidway = percentX < 0.5;
		const half = RatingContext.allowHalf() && isMidway;
		const factor = half ? 0.5 : 0;
		RatingContext.setHoveredValue(value()! - factor);
	};

	const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		switch (e.key) {
			case EventKey.ArrowLeft:
			case EventKey.ArrowUp:
				e.preventDefault();
				if (isLTR()) {
					setPrevValue();
				} else {
					setNextValue();
				}
				break;
			case EventKey.ArrowRight:
			case EventKey.ArrowDown:
				e.preventDefault();
				if (isLTR()) {
					setNextValue();
				} else {
					setPrevValue();
				}
				break;
			case EventKey.Space:
				e.preventDefault();
				RatingContext.setValue(newValue()!);
				break;
			case EventKey.Home:
				e.preventDefault();
				RatingContext.setValue(1);
				break;
			case EventKey.End:
				e.preventDefault();
				RatingContext.setValue(RatingContext.items().length);
				break;
		}
	};

	const dataset: Accessor<RatingItemDataSet> = createMemo(() => ({
		...formControlContext.dataset(),
		"data-checked": equal() ? "" : undefined,
		"data-half": half() ? "" : undefined,
		"data-highlighted": highlighted() ? "" : undefined,
	}));

	const context: RatingItemContextValue = {
		state: { highlighted, half },
		dataset,
		generateId: createGenerateId(() => others.id!),
		itemId: () => others.id,
		registerLabel: createRegisterId(setLabelId),
		registerDescription: createRegisterId(setDescriptionId),
	};

	return (
		<RatingItemContext.Provider value={context}>
			<Polymorphic<RatingItemRenderProps>
				as="div"
				ref={mergeRefs((el) => (ref = el), local.ref)}
				role="radio"
				tabIndex={tabIndex()}
				aria-checked={equal()}
				aria-required={formControlContext.isRequired() || undefined}
				aria-disabled={formControlContext.isDisabled() || undefined}
				aria-readonly={formControlContext.isReadOnly() || undefined}
				aria-labelledby={ariaLabelledBy()}
				aria-describedby={ariaDescribedBy()}
				onClick={onClick}
				onPointerMove={onPointerMove}
				onKeyDown={onKeyDown}
				{...dataset()}
				{...others}
			/>
		</RatingItemContext.Provider>
	);
}
