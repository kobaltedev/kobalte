import { For } from "solid-js";

import { RadioGroup, useColorMode } from "../src";

const pets = ["Dogs", "Cats", "Dragons"];

export default function App() {
  const { toggleColorMode } = useColorMode();

  return (
    <>
      <button onClick={toggleColorMode}>Toggle color mode</button>
      <RadioGroup id="chien" name="food">
        <RadioGroup.Label>Favorite pet</RadioGroup.Label>
        <div>
          <For each={pets}>
            {pet => (
              <RadioGroup.Item>
                <RadioGroup.ItemInput />
                <RadioGroup.ItemControl />
                <RadioGroup.ItemLabel>{pet}</RadioGroup.ItemLabel>
              </RadioGroup.Item>
            )}
          </For>
        </div>
        <RadioGroup.Description>Choose wisely</RadioGroup.Description>
        <RadioGroup.ErrorMessage>Noo, you choose wrongly</RadioGroup.ErrorMessage>
      </RadioGroup>
    </>
  );
}
