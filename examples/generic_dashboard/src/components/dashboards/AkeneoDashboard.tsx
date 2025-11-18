import { Pie } from 'react-chartjs-2';
import styled from 'styled-components';
import { SectionTitle, Table, Helper } from 'akeneo-design-system';
import { Flag } from '../Flag.tsx';

interface AkeneoDashboardProps {
  productStatusData: any;
  pricingStatusData: any;
  chartOptions: any;
  selectedFamilyLabel: string;
  completenessData: Array<{ locale: string; completeness: number }>;
  completenessLoading: boolean;
  products: any[];
}

const DashboardGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CardDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
`;

const ChartContainer = styled.div`
  height: 256px;
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const ProgressBarContainer = styled.div`
  margin-bottom: 16px;
`;

const ProgressBarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ProgressBarLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
`;

const ProgressBarValue = styled.span`
  font-size: 14px;
  color: #666;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ value: number }>`
  height: 100%;
  background-color: #9452ba;
  width: ${props => props.value}%;
  transition: width 0.3s ease;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #666;
`;

const ProductImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
`;

const getProductName = (values: { [key: string]: Array<{ locale: string | null; data: string; }> } | undefined): string => {
  const attributePriority = ['name', 'erp_name', 'product_name', 'marketing_name', 'internal_erpname', 'label'];
  const localePriority = ['en_US', 'en_GB', 'fr_FR', 'de_DE', 'nl_NL', 'it_IT', 'es_ES'];

  if (!values) {
    return 'N/A';
  }

  for (const attribute of attributePriority) {
    const nameValues = values[attribute];
    if (nameValues && nameValues.length > 0) {
      for (const locale of localePriority) {
        const nameValue = nameValues.find(val => val.locale === locale);
        if (nameValue && nameValue.data) {
          return nameValue.data;
        }
      }
      if (nameValues[0] && nameValues[0].data) {
        return nameValues[0].data;
      }
    }
  }

  return 'N/A';
};

export const AkeneoDashboard = ({
  productStatusData,
  pricingStatusData,
  chartOptions,
  selectedFamilyLabel,
  completenessData,
  completenessLoading,
  products,
}: AkeneoDashboardProps) => {
  return (
    <DashboardGrid>
      {/* Pricing Status Pie Chart */}
      <Card>
        <CardTitle>Pricing Status</CardTitle>
        <CardDescription>Complete products with or without a price.</CardDescription>
        <ChartContainer>
          <Pie data={pricingStatusData} options={chartOptions} />
        </ChartContainer>
      </Card>

      {/* Product Status Pie Chart */}
      <Card>
        <CardTitle>Distribution by completeness status</CardTitle>
        <ChartContainer>
          <Pie data={productStatusData} options={chartOptions} />
        </ChartContainer>
      </Card>

      <FullWidth>
        {/* Completeness per Locale Widget */}
        <Card>
          <SectionTitle>
            <SectionTitle.Title>Completeness per Locale</SectionTitle.Title>
          </SectionTitle>
          <CardDescription>
            Average score for the '{selectedFamilyLabel}' family.
          </CardDescription>
          {completenessLoading ? (
            <LoadingContainer>
              <span>Calculating...</span>
            </LoadingContainer>
          ) : (
            <div>
              {completenessData.map((item) => (
                <ProgressBarContainer key={item.locale}>
                  <ProgressBarHeader>
                    <ProgressBarLabel>
                      <Flag locale={item.locale} />
                      <span>{item.locale}</span>
                    </ProgressBarLabel>
                    <ProgressBarValue>{item.completeness}%</ProgressBarValue>
                  </ProgressBarHeader>
                  <ProgressBar>
                    <ProgressBarFill value={item.completeness} />
                  </ProgressBar>
                </ProgressBarContainer>
              ))}
            </div>
          )}
        </Card>
      </FullWidth>

      <FullWidth>
        {/* Products Table Widget */}
        <Card>
          <SectionTitle>
            <SectionTitle.Title>Recently updated products in the {selectedFamilyLabel} family</SectionTitle.Title>
          </SectionTitle>
          <CardDescription>List of 10 products from the PIM.</CardDescription>
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
                        <ProductImage src={product.imageUrl} alt={productName} />
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
        </Card>
      </FullWidth>
    </DashboardGrid>
  );
};
