import { SectionTitle, Table, Helper } from 'akeneo-design-system';
import { Flag } from '../Flag.tsx';
import { getProductName } from '@/lib/productUtils';

interface AkeneoDashboardProps {
  productStatusData: any;
  pricingStatusData: any;
  selectedFamilyLabel: string;
  completenessData: Array<{ locale: string; completeness: number }>;
  completenessLoading: boolean;
  products: any[];
}

export const AkeneoDashboard = ({
  productStatusData,
  pricingStatusData,
  selectedFamilyLabel,
  completenessData,
  completenessLoading,
  products,
}: AkeneoDashboardProps) => {
  // Extract data from chart objects
  const pricingLabels = pricingStatusData.labels || [];
  const pricingValues = pricingStatusData.datasets?.[0]?.data || [];
  const pricingTotal = pricingValues.reduce((sum: number, val: number) => sum + val, 0);

  const productLabels = productStatusData.labels || [];
  const productValues = productStatusData.datasets?.[0]?.data || [];
  const productTotal = productValues.reduce((sum: number, val: number) => sum + val, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Status Tables Side by Side */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Pricing Status Table */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <SectionTitle>
            <SectionTitle.Title>Pricing Status</SectionTitle.Title>
          </SectionTitle>
          <Helper level="info">Complete products with or without a price.</Helper>
          <Table>
            <Table.Header>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Count</Table.HeaderCell>
              <Table.HeaderCell>Percentage</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {pricingLabels.map((label: string, index: number) => {
                const value = pricingValues[index] || 0;
                const percentage = pricingTotal > 0 ? ((value / pricingTotal) * 100).toFixed(1) : '0.0';
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{label}</Table.Cell>
                    <Table.Cell>{value}</Table.Cell>
                    <Table.Cell>{percentage}%</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>

        {/* Product Status Table */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <SectionTitle>
            <SectionTitle.Title>Distribution by Completeness Status</SectionTitle.Title>
          </SectionTitle>
          <Table>
            <Table.Header>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Count</Table.HeaderCell>
              <Table.HeaderCell>Percentage</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {productLabels.map((label: string, index: number) => {
                const value = productValues[index] || 0;
                const percentage = productTotal > 0 ? ((value / productTotal) * 100).toFixed(1) : '0.0';
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{label}</Table.Cell>
                    <Table.Cell>{value}</Table.Cell>
                    <Table.Cell>{percentage}%</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Completeness per Locale Table */}
      <div>
        <SectionTitle>
          <SectionTitle.Title>Completeness per Locale</SectionTitle.Title>
        </SectionTitle>
        <Helper level="info">Average score for the '{selectedFamilyLabel}' family.</Helper>

        {completenessLoading ? (
          <Helper level="warning">Calculating...</Helper>
        ) : (
          <Table>
            <Table.Header>
              <Table.HeaderCell>Locale</Table.HeaderCell>
              <Table.HeaderCell>Completeness</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {completenessData.map((item) => (
                <Table.Row key={item.locale}>
                  <Table.Cell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Flag locale={item.locale} />
                      <span>{item.locale}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{item.completeness}%</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {/* Products Table */}
      <div>
        <SectionTitle>
          <SectionTitle.Title>Recently Updated Products in the {selectedFamilyLabel} Family</SectionTitle.Title>
        </SectionTitle>
        <Helper level="info">List of 10 products from the PIM.</Helper>

        <Table>
          <Table.Header>
            <Table.HeaderCell>Image</Table.HeaderCell>
            <Table.HeaderCell>SKU</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Last Update</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {products.map((product: any) => {
              const updatedDate = new Date(product.updated);
              const day = String(updatedDate.getDate()).padStart(2, '0');
              const month = String(updatedDate.getMonth() + 1).padStart(2, '0');
              const year = updatedDate.getFullYear();
              const hours = String(updatedDate.getHours()).padStart(2, '0');
              const minutes = String(updatedDate.getMinutes()).padStart(2, '0');
              const seconds = String(updatedDate.getSeconds()).padStart(2, '0');
              const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
              const productName = getProductName(product.values);

              return (
                <Table.Row key={product.uuid}>
                  <Table.Cell>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={productName} style={{ width: 70, height: 70, objectFit: 'cover' }} />
                    ) : (
                      'N/A'
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <a href={`/enrich/product/${product.uuid}`} target="_blank" rel="noopener noreferrer">
                      {product.values?.sku?.[0]?.data ?? product.values?.internal_itemid?.[0]?.data ?? product.identifier}
                    </a>
                  </Table.Cell>
                  <Table.Cell>{productName}</Table.Cell>
                  <Table.Cell>{formattedDate}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
