import { ReleaseCalendarConfig } from '../types';

/**
 * Validate a product for the master locale
 * Updates the validation attribute (yes/no) with true for the master locale and channel
 */
export async function validateMasterLocale(
  productUuid: string,
  config: ReleaseCalendarConfig
): Promise<void> {
  if (!globalThis.PIM?.api?.product_uuid_v1) {
    throw new Error('PIM API not available');
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
  if (!globalThis.PIM?.api?.product_uuid_v1) {
    throw new Error('PIM API not available');
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
