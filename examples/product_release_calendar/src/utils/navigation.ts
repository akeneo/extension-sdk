/**
 * Navigate to a product edit page
 */
export function navigateToProduct(productUuid: string): void {
  if (!globalThis.PIM?.navigate) {
    console.error('PIM navigation API not available');
    return;
  }

  try {
    // Use internal navigation to product edit page
    globalThis.PIM.navigate.internal(`#/enrich/product/${productUuid}`);
  } catch (error) {
    console.error('Failed to navigate to product:', error);
  }
}

/**
 * Navigate to product model edit page
 */
export function navigateToProductModel(code: string): void {
  if (!globalThis.PIM?.navigate) {
    console.error('PIM navigation API not available');
    return;
  }

  try {
    // Use internal navigation to product model edit page
    globalThis.PIM.navigate.internal(`#/enrich/product-model/${code}`);
  } catch (error) {
    console.error('Failed to navigate to product model:', error);
  }
}
