import {
	access,
	clamp,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
	type Orientation,
} from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createUniqueId, omit } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createControllableSignal } from "../primitives";
import {
	type StepState,
	StepsContext,
	type StepsContextValue,
} from "./steps-context";

export interface StepsRootOptions {
	/** The total number of steps. */
	count: number;

	/** The controlled index of the current step. */
	value?: number;

	/**
	 * The index of the current step when initially rendered.
	 * Useful when you do not need to control the state.
	 */
	defaultValue?: number;

	/** Event handler called when the current step changes. */
	onChange?: (value: number) => void;

	/** The orientation of the steps. */
	orientation?: Orientation;

	/**
	 * Whether the user must complete the steps in order — jumping ahead to a
	 * step further than the next one is blocked unless the current step is
	 * valid.
	 * @defaultValue false
	 */
	linear?: boolean;

	/**
	 * Returns whether the step at `index` is valid, used to gate forward
	 * navigation when `linear` is `true`.
	 * @defaultValue () => true
	 */
	isStepValid?: (index: number) => boolean;

	/**
	 * Returns whether the step at `index` should be skipped over by
	 * `goToNextStep`/`goToPrevStep`.
	 * @defaultValue () => false
	 */
	isStepSkippable?: (index: number) => boolean;

	/** Event handler called once when every step has been completed. */
	onStepComplete?: () => void;

	/** Event handler called when navigation is blocked by an invalid step in `linear` mode. */
	onStepInvalid?: (details: { step: number }) => void;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate ids for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;
}

export interface StepsRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties | string;
}

export interface StepsRootRenderProps extends StepsRootCommonProps {
	"data-orientation": Orientation;
}

export type StepsRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StepsRootOptions & Partial<StepsRootCommonProps<ElementOf<T>>>;

export function StepsRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StepsRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `steps-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			orientation: "horizontal",
			linear: false,
			isStepValid: () => true,
			isStepSkippable: () => false,
		},
		props as StepsRootProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"style",
		"count",
		"value",
		"defaultValue",
		"onChange",
		"orientation",
		"linear",
		"isStepValid",
		"isStepSkippable",
		"onStepComplete",
		"onStepInvalid",
	);

	const initialValueIsControlled = mergedProps.value !== undefined;

	const [value, setValueRaw] = createControllableSignal<number>({
		value: () =>
			initialValueIsControlled ? (mergedProps.value ?? 0) : undefined,
		defaultValue: () => mergedProps.defaultValue ?? 0,
		onChange: (v) => mergedProps.onChange?.(v),
	});

	const count = () => mergedProps.count!;

	const setStep = (index: number) => {
		const clamped = clamp(index, 0, count());
		const wasCompleted = (value() ?? 0) >= count();

		setValueRaw(clamped);

		if (!wasCompleted && clamped >= count()) {
			mergedProps.onStepComplete?.();
		}
	};

	// `mergeDefaultProps`'s underlying `merge()` treats an explicitly passed
	// `undefined` (e.g. `isStepValid={someCondition ? fn : undefined}`) as an
	// override, not a fall-through to the default — so don't rely on the
	// default here, guard directly against a missing function instead.
	const isStepValid = (index: number) =>
		mergedProps.isStepValid?.(index) ?? true;
	const isStepSkippable = (index: number) =>
		mergedProps.isStepSkippable?.(index) ?? false;

	const canChangeStep = (index: number) => {
		const current = value() ?? 0;

		if (index === current) {
			return false;
		}

		if (!mergedProps.linear) {
			return true;
		}

		if (index < current) {
			return true;
		}

		return index === current + 1 && isStepValid(current);
	};

	const changeStep = (index: number) => {
		const current = value() ?? 0;

		if (index === current) {
			return;
		}

		if (canChangeStep(index)) {
			setStep(index);
		} else {
			mergedProps.onStepInvalid?.({ step: current });
		}
	};

	const goToNextStep = () => {
		const current = value() ?? 0;

		if (current >= count()) {
			return;
		}

		if (mergedProps.linear && !isStepValid(current)) {
			mergedProps.onStepInvalid?.({ step: current });
			return;
		}

		let next = current + 1;

		while (next < count() && isStepSkippable(next)) {
			next++;
		}

		setStep(next);
	};

	const goToPrevStep = () => {
		let prev = (value() ?? 0) - 1;

		while (prev > 0 && isStepSkippable(prev)) {
			prev--;
		}

		if (prev < 0) {
			return;
		}

		setStep(prev);
	};

	const resetStep = () => setStep(mergedProps.defaultValue ?? 0);

	const hasNextStep = () => (value() ?? 0) < count();
	const hasPrevStep = () => (value() ?? 0) > 0;
	const isCompleted = () => (value() ?? 0) >= count();

	const percent = () => {
		const total = count();
		return total <= 0 ? 0 : clamp(((value() ?? 0) / total) * 100, 0, 100);
	};

	const getItemState = (index: number): StepState => {
		const current = value() ?? 0;

		if (index < current) {
			return "complete";
		}

		if (index === current) {
			return "current";
		}

		return "incomplete";
	};

	const resolvedStyle = (): JSX.CSSProperties => {
		const percentVar = { "--percent": `${percent()}%` } as JSX.CSSProperties;
		const userStyle = mergedProps.style;

		if (!userStyle || typeof userStyle === "string") {
			return percentVar;
		}

		return { ...percentVar, ...userStyle };
	};

	const context: StepsContextValue = {
		value: () => value() ?? 0,
		count,
		percent,
		orientation: () => mergedProps.orientation!,
		hasNextStep,
		hasPrevStep,
		isCompleted,
		isStepValid,
		isStepSkippable,
		getItemState,
		canChangeStep,
		changeStep,
		setStep,
		goToNextStep,
		goToPrevStep,
		resetStep,
		generateId: createGenerateId(() => access(mergedProps.id)!),
	};

	return (
		<StepsContext value={context}>
			<Polymorphic<StepsRootRenderProps>
				as="div"
				ref={mergeRefs((el) => (ref = el as HTMLElement), mergedProps.ref)}
				id={access(mergedProps.id)!}
				data-orientation={context.orientation()}
				style={resolvedStyle()}
				{...others}
			/>
		</StepsContext>
	);
}
