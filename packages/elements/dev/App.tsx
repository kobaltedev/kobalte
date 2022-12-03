import { I18nProvider, ListBox, SelectionType } from "../src";
import { createSignal } from "solid-js";

interface Country {
  id: string;
  label: string;
}

interface Continent {
  id: string;
  label: string;
  countries: Country[];
}

const dataSource: Array<Continent | Country> = [
  { label: "Nigeria", id: "NG" },
  { label: "Japan", id: "JP" },
  { label: "Korea", id: "KO" },
  { label: "Kenya", id: "KE" },
  { label: "United Kingdom", id: "UK" },
  { label: "Ghana", id: "GH" },
  { label: "Uganda", id: "UG" },
  /*{
    label: "Europe",
    id: "EU",
    countries: [
      { label: "France", id: "FR" },
      { label: "Germany", id: "DE" },
    ],
  },
  */
];

export default function App() {
  const [selectedKeys, setSelectedKeys] = createSignal<SelectionType>();

  function performBulkAction() {
    const selection = selectedKeys();

    if (selection === "all") {
      return "all";
    } else {
      return [...(selection ?? [])].join(", ");
    }
  }

  return (
    <I18nProvider>
      <div>Selection: {performBulkAction()}.</div>
      <ListBox
        selectionMode="multiple"
        selectedKeys={selectedKeys()}
        onSelectionChange={setSelectedKeys}
        class="listbox"
        dataSource={dataSource}
        getItem={(country: Country) => ({
          key: country.id,
          textValue: country.label,
          rawValue: country,
        })}
        getSection={(continent: Continent) => ({
          key: continent.id,
          items: continent.countries,
          rawValue: continent,
        })}
      >
        {(item, index) => (
          <ListBox.Option class="listbox-option" value={item().key} textValue={item().textValue}>
            {item().textValue}
          </ListBox.Option>
        )}
      </ListBox>
    </I18nProvider>
  );
}
