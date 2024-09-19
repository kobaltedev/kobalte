import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as Toast from ".";
import { I18nProvider } from "../i18n";
import { toaster } from "./toaster";
import type { ShowToastOptions } from "./types";

describe("Toast", () => {
	installPointerEvent();

	beforeEach(() => {
		vi.useFakeTimers();
		toaster.clear();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.clearAllTimers();
	});

	const showToast = (
		rootProps: Partial<Toast.ToastRootProps> = {},
		options?: ShowToastOptions,
	) => {
		return toaster.show(
			(props) => (
				<Toast.Root {...rootProps} toastId={props.toastId}>
					<Toast.Title data-testid="title">Title</Toast.Title>
					<Toast.Description data-testid="description">
						Description
					</Toast.Description>
					<Toast.CloseButton data-testid="close-button" />
					<button
						type="button"
						data-testid="manual-dismiss"
						onClick={() => toaster.dismiss(props.toastId)}
					/>
				</Toast.Root>
			),
			options,
		);
	};

	it("renders correctly", async () => {
		const { getByRole, getByTestId } = render(() => (
			<>
				<button type="button" data-testid="trigger" onClick={() => showToast()}>
					Show
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		expect(toast).toBeInTheDocument();
	});

	it("should have 'aria-live' set to 'assertive' when priority is 'high'", async () => {
		const { getByRole, getByTestId } = render(() => (
			<>
				<button
					type="button"
					data-testid="trigger"
					onClick={() => showToast({ priority: "high" })}
				>
					Show
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		expect(toast).toHaveAttribute("aria-live", "assertive");
	});

	it("should have 'aria-live' set to 'polite' when priority is 'low'", async () => {
		const { getByRole, getByTestId } = render(() => (
			<>
				<button
					type="button"
					data-testid="trigger"
					onClick={() => showToast({ priority: "low" })}
				>
					Show
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		expect(toast).toHaveAttribute("aria-live", "polite");
	});

	it("should have 'aria-atomic' set to 'true'", async () => {
		const { getByRole, getByTestId } = render(() => (
			<>
				<button type="button" data-testid="trigger" onClick={() => showToast()}>
					Show
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		expect(toast).toHaveAttribute("aria-atomic", "true");
	});

	it("should be labelled by its toast title", async () => {
		const { getByRole, getByTestId } = render(() => (
			<>
				<button type="button" data-testid="trigger" onClick={() => showToast()}>
					Show
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		const title = getByTestId("title");

		expect(toast).toHaveAttribute("aria-labelledby", title.id);
	});

	it("should be described by its toast description", async () => {
		const { getByRole, getByTestId } = render(() => (
			<>
				<button type="button" data-testid="trigger" onClick={() => showToast()}>
					Show
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		const description = getByTestId("description");

		expect(toast).toHaveAttribute("aria-describedby", description.id);
	});

	it("should close after duration", async () => {
		const duration = 1000;

		const { getByRole, getByTestId } = render(() => (
			<>
				<button type="button" data-testid="trigger" onClick={() => showToast()}>
					Show
				</button>
				<Toast.Region duration={duration}>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		expect(toast).toBeInTheDocument();

		vi.advanceTimersByTime(duration);

		//		expect(toast).not.toBeInTheDocument(); // TODO: fix solid-presence vitest
	});

	it("supports overriding toast region duration", async () => {
		const durationOverride = 1000;

		const { getByRole, getByTestId } = render(() => (
			<>
				<button
					type="button"
					data-testid="trigger"
					onClick={() => showToast({ duration: durationOverride })}
				>
					Show
				</button>
				<Toast.Region duration={3000}>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		expect(toast).toBeInTheDocument();

		vi.advanceTimersByTime(durationOverride);

		//		expect(toast).not.toBeInTheDocument(); // TODO: fix solid-presence vitest
	});

	it("should not close after duration if persistent", async () => {
		const duration = 1000;

		const { getByRole, getByTestId } = render(() => (
			<>
				<button
					type="button"
					data-testid="trigger"
					onClick={() => showToast({ persistent: true })}
				>
					Show
				</button>
				<Toast.Region duration={duration}>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		expect(toast).toBeInTheDocument();

		vi.advanceTimersByTime(duration);

		expect(toast).toBeInTheDocument();
	});

	it("should close when clicking the toast close button", async () => {
		const { getByRole, getByTestId } = render(() => (
			<>
				<button type="button" data-testid="trigger" onClick={() => showToast()}>
					Show
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		expect(toast).toBeInTheDocument();

		fireEvent.click(getByTestId("close-button"));

		//		expect(toast).not.toBeInTheDocument(); // TODO: fix solid-presence vitest
	});

	it("should close when using toaster dismiss method", async () => {
		const { getByRole, getByTestId } = render(() => (
			<>
				<button type="button" data-testid="trigger" onClick={() => showToast()}>
					Show
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		const toast = getByRole("status");

		expect(toast).toBeInTheDocument();

		fireEvent.click(getByTestId("manual-dismiss"));

		//		expect(toast).not.toBeInTheDocument(); // TODO: fix solid-presence vitest
	});

	it("can be updated with the toaster", async () => {
		let toastId = -1;

		const { getByRole, getByTestId } = render(() => (
			<>
				<button
					type="button"
					data-testid="trigger"
					onClick={() => {
						toastId = toaster.show((props) => (
							<Toast.Root {...props}>Initial</Toast.Root>
						));
					}}
				>
					Show
				</button>
				<button
					type="button"
					data-testid="update-trigger"
					onClick={() => {
						toaster.update(toastId, (props) => (
							<Toast.Root {...props}>Updated</Toast.Root>
						));
					}}
				>
					Update
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		expect(getByRole("status")).toHaveTextContent("Initial");

		fireEvent.click(getByTestId("update-trigger"));

		expect(getByRole("status")).toHaveTextContent("Updated");
	});

	it.skipIf(process.env.GITHUB_ACTIONS)(
		"supports promise resolve",
		async () => {
			const timeout = 1000;

			const promise = () =>
				new Promise<string>((resolve) =>
					setTimeout(() => resolve("data"), timeout),
				);

			const { getByRole, getByTestId } = render(() => (
				<>
					<button
						type="button"
						data-testid="trigger"
						onClick={() =>
							toaster.promise(promise, (props) => (
								<Toast.Root toastId={props.toastId}>
									{props.state} - {props.data}
								</Toast.Root>
							))
						}
					>
						Show
					</button>
					<Toast.Region>
						<Toast.List />
					</Toast.Region>
				</>
			));

			fireEvent.click(getByTestId("trigger"));

			expect(getByRole("status")).toHaveTextContent("pending");

			vi.advanceTimersByTime(timeout);
			await Promise.resolve();

			expect(getByRole("status")).toHaveTextContent("fulfilled - data");
		},
	);

	// don't know how to test implicit promise rejection
	it.skip("supports promise reject", async () => {
		const timeout = 1000;

		const promise = () =>
			new Promise<string>((_, reject) =>
				setTimeout(() => reject(new Error("error")), timeout),
			);

		const { getByRole, getByTestId } = render(() => (
			<>
				<button
					type="button"
					data-testid="trigger"
					onClick={() =>
						toaster.promise<string, Error>(promise, (props) => (
							<Toast.Root toastId={props.toastId}>
								{props.state} - {props.error?.message}
							</Toast.Root>
						))
					}
				>
					Show
				</button>
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			</>
		));

		fireEvent.click(getByTestId("trigger"));

		expect(getByRole("status")).toHaveTextContent("pending");

		vi.advanceTimersByTime(timeout);
		try {
			await Promise.reject();
		} catch (e) {
			// noop
		}

		expect(getByRole("status")).toHaveTextContent("rejected - error");
	});

	describe("Toast.Region", () => {
		it("renders correctly", async () => {
			const { getByRole } = render(() => (
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			));

			const region = getByRole("region");

			expect(region).toBeInTheDocument();
		});

		it("has default 'aria-label' with hot keys", async () => {
			const { getByRole } = render(() => (
				<I18nProvider locale="en">
					<Toast.Region>
						<Toast.List />
					</Toast.Region>
				</I18nProvider>
			));

			const region = getByRole("region");

			expect(region).toHaveAttribute("aria-label", "Notifications (alt+T)");
		});

		it("supports custom 'aria-label' with hot keys placeholder replacement", async () => {
			const { getByRole } = render(() => (
				<I18nProvider locale="en">
					<Toast.Region aria-label="Toasts - {hotkey}">
						<Toast.List />
					</Toast.Region>
				</I18nProvider>
			));

			const region = getByRole("region");

			expect(region).toHaveAttribute("aria-label", "Toasts - alt+T");
		});

		it("has 'pointer-events' set to 'none' when no toast", async () => {
			const { getByRole } = render(() => (
				<Toast.Region>
					<Toast.List />
				</Toast.Region>
			));

			const region = getByRole("region");

			expect(region).toHaveStyle({ "pointer-events": "none" });
		});

		it("should not show move toasts than the limit as the same time", async () => {
			const limit = 3;
			const aboveLimit = limit + 1;

			const { getAllByRole, getByTestId } = render(() => (
				<>
					<button
						type="button"
						data-testid="trigger"
						onClick={() => {
							for (let i = 0; i < aboveLimit; i++) showToast();
						}}
					>
						Show more than limit
					</button>
					<Toast.Region limit={limit}>
						<Toast.List />
					</Toast.Region>
				</>
			));

			fireEvent.click(getByTestId("trigger"));

			const toasts = getAllByRole("status");

			expect(toasts.length).toBe(limit);
		});

		it("should not use dismissed toasts for list", async () => {
			const limit = 1;

			let closeId: number;

			const { getAllByRole, getByTestId } = render(() => (
				<>
					<button
						type="button"
						data-testid="dismiss-toast"
						onClick={() => {
							toaster.dismiss(closeId);
						}}
					>
						Close a toast
					</button>
					<button
						type="button"
						data-testid="trigger"
						onClick={() => {
							closeId = showToast();
						}}
					>
						Show Toast
					</button>
					<Toast.Region limit={limit}>
						<Toast.List data-testid="custom-region" />
					</Toast.Region>
				</>
			));

			fireEvent.click(getByTestId("trigger"));

			fireEvent.click(getByTestId("dismiss-toast"));

			let toasts =
				getByTestId("custom-region").querySelectorAll('[role="status"]');
			expect(toasts.length).toBe(0);

			fireEvent.click(getByTestId("trigger"));

			toasts = getByTestId("custom-region").querySelectorAll('[role="status"]');

			expect(toasts.length).toBe(1);
		});

		it("should render multiple regions simultaneously", async () => {
			const { getByTestId } = render(() => (
				<>
					<button
						type="button"
						data-testid="trigger"
						onClick={() => {
							showToast(
								{},
								{
									region: "custom-id",
								},
							);
							showToast();
							showToast();
							showToast();
							showToast(
								{},
								{
									region: "custom-id",
								},
							);
						}}
					>
						Show more than limit
					</button>
					<Toast.Region>
						<Toast.List data-testid="default-region" />
					</Toast.Region>
					<Toast.Region regionId="custom-id">
						<Toast.List data-testid="custom-region" />
					</Toast.Region>
				</>
			));

			fireEvent.click(getByTestId("trigger"));

			const defaultRegionToasts =
				getByTestId("default-region").querySelectorAll('[role="status"]');
			const customRegionToasts =
				getByTestId("custom-region").querySelectorAll('[role="status"]');

			expect(defaultRegionToasts.length).toBe(3);
			expect(customRegionToasts.length).toBe(2);
		});
	});

	describe("Toast.List", () => {
		it.skipIf(process.env.GITHUB_ACTIONS)(
			"pauses timers on pointer move and resume on pointer leave when 'pauseOnInteraction'",
			async () => {
				const duration = 1000;

				const { getByRole, getByTestId } = render(() => (
					<>
						<button
							type="button"
							data-testid="trigger"
							onClick={() => showToast()}
						>
							Show
						</button>
						<Toast.Region duration={duration} pauseOnInteraction>
							<Toast.List data-testid="list" />
						</Toast.Region>
					</>
				));

				fireEvent.click(getByTestId("trigger"));

				const toast = getByRole("status");

				expect(toast).toBeInTheDocument();

				const list = getByTestId("list");

				fireEvent(
					list,
					createPointerEvent("pointermove", {
						pointerId: 1,
						pointerType: "mouse",
					}),
				);
				await Promise.resolve();

				vi.advanceTimersByTime(duration);

				expect(toast).toBeInTheDocument();

				fireEvent(
					list,
					createPointerEvent("pointerleave", {
						pointerId: 1,
						pointerType: "mouse",
					}),
				);
				await Promise.resolve();

				vi.advanceTimersByTime(duration);

				//				expect(toast).not.toBeInTheDocument(); // TODO: fix solid-presence vitest
			},
		);

		it.skipIf(process.env.GITHUB_ACTIONS)(
			"pauses timers on focus in and resume on focus out when 'pauseOnInteraction'",
			async () => {
				const duration = 1000;

				const { getByRole, getByTestId } = render(() => (
					<>
						<button
							type="button"
							data-testid="trigger"
							onClick={() => showToast()}
						>
							Show
						</button>
						<Toast.Region duration={duration} pauseOnInteraction>
							<Toast.List data-testid="list" />
						</Toast.Region>
					</>
				));

				fireEvent.click(getByTestId("trigger"));

				const toast = getByRole("status");

				expect(toast).toBeInTheDocument();

				const list = getByTestId("list");

				fireEvent.focusIn(list);
				await Promise.resolve();

				vi.advanceTimersByTime(duration);

				expect(toast).toBeInTheDocument();

				fireEvent.focusOut(list);
				await Promise.resolve();

				vi.advanceTimersByTime(duration);

				//				expect(toast).not.toBeInTheDocument(); // TODO: fix solid-presence vitest
			},
		);
	});
});
