import { I18nProvider } from "../src";

interface Food {
  id: string;
  label: string;
  textValue: string;
  disabled?: boolean;
}

interface Category {
  label: string;
  foods: Array<Food>;
}

const dataSource: Array<Category | Food> = [
  { label: "🍔 Burger", textValue: "Burger", id: "burger" },
  { label: "🍕 Pizza", textValue: "Pizza", id: "pizza" },
  { label: "🌭 Hot dog", textValue: "Hot dog", id: "hotdog" },
  {
    label: "Fruits",
    foods: [
      { label: "🍎 Apple", textValue: "Apple", id: "apple" },
      { label: "🍇 Grape", textValue: "Grape", id: "grape" },
      { label: "🍊 Orange", textValue: "Orange", id: "orange" },
      { label: "🍓 Strawberry", textValue: "Strawberry", id: "strawberry" },
      { label: "🍉 Watermelon", textValue: "Watermelon", id: "watermelon" },
    ],
  },
  {
    label: "Meats",
    foods: [
      { label: "🥓 Bacon", textValue: "Bacon", id: "bacon" },
      { label: "🍗 Chicken", textValue: "Chicken", id: "chicken" },
      { label: "🥩 Steak", textValue: "Steak", id: "steak" },
    ],
  },
  {
    label: "Vegetables",
    foods: [
      { label: "🥕 Carrot", textValue: "Carrot", id: "carrot" },
      { label: "🥬 Lettuce", textValue: "Lettuce", id: "lettuce" },
      { label: "🥔 Potatoe", textValue: "Potatoe", id: "potatoe" },
      { label: "🍅 Tomato", textValue: "Tomato", id: "tomato" },
    ],
  },
];

function getNode(source: Category | Food) {
  if (Object.hasOwn(source, "foods")) {
    return {
      type: "section",
    };
  } else {
    return {
      type: "item",
    };
  }
}

dataSource.forEach(source => console.log(getNode(source).type));

export default function App() {
  return <I18nProvider></I18nProvider>;
}
