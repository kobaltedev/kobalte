import "./index.css";

import { render } from "solid-js/web";

import { KobalteProvider } from "../src";
import App from "./App";

render(
  () => (
    <KobalteProvider>
      <App />
    </KobalteProvider>
  ),
  document.getElementById("root") as HTMLDivElement
);
