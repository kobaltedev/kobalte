import "./index.css";

import { render } from "solid-js/web";

import { ColorModeProvider, ColorModeScript } from "../src";
import App from "./App";

render(
  () => (
    <>
      <ColorModeScript />
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </>
  ),
  document.getElementById("root") as HTMLDivElement
);
