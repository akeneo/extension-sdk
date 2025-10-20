import { SectionTitle, Helper, Table, Badge } from "akeneo-design-system";
import { useGetTopCategories } from "../hooks/useGetTopCategories";

export const TopCategoriesWidget = () => {
  const { categories, loading, error } = useGetTopCategories(15);

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
    marginBottom: '16px',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const badgeStyle = (count: number) => {
    // Color scheme based on product count
    if (count > 100) return { backgroundColor: '#4CAF50' }; // Green for high count
    if (count > 50) return { backgroundColor: '#FFC107' }; // Yellow for medium count
    return { backgroundColor: '#F44336' }; // Red for low count
  };

  return (
    <div style={widgetStyle}>
      <SectionTitle>
        <SectionTitle.Title style={titleStyle}>Top Product Categories</SectionTitle.Title>
      </SectionTitle>

      {loading && <Helper level="info">Loading top categories...</Helper>}
      {error && <Helper level="error">{error}</Helper>}

      {!loading && !error && categories && (
        <div style={tableContainerStyle}>
          <Table>
            <Table.Header>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Product Count</Table.HeaderCell>
              <Table.HeaderCell>Distribution</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {categories.map((category) => (
                <Table.Row key={category.code}>
                  <Table.Cell>{category.label}</Table.Cell>
                  <Table.Cell>{category.productCount}</Table.Cell>
                  <Table.Cell>
                    <Badge style={badgeStyle(category.productCount)}>
                      {category.productCount > 100 ? 'High' : category.productCount > 50 ? 'Medium' : 'Low'}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
              {categories.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={3}>No categories found</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};
