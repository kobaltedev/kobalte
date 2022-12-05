import { CollectionDataSource } from "./types";

/**
 * Primitive for easily creating a collection data source object.
 */
export function createDataSource<DataItem, DataSection = any>(
  dataSource: CollectionDataSource<DataItem, DataSection>
): CollectionDataSource<DataItem, DataSection> {
  return dataSource;
}
