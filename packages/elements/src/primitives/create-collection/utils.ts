import { CollectionItem, CollectionNode } from "./types";

/**
 * Generate an array of `CollectionNode` from a custom data source.
 */
export function buildNodes(dataSource: CollectionItem[]): Array<CollectionNode> {
  let index = 0;

  const nodes: Array<CollectionNode> = [];

  for (const data of dataSource) {
    nodes.push({
      key: data.key,
      label: data.label,
      textValue: data.textValue,
      isDisabled: data.isDisabled,
      index,
    });

    index++;
  }

  return nodes;
}
