import { For } from "solid-js";

import { Button, IconButton, useColorMode } from "../src";
import { SpinnerIcon } from "../src/icon/icon-set";

export default function App() {
  const { toggleColorMode } = useColorMode();

  return (
    <>
      <button onClick={toggleColorMode}>Toggle color mode</button>
      <div
        style={{
          margin: "16px",
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          gap: "16px",
        }}
      >
        <Button size="md" leftIcon={<SpinnerIcon />} isFullWidth>
          Button
        </Button>
        <Button size="md" rightIcon={<SpinnerIcon />} isFullWidth>
          Button
        </Button>
        <Button size="md" isLoading>
          Button
        </Button>
        <Button size="md" isLoading loadingText="Loading..." loaderPlacement="start">
          Button
        </Button>
        <Button size="md" isLoading loadingText="Loading..." loaderPlacement="end">
          Button
        </Button>
        <div
          style={{
            margin: "16px",
            display: "flex",
            "align-items": "center",
            gap: "16px",
          }}
        >
          <Button size="xs" leftIcon={<SpinnerIcon />}>
            Button
          </Button>
          <Button size="sm" leftIcon={<SpinnerIcon />}>
            Button
          </Button>
          <Button size="md" leftIcon={<SpinnerIcon />}>
            Button
          </Button>
          <Button size="lg" leftIcon={<SpinnerIcon />} isDisabled>
            Button
          </Button>
        </div>
        <div
          style={{
            margin: "16px",
            display: "flex",
            "align-items": "center",
            gap: "16px",
          }}
        >
          <Button size="xs" rightIcon={<SpinnerIcon />}>
            Button
          </Button>
          <Button size="sm" rightIcon={<SpinnerIcon />}>
            Button
          </Button>
          <Button size="md" rightIcon={<SpinnerIcon />}>
            Button
          </Button>
          <Button size="lg" rightIcon={<SpinnerIcon />} isDisabled>
            Button
          </Button>
        </div>
        <div>
          <For each={["solid", "soft", "outlined", "plain"]}>
            {variant => (
              <div
                style={{
                  margin: "16px",
                  display: "flex",
                  "align-items": "center",
                  gap: "16px",
                }}
              >
                <For each={["primary", "secondary", "danger"]}>
                  {color => (
                    <div
                      style={{
                        margin: "16px",
                        display: "flex",
                        "align-items": "center",
                        gap: "16px",
                      }}
                    >
                      <Button variant={variant as any} color={color as any} size="xs">
                        Button
                      </Button>
                      <Button variant={variant as any} color={color as any} size="sm">
                        Button
                      </Button>
                      <Button variant={variant as any} color={color as any} size="md">
                        Button
                      </Button>
                      <Button variant={variant as any} color={color as any} size="lg" isDisabled>
                        Button
                      </Button>
                    </div>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
      <div
        style={{
          margin: "16px",
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          gap: "16px",
        }}
      >
        <IconButton size="md" aria-label="spinner">
          <SpinnerIcon />
        </IconButton>
        <div
          style={{
            margin: "16px",
            display: "flex",
            "align-items": "center",
            gap: "16px",
          }}
        >
          <IconButton size="xs" aria-label="spinner">
            <SpinnerIcon />
          </IconButton>
          <IconButton size="sm" aria-label="spinner">
            <SpinnerIcon />
          </IconButton>
          <IconButton size="md" aria-label="spinner">
            <SpinnerIcon />
          </IconButton>
          <IconButton size="lg" aria-label="spinner" isDisabled>
            <SpinnerIcon />
          </IconButton>
        </div>
        <div>
          <For each={["solid", "soft", "outlined", "plain"]}>
            {variant => (
              <div
                style={{
                  margin: "16px",
                  display: "flex",
                  "align-items": "center",
                  gap: "16px",
                }}
              >
                <For each={["primary", "secondary", "danger"]}>
                  {color => (
                    <div
                      style={{
                        margin: "16px",
                        display: "flex",
                        "align-items": "center",
                        gap: "16px",
                      }}
                    >
                      <IconButton
                        variant={variant as any}
                        color={color as any}
                        size="xs"
                        aria-label="spinner"
                      >
                        <SpinnerIcon />
                      </IconButton>
                      <IconButton
                        variant={variant as any}
                        color={color as any}
                        size="sm"
                        aria-label="spinner"
                      >
                        <SpinnerIcon />
                      </IconButton>
                      <IconButton
                        variant={variant as any}
                        color={color as any}
                        size="md"
                        aria-label="spinner"
                      >
                        <SpinnerIcon />
                      </IconButton>
                      <IconButton
                        variant={variant as any}
                        color={color as any}
                        size="lg"
                        aria-label="spinner"
                        isDisabled
                      >
                        <SpinnerIcon />
                      </IconButton>
                    </div>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  );
}
