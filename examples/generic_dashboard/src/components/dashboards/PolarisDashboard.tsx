import '@shopify/polaris/build/esm/styles.css';
import {
  AppProvider,
  Page,
  Layout,
  Card,
  DataTable,
  Text,
  ProgressBar,
  BlockStack,
  InlineStack,
  Box,
} from '@shopify/polaris';
import { Flag } from '../Flag.tsx';
import { getProductName } from '@/lib/productUtils';

interface PolarisDashboardProps {
  productStatusData: any;
  pricingStatusData: any;
  selectedFamilyLabel: string;
  completenessData: Array<{ locale: string; completeness: number }>;
  completenessLoading: boolean;
  products: any[];
}

export const PolarisDashboard = ({
  productStatusData,
  pricingStatusData,
  selectedFamilyLabel,
  completenessData,
  completenessLoading,
  products,
}: PolarisDashboardProps) => {
  // Extract data from chart objects
  const pricingLabels = pricingStatusData.labels || [];
  const pricingValues = pricingStatusData.datasets?.[0]?.data || [];
  const pricingTotal = pricingValues.reduce((sum: number, val: number) => sum + val, 0);

  const productLabels = productStatusData.labels || [];
  const productValues = productStatusData.datasets?.[0]?.data || [];
  const productTotal = productValues.reduce((sum: number, val: number) => sum + val, 0);

  // Prepare pricing status table data
  const pricingRows = pricingLabels.map((label: string, index: number) => {
    const value = pricingValues[index] || 0;
    const percentage = pricingTotal > 0 ? ((value / pricingTotal) * 100).toFixed(1) : '0.0';
    return [label, value.toString(), `${percentage}%`];
  });

  // Prepare product status table data
  const productRows = productLabels.map((label: string, index: number) => {
    const value = productValues[index] || 0;
    const percentage = productTotal > 0 ? ((value / productTotal) * 100).toFixed(1) : '0.0';
    return [label, value.toString(), `${percentage}%`];
  });

  return (
    <AppProvider i18n={{}}>
      <Page>
      <Layout>
        {/* Pricing Status and Product Status side by side */}
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Pricing Status</Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Complete products with or without a price.
              </Text>
              <DataTable
                columnContentTypes={['text', 'numeric', 'numeric']}
                headings={['Status', 'Count', 'Percentage']}
                rows={pricingRows}
              />
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Distribution by Completeness Status</Text>
              <DataTable
                columnContentTypes={['text', 'numeric', 'numeric']}
                headings={['Status', 'Count', 'Percentage']}
                rows={productRows}
              />
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Completeness per Locale */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Completeness per Locale</Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Average score for the '{selectedFamilyLabel}' family.
              </Text>
              {completenessLoading ? (
                <Text as="p" variant="bodyMd" tone="subdued">Calculating...</Text>
              ) : (
                <BlockStack gap="300">
                  {completenessData.map((item: { locale: string; completeness: number }) => (
                    <BlockStack gap="200" key={item.locale}>
                      <InlineStack align="space-between">
                        <InlineStack gap="200" blockAlign="center">
                          <Flag locale={item.locale} />
                          <Text as="span" variant="bodyMd">{item.locale}</Text>
                        </InlineStack>
                        <Text as="span" variant="bodyMd" tone="subdued">{item.completeness}%</Text>
                      </InlineStack>
                      <ProgressBar progress={item.completeness} size="small" />
                    </BlockStack>
                  ))}
                </BlockStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Products Table */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Recently Updated Products in the {selectedFamilyLabel} Family
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                List of 10 products from the PIM.
              </Text>
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text']}
                headings={['Image', 'SKU', 'Name', 'Last Update']}
                rows={products.map((product: any) => {
                  const updatedDate = new Date(product.updated);
                  const day = String(updatedDate.getDate()).padStart(2, '0');
                  const month = String(updatedDate.getMonth() + 1).padStart(2, '0');
                  const year = updatedDate.getFullYear();
                  const hours = String(updatedDate.getHours()).padStart(2, '0');
                  const minutes = String(updatedDate.getMinutes()).padStart(2, '0');
                  const seconds = String(updatedDate.getSeconds()).padStart(2, '0');
                  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                  const productName = getProductName(product.values);
                  const sku = product.values?.sku?.[0]?.data ?? product.values?.internal_itemid?.[0]?.data ?? product.identifier;

                  return [
                    product.imageUrl ? (
                      <Box as="span">
                        <img
                          src={product.imageUrl}
                          alt={productName}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </Box>
                    ) : 'N/A',
                    sku,
                    productName,
                    formattedDate,
                  ];
                })}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
    </AppProvider>
  );
};
