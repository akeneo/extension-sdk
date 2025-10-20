import { SectionTitle, Helper, Table } from "akeneo-design-system";
import { useGetStockData } from "../hooks/useGetStockData";

// Format the date to a more readable format
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const ProductStockWidget = () => {
  const { stockData, loading, error } = useGetStockData();

  // Styles for iframe-friendly display
  const widgetStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    height: '100%',
    boxSizing: 'border-box' as const
  };

  const titleStyle = {
    color: '#58316f',
    fontSize: '18px',
    marginBottom: '16px'
  };

  const tableContainerStyle = {
    width: '100%',
    overflowX: 'auto' as const,
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '12px'
  };

  const metadataStyle = {
    marginTop: '12px',
    fontSize: '13px',
    color: '#666'
  };

  return (
    <div style={widgetStyle}>
      <SectionTitle>
        <SectionTitle.Title style={titleStyle}>Product Stock Levels</SectionTitle.Title>
      </SectionTitle>

      {loading && <Helper level="info">Loading stock data...</Helper>}
      {error && <Helper level="error">{error}</Helper>}

      {!loading && !stockData && !error && (
        <Helper level="info">No stock data available</Helper>
      )}

      {!loading && !error && stockData && (() => {
        const products = stockData?.products || [];

        return (
          <>
            <div style={tableContainerStyle}>
              <Table>
                <Table.Header>
                  <Table.HeaderCell>Product Name</Table.HeaderCell>
                  <Table.HeaderCell>UUID</Table.HeaderCell>
                  <Table.HeaderCell>Stock Value</Table.HeaderCell>
                  <Table.HeaderCell>Last Updated</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                  {products.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={4}>No products available</Table.Cell>
                    </Table.Row>
                  ) : (
                    products.map((product, index) => (
                      <Table.Row key={product?.uuid || `product-${index}`}>
                        <Table.Cell>{product?.name || 'Unknown'}</Table.Cell>
                        <Table.Cell>{product?.uuid || 'N/A'}</Table.Cell>
                        <Table.Cell>{product?.stockValue !== undefined ? product.stockValue : 'N/A'}</Table.Cell>
                        <Table.Cell>{product?.lastUpdateDate ? formatDate(product.lastUpdateDate) : 'N/A'}</Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table>
            </div>
            <div style={metadataStyle}>
              <Helper level="info">
                Total Products: {stockData.metadata?.totalProducts || 'Unknown'} |
                Last Updated: {stockData.metadata?.timestamp ? formatDate(stockData.metadata.timestamp) : 'N/A'}
              </Helper>
            </div>
          </>
        );
      })()}
    </div>
  );
};
