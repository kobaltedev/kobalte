import "./index.scss";

import { render } from "solid-js/web";

import { ColorModeScript, KobalteProvider } from "../src";
import App from "./App";

render(
  () => (
    <>
      <ColorModeScript />
      <KobalteProvider>
        <App />
      </KobalteProvider>
    </>
  ),
  document.getElementById("root") as HTMLDivElement
);
