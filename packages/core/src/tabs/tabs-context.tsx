import type { Orientation } from "@kobalte/utils";
import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";

import type { SingleSelectListState } from "../list";
import type { TabsActivationMode } from "./types";

export interface TabsContextValue {
	isDisabled: Accessor<boolean>;
	orientation: Accessor<Orientation>;
	activationMode: Accessor<TabsActivationMode>;
	triggerIdsMap: Accessor<Map<string, string>>;
	contentIdsMap: Accessor<Map<string, string>>;
	listState: Accessor<SingleSelectListState>;
	selectedTab: Accessor<HTMLElement | undefined>;
	setSelectedTab: Setter<HTMLElement | undefined>;
	generateTriggerId: (value: string) => string;
	generateContentId: (value: string) => string;
}

export const TabsContext = createContext<TabsContextValue>();

export function useTabsContext() {
	const context = useContext(TabsContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useTabsContext` must be used within a `Tabs` component",
		);
	}

	return context;
}
