import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as Select from ".";

const OPTIONS = ["One", "Two", "Three"];

function renderSelect(props: {
	readOnly?: boolean;
	onChange?: (value: string | null) => void;
}) {
	return render(() => (
		<Select.Root<string>
			options={OPTIONS}
			defaultValue="Two"
			readOnly={props.readOnly}
			onChange={props.onChange}
			itemComponent={(itemProps) => (
				<Select.Item item={itemProps.item}>
					<Select.ItemLabel>{itemProps.item.rawValue}</Select.ItemLabel>
				</Select.Item>
			)}
		>
			<Select.HiddenSelect />
			<Select.Trigger>
				<Select.Value<string>>{(state) => state.selectedOption()}</Select.Value>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content>
					<Select.Listbox />
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	));
}

const pressTrigger = async (trigger: HTMLElement, pointerType: string) => {
	fireEvent(
		trigger,
		createPointerEvent("pointerdown", {
			pointerId: 1,
			pointerType,
			clientX: 0,
			clientY: 0,
			button: 0,
		}),
	);
	await fireEvent.click(trigger);
	vi.runAllTimers();
};

const pressKey = async (trigger: HTMLElement, key: string) => {
	await fireEvent.keyDown(trigger, { key });
	vi.runAllTimers();
};

const OPENING_KEYS = ["Enter", " ", "ArrowDown", "ArrowUp"];
const CHANGING_KEYS = ["ArrowLeft", "ArrowRight", "t"];

describe("Select read only", () => {
	installPointerEvent();

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	describe("when it is not read only", () => {
		it.each(["mouse", "touch"])("opens on a %s press", async (pointerType) => {
			const { getByRole } = renderSelect({});
			const trigger = getByRole("button");

			await pressTrigger(trigger, pointerType);

			expect(trigger).toHaveAttribute("aria-expanded", "true");
		});

		it.each(OPENING_KEYS)("opens on the %j key", async (key) => {
			const { getByRole } = renderSelect({});
			const trigger = getByRole("button");

			await pressKey(trigger, key);

			expect(trigger).toHaveAttribute("aria-expanded", "true");
		});

		it.each(CHANGING_KEYS)("changes its value on the %j key", async (key) => {
			const onChange = vi.fn();
			const { getByRole } = renderSelect({ onChange });

			await pressKey(getByRole("button"), key);

			expect(onChange).toHaveBeenCalledTimes(1);
		});
	});

	describe("while it is read only", () => {
		it.each(["mouse", "touch"])(
			"does not open on a %s press",
			async (pointerType) => {
				const { getByRole } = renderSelect({ readOnly: true });
				const trigger = getByRole("button");

				await pressTrigger(trigger, pointerType);

				expect(trigger).toHaveAttribute("aria-expanded", "false");
			},
		);

		it.each(OPENING_KEYS)("does not open on the %j key", async (key) => {
			const { getByRole } = renderSelect({ readOnly: true });
			const trigger = getByRole("button");

			await pressKey(trigger, key);

			expect(trigger).toHaveAttribute("aria-expanded", "false");
		});

		it.each(CHANGING_KEYS)(
			"does not change its value on the %j key",
			async (key) => {
				const onChange = vi.fn();
				const { getByRole } = renderSelect({ readOnly: true, onChange });

				await pressKey(getByRole("button"), key);

				expect(onChange).not.toHaveBeenCalled();
			},
		);

		it("stays focusable", () => {
			const { getByRole } = renderSelect({ readOnly: true });
			const trigger = getByRole("button");

			trigger.focus();

			expect(trigger).not.toBeDisabled();
			expect(document.activeElement).toBe(trigger);
		});
	});
});
