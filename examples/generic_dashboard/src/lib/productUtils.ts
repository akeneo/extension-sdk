/**
 * Product utility functions
 *
 * Shared utilities for working with PIM product data across all dashboard implementations.
 */

/**
 * Extracts the best available product name from product values
 *
 * Attempts to find a product name by checking multiple attribute names in priority order,
 * and multiple locales in priority order. Falls back to 'N/A' if no name is found.
 *
 * @param values - Product values object containing localized attribute data
 * @returns The best available product name, or 'N/A' if none found
 *
 * @example
 * const values = {
 *   name: [{ locale: 'en_US', data: 'Product Name' }]
 * };
 * getProductName(values); // Returns: 'Product Name'
 */
export const getProductName = (
  values: { [key: string]: Array<{ locale: string | null; data: string }> } | undefined
): string => {
  // Priority order for checking attribute names
  const attributePriority = [
    'name',
    'erp_name',
    'product_name',
    'marketing_name',
    'internal_erpname',
    'label',
  ];

  // Priority order for checking locales
  const localePriority = ['en_US', 'en_GB', 'fr_FR', 'de_DE', 'nl_NL', 'it_IT', 'es_ES'];

  if (!values) {
    return 'N/A';
  }

  // Check each attribute in priority order
  for (const attribute of attributePriority) {
    const nameValues = values[attribute];

    if (nameValues && nameValues.length > 0) {
      // Try to find a value in priority locale order
      for (const locale of localePriority) {
        const nameValue = nameValues.find((val) => val.locale === locale);
        if (nameValue && nameValue.data) {
          return nameValue.data;
        }
      }

      // If no priority locale found, use the first available value
      if (nameValues[0] && nameValues[0].data) {
        return nameValues[0].data;
      }
    }
  }

  // No name found in any attribute or locale
  return 'N/A';
};
