import { createPress, useColorMode } from "../src";

import { Dynamic, For } from "solid-js/web";
import { createSignal } from "solid-js";

function Example(props: any) {
  const { pressProps } = createPress(props);

  return (
    <Dynamic
      {...props}
      {...pressProps}
      component={props.elementType ?? "div"}
      style={props.style}
      tabIndex="0"
      draggable={props.draggable}
    >
      {props.elementType !== "input" ? "test" : undefined}
    </Dynamic>
  );
}

export default function App() {
  const { toggleColorMode } = useColorMode();
  const [events, setEvents] = createSignal<any[]>([]);
  const addEvent = (e: any) => setEvents(prev => [...prev, e]);

  return (
    <>
      <button onClick={toggleColorMode}>Toggle color mode</button>
      <Example
        elementType="a"
        href="#"
        onClick={(e: any) => {
          e.preventDefault();
          addEvent({ type: "click" });
        }}
        onPressStart={addEvent}
        onPressEnd={addEvent}
        onPressChange={(pressed: boolean) => addEvent({ type: "presschange", pressed })}
        onPress={addEvent}
        onPressUp={addEvent}
      />
      <ul>
        <For each={events()}>
          {e => (
            <li>
              <div>- {e.type}</div>
              <div>- {e.pointerType ?? "?"}</div>
              <br />
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
