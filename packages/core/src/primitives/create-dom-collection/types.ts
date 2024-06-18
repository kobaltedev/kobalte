import type { Accessor } from "solid-js";

export interface DomCollectionItem {
	ref: Accessor<Element | undefined>;
}
