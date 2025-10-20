import { useState, useEffect } from 'react';

interface CategoryCount {
  code: string;
  label: string;
  productCount: number;
}

export const useGetTopCategories = (limit: number = 5) => {
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        // Get categories using the correct API from global.d.ts
        const categoryListResponse = await globalThis.PIM.api.category_v1.list({
          limit: 100,
          page: 1
        });

        if (!categoryListResponse || !categoryListResponse.items) {
          throw new Error('Failed to retrieve categories');
        }

        // Process each category to get product counts
        const categoryPromises = categoryListResponse.items.map(category => {
          return new Promise<CategoryCount>(async (resolve) => {
            try {
              const productResponse = await globalThis.PIM.api.product_uuid_v1.list({
                search: {
                  categories: [{ operator: "IN", value: [category.code] }]
                },
                withCount: true,
                limit: 100
              });
              const productCount = typeof productResponse.count === 'number' ? productResponse.count : 0;
              resolve({
                code: category.code,
                label: category.labels?.['en_US'] || category.code,
                productCount
              });
            } catch (err) {
              console.error(`Error getting product count for category ${category.code}:`, err);
              resolve({
                code: category.code,
                label: category.labels?.['en_US'] || category.code,
                productCount: 0
              });
            }
          });
        });

        // Wait for all category product counts to complete
        const categoriesWithCounts = await Promise.all(categoryPromises);

        // Sort by product count descending and take top N
        const topCategories = categoriesWithCounts
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, limit);

        setCategories(topCategories);
      } catch (err) {
        console.error('Error fetching top categories:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit]);

  return { categories, loading, error };
};
