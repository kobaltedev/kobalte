import {
  CollectionItemPropertyNames,
  CollectionNode,
  CollectionSectionPropertyNames,
  CollectionKey,
} from "./types";

interface BuildNodesParams {
  dataSource: Array<any>;
  itemPropertyNames?: Partial<CollectionItemPropertyNames>;
  sectionPropertyNames?: Partial<CollectionSectionPropertyNames>;
  startIndex?: number;
  startLevel?: number;
  parentKey?: CollectionKey;
}

/**
 * Generate a flatted array of `CollectionNode` from a custom data source.
 */
export function buildNodes(params: BuildNodesParams): Array<CollectionNode> {
  let index = params.startIndex ?? 0;
  const level = params.startLevel ?? 0;

  const itemPropertyNames: CollectionItemPropertyNames = {
    key: params.itemPropertyNames?.key ?? "key",
    label: params.itemPropertyNames?.label ?? "label",
    textValue: params.itemPropertyNames?.textValue ?? "textValue",
    disabled: params.itemPropertyNames?.disabled ?? "disabled",
  };

  const sectionPropertyNames: CollectionSectionPropertyNames = {
    key: params.sectionPropertyNames?.key ?? "key",
    label: params.sectionPropertyNames?.label ?? "label",
    items: params.sectionPropertyNames?.items ?? "items",
  };

  const nodes: Array<CollectionNode> = [];

  for (const data of params.dataSource) {
    const isSection = sectionPropertyNames.label in data && sectionPropertyNames.items in data;

    if (isSection) {
      const sectionNode: CollectionNode = {
        type: "section",
        rawValue: data,
        key: data[sectionPropertyNames.key] ?? getFallbackKey(index, params.parentKey),
        label: data[sectionPropertyNames.label],
        textValue: "",
        isDisabled: false,
        level: level,
        index: index,
        childNodes: [],
        parentKey: params.parentKey,
      };

      index++;

      const childNodes = buildNodes({
        dataSource: data[sectionPropertyNames.items],
        itemPropertyNames,
        sectionPropertyNames,
        startIndex: index,
        startLevel: sectionNode.level + 1,
        parentKey: sectionNode.key,
      });

      sectionNode.childNodes = childNodes;

      nodes.push(sectionNode);

      index += childNodes.length;
    } else {
      nodes.push({
        type: "item",
        rawValue: data,
        key: data[itemPropertyNames.key] ?? getFallbackKey(index, params.parentKey),
        label: data[itemPropertyNames.label],
        textValue: data[itemPropertyNames.textValue] ?? data[itemPropertyNames.label],
        isDisabled: data[itemPropertyNames.disabled] ?? false,
        level,
        index,
        childNodes: [],
        parentKey: params.parentKey,
      });

      index++;
    }
  }

  return nodes;
}

function getFallbackKey(index: number, parentKey?: CollectionKey) {
  return parentKey != null ? `${parentKey}.${index}` : `$.${index}`;
}
