import { ReleaseCalendarConfig, ReleaseDate, DisplayMode } from '../types';

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
  targetLocales: ['fr_FR', 'de_DE'],
  validationAttribute: 'validation_status',
  thresholds: {
    masterEnrichment: 40,
    localization: 80,
  },
  channel: 'ecommerce',
  displayMode: DisplayMode.BOARD,
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
          category: item.category as string | undefined,
          channel: item.channel as string | undefined,
        });
      }
    });
  }

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
    validationAttribute: (customVars.validationAttribute as string) || DEFAULT_CONFIG.validationAttribute,
    thresholds: {
      masterEnrichment: (customVars.thresholdMasterEnrichment as number) || DEFAULT_CONFIG.thresholds.masterEnrichment,
      localization: (customVars.thresholdLocalization as number) || DEFAULT_CONFIG.thresholds.localization,
    },
    channel: (customVars.channel as string) || DEFAULT_CONFIG.channel,
    displayMode: (customVars.displayMode as DisplayMode) || DEFAULT_CONFIG.displayMode,
  };
}
