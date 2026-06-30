import { Index, createSignal } from "solid-js";
import { Rating } from "../../../../packages/core/src/rating";

import style from "./rating.module.css";

export function BasicExample() {
	return (
		<Rating class={style.rating}>
			<Rating.Label class={style.rating__label}>Rate Us:</Rating.Label>
			<Rating.Control class={style.rating__control}>
				<Index each={Array(5)}>
					{(_) => (
						<Rating.Item class={style["rating-item"]}>
							<Rating.ItemControl>
								<StarIcon />
							</Rating.ItemControl>
						</Rating.Item>
					)}
				</Index>
			</Rating.Control>
		</Rating>
	);
}

export function DefaultValueExample() {
	return (
		<Rating class={style.rating} defaultValue={3}>
			<Rating.Control class={style.rating__control}>
				<Index each={Array(5)}>
					{(_) => (
						<Rating.Item class={style["rating-item"]}>
							<Rating.ItemControl>
								<StarIcon />
							</Rating.ItemControl>
						</Rating.Item>
					)}
				</Index>
			</Rating.Control>
		</Rating>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal(0);

	return (
		<>
			<Rating class={style.rating} value={value()} onChange={setValue}>
				<Rating.Control class={style.rating__control}>
					<Index each={Array(5)}>
						{(_) => (
							<Rating.Item class={style["rating-item"]}>
								<Rating.ItemControl>
									<StarIcon />
								</Rating.ItemControl>
							</Rating.Item>
						)}
					</Index>
				</Rating.Control>
			</Rating>
			<p class="not-prose text-sm mt-4">Your rating is: {value()}/5</p>
		</>
	);
}

export function HalfRatingsExample() {
	return (
		<Rating class={style.rating} allowHalf>
			<Rating.Control class={style.rating__control}>
				<Index each={Array(5)}>
					{(_) => (
						<Rating.Item class={style["rating-item"]}>
							<Rating.ItemControl>
								{(state) => (state.half() ? <StarHalfIcon /> : <StarIcon />)}
							</Rating.ItemControl>
						</Rating.Item>
					)}
				</Index>
			</Rating.Control>
		</Rating>
	);
}

export function DescriptionExample() {
	return (
		<Rating class={style.rating}>
			<Rating.Label class={style.rating__label}>Rate Us:</Rating.Label>
			<Rating.Control class={style.rating__control}>
				<Index each={Array(5)}>
					{(_) => (
						<Rating.Item class={style["rating-item"]}>
							<Rating.ItemControl>
								<StarIcon />
							</Rating.ItemControl>
						</Rating.Item>
					)}
				</Index>
			</Rating.Control>
			<Rating.Description class={style.rating__description}>
				Rate your experience with us.
			</Rating.Description>
		</Rating>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal(0);

	return (
		<Rating
			class={style.rating}
			value={value()}
			onChange={setValue}
			validationState={value() === 0 ? "invalid" : "valid"}
		>
			<Rating.Label class={style.rating__label}>Rate Us:</Rating.Label>
			<Rating.Control class={style.rating__control}>
				<Index each={Array(5)}>
					{(_) => (
						<Rating.Item class={style["rating-item"]}>
							<Rating.ItemControl>
								<StarIcon />
							</Rating.ItemControl>
						</Rating.Item>
					)}
				</Index>
			</Rating.Control>
			<Rating.ErrorMessage class={style["rating__error-message"]}>
				Please select a rating between 1 and 5.
			</Rating.ErrorMessage>
		</Rating>
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
			class="flex flex-col items-center space-y-6"
		>
			<Rating class={style.rating} name="rate">
				<Rating.Control class={style.rating__control}>
					<Index each={Array(5)}>
						{(_) => (
							<Rating.Item class={style["rating-item"]}>
								<Rating.ItemControl>
									<StarIcon />
								</Rating.ItemControl>
							</Rating.Item>
						)}
					</Index>
				</Rating.Control>
				<Rating.HiddenInput />
			</Rating>
			<div class="flex space-x-2">
				<button type="reset" class="kb-button">
					Reset
				</button>
				<button type="submit" class="kb-button-primary">
					Submit
				</button>
			</div>
		</form>
	);
}

function StarIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 273 260"
			fill="inherit"
			stroke="inherit"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<title>Star Icon</title>
			<path d="M136.5 0L177.83 86.614L272.977 99.1561L203.374 165.229L220.847 259.594L136.5 213.815L52.1528 259.594L69.6265 165.229L0.0233917 99.1561L95.1699 86.614L136.5 0Z" />
		</svg>
	);
}

function StarHalfIcon() {
	return (
		<svg
			class={style["half-star-icon"]}
			viewBox="0 0 273 260"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			stroke="inherit"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<title>Half Star Icon</title>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M135.977 214.086L52.1294 259.594L69.6031 165.229L0 99.1561L95.1465 86.614L135.977 1.04785V214.086Z"
				fill="inherit"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M135.977 213.039L219.826 258.546L202.352 164.181L271.957 98.1082L176.808 85.5661L135.977 0V213.039Z"
			/>
		</svg>
	);
}
