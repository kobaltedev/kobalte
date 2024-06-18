import { isNumber, isString } from "@kobalte/utils";

import type { CollectionNode } from "./types";

interface BuildNodesParams {
	dataSource: any[];
	getKey?: string | ((data: any) => string);
	getTextValue?: string | ((data: any) => string);
	getDisabled?: string | ((data: any) => boolean);
	getSectionChildren?: string | ((section: any) => any[]);
	startIndex?: number;
	startLevel?: number;
}

/**
 * Generate a flatted array of `CollectionNode` from a custom data source.
 */
export function buildNodes(params: BuildNodesParams): Array<CollectionNode> {
	let index = params.startIndex ?? 0;
	const level = params.startLevel ?? 0;

	const nodes: Array<CollectionNode> = [];

	const getKey = (data: any): string => {
		if (data == null) {
			return "";
		}

		const _getKey = params.getKey ?? "key";
		const dataKey = isString(_getKey) ? data[_getKey] : _getKey(data);
		return dataKey != null ? String(dataKey) : "";
	};

	const getTextValue = (data: any): string => {
		if (data == null) {
			return "";
		}

		const _getTextValue = params.getTextValue ?? "textValue";
		const dataTextValue = isString(_getTextValue)
			? data[_getTextValue]
			: _getTextValue(data);
		return dataTextValue != null ? String(dataTextValue) : "";
	};

	const getDisabled = (data: any): boolean => {
		if (data == null) {
			return false;
		}

		const _getDisabled = params.getDisabled ?? "disabled";
		return (
			(isString(_getDisabled) ? data[_getDisabled] : _getDisabled(data)) ??
			false
		);
	};

	const getSectionChildren = (data: any): any[] | undefined => {
		if (data == null) {
			return undefined;
		}

		if (isString(params.getSectionChildren)) {
			return data[params.getSectionChildren];
		}

		return params.getSectionChildren?.(data);
	};

	for (const data of params.dataSource) {
		// If it's not an object assume it's an item.
		if (isString(data) || isNumber(data)) {
			nodes.push({
				type: "item",
				rawValue: data,
				key: String(data),
				textValue: String(data),
				disabled: getDisabled(data),
				level,
				index,
			});

			index++;

			continue;
		}

		// Assume it's a section if it has children.
		if (getSectionChildren(data) != null) {
			nodes.push({
				type: "section",
				rawValue: data,
				key: "", // not applicable here
				textValue: "", // not applicable here
				disabled: false, // not applicable here
				level: level,
				index: index,
			});

			index++;

			const sectionChildren = getSectionChildren(data) ?? [];

			if (sectionChildren.length > 0) {
				const childNodes = buildNodes({
					dataSource: sectionChildren,
					getKey: params.getKey,
					getTextValue: params.getTextValue,
					getDisabled: params.getDisabled,
					getSectionChildren: params.getSectionChildren,
					startIndex: index,
					startLevel: level + 1,
				});

				nodes.push(...childNodes);

				index += childNodes.length;
			}
		} else {
			nodes.push({
				type: "item",
				rawValue: data,
				key: getKey(data),
				textValue: getTextValue(data),
				disabled: getDisabled(data),
				level,
				index,
			});

			index++;
		}
	}

	return nodes;
}
