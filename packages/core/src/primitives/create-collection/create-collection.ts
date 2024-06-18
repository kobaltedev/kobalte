/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/collections/src/useCollection.ts
 */

import { access } from "@kobalte/utils";
import {
	type Accessor,
	createEffect,
	createMemo,
	createSignal,
	on,
} from "solid-js";

import type { Collection, CollectionBase, CollectionNode } from "./types";
import { buildNodes } from "./utils";

type CollectionFactory<C extends Collection<CollectionNode>> = (
	node: Iterable<CollectionNode>,
) => C;

export interface CreateCollectionProps<C extends Collection<CollectionNode>>
	extends CollectionBase {
	factory: CollectionFactory<C>;
}

export function createCollection<C extends Collection<CollectionNode>>(
	props: CreateCollectionProps<C>,
	deps: Array<Accessor<any>> = [],
) {
	return createMemo(() => {
		const nodes = buildNodes({
			dataSource: access(props.dataSource),
			getKey: access(props.getKey),
			getTextValue: access(props.getTextValue),
			getDisabled: access(props.getDisabled),
			getSectionChildren: access(props.getSectionChildren),
		});

		// Subscribe to all deps
		for (let i = 0; i < deps.length; i++) deps[i]();

		return props.factory(nodes);
	});
}
