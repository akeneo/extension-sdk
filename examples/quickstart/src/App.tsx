import {Information, Link, SectionTitle, UsersIllustration} from "akeneo-design-system";
import {useGetProduct} from "./useGetProduct.ts";
import {useGetCategories} from "./useGetCategories.ts";
import {useGetCustomHeaders} from "./useGetCustomHeaders.ts";
import React from "react";
import {Button} from "akeneo-design-system";

function App() {
  const PIMContext = globalThis.PIM.context;
  const PIMUser = globalThis.PIM.user
  const productList = useGetProduct();
  const graphPIMCategories = useGetCategories();
  const customHeaders = useGetCustomHeaders();
  const [result, setResult] = React.useState('');

  async function callApi() {
    try {
      setResult('Calling API...');
      const currentUser = PIM.user;

      const resp = await PIM.api.external.call({
        method: 'POST',
        url: 'https://httpbin.org/anything', // Anonymized URL
        credentials_code: 'custom_api',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: { user: currentUser }
      });

      const data = await resp.json();
      setResult(JSON.stringify(data, null, 2));

    } catch (e: any) {
      console.error('Error making external call:', e);
      setResult(`Error: ${e?.message ?? String(e)}`);
    }
  }

  return <>
    <Information
      illustration={<UsersIllustration />}
      title="Welcome to the Akeneo custom component SDK!"
    >
      See the <Link href="https://github.com/akeneo/extension-sdk/blob/init/README.md" target="_blank">Readme</Link> of the SDK to explore capabilities and see implementation examples.<br/>
      Link to the UI Extension component  <Link href="https://api.akeneo.com/extensions/overview.html" target="_blank">documentation</Link>.<br/>
    </Information>

    {/* Add this new section for the API call */}
    <SectionTitle>
      <SectionTitle.Title level="secondary">Test Custom API Call</SectionTitle.Title>
    </SectionTitle>
    <div style={{ marginBottom: '20px' }}>
      <Button onClick={callApi} level="primary">Call API</Button>
    </div>
    {result && (
      <div style={{ marginBottom: '20px' }}>
        <h4>API Result:</h4>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>{result}</pre>
      </div>
    )}

    <SectionTitle>
      <SectionTitle.Title level="secondary">Available PIM Context information within the custom component context (depend of the displayed page)</SectionTitle.Title>
    </SectionTitle>
    <pre>{JSON.stringify(PIMContext)}</pre>
    <SectionTitle>
      <SectionTitle.Title level="secondary">Available PIM User information within the custom component context</SectionTitle.Title>
    </SectionTitle>
    <pre>{JSON.stringify(PIMUser)}</pre>
    <SectionTitle>
      <SectionTitle.Title level="secondary">Example response of external call with custom headers</SectionTitle.Title>
    </SectionTitle>
    {customHeaders && <pre>{JSON.stringify(customHeaders, null, 4)}</pre>}
    <SectionTitle>
      <SectionTitle.Title level="secondary">Example response of products list endpoint</SectionTitle.Title>
    </SectionTitle>
    {productList && <pre>{JSON.stringify(productList, null, 4)}</pre>}
    <SectionTitle>
      <SectionTitle.Title level="secondary">Example response of external call with credentials</SectionTitle.Title>
    </SectionTitle>
    {graphPIMCategories && <pre>{JSON.stringify(graphPIMCategories, null, 4)}</pre>}
  </>
}

export default App
