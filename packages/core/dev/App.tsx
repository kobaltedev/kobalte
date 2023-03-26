import { I18nProvider, Tooltip } from "../src";

export default function App() {
  return (
    <I18nProvider>
      <div style={{ display: "flex" }}>
        <Tooltip.Root>
          <Tooltip.Trigger class="button">Hover or focus me</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content class="tooltip">Content</Tooltip.Content>
            <Tooltip.Arrow />
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger class="button">Hover or focus me 2</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content class="tooltip">Content 2</Tooltip.Content>
            <Tooltip.Arrow />
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </I18nProvider>
  );
}
