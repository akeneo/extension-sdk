import { useState, useEffect } from 'react';

interface StockDataProduct {
  name: string;
  uuid: string;
  stockValue: number;
  lastUpdateDate: string;
}

interface StockDataResponse {
  products: StockDataProduct[];
  metadata: {
    totalProducts: number;
    timestamp: string;
  };
}

export const useGetStockData = () => {
  const [stockData, setStockData] = useState<StockDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = () => {
      setLoading(true);

      globalThis.PIM.api.external.call({
        method: 'GET',
        url: 'https://6266eaade6e2441f8a770093b3a341c2.api.mockbin.io/',
        headers: {'Accept': 'application/json'},
        credentials_code: 'credential_code_example'
      })
      .then(response => {
        return response.json();
      })
      .then(dataObj => {
        console.log('Parsed API response object:', dataObj);

        // Direct assignment since our mockbin API directly returns the structure we want
        setStockData(dataObj.body);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching or processing stock data:', err);
        setError('Failed to fetch or process stock data: ' + (err instanceof Error ? err.message : String(err)));
        setStockData(null);
      })
      .finally(() => {
        setLoading(false);
      });
    };

    fetchStockData();
  }, []);

  return { stockData, loading, error };
};
