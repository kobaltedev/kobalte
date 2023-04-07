import { createRoot, onCleanup, onMount } from "solid-js";
import { render, screen } from "@solidjs/testing-library";

import { createDefaultLocale } from "./create-default-locale";
import { I18nProvider, useLocale } from "./i18n-provider";

function Example() {
  const { locale, direction } = useLocale();
  return (
    <>
      <span data-testid="locale">{locale()}</span>
      <span data-testid="direction">{direction()}</span>
    </>
  );
}

describe("I18nProvider", () => {
  it("should use default locale when no one is provided", () => {
    render(() => (
      <I18nProvider>
        <Example />
      </I18nProvider>
    ));

    const locale = screen.getByTestId("locale");
    const direction = screen.getByTestId("direction");

    expect(locale).toHaveTextContent("en-US");
    expect(direction).toHaveTextContent("ltr");
  });

  it("should use provided locale", () => {
    render(() => (
      <I18nProvider locale="ar-AR">
        <Example />
      </I18nProvider>
    ));

    const locale = screen.getByTestId("locale");
    const direction = screen.getByTestId("direction");

    expect(locale).toHaveTextContent("ar-AR");
    expect(direction).toHaveTextContent("rtl");
  });
});

describe("createDefaultLocale", () => {
  it("should use en-US locale by default", () => {
    createRoot(dispose => {
      const { locale, direction } = createDefaultLocale();

      expect(locale()).toBe("en-US");
      expect(direction()).toBe("ltr");

      dispose();
    });
  });

  it("should add and remove languagechange listener correctly", () => {
    createRoot(dispose => {
      jest.spyOn(window, "addEventListener").mock;
      jest.spyOn(window, "removeEventListener").mock;

      createDefaultLocale();

      onMount(() => {
        expect(window.addEventListener).toHaveBeenCalledWith(
          "languagechange",
          expect.any(Function)
        );

        onCleanup(() => {
          expect(window.removeEventListener).toHaveBeenCalledWith(
            "languagechange",
            expect.any(Function)
          );
        });
      });

      dispose();
    });
  });
});
