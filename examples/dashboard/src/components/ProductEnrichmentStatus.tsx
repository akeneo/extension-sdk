import { SectionTitle, Helper, Table } from "akeneo-design-system";
import { useGetEnrichmentStatus } from "../hooks/useGetEnrichmentStatus";

// Updated table style to be more responsive
const tableContainerStyle = {
  width: '100%',
  overflowX: 'auto' as const,
  marginBottom: '16px',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const getPercentage = (value: number, total: number) => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

export const ProductEnrichmentStatus = () => {
  const { status, loading: enrichmentLoading, error: enrichmentError } = useGetEnrichmentStatus();

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
        <SectionTitle.Title style={titleStyle}>Product Enrichment Status</SectionTitle.Title>
      </SectionTitle>

      {enrichmentLoading && <Helper level="info">Loading enrichment status...</Helper>}
      {enrichmentError && <Helper level="error">{enrichmentError}</Helper>}

      {!enrichmentLoading && !enrichmentError && status && (
        <div style={tableContainerStyle}>
          <Table>
            <Table.Header>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Count</Table.HeaderCell>
              <Table.HeaderCell>Percentage</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Complete (Ready to Publish)</Table.Cell>
                <Table.Cell>{status.complete}</Table.Cell>
                <Table.Cell>{getPercentage(status.complete, status.totalCount)}%</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>In Progress</Table.Cell>
                <Table.Cell>{status.inProgress}</Table.Cell>
                <Table.Cell>{getPercentage(status.inProgress, status.totalCount)}%</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Missing Core Info</Table.Cell>
                <Table.Cell>{status.missing}</Table.Cell>
                <Table.Cell>{getPercentage(status.missing, status.totalCount)}%</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};
