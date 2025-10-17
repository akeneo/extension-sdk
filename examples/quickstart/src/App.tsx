import { Information, Link, SectionTitle, UsersIllustration, Button } from "akeneo-design-system";
import { channelExample } from "./examples/channelExample";
import { associationTypeExample } from "./examples/AssociationTypeExample";
import { attributeGroupExample } from "./examples/AttributeGroupExample";
import { attributeOptionExample } from "./examples/AttributeOptionExample";
import { assetExample } from "./examples/AssetExample";
import { assetAttributeExample } from "./examples/AssetAttributeExample";
import { assetFamilyExample } from "./examples/AssetFamilyExample";
import { assetAttributeOptionExample } from "./examples/AssetAttributeOptionExample";
import { systemExample } from "./examples/SystemExample";
import { currencyExample } from "./examples/CurrencyExample";
import { familyVariantExample } from "./examples/FamilyVariantExample";
import { productModelExample } from "./examples/ProductModelExample";
import { categoryExample } from "./examples/CategoryExample";
import { familyExample } from "./examples/FamilyExample";
import { localeExample } from "./examples/LocaleExample";
import { referenceEntityExample } from "./examples/ReferenceEntityExample";
import { referenceEntityAttributesExample } from "./examples/ReferenceEntityAttributesExample";
import { referenceEntityRecordExample } from "./examples/ReferenceEntityRecordExample";
import { referenceEntityAttributeOptionsExample } from "./examples/ReferenceEntityAttributeOptionsExample";
import { attributeExample } from "./examples/AttributeExample";
import { productUuidExample } from "./examples/ProductUuidExample";
import { useState } from "react";

function App() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runExample = async (exampleFn: () => Promise<void>) => {
    setIsLoading(true);
    setResults([]);

    // Capture console.log output
    const originalLog = console.log;
    const originalError = console.error;
    const logs: string[] = [];

    console.log = (...args) => {
      logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
      originalLog(...args);
    };

    console.error = (...args) => {
      logs.push('ERROR: ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
      originalError(...args);
    };

    try {
      await exampleFn();
      setResults(logs);
    } catch (error) {
      setResults([...logs, `Error: ${error}`]);
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setIsLoading(false);
    }
  };

  const examples = [
    { name: 'Channel', fn: channelExample },
    { name: 'Association Type', fn: associationTypeExample },
    { name: 'Attribute Group', fn: attributeGroupExample },
    { name: 'Attribute Option', fn: attributeOptionExample },
    { name: 'Asset', fn: assetExample },
    { name: 'Asset Attribute', fn: assetAttributeExample },
    { name: 'Asset Family', fn: assetFamilyExample },
    { name: 'Asset Attribute Option', fn: assetAttributeOptionExample },
    { name: 'System', fn: systemExample },
    { name: 'Currency', fn: currencyExample },
    { name: 'Family Variant', fn: familyVariantExample },
    { name: 'Product Model', fn: productModelExample },
    { name: 'Category', fn: categoryExample },
    { name: 'Family', fn: familyExample },
    { name: 'Locale', fn: localeExample },
    { name: 'Reference Entity', fn: referenceEntityExample },
    { name: 'Reference Entity Attributes', fn: referenceEntityAttributesExample },
    { name: 'Reference Entity Record', fn: referenceEntityRecordExample },
    { name: 'Reference Entity Attribute Options', fn: referenceEntityAttributeOptionsExample },
    { name: 'Attribute', fn: attributeExample },
    { name: 'Product UUID', fn: productUuidExample },
  ];

  return <>
    <Information
      illustration={<UsersIllustration />}
      title="Welcome to the Akeneo custom component SDK!"
    >
      See the <Link href="https://github.com/akeneo/extension-sdk/blob/init/README.md" target="_blank">Readme</Link> of the SDK to explore capabilities and see implementation examples.<br />
      Link to the UI Extension component  <Link href="https://api.akeneo.com/extensions/overview.html" target="_blank">documentation</Link>.<br />
    </Information>

    <SectionTitle>
      <SectionTitle.Title>API Examples</SectionTitle.Title>
    </SectionTitle>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
      {examples.map((example) => (
        <Button
          key={example.name}
          onClick={() => runExample(example.fn)}
          disabled={isLoading}
        >
          {example.name}
        </Button>
      ))}
    </div>

    {results.length > 0 && (
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Results:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {results.join('\n')}
        </pre>
      </div>
    )}
  </>
}

export default App
