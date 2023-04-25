import { createSignal } from "solid-js";
import { I18nProvider, Combobox } from "../src";

export default function App() {
  const [options, setOptions] = createSignal([
    "Apple",
    "Banana",
    "Blueberry",
    "Grapes",
    "Pineapple",
  ]);
  const [value, setValue] = createSignal("Pineapple");

  return (
    <I18nProvider locale="en-US">
      <p>Your favorite fruit is: {value()}.</p>
      <button onClick={() => setOptions(list => list.slice(0, -1))}>remove item</button>
    </I18nProvider>
  );
}
