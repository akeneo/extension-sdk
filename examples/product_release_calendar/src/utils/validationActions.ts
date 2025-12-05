import { ReleaseCalendarConfig } from '../types';

/**
 * Validate a product for the master locale
 * Updates the validation attribute (yes/no) with true for the master locale and channel
 */
export async function validateMasterLocale(
  productUuid: string,
  config: ReleaseCalendarConfig
): Promise<void> {
  if (!globalThis.PIM?.api?.product_uuid_v1 || !globalThis.PIM?.api?.family_v1) {
    throw new Error('PIM API not available');
  }

  // Fetch the product to get its family code
  const product: any = await globalThis.PIM.api.product_uuid_v1.get({ uuid: productUuid });

  if (!product.family) {
    throw new Error('Product has no family assigned');
  }

  // Fetch the family to check if validation attribute exists
  const family: any = await globalThis.PIM.api.family_v1.get({ code: product.family });

  // Check if the validation attribute exists in the family's attributes
  if (!family.attributes || !family.attributes.includes(config.validationAttribute)) {
    throw new Error(`Validation attribute "${config.validationAttribute}" not found in family "${product.family}". Please ensure the attribute exists in the product family and is configured as localizable and scopable.`);
  }

  const updatePayload: any = {
    values: {
      [config.validationAttribute]: [
        {
          locale: config.masterLocale,
          scope: config.channel || null,
          data: true,
        },
      ],
    },
  };

  await globalThis.PIM.api.product_uuid_v1.patch({
    uuid: productUuid,
    data: updatePayload,
  });
}

/**
 * Validate all target locales for a product
 * Updates the validation attribute (yes/no) with true for all target locales
 */
export async function validateAllLocales(
  productUuid: string,
  config: ReleaseCalendarConfig
): Promise<void> {
  if (!globalThis.PIM?.api?.product_uuid_v1 || !globalThis.PIM?.api?.family_v1) {
    throw new Error('PIM API not available');
  }

  // Fetch the product to get its family code
  const product: any = await globalThis.PIM.api.product_uuid_v1.get({ uuid: productUuid });

  if (!product.family) {
    throw new Error('Product has no family assigned');
  }

  // Fetch the family to check if validation attribute exists
  const family: any = await globalThis.PIM.api.family_v1.get({ code: product.family });

  // Check if the validation attribute exists in the family's attributes
  if (!family.attributes || !family.attributes.includes(config.validationAttribute)) {
    throw new Error(`Validation attribute "${config.validationAttribute}" not found in family "${product.family}". Please ensure the attribute exists in the product family and is configured as localizable and scopable.`);
  }

  // Create validation entries for all target locales with true value
  const validationEntries = config.targetLocales.map((locale) => ({
    locale,
    scope: config.channel || null,
    data: true,
  }));

  const updatePayload: any = {
    values: {
      [config.validationAttribute]: validationEntries,
    },
  };

  await globalThis.PIM.api.product_uuid_v1.patch({
    uuid: productUuid,
    data: updatePayload,
  });
}

/**
 * Trigger go-live action
 * Returns a success message to be displayed by the caller
 */
export function triggerGoLive(productIdentifier: string): string {
  return `Product "${productIdentifier}" is ready to go live!`;
}
