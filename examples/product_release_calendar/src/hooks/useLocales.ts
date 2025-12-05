import { useEffect, useState } from 'react';

interface Locale {
  code: string;
  enabled: boolean;
}

interface UseLocalesResult {
  locales: Locale[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch available locales from PIM
 */
export function useLocales(): UseLocalesResult {
  const [locales, setLocales] = useState<Locale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocales = async () => {
      if (!globalThis.PIM?.api?.locale_v1) {
        setError('PIM API not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await globalThis.PIM.api.locale_v1.list({
          limit: 100,
        });

        if (response.items) {
          const localeList = response.items
            .filter((locale: any) => locale.enabled)
            .map((locale: any) => ({
              code: locale.code,
              enabled: locale.enabled,
            }));
          setLocales(localeList);
        }
      } catch (err) {
        console.error('Failed to fetch locales:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch locales');
      } finally {
        setLoading(false);
      }
    };

    fetchLocales();
  }, []);

  return { locales, loading, error };
}
