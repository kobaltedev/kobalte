import "./index.css";

import { render } from "solid-js/web";

import { ColorModeScript, MaterialProvider } from "../src";
import App from "./App";

render(
  () => (
    <>
      <ColorModeScript />
      <MaterialProvider>
        <App />
      </MaterialProvider>
    </>
  ),
  document.getElementById("root") as HTMLDivElement
);
