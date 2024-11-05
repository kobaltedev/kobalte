/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRating.ts
 */

import {
	EventKey,
	callHandler,
	createGenerateId,
	getEventPoint,
	getRelativePoint,
	isFunction,
	mergeDefaultProps,
} from "@kobalte/utils";
import {
	type Accessor,
	type JSX,
	type ValidComponent,
	children,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import { useFormControlContext } from "../form-control";
import { useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createRegisterId } from "../primitives";
import { useRatingGroupContext } from "./rating-group-context";
import {
	RatingGroupItemContext,
	type RatingGroupItemContextValue,
	type RatingGroupItemDataSet,
	RatingGroupItemState,
} from "./rating-group-item-context";

export interface RatingGroupItemOptions {
	/** Unique value/index of item */
	index: number;
}

export interface RatingGroupItemCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	// ref: T | ((el: T) => void);
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface RatingGroupItemRenderProps
	extends RatingGroupItemCommonProps,
		RatingGroupItemDataSet {
	role: "radio";
	tabIndex: number | undefined;
}

export type RatingGroupItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingGroupItemOptions & Partial<RatingGroupItemCommonProps<ElementOf<T>>>;

/**
 * The root container for a rating group item
 */
export function RatingGroupItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingGroupItemProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const ratingGroupContext = useRatingGroupContext();

	const defaultId = `${formControlContext.generateId("item")}-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as RatingGroupItemProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"index",
		"onPointerDown",
		"onKeyDown",
		"onClick",
		"onPointerMove",
		"aria-labelledby",
		"aria-describedby",
	]);

	const [labelId, setLabelId] = createSignal<string>();
	const [descriptionId, setDescriptionId] = createSignal<string>();

	const [isFocused, setIsFocused] = createSignal(false);

	const itemIndex: number = local.index!;

	const isSelected = createMemo(() => {
		return ratingGroupContext.isSelectedValue(itemIndex);
	});

	const isHighlighted = createMemo(() => {
		return ratingGroupContext.isHoveredValue(itemIndex);
	});

	const isHalfHighlighted = createMemo(() => {
		return (
			!isHighlighted() && ratingGroupContext.isHoveredValue(itemIndex - 0.5)
		);
	});

	const isDisabled = createMemo(() => {
		return formControlContext.isDisabled() || false;
	});

	const tabIndex = createMemo(() => {
		if (formControlContext.isDisabled()) return undefined;
		if (formControlContext.isReadOnly()) isSelected() ? 0 : undefined;
		return isSelected() ? 0 : -1;
	});

	const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		callHandler(e, local.onPointerDown);

		const point = getEventPoint(e);
		const relativePoint = getRelativePoint(point, e.currentTarget);
		const percentX = relativePoint.getPercentValue({
			orientation: ratingGroupContext.orientation(),
			dir: "ltr",
		});
		const isMidway = percentX < 0.5;
		const adjustment = isMidway && ratingGroupContext.allowHalf() ? -0.5 : 0;
		ratingGroupContext.setHoveredValue(itemIndex + adjustment);
	};

	const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		callHandler(e, local.onPointerDown);

		// For consistency with native, prevent the input blurs on pointer down.
		if (isFocused()) {
			e.preventDefault();
		}
	};

	const dataset: Accessor<RatingGroupItemDataSet> = createMemo(() => ({
		...formControlContext.dataset(),
		"data-disabled": isDisabled() ? "" : undefined,
		"data-checked": isSelected() ? "" : undefined,
		"data-highlighted": isHighlighted() || isHalfHighlighted() ? "" : undefined,
		"data-half": isHalfHighlighted() ? "" : undefined,
	}));

	const context: RatingGroupItemContextValue = {
		index: () => itemIndex,
		dataset,
		itemId: () => others.id,
		select: () =>
			ratingGroupContext.setSelectedValue(
				isHalfHighlighted() ? itemIndex - 0.5 : itemIndex,
			),
		generateId: createGenerateId(() => others.id!),
		registerLabel: createRegisterId(setLabelId),
		registerDescription: createRegisterId(setDescriptionId),
		setIsFocused,
		state: () => {
			return {
				highlighted: isHighlighted() || isHalfHighlighted(),
				half: isHalfHighlighted(),
			};
		},
	};

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		context.select();
	};

	const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		if (e.key === EventKey.Space) {
			context.select();
		}
	};

	const ariaLabelledBy = () => {
		return (
			[
				local["aria-labelledby"],
				labelId(),
				// If there is both an aria-label and aria-labelledby, add the input itself has an aria-labelledby
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
				ratingGroupContext.ariaDescribedBy(),
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	return (
		<RatingGroupItemContext.Provider value={context}>
			<Polymorphic<RatingGroupItemRenderProps>
				as="div"
				role="radio"
				tabIndex={tabIndex()}
				aria-labelledby={ariaLabelledBy()}
				aria-describedby={ariaDescribedBy()}
				onClick={onClick}
				onKeyDown={onKeyDown}
				onPointerMove={onPointerMove}
				onPointerDown={onPointerDown}
				{...dataset()}
				{...others}
			/>
		</RatingGroupItemContext.Provider>
	);
}
