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
} from "./rating-group-item-context";

export interface RatingGroupItemState {
	half: boolean;
	highlighted: boolean;
}
export interface RatingGroupItemOptions {
	index: number;

	disabled?: boolean;

	children?: JSX.Element | ((state: RatingGroupItemState) => JSX.Element);
}

export interface RatingGroupItemCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	children: JSX.Element;
}

export interface RatingGroupItemRenderProps
	extends RatingGroupItemCommonProps,
		RatingGroupItemDataSet {
	role: "group";
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
		"disabled",
		"children",
		"onPointerDown",
		"onKeyDown",
		"onClick",
		"onPointerMove",
	]);

	const [labelId, setLabelId] = createSignal<string>();
	const [descriptionId, setDescriptionId] = createSignal<string>();

	const [isFocused, setIsFocused] = createSignal(false);

	const isSelected = createMemo(() => {
		return ratingGroupContext.isSelectedValue(local.index);
	});

	const isHighlighted = createMemo(() => {
		return ratingGroupContext.isHighlightedValue(local.index);
	});

	const isHalfHighlighted = createMemo(() => {
		return (
			!isHighlighted() &&
			ratingGroupContext.isHighlightedValue(local.index - 0.5)
		);
	});

	const isDisabled = createMemo(() => {
		return local.disabled || formControlContext.isDisabled() || false;
	});

	const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		callHandler(e, local.onPointerDown);

		const point = getEventPoint(e);
		const relativePoint = getRelativePoint(point, e.currentTarget);
		const percentX = relativePoint.getPercentValue({
			orientation: ratingGroupContext.orientation,
			dir: "ltr",
		});
		const isMidway = percentX < 0.5;
		ratingGroupContext.setHighlightedValue(
			isMidway ? local.index - 0.5 : local.index,
		);
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
		index: () => local.index,
		dataset,
		isSelected,
		isDisabled,
		labelId,
		descriptionId,
		select: () =>
			ratingGroupContext.setSelectedValue(
				isHalfHighlighted() ? local.index - 0.5 : local.index,
			),
		generateId: createGenerateId(() => others.id!),
		registerLabel: createRegisterId(setLabelId),
		registerDescription: createRegisterId(setDescriptionId),
		setIsFocused,
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

	return (
		<RatingGroupItemContext.Provider value={context}>
			<Polymorphic<RatingGroupItemRenderProps>
				as="div"
				role="group"
				onClick={onClick}
				onKeyDown={onKeyDown}
				onPointerMove={onPointerMove}
				onPointerDown={onPointerDown}
				{...dataset()}
				{...others}
			>
				<RatingGroupItemChild
					state={{
						half: isHalfHighlighted(),
						highlighted: isHighlighted() || isHalfHighlighted(),
					}}
				>
					{local.children}
				</RatingGroupItemChild>
			</Polymorphic>
		</RatingGroupItemContext.Provider>
	);
}

interface RatingGroupItemChildProps
	extends Pick<RatingGroupItemOptions, "children"> {
	state: RatingGroupItemState;
}

function RatingGroupItemChild(props: RatingGroupItemChildProps) {
	const resolvedChildren = children(() => {
		const body = props.children;
		return isFunction(body) ? body(props.state) : body;
	});

	return <>{resolvedChildren()}</>;
}
