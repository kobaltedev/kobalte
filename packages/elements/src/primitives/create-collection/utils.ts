import { CollectionNode } from "./types";

interface BuildNodesParams {
  dataSource: Array<any>;
  getNode: (source: any) => CollectionNode;
  parentKey?: string;
}

/**
 * Generate a flatted array of `CollectionNoe` from a custom data source.
 */
export function buildNodes(params: BuildNodesParams): Array<CollectionNode> {
  const nodes: Array<CollectionNode> = [];

  for (const item of params.dataSource) {
    nodes.push(params.getNode(item));
  }

  return nodes;
}
