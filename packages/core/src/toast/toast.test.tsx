import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen } from "@solidjs/testing-library";

import { I18nProvider } from "../i18n";
import * as Toast from ".";
import { toaster } from "./toaster";
import { ShowToastOptions } from "./types";

describe("Toast", () => {
  installPointerEvent();

  beforeEach(() => {
    jest.useFakeTimers();
    toaster.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const showToast = (rootProps: Partial<Toast.ToastRootProps> = {}, options?: ShowToastOptions) => {
    toaster.show(
      props => (
        <Toast.Root {...rootProps} toastId={props.toastId}>
          <Toast.Title data-testid="title">Title</Toast.Title>
          <Toast.Description data-testid="description">Description</Toast.Description>
          <Toast.CloseButton data-testid="close-button" />
          <button data-testid="manual-dismiss" onClick={() => toaster.dismiss(props.toastId)} />
        </Toast.Root>
      ),
      options
    );
  };

  it("renders correctly", async () => {
    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast()}>
          Show
        </button>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    expect(toast).toBeInTheDocument();
  });

  it("should have 'aria-live' set to 'assertive' when priority is 'high'", async () => {
    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast({ priority: "high" })}>
          Show
        </button>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    expect(toast).toHaveAttribute("aria-live", "assertive");
  });

  it("should have 'aria-live' set to 'polite' when priority is 'low'", async () => {
    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast({ priority: "low" })}>
          Show
        </button>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    expect(toast).toHaveAttribute("aria-live", "polite");
  });

  it("should have 'aria-atomic' set to 'true'", async () => {
    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast()}>
          Show
        </button>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    expect(toast).toHaveAttribute("aria-atomic", "true");
  });

  it("should be labelled by its toast title", async () => {
    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast()}>
          Show
        </button>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    const title = screen.getByTestId("title");

    expect(toast).toHaveAttribute("aria-labelledby", title.id);
  });

  it("should be described by its toast description", async () => {
    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast()}>
          Show
        </button>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    const description = screen.getByTestId("description");

    expect(toast).toHaveAttribute("aria-describedby", description.id);
  });

  it("should close after duration", async () => {
    const duration = 1000;

    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast()}>
          Show
        </button>
        <Toast.Region duration={duration}>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    expect(toast).toBeInTheDocument();

    jest.advanceTimersByTime(duration);

    expect(toast).not.toBeInTheDocument();
  });

  it("supports overriding toast region duration", async () => {
    const durationOverride = 1000;

    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast({ duration: durationOverride })}>
          Show
        </button>
        <Toast.Region duration={3000}>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    expect(toast).toBeInTheDocument();

    jest.advanceTimersByTime(durationOverride);

    expect(toast).not.toBeInTheDocument();
  });

  it("should not close after duration if persistent", async () => {
    const duration = 1000;

    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast({ persistent: true })}>
          Show
        </button>
        <Toast.Region duration={duration}>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    expect(toast).toBeInTheDocument();

    jest.advanceTimersByTime(duration);

    expect(toast).toBeInTheDocument();
  });

  it("should close when clicking the toast close button", async () => {
    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast()}>
          Show
        </button>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    expect(toast).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-button"));

    expect(toast).not.toBeInTheDocument();
  });

  it("should close when using toaster dismiss method", async () => {
    render(() => (
      <>
        <button data-testid="trigger" onClick={() => showToast()}>
          Show
        </button>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    const toast = screen.getByRole("status");

    expect(toast).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("manual-dismiss"));

    expect(toast).not.toBeInTheDocument();
  });

  it("can be updated with the toaster", async () => {
    let toastId = -1;

    render(() => (
      <>
        <button
          data-testid="trigger"
          onClick={() => {
            toastId = toaster.show(props => <Toast.Root {...props}>Initial</Toast.Root>);
          }}
        >
          Show
        </button>
        <button
          data-testid="update-trigger"
          onClick={() => {
            toaster.update(toastId, props => <Toast.Root {...props}>Updated</Toast.Root>);
          }}
        >
          Update
        </button>
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      </>
    ));

    fireEvent.click(screen.getByTestId("trigger"));

    expect(screen.getByRole("status")).toHaveTextContent("Initial");

    fireEvent.click(screen.getByTestId("update-trigger"));

    expect(screen.getByRole("status")).toHaveTextContent("Updated");
  });

  it("supports promise resolve", async () => {
    const timeout = 1000;

    const promise = () =>
      new Promise<string>(resolve => setTimeout(() => resolve("data"), timeout));

    render(() => (
      <>
        <button
          data-testid="trigger"
          onClick={() =>
            toaster.promise(promise, props => (
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

    fireEvent.click(screen.getByTestId("trigger"));

    expect(screen.getByRole("status")).toHaveTextContent("pending");

    jest.advanceTimersByTime(timeout);
    await Promise.resolve();

    expect(screen.getByRole("status")).toHaveTextContent("fulfilled - data");
  });

  // don't know how to test implicit promise rejection
  it.skip("supports promise reject", async () => {
    const timeout = 1000;

    const promise = () =>
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error("error")), timeout));

    render(() => (
      <>
        <button
          data-testid="trigger"
          onClick={() =>
            toaster.promise<string, Error>(promise, props => (
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

    fireEvent.click(screen.getByTestId("trigger"));

    expect(screen.getByRole("status")).toHaveTextContent("pending");

    jest.advanceTimersByTime(timeout);
    try {
      await Promise.reject();
    } catch (e) {
      // noop
    }

    expect(screen.getByRole("status")).toHaveTextContent("rejected - error");
  });

  describe("Toast.Region", () => {
    it("renders correctly", async () => {
      render(() => (
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      ));

      const region = screen.getByRole("region");

      expect(region).toBeInTheDocument();
    });

    it("has default 'aria-label' with hot keys", async () => {
      render(() => (
        <I18nProvider locale="en">
          <Toast.Region>
            <Toast.List />
          </Toast.Region>
        </I18nProvider>
      ));

      const region = screen.getByRole("region");

      expect(region).toHaveAttribute("aria-label", "Notifications (alt+T)");
    });

    it("supports custom 'aria-label' with hot keys placeholder replacement", async () => {
      render(() => (
        <I18nProvider locale="en">
          <Toast.Region aria-label="Toasts - {hotkey}">
            <Toast.List />
          </Toast.Region>
        </I18nProvider>
      ));

      const region = screen.getByRole("region");

      expect(region).toHaveAttribute("aria-label", "Toasts - alt+T");
    });

    it("has 'pointer-events' set to 'none' when no toast", async () => {
      render(() => (
        <Toast.Region>
          <Toast.List />
        </Toast.Region>
      ));

      const region = screen.getByRole("region");

      expect(region).toHaveStyle({ "pointer-events": "none" });
    });

    it("should not show move toasts than the limit as the same time", async () => {
      const limit = 3;
      const aboveLimit = limit + 1;

      render(() => (
        <>
          <button
            data-testid="trigger"
            onClick={() => Array.from(Array(aboveLimit).keys()).forEach(() => showToast())}
          >
            Show more than limit
          </button>
          <Toast.Region limit={limit}>
            <Toast.List />
          </Toast.Region>
        </>
      ));

      fireEvent.click(screen.getByTestId("trigger"));

      const toasts = screen.getAllByRole("status");

      expect(toasts.length).toBe(limit);
    });

    it("should render multiple regions simultaneously", async () => {
      render(() => (
        <>
          <button
            data-testid="trigger"
            onClick={() => {
              showToast(
                {},
                {
                  region: "custom-id",
                }
              );
              showToast();
              showToast();
              showToast();
              showToast(
                {},
                {
                  region: "custom-id",
                }
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

      fireEvent.click(screen.getByTestId("trigger"));

      const defaultRegionToasts = screen
        .getByTestId("default-region")
        .querySelectorAll('[role="status"]');
      const customRegionToasts = screen
        .getByTestId("custom-region")
        .querySelectorAll('[role="status"]');

      expect(defaultRegionToasts.length).toBe(3);
      expect(customRegionToasts.length).toBe(2);
    });
  });

  describe("Toast.List", () => {
    it("pauses timers on pointer move and resume on pointer leave when 'pauseOnInteraction'", async () => {
      const duration = 1000;

      render(() => (
        <>
          <button data-testid="trigger" onClick={() => showToast()}>
            Show
          </button>
          <Toast.Region duration={duration} pauseOnInteraction>
            <Toast.List data-testid="list" />
          </Toast.Region>
        </>
      ));

      fireEvent.click(screen.getByTestId("trigger"));

      const toast = screen.getByRole("status");

      expect(toast).toBeInTheDocument();

      const list = screen.getByTestId("list");

      fireEvent(list, createPointerEvent("pointermove", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.advanceTimersByTime(duration);

      expect(toast).toBeInTheDocument();

      fireEvent(list, createPointerEvent("pointerleave", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      jest.advanceTimersByTime(duration);

      expect(toast).not.toBeInTheDocument();
    });

    it("pauses timers on focus in and resume on focus out when 'pauseOnInteraction'", async () => {
      const duration = 1000;

      render(() => (
        <>
          <button data-testid="trigger" onClick={() => showToast()}>
            Show
          </button>
          <Toast.Region duration={duration} pauseOnInteraction>
            <Toast.List data-testid="list" />
          </Toast.Region>
        </>
      ));

      fireEvent.click(screen.getByTestId("trigger"));

      const toast = screen.getByRole("status");

      expect(toast).toBeInTheDocument();

      const list = screen.getByTestId("list");

      fireEvent.focusIn(list);
      await Promise.resolve();

      jest.advanceTimersByTime(duration);

      expect(toast).toBeInTheDocument();

      fireEvent.focusOut(list);
      await Promise.resolve();

      jest.advanceTimersByTime(duration);

      expect(toast).not.toBeInTheDocument();
    });
  });
});
