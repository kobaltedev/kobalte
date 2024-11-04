import { Index, createSignal } from "solid-js";
import { RatingGroup } from "../../../../packages/core/src/rating-group";

import style from "./rating-group.module.css";

export function BasicExample() {
	return (
		<RatingGroup class={style["rating-group"]}>
			<RatingGroup.Label class={style["rating-group__label"]}>
				Rate Us:
			</RatingGroup.Label>
			<RatingGroup.Control class={style["rating-group__control"]}>
				<Index each={Array(5)}>
					{(_) => (
						<RatingGroup.Item class={style["rating-group-item"]}>
							<RatingGroup.ItemControl>
								<StarIcon />
							</RatingGroup.ItemControl>
						</RatingGroup.Item>
					)}
				</Index>
			</RatingGroup.Control>
		</RatingGroup>
	);
}

export function DefaultValueExample() {
	return (
		<RatingGroup class={style["rating-group"]} defaultValue={3}>
			<RatingGroup.Control class={style["rating-group__control"]}>
				<Index each={Array(5)}>
					{(_) => (
						<RatingGroup.Item class={style["rating-group-item"]}>
							<RatingGroup.ItemControl>
								<StarIcon />
							</RatingGroup.ItemControl>
						</RatingGroup.Item>
					)}
				</Index>
			</RatingGroup.Control>
		</RatingGroup>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal(0);

	return (
		<>
			<RatingGroup
				class={style["rating-group"]}
				value={value()}
				onChange={setValue}
			>
				<RatingGroup.Control class={style["rating-group__control"]}>
					<Index each={Array(5)}>
						{(_) => (
							<RatingGroup.Item class={style["rating-group-item"]}>
								<RatingGroup.ItemControl>
									<StarIcon />
								</RatingGroup.ItemControl>
							</RatingGroup.Item>
						)}
					</Index>
				</RatingGroup.Control>
			</RatingGroup>
			<p class="not-prose text-sm mt-4">Your rating is: {value()}/5</p>
		</>
	);
}

export function HalfRatingsExample() {
	return (
		<RatingGroup class={style["rating-group"]} allowHalf>
			<RatingGroup.Control class={style["rating-group__control"]}>
				<Index each={Array(5)}>
					{(_) => (
						<RatingGroup.Item class={style["rating-group-item"]}>
							<RatingGroup.ItemControl>
								{(state) =>
									state.half() ? (
										<StarHalfIcon />
									) : state.highlighted() ? (
										<StarIcon />
									) : (
										<StarIcon />
									)
								}
							</RatingGroup.ItemControl>
						</RatingGroup.Item>
					)}
				</Index>
			</RatingGroup.Control>
		</RatingGroup>
	);
}

export function DescriptionExample() {
	return (
		<RatingGroup class={style["rating-group"]}>
			<RatingGroup.Label class={style["rating-group__label"]}>
				Rate Us:
			</RatingGroup.Label>
			<RatingGroup.Control class={style["rating-group__control"]}>
				<Index each={Array(5)}>
					{(_) => (
						<RatingGroup.Item class={style["rating-group-item"]}>
							<RatingGroup.ItemControl>
								<StarIcon />
							</RatingGroup.ItemControl>
						</RatingGroup.Item>
					)}
				</Index>
			</RatingGroup.Control>
			<RatingGroup.Description class={style["rating-group__description"]}>
				Rate your experience with us.
			</RatingGroup.Description>
		</RatingGroup>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal(0);

	return (
		<RatingGroup
			class={style["rating-group"]}
			value={value()}
			onChange={setValue}
			validationState={value() === 0 ? "invalid" : "valid"}
		>
			<RatingGroup.Label class={style["rating-group__label"]}>
				Rate Us:
			</RatingGroup.Label>
			<RatingGroup.Control class={style["rating-group__control"]}>
				<Index each={Array(5)}>
					{(_) => (
						<RatingGroup.Item class={style["rating-group-item"]}>
							<RatingGroup.ItemControl>
								<StarIcon />
							</RatingGroup.ItemControl>
						</RatingGroup.Item>
					)}
				</Index>
			</RatingGroup.Control>
			<RatingGroup.ErrorMessage class={style["rating-group__error-message"]}>
				Please select a rating between 1 and 5.
			</RatingGroup.ErrorMessage>
		</RatingGroup>
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
			<RatingGroup class={style["rating-group"]} name="rate">
				<RatingGroup.Control class={style["rating-group__control"]}>
					<Index each={Array(5)}>
						{(_) => (
							<RatingGroup.Item class={style["rating-group-item"]}>
								<RatingGroup.ItemControl>
									<StarIcon />
								</RatingGroup.ItemControl>
							</RatingGroup.Item>
						)}
					</Index>
				</RatingGroup.Control>
				<RatingGroup.HiddenInput />
			</RatingGroup>
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
