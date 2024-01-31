// @refresh reload
import "@docsearch/css";
import "./root.css";

import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR, Toast } from "@kobalte/core";
import { MetaProvider, Title } from "@solidjs/meta";
import { cache, createAsync, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";
import { isServer, Portal } from "solid-js/web";
import { MDXProvider } from "solid-mdx";

import toastStyles from "./examples/toast.module.css";
import { mdxComponents } from "./mdx-components";
import {
  getCookie,
} from "vinxi/server";

export const mods = /*#__PURE__*/ import.meta.glob<
  true,
  any,
  {
    getHeadings: () => {
      depth: number;
      text: string;
      slug: string;
    }[];
  }
>("./routes/docs/**/*.{md,mdx}", {
  eager: true,
  query: {
    meta: "",
  },
});

function getServerCookies() {
  "use server";

  const colorMode = getCookie("kb-color-mode");

  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  return (
    <Router
      root={props => (
        <Suspense>
          <MetaProvider>
            <Title>Kobalte</Title>
            <ColorModeScript storageType={storageManager.type} />
            <ColorModeProvider storageManager={storageManager}>
              <MDXProvider components={mdxComponents}>
                {props.children}

                <Portal>
                  <Toast.Region>
                    <Toast.List class={toastStyles["toast__list"]} />
                  </Toast.Region>
                  <Toast.Region regionId="custom-region-id">
                    <Toast.List class={toastStyles["toast__list-custom-region"]} />
                  </Toast.Region>
                </Portal>
              </MDXProvider>
            </ColorModeProvider>
          </MetaProvider>
        </Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
