import {Link, Placeholder, SectionTitle, UsersIllustration} from "akeneo-design-system";
import {useGetProduct} from "./useGetProduct.ts";
import {useGetCategory} from "./useGetCategory.ts";

function App() {
  const PIMContext = globalThis.PIM.context;
  const PIMUser = globalThis.PIM.user
  const currentProduct = useGetProduct('product' in PIMContext ? PIMContext.product.uuid : undefined);
  const currentCategory = useGetCategory('category' in PIMContext ? PIMContext.category.code : undefined);

  return <>
    <Placeholder
        size={'large'}
        illustration={<UsersIllustration/>}
        title="Welcome to the SDM SDK starter kit!"
    >
      Please update the src/App.tsx file to match your needs!<br/>
      <Link href="https://dsm.akeneo.com/" target="_blank">Link to the official Akeneo DSM</Link><br/>
    </Placeholder>
    <SectionTitle>
      <SectionTitle.Title>PIM Context</SectionTitle.Title>
    </SectionTitle>
    <pre>{JSON.stringify(PIMContext)}</pre>
    <SectionTitle>
      <SectionTitle.Title>PIM User</SectionTitle.Title>
    </SectionTitle>
    <pre>{JSON.stringify(PIMUser)}</pre>
    <SectionTitle>
      <SectionTitle.Title>Current object properties</SectionTitle.Title>
    </SectionTitle>
    {currentProduct && <pre>{JSON.stringify(currentProduct, null, 4)}</pre>}
    {currentCategory && <pre>{JSON.stringify(currentCategory, null, 4)}</pre>}
  </>
}

export default App