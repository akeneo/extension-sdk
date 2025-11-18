import { Pie } from 'react-chartjs-2';
import styled from 'styled-components';
import { Flag } from '../Flag.tsx';

interface PolarisDashboardProps {
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

const PolarisCard = styled.div`
  display: block;
  padding: 20px;
  background: white;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #202223;
`;

const CardDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #6d7175;
`;

const ChartContainer = styled.div`
  height: 256px;
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const ProgressContainer = styled.div`
  margin-bottom: 16px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #202223;
`;

const ProgressValue = styled.span`
  font-size: 14px;
  color: #6d7175;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e3e3e3;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ value: number }>`
  height: 100%;
  background-color: #008060;
  width: ${props => props.value}%;
  transition: width 0.3s ease;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #6d7175;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const TableHead = styled.thead`
  background-color: #f6f6f7;
  border-bottom: 1px solid #e3e3e3;
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #202223;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e3e3e3;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #202223;
`;

const ProductImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductLink = styled.a`
  color: #008060;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
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

export const PolarisDashboard = ({
  productStatusData,
  pricingStatusData,
  chartOptions,
  selectedFamilyLabel,
  completenessData,
  completenessLoading,
  products,
}: PolarisDashboardProps) => {
  return (
    <DashboardGrid>
      {/* Pricing Status Pie Chart */}
      <PolarisCard>
        <CardTitle>Pricing Status</CardTitle>
        <CardDescription>Complete products with or without a price.</CardDescription>
        <ChartContainer>
          <Pie data={pricingStatusData} options={chartOptions} />
        </ChartContainer>
      </PolarisCard>

      {/* Product Status Pie Chart */}
      <PolarisCard>
        <CardTitle>Distribution by completeness status</CardTitle>
        <ChartContainer>
          <Pie data={productStatusData} options={chartOptions} />
        </ChartContainer>
      </PolarisCard>

      <FullWidth>
        {/* Completeness per Locale Widget */}
        <PolarisCard>
          <CardTitle>Completeness per Locale</CardTitle>
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
                <ProgressContainer key={item.locale}>
                  <ProgressHeader>
                    <ProgressLabel>
                      <Flag locale={item.locale} />
                      <span>{item.locale}</span>
                    </ProgressLabel>
                    <ProgressValue>{item.completeness}%</ProgressValue>
                  </ProgressHeader>
                  <ProgressBar>
                    <ProgressBarFill value={item.completeness} />
                  </ProgressBar>
                </ProgressContainer>
              ))}
            </div>
          )}
        </PolarisCard>
      </FullWidth>

      <FullWidth>
        {/* Products Table Widget */}
        <PolarisCard>
          <CardTitle>Recently updated products in the {selectedFamilyLabel} family</CardTitle>
          <CardDescription>List of 10 products from the PIM.</CardDescription>
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Image</TableHeader>
                  <TableHeader>SKU</TableHeader>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Last Update</TableHeader>
                </tr>
              </TableHead>
              <TableBody>
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
                    <TableRow key={product.uuid}>
                      <TableCell>
                        {product.imageUrl ? (
                          <ProductImage src={product.imageUrl} alt={productName} />
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <ProductLink href={`/enrich/product/${product.uuid}`} target="_blank" rel="noopener noreferrer">
                          {product.values?.sku?.[0]?.data ?? product.values?.internal_itemid?.[0]?.data ?? product.identifier}
                        </ProductLink>
                      </TableCell>
                      <TableCell>{productName}</TableCell>
                      <TableCell>{formattedDate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </PolarisCard>
      </FullWidth>
    </DashboardGrid>
  );
};
