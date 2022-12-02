import {
  CollectionItem,
  CollectionNode,
  CollectionSection,
  createCollection,
  I18nProvider,
  ListCollection,
} from "../src";
import { createEffect, createSignal } from "solid-js";

interface APIOption {
  id: string;
  label: string;
  disabled?: boolean;
}

interface APISection {
  id: string;
  label: string;
  options: Array<APISection | APIOption>;
}

const getItem = (apiOption: APIOption): CollectionItem<APIOption> => {
  return {
    key: apiOption.id,
    textValue: apiOption.label,
    isDisabled: apiOption.disabled,
    rawValue: apiOption,
  };
};

const getSection = (apiSection: APISection): CollectionSection<APISection, APIOption> => {
  return {
    key: apiSection.id,
    items: apiSection.options,
    rawValue: apiSection,
  };
};

export default function App() {
  const [dataSource, setDataSource] = createSignal<Array<APISection | APIOption>>([]);

  const collection = createCollection({
    source: dataSource,
    itemMapper: getItem,
    sectionMapper: getSection,
    factory: nodes => new ListCollection(nodes as Iterable<CollectionNode<any>>),
  });

  const addItem = () => {
    setDataSource(prev => [
      ...prev,
      {
        id: String(prev.length),
        label: `Item ${prev.length}`,
      },
    ]);
  };

  const addSection = () => {
    setDataSource(prev => [
      ...prev,
      {
        id: String(prev.length),
        label: `Section ${prev.length}`,
        options: [
          {
            id: `${prev.length}.1`,
            label: `Item ${prev.length}.1`,
          },
          {
            id: `${prev.length}.2`,
            label: `Item Section ${prev.length}.2`,
            options: [
              {
                id: `${prev.length}.2.1`,
                label: `Item ${prev.length}.2.1`,
              },
              {
                id: `${prev.length}.2.2`,
                label: `Item ${prev.length}.2.2`,
              },
              {
                id: `${prev.length}.2.3`,
                label: `Item ${prev.length}.2.3`,
              },
            ],
          },
          {
            id: `${prev.length}.3`,
            label: `Item ${prev.length}.3`,
          },
        ],
      },
    ]);
  };

  createEffect(() => {
    console.log(collection());
  });

  return (
    <I18nProvider>
      <button onClick={addItem}>Add item</button>
      <button onClick={addSection}>Add section</button>
    </I18nProvider>
  );
}
