// @refresh reload
import "./root.css";

import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from "@kobalte/elements";
import { Suspense, useContext } from "solid-js";
import { isServer } from "solid-js/web";
import { MDXProvider } from "solid-mdx";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  ServerContext,
  Title,
} from "solid-start";

import { Layout } from "./components/layout";
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
      </Head>
      <Body>
        <ColorModeScript storageType={storageManager.type} />
        <Suspense>
          <ErrorBoundary>
            <ColorModeProvider storageManager={storageManager}>
              <MDXProvider components={mdxComponents}>
                <Layout>
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </Layout>
              </MDXProvider>
            </ColorModeProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
