// @refresh reload
import "@docsearch/css";
import "./root.css";

import {
	ColorModeProvider,
	ColorModeScript,
	Toast,
	cookieStorageManagerSSR,
} from "@kobalte/core";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";
import { Portal, isServer } from "solid-js/web";
import { MDXProvider } from "solid-mdx";

import { getCookie } from "vinxi/server";
import toastStyles from "./examples/toast.module.css";
import { mdxComponents } from "./mdx-components";

//export const mods = /*#__PURE__*/ import.meta.glob<
//	true,
//	string,
//	{
//		getHeadings: () => {
//			depth: number;
//			text: string;
//			slug: string;
//		}[];
//	}
//>("./routes/docs/**/*.{md,mdx}", {
//	eager: true,
//	query: {
//		meta: "",
//	},
//});

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
			root={(props) => (
				<MetaProvider>
					<Title>Kobalte</Title>
					<ColorModeScript storageType={storageManager.type} />
					<ColorModeProvider storageManager={storageManager}>
						<MDXProvider components={mdxComponents}>
							<Suspense>{props.children}</Suspense>

							<Portal>
								<Toast.Region>
									<Toast.List class={toastStyles.toast__list} />
								</Toast.Region>
								<Toast.Region regionId="custom-region-id">
									<Toast.List
										class={toastStyles["toast__list-custom-region"]}
									/>
								</Toast.Region>
							</Portal>
						</MDXProvider>
					</ColorModeProvider>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
