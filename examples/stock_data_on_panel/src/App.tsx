import {Placeholder, SectionTitle, UsersIllustration, Button, Helper} from "akeneo-design-system";
import {useEffect, useState} from "react";

interface StockData {
  region: string;
  available: number;
  reserved: number;
  warehouse: string;
}

function App() {

  const [stockData, setStockData] = useState<{[key: string]: StockData} | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsLoading(true);

        const response = await globalThis.PIM.api.external.call({
          method: 'GET',
          url: 'https://66e7dcf4927f4604bcbeb54c920d9761.api.mockbin.io/',
          credentials_code: 'credential_example_1',
        });

        const data = await response.json();

        setStockData(data.body.stock);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const handleRefillStock = (region: string, warehouse: string) => {
    setSuccessMessage(`Successfully requested stock refill for ${region} - ${warehouse}`);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '100%' }}>
      <SectionTitle>Stock Information Dashboard</SectionTitle>

      {isLoading && <Placeholder
        illustration={<UsersIllustration />}
        title="Loading stock information.."
      >
      </Placeholder>}

      {error && (
        <Helper level="error" inline={false}>
          {error}
        </Helper>
      )}

      {successMessage && (
        <div style={{
          backgroundColor: '#ebf5ec',
          color: '#236334',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '16px',
          border: '1px solid #b6dfbe'
        }}>
          {successMessage}
        </div>
      )}

      {stockData && !isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(stockData).map(([key, data]) => (
            <div key={key} style={{
              border: '1px solid #dddddd',
              borderRadius: '4px',
              padding: '16px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '16px' }}>
                {data.region} - {data.warehouse}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Available Stock:</span>
                  <span style={{ fontWeight: 'bold' }}>{data.available}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Reserved Stock:</span>
                  <span style={{ fontWeight: 'bold' }}>{data.reserved}</span>
                </div>
              </div>

              <Button
                level="primary"
                size="small"
                onClick={() => handleRefillStock(data.region, data.warehouse)}
                style={{ width: '100%' }}
              >
                Request Refill
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
