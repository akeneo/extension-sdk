import { useEffect, useState } from 'react';

interface Category {
  code: string;
  label: string;
}

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch available product categories
 */
export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!globalThis.PIM?.api?.category_v1) {
        setError('PIM API not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await globalThis.PIM.api.category_v1.list({
          limit: 100,
        });

        if (response.items) {
          const categoryList = response.items.map((category: any) => ({
            code: category.code,
            label: category.labels?.en_US || category.labels?.en || category.code,
          }));
          setCategories(categoryList);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
