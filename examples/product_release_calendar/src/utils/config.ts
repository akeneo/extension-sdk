import { ReleaseCalendarConfig, ReleaseDate } from '../types';

/**
 * Default configuration
 * This serves as a fallback when custom_variables are not configured
 */
export const DEFAULT_CONFIG: ReleaseCalendarConfig = {
  releaseDates: [
    // Example: Release dates for different locales
    { date: '2025-12-01', locale: 'en_US' },
    { date: '2025-12-15', locale: 'fr_FR' },
    { date: '2025-12-15', locale: 'de_DE' },
  ],
  masterLocale: 'en_US',
  targetLocales: ['fr_FR', 'de_DE', 'es_ES', 'it_IT'],
  validationStatusAttribute: 'validation_status',
  centralValidationAttribute: 'central_validation',
  masterRequiredAttributes: ['description', 'short_description', 'name'],
  imageAttributes: ['image', 'main_image', 'images'],
  imageAssetFamily: 'product_images',
  thresholds: {
    masterEnrichment: 40,
    masterValidation: 80,
    localization: 80,
  },
  channel: 'ecommerce',
};

/**
 * Parse release dates from custom_variables
 */
function parseReleaseDates(customVars: any): ReleaseDate[] {
  const releaseDates: ReleaseDate[] = [];

  // Check for releaseDates array
  if (Array.isArray(customVars.releaseDates)) {
    customVars.releaseDates.forEach((item: any) => {
      if (item && typeof item === 'object' && item.date) {
        releaseDates.push({
          date: item.date as string,
          locale: item.locale as string | undefined,
          family: item.family as string | undefined,
          channel: item.channel as string | undefined,
        });
      }
    });
  }

  console.log(releaseDates.length > 0 ? "release_date" : "deafault_config")
  return releaseDates.length > 0 ? releaseDates : DEFAULT_CONFIG.releaseDates;
}

/**
 * Load configuration from custom_variables or use defaults
 */
export function loadConfig(): ReleaseCalendarConfig {
  const customVars = globalThis.PIM?.custom_variables;

  if (!customVars) {
    console.warn('PIM custom_variables not found, using default configuration');
    return DEFAULT_CONFIG;
  }

  // Merge custom variables with defaults
  return {
    releaseDates: parseReleaseDates(customVars),
    masterLocale: (customVars.masterLocale as string) || DEFAULT_CONFIG.masterLocale,
    targetLocales: Array.isArray(customVars.targetLocales)
      ? (customVars.targetLocales as string[])
      : DEFAULT_CONFIG.targetLocales,
    validationStatusAttribute: (customVars.validationStatusAttribute as string) || DEFAULT_CONFIG.validationStatusAttribute,
    centralValidationAttribute: (customVars.centralValidationAttribute as string) || DEFAULT_CONFIG.centralValidationAttribute,
    masterRequiredAttributes: Array.isArray(customVars.masterRequiredAttributes)
      ? (customVars.masterRequiredAttributes as string[])
      : DEFAULT_CONFIG.masterRequiredAttributes,
    imageAttributes: Array.isArray(customVars.imageAttributes)
      ? (customVars.imageAttributes as string[])
      : DEFAULT_CONFIG.imageAttributes,
    imageAssetFamily: (customVars.imageAssetFamily as string) || DEFAULT_CONFIG.imageAssetFamily,
    thresholds: {
      masterEnrichment: (customVars.thresholdMasterEnrichment as number) || DEFAULT_CONFIG.thresholds.masterEnrichment,
      masterValidation: (customVars.thresholdMasterValidation as number) || DEFAULT_CONFIG.thresholds.masterValidation,
      localization: (customVars.thresholdLocalization as number) || DEFAULT_CONFIG.thresholds.localization,
    },
    channel: (customVars.channel as string) || DEFAULT_CONFIG.channel,
  };
}
