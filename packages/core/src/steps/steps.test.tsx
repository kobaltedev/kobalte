import { fireEvent, render } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { vi } from "vitest";

import * as Steps from ".";

function StepsExample(props: {
	count?: number;
	value?: number;
	onChange?: (value: number) => void;
	linear?: boolean;
	isStepValid?: (index: number) => boolean;
	isStepSkippable?: (index: number) => boolean;
	onStepComplete?: () => void;
	onStepInvalid?: (details: { step: number }) => void;
}) {
	const count = props.count ?? 3;

	return (
		<Steps.Root
			count={count}
			value={props.value}
			onChange={props.onChange}
			linear={props.linear}
			isStepValid={props.isStepValid}
			isStepSkippable={props.isStepSkippable}
			onStepComplete={props.onStepComplete}
			onStepInvalid={props.onStepInvalid}
		>
			<Steps.List>
				{Array.from({ length: count }, (_, index) => (
					<Steps.Item index={index} data-testid="item">
						<Steps.Trigger data-testid="trigger">
							<Steps.Indicator data-testid="indicator">
								{index + 1}
							</Steps.Indicator>
						</Steps.Trigger>
						<Steps.Separator data-testid="separator" />
					</Steps.Item>
				))}
			</Steps.List>
			{Array.from({ length: count }, (_, index) => (
				<Steps.Content index={index} data-testid="content">
					Step {index + 1} content
				</Steps.Content>
			))}
			<Steps.CompletedContent data-testid="completed">
				All done!
			</Steps.CompletedContent>
			<Steps.Progress data-testid="progress" />
			<Steps.PrevTrigger data-testid="prev">Prev</Steps.PrevTrigger>
			<Steps.NextTrigger data-testid="next">Next</Steps.NextTrigger>
		</Steps.Root>
	);
}

describe("Steps", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders with the first step current by default", () => {
		const { getAllByTestId, getByTestId } = render(() => <StepsExample />);

		const items = getAllByTestId("item");
		expect(items).toHaveLength(3);

		expect(items[0]).toHaveAttribute("data-current");
		expect(items[1]).toHaveAttribute("data-incomplete");
		expect(items[2]).toHaveAttribute("data-incomplete");

		expect(getByTestId("prev")).toBeDisabled();
		expect(getByTestId("next")).not.toBeDisabled();

		const contents = getByTestId("content");
		expect(contents).toHaveTextContent("Step 1 content");
	});

	it("cross-references each trigger and its content via aria-controls/aria-labelledby, and hides separators from assistive technology", () => {
		const { getAllByTestId, getByTestId } = render(() => <StepsExample />);

		// Only the current step's content is mounted at a time, so check the
		// active trigger/content pair, then advance and check the next pair.
		for (let step = 0; step < 2; step++) {
			const trigger = getAllByTestId("trigger")[step];
			const content = getByTestId("content");

			expect(trigger.getAttribute("aria-controls")).toBe(content.id);
			expect(content.getAttribute("aria-labelledby")).toBe(trigger.id);

			fireEvent.click(getByTestId("next"));
			flush();
		}

		for (const separator of getAllByTestId("separator")) {
			expect(separator).toHaveAttribute("aria-hidden", "true");
		}
	});

	it("NextTrigger/PrevTrigger navigate between steps", () => {
		const { getByTestId, getAllByTestId } = render(() => <StepsExample />);

		fireEvent.click(getByTestId("next"));
		flush();

		let items = getAllByTestId("item");
		expect(items[0]).toHaveAttribute("data-complete");
		expect(items[1]).toHaveAttribute("data-current");
		expect(getByTestId("content")).toHaveTextContent("Step 2 content");

		fireEvent.click(getByTestId("prev"));
		flush();

		items = getAllByTestId("item");
		expect(items[0]).toHaveAttribute("data-current");
		expect(getByTestId("content")).toHaveTextContent("Step 1 content");
	});

	it("clicking a trigger jumps directly to that step when not linear", () => {
		const { getAllByTestId, getByTestId } = render(() => <StepsExample />);

		const triggers = getAllByTestId("trigger");
		fireEvent.click(triggers[2]);
		flush();

		expect(getAllByTestId("item")[2]).toHaveAttribute("data-current");
		expect(getByTestId("content")).toHaveTextContent("Step 3 content");
	});

	it("reaches the completed state after the last NextTrigger click", () => {
		const onStepComplete = vi.fn();
		const { getByTestId } = render(() => (
			<StepsExample count={2} onStepComplete={onStepComplete} />
		));

		fireEvent.click(getByTestId("next"));
		flush();
		fireEvent.click(getByTestId("next"));
		flush();

		expect(onStepComplete).toHaveBeenCalledTimes(1);
		expect(getByTestId("next")).toBeDisabled();
		expect(getByTestId("completed")).toHaveTextContent("All done!");
	});

	it("linear mode blocks jumping ahead past the next step", () => {
		const onStepInvalid = vi.fn();
		const { getAllByTestId, getByTestId } = render(() => (
			<StepsExample linear onStepInvalid={onStepInvalid} />
		));

		const triggers = getAllByTestId("trigger");
		fireEvent.click(triggers[2]);
		flush();

		expect(getAllByTestId("item")[0]).toHaveAttribute("data-current");
		expect(onStepInvalid).toHaveBeenCalledWith({ step: 0 });
	});

	it("linear mode blocks advancing past an invalid step", () => {
		const onStepInvalid = vi.fn();
		const { getByTestId, getAllByTestId } = render(() => (
			<StepsExample
				linear
				isStepValid={(index) => index !== 0}
				onStepInvalid={onStepInvalid}
			/>
		));

		fireEvent.click(getByTestId("next"));
		flush();

		expect(getAllByTestId("item")[0]).toHaveAttribute("data-current");
		expect(onStepInvalid).toHaveBeenCalledWith({ step: 0 });
	});

	it("linear mode allows advancing to the next step once it becomes valid, and always allows going back", () => {
		const { getByTestId, getAllByTestId } = render(() => (
			<StepsExample linear />
		));

		fireEvent.click(getByTestId("next"));
		flush();
		expect(getAllByTestId("item")[1]).toHaveAttribute("data-current");

		const triggers = getAllByTestId("trigger");
		fireEvent.click(triggers[0]);
		flush();
		expect(getAllByTestId("item")[0]).toHaveAttribute("data-current");
	});

	it("isStepSkippable causes next/prev navigation to skip marked steps", () => {
		const { getByTestId, getAllByTestId } = render(() => (
			<StepsExample count={3} isStepSkippable={(index) => index === 1} />
		));

		fireEvent.click(getByTestId("next"));
		flush();

		expect(getAllByTestId("item")[2]).toHaveAttribute("data-current");

		fireEvent.click(getByTestId("prev"));
		flush();

		expect(getAllByTestId("item")[0]).toHaveAttribute("data-current");
	});

	it("supports controlled value/onChange", () => {
		const onChange = vi.fn();

		function Controlled() {
			const [value, setValue] = createSignal(0);

			return (
				<StepsExample
					value={value()}
					onChange={(v) => {
						setValue(v);
						onChange(v);
					}}
				/>
			);
		}

		const { getByTestId } = render(() => <Controlled />);

		fireEvent.click(getByTestId("next"));
		flush();

		expect(onChange).toHaveBeenCalledWith(1);
	});

	it("Progress reflects the completion percentage", () => {
		const { getByTestId } = render(() => <StepsExample count={4} />);

		const progress = getByTestId("progress");
		expect(progress).toHaveAttribute("aria-valuenow", "0");
		expect(progress).toHaveAttribute("aria-valuemax", "4");

		fireEvent.click(getByTestId("next"));
		flush();

		expect(progress).toHaveAttribute("aria-valuenow", "1");
		expect(progress.style.width).toBe("25%");
	});

	it("Root sets data-orientation and the --percent CSS variable", () => {
		const { container } = render(() => <StepsExample />);

		const root = container.firstElementChild as HTMLElement;
		expect(root).toHaveAttribute("data-orientation", "horizontal");
		expect(root.style.getPropertyValue("--percent")).toBe("0%");
	});
});
