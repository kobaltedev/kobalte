import { Button } from "../src";
import { For } from "solid-js";

export default function App() {
  return (
    <>
      <div
        style={{
          margin: "16px",
          display: "flex",
          "align-items": "center",
          gap: "16px",
        }}
      >
        <div>
          <For each={["primary", "secondary", "tertiary", "default"]}>
            {variant => (
              <div
                style={{
                  margin: "16px",
                  display: "flex",
                  "flex-direction": "column",
                  "align-items": "center",
                  gap: "16px",
                }}
              >
                <Button variant={variant as any} size="sm">
                  Button
                </Button>
                <Button variant={variant as any} size="md">
                  Button
                </Button>
                <Button variant={variant as any} size="lg">
                  Button
                </Button>
              </div>
            )}
          </For>
        </div>
        <div>
          <For each={["primary", "secondary", "tertiary", "default"]}>
            {variant => (
              <div
                style={{
                  margin: "16px",
                  display: "flex",
                  "flex-direction": "column",
                  "align-items": "center",
                  gap: "16px",
                }}
              >
                <Button variant={variant as any} size="sm" isDestructive>
                  Button
                </Button>
                <Button variant={variant as any} size="md" isDestructive>
                  Button
                </Button>
                <Button variant={variant as any} size="lg" isDestructive>
                  Button
                </Button>
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  );
}
