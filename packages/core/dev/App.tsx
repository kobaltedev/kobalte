import { As, I18nProvider, Polymorphic } from "../src";

function Button(props: any) {
  return <Polymorphic fallbackComponent="button" {...props} />;
}

function Link(props: any) {
  return <Polymorphic fallbackComponent="a" {...props} />;
}

export default function App() {
  return (
    <I18nProvider>
      <Button>No As</Button>
      <Button>
        <As component="a">Simple As</As>
      </Button>
      <Button>
        <As component={Link}>
          <As component="span">Nested As</As>
        </As>
      </Button>
    </I18nProvider>
  );
}
