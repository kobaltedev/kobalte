import { fireEvent, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import * as Combobox from ".";

describe("Combobox disabled while open", () => {
	it("ignores option clicks until re-enabled", () => {
		const [disabled, setDisabled] = createSignal(false);
		const onChange = vi.fn();
		const { getByRole } = render(() => (
			<Combobox.Root<string>
				options={["Apple", "Orange"]}
				defaultValue="Apple"
				defaultFilter={() => true}
				open
				disabled={disabled()}
				onChange={onChange}
				itemComponent={(props) => (
					<Combobox.Item item={props.item}>
						<Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
					</Combobox.Item>
				)}
			>
				<Combobox.Control>
					<Combobox.Input />
					<Combobox.Trigger />
				</Combobox.Control>
				<Combobox.Content>
					<Combobox.Listbox />
				</Combobox.Content>
			</Combobox.Root>
		));

		const orange = () => getByRole("option", { name: "Orange" });
		setDisabled(true);
		fireEvent.click(orange());
		expect(onChange).not.toHaveBeenCalled();
		expect(orange().getAttribute("aria-disabled")).toBe("true");

		setDisabled(false);
		fireEvent.click(orange());
		expect(onChange).toHaveBeenCalledWith("Orange");
	});
});
