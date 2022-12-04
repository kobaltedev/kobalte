import { createSignal, For } from "solid-js";

import { I18nProvider, ListBox, SelectionType } from "../src";

interface Country {
  id: string;
  label: string;
  textValue: string;
  disabled?: boolean;
}

const initialDataSource: Array<Country> = [
  { label: "🇳🇬 Nigeria", textValue: "Nigeria", id: "NG" },
  { label: "🇯🇵 Japan", textValue: "Japan", id: "JP" },
  { label: "🇰🇷 Korea", textValue: "Korea", id: "KO" },
  { label: "🇰🇪 Kenya", textValue: "Kenya", id: "KE" },
  { label: "🇬🇧 United Kingdom", textValue: "United Kingdom", id: "UK" },
  { label: "🇬🇭 Ghana", textValue: "Ghana", id: "GH" },
  { label: "🇫🇷 France", textValue: "France", id: "FR" },
];

export default function App() {
  const [dataSource, setDataSource] = createSignal(initialDataSource);
  const [value, setValue] = createSignal<SelectionType>();

  function performBulkAction() {
    const selection = value();

    if (selection === "all") {
      return "all";
    } else {
      return [...(selection ?? [])].join(", ");
    }
  }

  const addItem = () => {
    setDataSource(prev => [
      ...prev,
      {
        label: "🆕 Item" + prev.length,
        textValue: String(prev.length),
        id: String(prev.length),
      },
    ]);
  };

  const disableFrance = () => {
    setDataSource(prev => {
      return prev.map(item => {
        if (item.id === "FR") {
          return {
            ...item,
            disabled: true,
          };
        }

        return item;
      });
    });
  };

  return (
    <I18nProvider>
      <button onClick={addItem}>Add item</button>
      <button onClick={disableFrance}>Disable France</button>
      <div>Selection: {performBulkAction()}</div>
      <ListBox selectionMode="multiple" value={value()} onValueChange={setValue} class="listbox">
        <For each={dataSource()}>
          {country => (
            <ListBox.Option
              class="listbox-option"
              value={country.id}
              textValue={country.textValue}
              isDisabled={country.disabled}
            >
              {country.label}
            </ListBox.Option>
          )}
        </For>
      </ListBox>
    </I18nProvider>
  );
}
