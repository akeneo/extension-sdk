import { useEffect, useState } from 'react';
import { ProductWithRelease, ReleaseCalendarConfig, FilterState } from '../types';
import {
  inferProductStage,
  extractCompletenessPerLocale,
  extractGoLiveDates,
  isProductAtRisk,
  getLiveLocales,
} from '../utils/stageInference';

interface UseReleaseProductsResult {
  products: ProductWithRelease[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Extract identifier from product values when product.identifier is empty
 * Workaround for known bug where identifier field is not always filled
 */
function getProductIdentifier(product: any): string {
  // First try the identifier field
  if (product.identifier && product.identifier.trim().length > 0) {
    return product.identifier;
  }

  // Fallback: search through product values for pim_catalog_identifier attribute
  if (product.values) {
    for (const [, attributeValue] of Object.entries(product.values)) {
      if (Array.isArray(attributeValue) && attributeValue.length > 0) {
        const firstValue = attributeValue[0];
        if (
          firstValue &&
          typeof firstValue === 'object' &&
          'attribute_type' in firstValue &&
          firstValue.attribute_type === 'pim_catalog_identifier' &&
          'data' in firstValue
        ) {
          const data = firstValue.data;
          if (typeof data === 'string' && data.trim().length > 0) {
            return data.trim();
          }
        }
      }
    }
  }

  // Last resort: use UUID or empty string
  return product.uuid || '';
}

/**
 * Hook to fetch products with release tracking information
 */
export function useReleaseProducts(
  config: ReleaseCalendarConfig,
  filters: FilterState
): UseReleaseProductsResult {
  const [products, setProducts] = useState<ProductWithRelease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!globalThis.PIM?.api?.product_uuid_v1) {
      setError('PIM API not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build search criteria
      const search: any = {};

      // Filter by family if specified
      if (filters.family) {
        search.family = [
          {
            operator: 'IN',
            value: [filters.family],
          },
        ];
      }

      // Fetch products with completeness data
      const response = await globalThis.PIM.api.product_uuid_v1.list({
        limit: 100,
        search: Object.keys(search).length > 0 ? search : undefined,
        withCompletenesses: true,
      });

      if (!response.items) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Transform products with release tracking info
      const productsWithRelease: ProductWithRelease[] = response.items.map((product: any) => {
        const currentStage = inferProductStage(product, config);
        const completenessPerLocale = extractCompletenessPerLocale(product, config);
        const goLiveDates = extractGoLiveDates(product, config);
        const riskInfo = isProductAtRisk(product, currentStage, config);
        const liveLocales = getLiveLocales(product, config);

        // Get identifier with fallback for empty identifier field
        const identifier = getProductIdentifier(product);

        return {
          ...product,
          identifier,
          currentStage,
          completenessPerLocale,
          goLiveDates,
          validation: {
            masterValidated: ['master_validation', 'localization', 'central_validation', 'go_live', 'live'].includes(currentStage),
            centralValidated: ['central_validation', 'go_live', 'live'].includes(currentStage),
          },
          liveLocales,
          isAtRisk: riskInfo.isAtRisk,
          missingItems: riskInfo.missingItems,
        };
      });

        console.log(productsWithRelease)

      // Apply additional filters
      let filtered = productsWithRelease;

      // Filter by stage
      if (filters.stage) {
        filtered = filtered.filter((p) => p.currentStage === filters.stage);
      }

      // Filter by locale (products with go-live dates for this locale)
      if (filters.locale) {
        filtered = filtered.filter((p) => p.goLiveDates[filters.locale!] !== null);
      }

      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.identifier.toLowerCase().includes(query) ||
            (p.uuid && p.uuid.toLowerCase().includes(query))
        );
      }

      setProducts(filtered);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [config, filters.family, filters.stage, filters.locale, filters.searchQuery]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}
