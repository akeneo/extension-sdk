import {Button, Link, Placeholder, SectionTitle, UsersIllustration} from "akeneo-design-system";
import {useGetProduct} from "./useGetProduct.ts";
import {useGetCategory} from "./useGetCategory.ts";
import { channelExample } from "./channelTest.ts";
import { associationTypeExample } from "./associationTypeTest.ts";
import { attributeGroupExample } from "./AttributeGroupTest.ts";
import { attributeOptionExample } from "./AttributeOptionTest.ts";
import { assetExample } from "./AssetTest.ts";
import { assetAttributeExample } from "./AssetAttribute.ts";
import { assetFamilyExample } from "./AssetFamily.ts";
import { assetMediaFileExample } from "./AssetMediaFIle.ts";
import { assetAttributeOptionExample } from "./AssetAttributeOption.ts";
import { systemExample } from "./System.ts";
import { currencyExample } from "./currency.ts";
import { familyVariantExample } from "./family-variant.ts";
import { measurementFamilyExample } from "./measurementfamily.ts";
import { productModelExample } from "./ProductModel.ts";
import { categoryExample } from "./category.ts";
import { familyExample } from "./family.ts";
import { referenceEntityExample } from "./ReferenceEntityTest.ts";
import { referenceEntityAttributesExample } from "./ReferenceEntityAttributesTest.ts"
// import { localeExample } from "./locale.ts";
import { attributeExample } from "./Attribute.ts";
import { referenceEntityRecordExample } from "./ReferenceEntityRecordTest.ts";
import { referenceEntityAttributeOptionsExample } from "./ReferenceEntityAttributeOptionTest.ts";

function App() {
  const PIMContext = globalThis.PIM.context;
  const PIMUser = globalThis.PIM.user
  const currentProduct = useGetProduct('product' in PIMContext ? PIMContext.product.uuid : undefined);
  const currentCategory = useGetCategory('category' in PIMContext ? PIMContext.category.code : undefined);


  const handleChannelExample = () => {
    channelExample();
  };

  const handleAssociationTestExemple = () => {
    associationTypeExample();
  };

  const handleAttributeGroupExample = () => {
    attributeGroupExample();
  }

  const handleAttributeOptionExample = () => {
    attributeOptionExample();
  }

  const handleAssetExample = () => {
    assetExample()
  }

  const handleAssetAttributeExample = () => {
    assetAttributeExample();
  }

  const handleAssetFamilyExample = () => {
    assetFamilyExample();
  }

  const handleAssetMediaFileExample = () => {
    assetMediaFileExample()
  }

  const handleAssetAttributeOptionExample = () => {
    assetAttributeOptionExample()
  }

  const handleSystemExample = () => {
    systemExample()
  }

  const handleCurrencyExample = () => {
    currencyExample()
  }

  const handleFamilyVariantExample = () => {
    familyVariantExample()
  }


  return <>
    <Placeholder
        size={'large'}
        illustration={<UsersIllustration/>}
        title="Welcome to the SDM SDK starter kit!"
    >
      Please update the src/App.tsx file to match your needs!<br/>
      <Link href="https://dsm.akeneo.com/" target="_blank">Link to the official Akeneo DSM</Link><br/>
      <br />
      <Button onClick={handleChannelExample}>Run channel Example</Button>
      <br />
      <Button onClick={handleAssociationTestExemple}>Run Association Example</Button>
      <br />
      <Button onClick={handleAttributeGroupExample}>Run Attribute group Example</Button>
      <br />
      <Button onClick={handleAttributeOptionExample}>Run Attribute option Example</Button>
      <br />
      <Button onClick={handleAssetExample}>Run Asset Example</Button>
      <br />
      <Button onClick={handleAssetAttributeExample}>Run Asset attribute Example</Button>
      <br />
      <Button onClick={handleAssetFamilyExample}>Run Asset family Example</Button>
      <br />
      <Button onClick={handleAssetMediaFileExample}>Run Asset media file Example</Button>
      <br />
      <Button onClick={handleAssetAttributeOptionExample}>Run Asset attribute option Example</Button>
      <br />
      <Button onClick={handleSystemExample}>Run system Example</Button>
      <br />
      <Button onClick={handleCurrencyExample}>Run currency Example</Button>
      <br />
      <Button onClick={handleFamilyVariantExample}>Run family variant Example</Button>
      <br />
      <Button onClick={measurementFamilyExample}>Run measrment family Example</Button>
      <br />
      <Button onClick={productModelExample}>Run product model Example</Button>
      <br />
      <Button onClick={categoryExample}>Run category Example</Button>
      <br />
      <Button onClick={familyExample}>Run family Example</Button>
      <br />
      <Button onClick={referenceEntityExample}>Run Reference Entity Example</Button>
      <br />
      <Button onClick={referenceEntityAttributesExample}>Run Reference Entity Attributes Example</Button>
      <br />
      <Button onClick={referenceEntityRecordExample}>Run Reference Entity Record Example</Button>
      <br />
      <Button onClick={referenceEntityAttributeOptionsExample}>Run Reference Entity Attribute Option Example</Button>
      <br />
      {/* <Button onClick={localeExample}>Run locale Example</Button>
      <br /> */}
      <Button onClick={attributeExample}>Run attribute Example</Button>
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
