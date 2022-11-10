import { useColorMode } from "../src";

export default function App() {
  const { toggleColorMode } = useColorMode();

  return (
    <>
      <button onClick={toggleColorMode}>Toggle color mode</button>
    </>
  );
}
