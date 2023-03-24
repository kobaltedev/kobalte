import { isString } from "@kobalte/utils";

import { CollectionNode } from "./types";

interface BuildNodesParams {
  dataSource: any[];
  getKey?: string | ((data: any) => string);
  getTextValue?: string | ((data: any) => string);
  getIsDisabled?: string | ((data: any) => boolean);
  getSectionChildren?: string | ((section: any) => any[]);
  getIsSection?: (maybeSection: any) => boolean;
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
    const _getKey = params.getKey ?? "key";
    return isString(_getKey) ? data[_getKey] : _getKey(data);
  };

  const getTextValue = (data: any): string | undefined => {
    const _getTextValue = params.getTextValue ?? "textValue";
    return isString(_getTextValue) ? data[_getTextValue] : _getTextValue(data);
  };

  const getIsDisabled = (data: any): boolean | undefined => {
    const _getIsDisabled = params.getIsDisabled ?? "isDisabled";
    return isString(_getIsDisabled) ? data[_getIsDisabled] : _getIsDisabled(data);
  };

  const getSectionChildren = (data: any): any[] | undefined => {
    if (isString(params.getSectionChildren)) {
      return data[params.getSectionChildren];
    }

    return params.getSectionChildren?.(data);
  };

  for (const data of params.dataSource) {
    // If it's just a string assume it's an item.
    if (isString(data)) {
      nodes.push({
        type: "item",
        rawValue: data,
        key: data,
        textValue: data,
        isDisabled: getIsDisabled(data) ?? false,
        level,
        index,
      });

      index++;

      continue;
    }

    // If no custom `getIsSection` is provided assume it's a section if it has children.
    const isSection = params.getIsSection?.(data) ?? getSectionChildren(data) != null;

    if (isSection) {
      nodes.push({
        type: "section",
        rawValue: data,
        key: "", // not applicable here
        textValue: "", // not applicable here
        isDisabled: false, // not applicable here
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
          getIsDisabled: params.getIsDisabled,
          getIsSection: params.getIsSection,
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
        textValue: getTextValue(data) ?? "",
        isDisabled: getIsDisabled(data) ?? false,
        level,
        index,
      });

      index++;
    }
  }

  return nodes;
}
