import { CollectionItem, CollectionNode, CollectionSection } from "./types";

interface BuildNodesParams {
  dataSource: Array<any>;
  getItem: (source: any) => CollectionItem;
  getSection?: (source: any) => CollectionSection;
  startLevel?: number;
  parentKey?: string;
}

/**
 * Generate a flatted array of `CollectionNoe` from a custom data source.
 */
export function buildNodes(params: BuildNodesParams): Array<CollectionNode> {
  const startLevel = params.startLevel ?? 0;
  const nodes: Array<CollectionNode> = [];

  if (params.getSection) {
    for (const item of params.dataSource) {
      // try to parse it as a section
      const section = params.getSection(item);

      // if it has "items" it's a section
      if (section.items != null) {
        nodes.push(sectionToNode(section, startLevel, params.parentKey));

        const items = buildNodes({
          dataSource: section.items,
          getItem: params.getItem,
          getSection: params.getSection,
          startLevel: startLevel + 1,
          parentKey: section.key,
        });

        nodes.push(...items);
      } else {
        // otherwise it's an item
        nodes.push(itemToNode(params.getItem(item), startLevel, params.parentKey));
      }
    }
  } else {
    for (const item of params.dataSource) {
      nodes.push(itemToNode(params.getItem(item), startLevel, params.parentKey));
    }
  }

  return nodes;
}

function itemToNode(item: CollectionItem, level: number, parentKey?: string): CollectionNode {
  return {
    type: "item",
    key: item.key,
    rawValue: item.rawValue,
    level: level,
    textValue: item.textValue,
    parentKey: parentKey,
  };
}

function sectionToNode(
  section: CollectionSection,
  level: number,
  parentKey?: string
): CollectionNode {
  return {
    type: "section",
    key: section.key,
    rawValue: section.rawValue,
    level: level,
    textValue: "",
    parentKey: parentKey,
  };
}
