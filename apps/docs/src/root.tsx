// @refresh reload
import "./root.css";

import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from "@kobalte/core";
import { Suspense, useContext } from "solid-js";
import { isServer } from "solid-js/web";
import { MDXProvider } from "solid-mdx";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  ServerContext,
  Stylesheet,
  Title,
} from "solid-start";

import { mdxComponents } from "./mdx-components";

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

export default function Root() {
  const event = useContext(ServerContext);

  const storageManager = cookieStorageManagerSSR(
    isServer ? event?.request.headers.get("cookie") ?? "" : document.cookie
  );

  return (
    <Html lang="en">
      <Head>
        <Title>Kobalte</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <Link rel="manifest" href="/site.webmanifest" />
        <Stylesheet href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" />
      </Head>
      <Body>
        <ErrorBoundary>
          <ColorModeScript storageType={storageManager.type} />
          <Suspense>
            <ColorModeProvider storageManager={storageManager}>
              <MDXProvider components={mdxComponents}>
                <Routes>
                  <FileRoutes />
                </Routes>
              </MDXProvider>
            </ColorModeProvider>
          </Suspense>
          <script src="https://cdn.jsdelivr.net/npm/@docsearch/js@3"></script>
          <script>
            {`docsearch({
            appId: "H7ZQSI0SAN",
            apiKey: "c9354456dd4bb74c37e4d2b762b89b88",
            indexName: "kobalte",
            container: "#docsearch",
            debug: false
          });`}
          </script>
          <Scripts />
        </ErrorBoundary>
      </Body>
    </Html>
  );
}
