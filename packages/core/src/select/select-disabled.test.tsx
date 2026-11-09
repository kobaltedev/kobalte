import { fireEvent, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import * as Select from ".";

describe("Select disabled while open", () => {
	it.each(["click", "Enter"])(
		"ignores %s after disabling and allows selection after re-enabling",
		(action) => {
			const [disabled, setDisabled] = createSignal(false);
			const onChange = vi.fn();
			const { getByRole } = render(() => (
				<Select.Root<string>
					options={["Apple", "Orange"]}
					defaultValue="Apple"
					defaultOpen
					disabled={disabled()}
					onChange={onChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							<Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
						</Select.Item>
					)}
				>
					<Select.Trigger>
						<Select.Value<string>>
							{(state) => state.selectedOption()}
						</Select.Value>
					</Select.Trigger>
					<Select.Content>
						<Select.Listbox />
					</Select.Content>
				</Select.Root>
			));
			const orange = () => getByRole("option", { name: "Orange" });
			setDisabled(true);
			if (action === "click") fireEvent.click(orange());
			else fireEvent.keyDown(orange(), { key: "Enter" });
			expect(onChange).not.toHaveBeenCalled();
			expect(
				getByRole("option", { name: "Apple" }).getAttribute("aria-selected"),
			).toBe("true");
			setDisabled(false);
			if (action === "click") fireEvent.click(orange());
			else fireEvent.keyDown(orange(), { key: "Enter" });
			expect(onChange).toHaveBeenCalledWith("Orange");
		},
	);
});
