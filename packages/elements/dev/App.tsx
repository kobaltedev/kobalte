import { For } from "solid-js";

import { I18nProvider, ListBox } from "../src";

const selectData = [
  { label: "Nigeria", value: "NG" },
  { label: "Japan", value: "JP" },
  { label: "Korea", value: "KO" },
  { label: "Kenya", value: "KE" },
  { label: "United Kingdom", value: "UK" },
  { label: "Ghana", value: "GH" },
  { label: "Uganda", value: "UG" },
];

export default function App() {
  return (
    <I18nProvider>
      <ListBox class="collection">
        <For each={selectData}>
          {data => (
            <ListBox.Option value={data.value}>
              <ListBox.OptionLabel>{data.label}</ListBox.OptionLabel>
              <ListBox.OptionDescription>Description</ListBox.OptionDescription>
            </ListBox.Option>
          )}
        </For>
      </ListBox>
    </I18nProvider>
  );
}
