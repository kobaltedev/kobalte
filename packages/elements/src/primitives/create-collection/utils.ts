import { CollectionItem, CollectionNode, CollectionSection } from "./types";

interface BuildNodesParams {
  source: Array<any>;
  getItem?: (source: any) => CollectionItem;
  getSection?: (source: any) => CollectionSection;
  startIndex?: number;
  startLevel?: number;
  parentKey?: string;
}

/**
 * Generate a flatted array of `CollectionNode` from a custom data source.
 */
export function buildNodes(params: BuildNodesParams): Array<CollectionNode> {
  let index = params.startIndex ?? 0;
  const level = params.startLevel ?? 0;

  const nodes: Array<CollectionNode> = [];

  for (const data of params.source) {
    // If getSection is undefined, let's assume "data" has same shape as CollectionSection.
    const section = params.getSection?.(data) ?? (data as CollectionSection);

    if (section.items != null) {
      const sectionNode: CollectionNode = {
        type: "section",
        key: section.id,
        label: section.label,
        textValue: "", // safe fallback, as not relevant for section type nodes.
        isDisabled: false, // safe fallback, as not relevant for section type nodes.
        level: level,
        index: index,
        childNodes: [],
        parentKey: params.parentKey,
      };

      index++;

      const childNodes = buildNodes({
        source: section.items,
        getItem: params.getItem,
        getSection: params.getSection,
        startIndex: index,
        startLevel: sectionNode.level + 1,
        parentKey: sectionNode.key,
      });

      sectionNode.childNodes = childNodes;

      nodes.push(sectionNode);

      index += childNodes.length;
    } else {
      // If getItem is undefined, let's assume "data" has same shape as CollectionItem.
      const item = params.getItem?.(data) ?? (data as CollectionItem);

      nodes.push(itemToNode(item, level, index, params.parentKey));

      index++;
    }
  }

  return nodes;
}

function itemToNode(
  item: CollectionItem,
  level: number,
  index: number,
  parentKey?: string
): CollectionNode {
  return {
    type: "item",
    key: item.id,
    label: item.label,
    textValue: item.textValue ?? item.label,
    isDisabled: item.disabled ?? false,
    level,
    index,
    childNodes: [],
    parentKey,
  };
}
