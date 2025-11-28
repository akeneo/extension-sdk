import { useEffect, useState } from 'react';

interface Family {
  code: string;
  label: string;
}

interface UseFamiliesResult {
  families: Family[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch available product families
 */
export function useFamilies(): UseFamiliesResult {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamilies = async () => {
      if (!globalThis.PIM?.api?.family_v1) {
        setError('PIM API not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await globalThis.PIM.api.family_v1.list({
          limit: 100,
        });

        if (response.items) {
          const familyList = response.items.map((family: any) => ({
            code: family.code,
            label: family.labels?.en_US || family.labels?.en || family.code,
          }));
          setFamilies(familyList);
        }
      } catch (err) {
        console.error('Failed to fetch families:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch families');
      } finally {
        setLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  return { families, loading, error };
}
