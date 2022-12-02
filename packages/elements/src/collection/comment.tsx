export const foo = 1;

/*

/// Dynamic

interface APIOption {
  id: string;
  label: string;
  disabled: boolean;
}

interface APISection {
  id: string;
  label: string;
  options: APIOption[]
}

const remoteData: APISection[]  = [
  {
    id: "1",
    label: 'Australian',
    options: [
      { id: "1.1", label: 'Koala' },
      { id: "1.2", label: 'Kangaroo', disabled: true },
      { id: "1.3", label: 'Platypus' }
    ]
  },
];

interface CollectionItem<T> {
  key: string;
  label: string;
  value: string;
  textValue?: string;
  isDisabled?: boolean;
  rawValue?: T
}

const getItem = (apiOption: APIOption): CollectionItem<APIOption> => {
  return {
    key: apiOption.id,
    label: apiOption.label,
    value: apiOption.id,
    textValue: apiOption.label,
    isDisabled: apiOption.disabled
    rawValue: apiOption, // the value retrieved from the API, useful for passing additional data
  }
}

const renderItem = (item: GetCollectionItem<APIOption>) => {
  return (
     <ListBox.Item item={item}>
        <ListBox.ItemLabel>
          {item.label}
        </ListBox.ItemLabel>
        <Avatar src={item.rawValue.avatarSrc}/>
     </ListBox.Item>
  );
}

interface CollectionSection<T, U> {
  key: string;
  label: string;
  items: CollectionItem<U>[]
  rawValue?: T
}

const getSection = (apiSection: APISection): CollectionSection<APISection, APIOption> => {
  return {
    key: apiSection.id,
    label: apiSection.label,
    items: apiSection.options,
    rawValue: apiSection, // the value retrieved from the API, useful for passing additional data
  }
}

const renderSection = (section: CollectionSection<APISection, APIOption>) => {
  return (
    <ListBox.Section section={section}>
      <ListBox.SectionLabel>
        {section.label} - {section.rawValue.status}
      </ListBox.SectionLabel>
      <ListBox.SectionItems />
    </ListBox.Section>
  );
}

// START INTERNAL

interface CollectionNode {
  type: "item" | "section";
  key: string;
  value: string;
  textValue: string;
  level: number;
  parentKey?: string;
}

function itemToNode(item: CollectionItem, level: number, parentKey?: string): CollectionNode {
  return {
    type: "item",
    key: item.key,
    value: item.value,
    textValue: item.textValue,
    level: level,
    parentKey: parentKey,
  };
}

function generateCollectionNodes(source: Array<CollectionSection | CollectionItem>, level: number, parentKey?: string): CollectionNode[] {
  const nodes: CollectionNode[] = [];

  for(item of source) {

    // if has "items" key, it's a section
    if ((item as any).items != null) {
      const section = local.getSection(item);
      nodes.push(...generateCollectionNodes(section.items, level + 1, section.key));
    }

    nodes.push(itemToNode(local.getItem(item), level, parentKey));
  }

  return nodes;
}

const collectionNodes = generateCollectionNodes(local.items, 0);

// END INTERNAL

<ListBox
  items={remoteData}
  getItem={getItem}
  renderItem={renderItem}
  getSection={getSection}
  renderSection={renderSection}
/>

/// Static

<ListBox>
  <ListBox.Section key="1">
    <ListBox.SectionLabel>
      Australian
    </ListBox.SectionLabel>
    <ListBox.SectionItems>
      <ListBox.Item key="1.1">
        Koala
      </ListBox.Item>
      <ListBox.Item key="1.2" isDisabled>
        Kangaroo
      </ListBox.Item>
      <ListBox.Item key="1.3">
        Platypus
      </ListBox.Item>
    </ListBox.SectionItems>
  </ListBox.Section>
</ListBox>

*/
