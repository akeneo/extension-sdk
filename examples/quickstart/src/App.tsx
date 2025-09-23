import {Information, Link, SectionTitle, UsersIllustration} from "akeneo-design-system";
import {useGetProduct} from "./useGetProduct.ts";

function App() {
  const PIMContext = globalThis.PIM.context;
  const PIMUser = globalThis.PIM.user
  const productList = useGetProduct();

  return <>
    <Information
      illustration={<UsersIllustration />}
      title="Welcome to the Akeneo custom component SDK!"
    >
      See the <Link href="https://github.com/akeneo/extension-sdk/blob/init/README.md" target="_blank">Readme</Link> of the SDK to explore capabilities and see implementation examples.<br/>
      Link to the UI Extension component  <Link href="https://api.akeneo.com/extensions/overview.html" target="_blank">documentation</Link>.<br/>
    </Information>

    <SectionTitle>
      <SectionTitle.Title level="secondary">Available PIM Context information within the custom component context (depend of the displayed page)</SectionTitle.Title>
    </SectionTitle>
    <pre>{JSON.stringify(PIMContext)}</pre>
    <SectionTitle>
      <SectionTitle.Title level="secondary">Available PIM User information within the custom component context</SectionTitle.Title>
    </SectionTitle>
    <pre>{JSON.stringify(PIMUser)}</pre>
    <SectionTitle>
      <SectionTitle.Title level="secondary">Example response of products list endpoint</SectionTitle.Title>
    </SectionTitle>
    {productList && <pre>{JSON.stringify(productList, null, 4)}</pre>}
  </>
}

export default App
