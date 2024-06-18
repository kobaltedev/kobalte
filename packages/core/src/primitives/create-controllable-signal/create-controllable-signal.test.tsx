import { fireEvent, render } from "@solidjs/testing-library";
import { createRoot, createSignal } from "solid-js";
import { vi } from "vitest";

import { createControllableSignal } from "./create-controllable-signal";

describe("createControllableSignal", () => {
	it("should handle setValue behavior (uncontrolled mode)", async () =>
		createRoot(async (dispose) => {
			const onChangeSpy = vi.fn();

			const [value, setValue] = createControllableSignal<string | undefined>({
				defaultValue: () => "defaultValue",
				onChange: onChangeSpy,
			});

			expect(value()).toBe("defaultValue");
			expect(onChangeSpy).not.toHaveBeenCalled();

			setValue("newValue");
			await Promise.resolve();

			expect(value()).toBe("newValue");
			expect(onChangeSpy).toHaveBeenLastCalledWith("newValue");

			// clear it, so we can check more easily that it's not called in the next expect
			onChangeSpy.mockClear();

			setValue("newValue");
			await Promise.resolve();

			expect(value()).toBe("newValue");

			// won't invoke onChange for the same value twice in a row
			expect(onChangeSpy).not.toHaveBeenCalled();

			dispose();
		}));

	it("should handle setValue with callback behavior (uncontrolled mode)", async () =>
		createRoot(async (dispose) => {
			const onChangeSpy = vi.fn();

			const [value, setValue] = createControllableSignal<string | undefined>({
				defaultValue: () => "defaultValue",
				onChange: onChangeSpy,
			});

			expect(value()).toBe("defaultValue");
			expect(onChangeSpy).not.toHaveBeenCalled();

			setValue((prevValue) => {
				expect(prevValue).toBe("defaultValue");
				return "newValue";
			});
			await Promise.resolve();

			expect(value()).toBe("newValue");
			expect(onChangeSpy).toHaveBeenLastCalledWith("newValue");

			// clear it, so we can check more easily that it's not called in the next expect
			onChangeSpy.mockClear();

			setValue((prevValue) => {
				expect(prevValue).toBe("newValue");
				return "newValue";
			});
			await Promise.resolve();

			expect(value()).toBe("newValue");

			// won't invoke onChange for the same value twice in a row
			expect(onChangeSpy).not.toHaveBeenCalled();

			dispose();
		}));

	it("should handle setValue behavior (controlled mode)", async () =>
		createRoot(async (dispose) => {
			const onChangeSpy = vi.fn();

			const [value, setValue] = createControllableSignal<string>({
				value: () => "controlledValue",
				onChange: onChangeSpy,
			});

			expect(value()).toBe("controlledValue");
			expect(onChangeSpy).not.toHaveBeenCalled();

			setValue("newValue");
			await Promise.resolve();

			expect(value()).toBe("controlledValue");
			expect(onChangeSpy).toHaveBeenLastCalledWith("newValue");

			// clear it, so we can check more easily that it's not called in the next expect
			onChangeSpy.mockClear();

			setValue("controlledValue");
			await Promise.resolve();

			expect(value()).toBe("controlledValue");

			// won't invoke onChange for the same value twice in a row
			expect(onChangeSpy).not.toHaveBeenCalled();

			dispose();
		}));

	it("should handle setValue with callback behavior (controlled mode)", async () =>
		createRoot(async (dispose) => {
			const onChangeSpy = vi.fn();

			const [value, setValue] = createControllableSignal<string>({
				value: () => "controlledValue",
				onChange: onChangeSpy,
			});

			expect(value()).toBe("controlledValue");
			expect(onChangeSpy).not.toHaveBeenCalled();

			setValue((prevValue) => {
				expect(prevValue).toBe("controlledValue");
				return "newValue";
			});
			await Promise.resolve();

			expect(value()).toBe("controlledValue");
			expect(onChangeSpy).toHaveBeenLastCalledWith("newValue");

			// clear it, so we can check more easily that it's not called in the next expect
			onChangeSpy.mockClear();

			setValue((prevValue) => {
				expect(prevValue).toBe("controlledValue");
				return "controlledValue";
			});
			await Promise.resolve();

			expect(value()).toBe("controlledValue");

			// won't invoke onChange for the same value twice in a row
			expect(onChangeSpy).not.toHaveBeenCalled();

			dispose();
		}));

	it("should update value after props.value change (controlled mode)", async () =>
		createRoot(async (dispose) => {
			const onChangeSpy = vi.fn();

			const TestComponent = (props: any) => {
				const [value] = createControllableSignal<string>(props);

				return <div data-testid="test-component">{value()}</div>;
			};

			const TestComponentWrapper = (props: any) => {
				const [state, setState] = createSignal(props.value);
				return (
					<>
						<TestComponent value={state} onChange={onChangeSpy} />
						<button type="button" onClick={() => setState("updated")} />
					</>
				);
			};

			const { getByRole, getByTestId } = render(() => (
				<TestComponentWrapper value="controlledValue" />
			));

			const button = getByRole("button");
			const testComponent = getByTestId("test-component");

			expect(testComponent).toHaveTextContent("controlledValue");
			expect(onChangeSpy).not.toHaveBeenCalled();

			fireEvent.click(button);
			await Promise.resolve();

			expect(testComponent).toHaveTextContent("updated");
			expect(onChangeSpy).not.toHaveBeenCalled();

			dispose();
		}));

	it("should only trigger onChange once when using NaN", async () =>
		createRoot(async (dispose) => {
			const onChangeSpy = vi.fn();

			const [value, setValue] = createControllableSignal<number | undefined>({
				onChange: onChangeSpy,
			});

			expect(value()).not.toBeDefined();
			expect(onChangeSpy).not.toHaveBeenCalled();

			setValue(Number.NaN);
			await Promise.resolve();

			expect(value()).toBe(Number.NaN);
			expect(onChangeSpy).toHaveBeenCalledTimes(1);
			expect(onChangeSpy).toHaveBeenLastCalledWith(Number.NaN);

			setValue(Number.NaN);
			await Promise.resolve();

			expect(value()).toBe(Number.NaN);
			expect(onChangeSpy).toHaveBeenCalledTimes(1);

			dispose();
		}));
});
