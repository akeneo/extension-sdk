import { ReleaseCalendarConfig } from '../types';

/**
 * Determine if the identifier is a UUID (for products) or a code (for product models)
 */
function isUuid(identifier: string): boolean {
  // Simple UUID check - UUIDs contain hyphens, codes typically don't
  return identifier.includes('-') && identifier.length > 30;
}

/**
 * Validate a product or product model for the master locale
 * Updates the validation attribute (yes/no) with true for the master locale and channel
 */
export async function validateMasterLocale(
  productIdentifier: string,
  config: ReleaseCalendarConfig
): Promise<void> {
  if (!globalThis.PIM?.api?.product_uuid_v1 || !globalThis.PIM?.api?.product_model_v1 || !globalThis.PIM?.api?.family_v1) {
    throw new Error('PIM API not available');
  }

  const isProduct = isUuid(productIdentifier);

  // Fetch the product or product model to get its family code
  const entity: any = isProduct
    ? await globalThis.PIM.api.product_uuid_v1.get({ uuid: productIdentifier })
    : await globalThis.PIM.api.product_model_v1.get({ code: productIdentifier });

  if (!entity.family) {
    throw new Error('Product/Product model has no family assigned');
  }

  // Fetch the family to check if validation attribute exists
  const family: any = await globalThis.PIM.api.family_v1.get({ code: entity.family });

  // Check if the validation attribute exists in the family's attributes
  if (!family.attributes || !family.attributes.includes(config.validationAttribute)) {
    throw new Error(`Validation attribute "${config.validationAttribute}" not found in family "${entity.family}". Please ensure the attribute exists in the product family and is configured as localizable and scopable.`);
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

  if (isProduct) {
    await globalThis.PIM.api.product_uuid_v1.patch({
      uuid: productIdentifier,
      data: updatePayload,
    });
  } else {
    await globalThis.PIM.api.product_model_v1.patch({
      code: productIdentifier,
      data: updatePayload,
    });
  }
}

/**
 * Validate all target locales for a product or product model
 * Updates the validation attribute (yes/no) with true for all target locales
 */
export async function validateAllLocales(
  productIdentifier: string,
  config: ReleaseCalendarConfig
): Promise<void> {
  if (!globalThis.PIM?.api?.product_uuid_v1 || !globalThis.PIM?.api?.product_model_v1 || !globalThis.PIM?.api?.family_v1) {
    throw new Error('PIM API not available');
  }

  const isProduct = isUuid(productIdentifier);

  // Fetch the product or product model to get its family code
  const entity: any = isProduct
    ? await globalThis.PIM.api.product_uuid_v1.get({ uuid: productIdentifier })
    : await globalThis.PIM.api.product_model_v1.get({ code: productIdentifier });

  if (!entity.family) {
    throw new Error('Product/Product model has no family assigned');
  }

  // Fetch the family to check if validation attribute exists
  const family: any = await globalThis.PIM.api.family_v1.get({ code: entity.family });

  // Check if the validation attribute exists in the family's attributes
  if (!family.attributes || !family.attributes.includes(config.validationAttribute)) {
    throw new Error(`Validation attribute "${config.validationAttribute}" not found in family "${entity.family}". Please ensure the attribute exists in the product family and is configured as localizable and scopable.`);
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

  if (isProduct) {
    await globalThis.PIM.api.product_uuid_v1.patch({
      uuid: productIdentifier,
      data: updatePayload,
    });
  } else {
    await globalThis.PIM.api.product_model_v1.patch({
      code: productIdentifier,
      data: updatePayload,
    });
  }
}

/**
 * Trigger go-live action
 * Returns a success message to be displayed by the caller
 */
export function triggerGoLive(productIdentifier: string): string {
  return `Product "${productIdentifier}" is ready to go live!`;
}
