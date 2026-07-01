// @refresh reload
import "@docsearch/css";
import "./root.css";

import { Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";
import { Portal } from "solid-js/web";

import { Toast } from "@kobalte/core/toast";
import toastStyles from "./examples/toast.module.css";
import { SolidBaseRoot } from "@kobalte/solidbase/client";



export default function App() {
	return (
		<Router
			root={(props) => (
				<SolidBaseRoot>
					<Title>Kobalte</Title>
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
				</SolidBaseRoot>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
