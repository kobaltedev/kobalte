/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/rating/src/useRating.ts
 */

import {
	callHandler,
	mergeDefaultProps,
	mergeRefs,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createEffect,
	createSignal,
	createUniqueId,
	on,
	onCleanup,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import { useFormControlContext } from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useRatingGroupContext } from "./rating-group-context";

export interface RatingGroupInputOptions {}

export interface RatingGroupInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
	style?: JSX.CSSProperties | string;
	tabIndex: number;
}

export interface RatingGroupInputRenderProps
	extends RatingGroupInputCommonProps {
	type: "text";
	name: string;
	value: number;
	required: boolean | undefined;
	disabled: boolean | undefined;
	readonly: boolean | undefined;
}

export type RatingGroupInputProps<
	T extends ValidComponent | HTMLElement = HTMLInputElement,
> = RatingGroupInputOptions &
	Partial<RatingGroupInputCommonProps<ElementOf<T>>>;

/**
 * The native html input that is visually hidden in the rating group.
 */
export function RatingGroupInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, RatingGroupInputProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useRatingGroupContext();

	const defaultId = `${formControlContext.generateId(
		"input",
	)}-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as RatingGroupInputProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"style",
		"aria-labelledby",
		"aria-describedby",
	]);

	const ariaLabelledBy = () => {
		return (
			[
				local["aria-labelledby"],
				formControlContext.labelId(),
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
			[local["aria-describedby"], context.ariaDescribedBy()]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	return (
		<Polymorphic<RatingGroupInputRenderProps>
			as="input"
			type="text"
			tabIndex={-1}
			name={formControlContext.name()}
			value={context.value()!}
			required={formControlContext.isRequired()}
			readonly={formControlContext.isReadOnly()}
			style={combineStyle({ ...visuallyHiddenStyles }, local.style)}
			aria-labelledby={ariaLabelledBy()}
			aria-describedby={ariaDescribedBy()}
			disabled={formControlContext.isDisabled()}
			{...others}
		/>
	);
}
