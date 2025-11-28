import { ReleaseCalendarConfig, ReleaseDate } from '../types';

const DEFAULT_CONFIG: ReleaseCalendarConfig = {
  releaseDates: [
    { date: '2025-12-01', locale: 'en_US' },
    { date: '2025-12-15', locale: 'fr_FR' },
  ],
  masterLocale: 'en_US',
  targetLocales: ['fr_FR', 'de_DE'],
  masterRequiredAttributes: ['name', 'description'],
  imageAttributes: ['main_image'],
  channel: 'ecommerce',
  thresholds: {
    masterEnrichment: 40,
    masterVisuals: 60,
    masterValidation: 80,
    localization: 80,
    centralValidation: 100,
  },
};

/**
 * Parse release dates from custom_variables
 */
function parseReleaseDates(customVars: any): ReleaseDate[] {
  if (!customVars.releaseDates || !Array.isArray(customVars.releaseDates)) {
    return DEFAULT_CONFIG.releaseDates;
  }

  return customVars.releaseDates.filter(
    (rd: any) => rd && typeof rd.date === 'string'
  );
}

/**
 * Load configuration from custom_variables
 */
export function loadConfig(): ReleaseCalendarConfig {
  const customVars = (globalThis as any).PIM?.extension?.custom_variables || {};

  return {
    releaseDates: parseReleaseDates(customVars),
    masterLocale: customVars.masterLocale || DEFAULT_CONFIG.masterLocale,
    targetLocales: Array.isArray(customVars.targetLocales)
      ? customVars.targetLocales
      : DEFAULT_CONFIG.targetLocales,
    masterRequiredAttributes: Array.isArray(customVars.masterRequiredAttributes)
      ? customVars.masterRequiredAttributes
      : DEFAULT_CONFIG.masterRequiredAttributes,
    imageAttributes: Array.isArray(customVars.imageAttributes)
      ? customVars.imageAttributes
      : DEFAULT_CONFIG.imageAttributes,
    validationStatusAttribute: customVars.validationStatusAttribute,
    centralValidationAttribute: customVars.centralValidationAttribute,
    imageAssetFamily: customVars.imageAssetFamily,
    channel: customVars.channel || DEFAULT_CONFIG.channel,
    thresholds: {
      masterEnrichment:
        customVars.thresholdMasterEnrichment || DEFAULT_CONFIG.thresholds.masterEnrichment,
      masterVisuals:
        customVars.thresholdMasterVisuals || DEFAULT_CONFIG.thresholds.masterVisuals,
      masterValidation:
        customVars.thresholdMasterValidation || DEFAULT_CONFIG.thresholds.masterValidation,
      localization:
        customVars.thresholdLocalization || DEFAULT_CONFIG.thresholds.localization,
      centralValidation:
        customVars.thresholdCentralValidation ||
        DEFAULT_CONFIG.thresholds.centralValidation,
    },
  };
}
