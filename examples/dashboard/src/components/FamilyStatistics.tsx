import { SectionTitle, Helper, Table } from "akeneo-design-system";
import { useGetFamilyStats } from "../hooks/useGetFamilyStats";

// Updated table style to be more responsive
const tableContainerStyle = {
  width: '100%',
  overflowX: 'auto' as const,
  marginBottom: '16px',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

export const FamilyStatistics = () => {
  const { stats: familyStats, loading: familyLoading, error: familyError } = useGetFamilyStats();

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

  return (
    <div style={widgetStyle}>
      <SectionTitle>
        <SectionTitle.Title style={titleStyle}>Top 5 Families by Product Count</SectionTitle.Title>
      </SectionTitle>

      {familyLoading && <Helper level="info">Loading family statistics...</Helper>}
      {familyError && <Helper level="error">{familyError}</Helper>}

      {!familyLoading && !familyError && familyStats && (
        <>
          <div style={tableContainerStyle}>
            <Table>
              <Table.Header>
                <Table.HeaderCell>Family Code</Table.HeaderCell>
                <Table.HeaderCell>Product Count</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {familyStats.topFamilies.map(family => (
                  <Table.Row key={family.code}>
                    <Table.Cell>{family.code}</Table.Cell>
                    <Table.Cell>{family.productCount}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
