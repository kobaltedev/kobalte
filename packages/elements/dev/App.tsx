import { For } from "solid-js";

import { Button, Radio, RadioGroup, useColorMode } from "../src";

const pets = ["Dogs", "Cats", "Dragons"];

export default function App() {
  const { toggleColorMode } = useColorMode();

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const form = document.getElementById("form") as HTMLFormElement;
    const formData = new FormData(form);

    for (const [key, value] of formData) {
      console.log(`${key}: ${value}`);
    }
  };

  return (
    <>
      <button onClick={toggleColorMode}>Toggle color mode</button>
      <br />
      <Button onClick={() => console.log("foo")}>Button</Button>
      <form id={"form"} onSubmit={onSubmit}>
        <RadioGroup id="chien" name="food">
          <RadioGroup.Label>Favorite pet</RadioGroup.Label>
          <div>
            <For each={pets}>
              {pet => (
                <Radio class="radio" value={pet}>
                  <Radio.Input onClick={() => console.log("foo")} />
                  <Radio.Control />
                  <Radio.Label>{pet}</Radio.Label>
                </Radio>
              )}
            </For>
          </div>
          <RadioGroup.Description>Choose wisely</RadioGroup.Description>
          <RadioGroup.ErrorMessage>Noo, you choose wrongly</RadioGroup.ErrorMessage>
        </RadioGroup>
        <input type="reset" />
        <input type="submit" />
      </form>
    </>
  );
}
