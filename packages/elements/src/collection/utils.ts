import { CollectionItem, CollectionNode, CollectionSection } from "./types";

interface BuildNodesParams<SectionSource, ItemSource> {
  source: Array<SectionSource | ItemSource>;
  itemMapper: (source: ItemSource) => CollectionItem<ItemSource>;
  sectionMapper: (source: SectionSource) => CollectionSection<SectionSource, ItemSource>;
  startLevel?: number;
  parentKey?: string;
}

/**
 * Generate a flatted array of `CollectionNoe` from a custom data source.
 */
export function buildNodes<SectionSource, ItemSource>(
  params: BuildNodesParams<SectionSource, ItemSource>
): Array<CollectionNode<SectionSource | ItemSource>> {
  const startLevel = params.startLevel ?? 0;
  const nodes: Array<CollectionNode<SectionSource | ItemSource>> = [];

  for (const item of params.source) {
    // try to parse it as a section
    const section = params.sectionMapper(item as SectionSource);

    // if it has "items" it's a section
    if (section.items != null) {
      nodes.push(sectionToNode(section, startLevel, params.parentKey));

      const items = buildNodes({
        source: section.items,
        sectionMapper: params.sectionMapper,
        itemMapper: params.itemMapper,
        startLevel: startLevel + 1,
        parentKey: section.key,
      });

      nodes.push(...items);
    } else {
      // otherwise it's an item
      nodes.push(itemToNode(params.itemMapper(item as ItemSource), startLevel, params.parentKey));
    }
  }

  return nodes;
}

function itemToNode<ItemSource>(
  item: CollectionItem<ItemSource>,
  level: number,
  parentKey?: string
): CollectionNode<ItemSource> {
  return {
    type: "item",
    key: item.key,
    rawValue: item.rawValue,
    level: level,
    parentKey: parentKey,
    textValue: item.textValue,
  };
}

function sectionToNode<SectionSource, ItemSource>(
  section: CollectionSection<SectionSource, ItemSource>,
  level: number,
  parentKey?: string
): CollectionNode<SectionSource> {
  return {
    type: "section",
    key: section.key,
    rawValue: section.rawValue,
    level: level,
    parentKey: parentKey,
  };
}
