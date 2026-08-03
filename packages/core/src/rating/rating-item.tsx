import {
	callHandler,
	createGenerateId,
	EventKey,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	createMemo,
	createSignal,
	createUniqueId,
	omit,
	untrack,
} from "solid-js";

import { useFormControlContext } from "../form-control/index.ts";
import { useLocale } from "../i18n/index.tsx";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { createDomCollectionItem } from "../primitives/create-dom-collection/index.ts";
import {
	type CollectionItemWithRef,
	createRegisterId,
} from "../primitives/index.ts";
import { useRatingContext } from "./rating-context.tsx";
import {
	RatingItemContext,
	type RatingItemContextValue,
	type RatingItemDataSet,
} from "./rating-item-context.tsx";
import { getEventPoint, getRelativePoint } from "./utils.ts";

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
	tabindex: number | undefined;
	"aria-required": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-readonly": "true" | undefined;
	"aria-checked": "true" | "false";
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

	const others = omit(
		mergedProps,
		"ref",
		"aria-labelledby",
		"aria-describedby",
		"onClick",
		"onKeyDown",
		"onPointerMove",
	);

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
				mergedProps["aria-labelledby"],
				labelId(),
				mergedProps["aria-labelledby"] != null && others["aria-label"] != null
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
				mergedProps["aria-describedby"],
				descriptionId(),
				RatingContext.ariaDescribedBy(),
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const { direction } = useLocale();
	const isLTR = () => direction() === "ltr";

	const [labelId, setLabelId] = createSignal<string | undefined>(undefined, {
		ownedWrite: true,
	});
	const [descriptionId, setDescriptionId] = createSignal<string | undefined>(
		undefined,
		{ ownedWrite: true },
	);

	const index = () =>
		ref ? RatingContext.items().findIndex((v) => v.ref() === ref) : -1;

	// Always read items() so the memo re-runs when the collection registers.
	// onSettled fired before createDomCollectionItem effects flushed in Solid 2.0,
	// leaving index() === -1 and value === 0 for every item — all stars highlighted.
	const value = createMemo((): number | undefined => {
		const items = RatingContext.items();
		if (!ref) return undefined;
		const i = items.findIndex((v) => v.ref() === ref);
		if (i === -1) return undefined;
		return direction() === "ltr" ? i + 1 : items.length - i;
	});
	const newValue = () =>
		RatingContext.isHovering()
			? RatingContext.hoveredValue()!
			: RatingContext.value()!;
	const equal = () => Math.ceil(newValue()!) === value();
	const highlighted = () => {
		const v = value();
		return v !== undefined && (v <= newValue()! || equal());
	};
	const half = () => equal() && Math.abs(newValue()! - value()!) === 0.5;

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
		callHandler(e, mergedProps.onClick);

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
		callHandler(e, mergedProps.onPointerMove);

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
		callHandler(e, mergedProps.onKeyDown);

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

	const refCallback = mergeRefs(
		(el) => (ref = el),
		untrack(() => mergedProps.ref),
	);

	return (
		<RatingItemContext value={context}>
			<Polymorphic<RatingItemRenderProps>
				as="div"
				ref={refCallback}
				role="radio"
				tabindex={tabIndex()}
				aria-checked={equal() ? "true" : "false"}
				aria-required={formControlContext.isRequired() ? "true" : undefined}
				aria-disabled={formControlContext.isDisabled() ? "true" : undefined}
				aria-readonly={formControlContext.isReadOnly() ? "true" : undefined}
				aria-labelledby={ariaLabelledBy()}
				aria-describedby={ariaDescribedBy()}
				onClick={onClick}
				onPointerMove={onPointerMove}
				onKeyDown={onKeyDown}
				{...dataset()}
				{...others}
			/>
		</RatingItemContext>
	);
}
