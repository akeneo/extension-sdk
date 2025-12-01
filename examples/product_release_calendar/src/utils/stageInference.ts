import { ReleaseStage, ReleaseCalendarConfig, ReleaseDate } from '../types';

/**
 * Product interface matching PIM API product structure
 */
interface Product {
  uuid: string;
  identifier: string;
  family?: string;
  categories?: string[];
  enabled: boolean;
  values?: {
    [key: string]: any;
  };
  completenesses?: Array<{
    locale: string;
    scope?: string;
    data: number;
  }>;
}

/**
 * Find the nearest go-live date from a collection of dates
 * @param goLiveDates - Object mapping locales to date strings
 * @param onlyFuture - If true, only consider future dates (including today)
 * @returns Object with locale and date, or null if no dates found
 */
export function findNearestGoLiveDate(
  goLiveDates: { [locale: string]: string | null },
  onlyFuture: boolean = false
): { locale: string; date: Date } | null {
  const now = new Date();
  // Set to start of today for comparison (midnight)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dates = Object.entries(goLiveDates)
    .filter(([_, dateStr]) => dateStr !== null)
    .map(([locale, dateStr]) => ({ locale, date: new Date(dateStr!) }))
    .filter(({ date }) => !onlyFuture || date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return dates.length > 0 ? dates[0] : null;
}

/**
 * Infers the current release stage of a product based on:
 * - Completeness per locale
 * - Presence of required attributes
 * - Validation status
 * - Go-live dates
 */
export function inferProductStage(
  product: Product,
  config: ReleaseCalendarConfig
): ReleaseStage {
  const masterCompleteness = getMasterCompleteness(product, config);
  const localizationComplete = checkLocalizationComplete(product, config);
  const hasFutureGoLiveDate = checkHasFutureGoLiveDate(product, config);
  const hasPassedGoLiveDate = checkHasPassedGoLiveDate(product, config);
  const isMasterValidated = checkIsValidated(product, config, config.masterLocale);
  const areAllLocalesValidated = checkAreAllLocalesValidated(product, config);

  // Stage 7: Live - product has passed go-live date
  if (hasPassedGoLiveDate) {
    return ReleaseStage.LIVE;
  }

  // Stage 6: Ready to Go Live - all locales validated, waiting for go-live date
  if (areAllLocalesValidated && hasFutureGoLiveDate) {
    return ReleaseStage.GO_LIVE;
  }

  // Stage 5: Global Validation - master validated, all locales complete, but not all validated
  if (isMasterValidated && localizationComplete && !areAllLocalesValidated) {
    return ReleaseStage.GLOBAL_VALIDATION;
  }

  // Stage 4: Localization - master validated, working on translations
  if (isMasterValidated && !localizationComplete) {
    return ReleaseStage.LOCALIZATION;
  }

  // Stage 3: Master Validation - master enrichment complete, awaiting validation
  if (masterCompleteness >= config.thresholds.masterEnrichment && !isMasterValidated) {
    return ReleaseStage.MASTER_VALIDATION;
  }

  // Stage 2: Master Enrichment - adding information and visuals in master locale
  if (masterCompleteness > 0) {
    return ReleaseStage.MASTER_ENRICHMENT;
  }

  // Stage 1: Creation - product exists but is empty
  return ReleaseStage.CREATION;
}

/**
 * Get completeness for master locale
 */
function getMasterCompleteness(product: Product, config: ReleaseCalendarConfig): number {
  console.log("product", product);
  console.log("product completenesse", product.completenesses);
  if (!product.completenesses) return 0;

  console.log("config", config);
  const masterCompleteness = product.completenesses.find(
    (c: any) =>
      c.locale === config.masterLocale &&
      (!config.channel || c.scope === config.channel)
  );

  console.log("master completenesse",masterCompleteness);
  return masterCompleteness?.data || 0;
}

/**
 * Check if product has required master attributes filled
 */
function checkRequiredAttributes(product: Product, config: ReleaseCalendarConfig): boolean {
  if (!product.values || config.masterRequiredAttributes.length === 0) {
    return false;
  }

  return config.masterRequiredAttributes.every((attrCode) => {
    const attrValue = product.values![attrCode];
    if (!attrValue) return false;

    // Check if master locale value exists
    const masterValue = Array.isArray(attrValue)
      ? attrValue.find((v: any) =>
          !v.locale || v.locale === config.masterLocale
        )
      : attrValue;

    // Check if value is not empty
    if (!masterValue) return false;
    if (masterValue.data === null || masterValue.data === undefined) return false;
    if (typeof masterValue.data === 'string' && masterValue.data.trim() === '') return false;
    if (Array.isArray(masterValue.data) && masterValue.data.length === 0) return false;

    return true;
  });
}

/**
 * Check if product has images
 */
function checkHasImages(product: Product, config: ReleaseCalendarConfig): boolean {
  if (!product.values || config.imageAttributes.length === 0) {
    return false;
  }

  return config.imageAttributes.some((attrCode) => {
    const attrValue = product.values![attrCode];
    if (!attrValue) return false;

    // For simple media attributes
    if (Array.isArray(attrValue)) {
      const masterImage = attrValue.find((v: any) =>
        !v.locale || v.locale === config.masterLocale
      );
      return masterImage && masterImage.data && masterImage.data.length > 0;
    }

    // For asset collection attributes
    if (attrValue.data && Array.isArray(attrValue.data)) {
      return attrValue.data.length > 0;
    }

    return false;
  });
}

/**
 * Check if localization is complete for all target locales
 */
function checkLocalizationComplete(product: Product, config: ReleaseCalendarConfig): boolean {
  if (!product.completenesses || config.targetLocales.length === 0) {
    return false;
  }

  return config.targetLocales.every((locale) => {
    const localeCompleteness = product.completenesses?.find(
      (c: any) =>
        c.locale === locale &&
        (!config.channel || c.scope === config.channel)
    );

    return (localeCompleteness?.data || 0) >= config.thresholds.localization;
  });
}

/**
 * Check if a product is validated for a specific locale
 * Validation is determined by the presence of a value in the validationAttribute
 */
function checkIsValidated(product: Product, config: ReleaseCalendarConfig, locale: string): boolean {
  if (!product.values || !config.validationAttribute) {
    return false;
  }

  const validationAttr = product.values[config.validationAttribute];
  if (!validationAttr) return false;

  // Handle array of values (localizable/scopable attributes)
  if (Array.isArray(validationAttr)) {
    const localeValue = validationAttr.find((v: any) =>
      v.locale === locale &&
      (!config.channel || !v.scope || v.scope === config.channel)
    );
    return localeValue && localeValue.data !== null && localeValue.data !== '';
  }

  // Handle single value
  return validationAttr.data !== null && validationAttr.data !== '';
}

/**
 * Check if all target locales are validated
 */
function checkAreAllLocalesValidated(product: Product, config: ReleaseCalendarConfig): boolean {
  if (!config.targetLocales || config.targetLocales.length === 0) {
    return false;
  }

  // Check if master locale is validated
  const isMasterValidated = checkIsValidated(product, config, config.masterLocale);
  if (!isMasterValidated) return false;

  // Check if all target locales are validated
  return config.targetLocales.every((locale) =>
    checkIsValidated(product, config, locale)
  );
}

/**
 * Check if product has a future go-live date
 */
function checkHasFutureGoLiveDate(product: Product, config: ReleaseCalendarConfig): boolean {
  const goLiveDates = extractGoLiveDates(product, config);
  const now = new Date();

  return Object.values(goLiveDates).some((dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date > now;
  });
}

/**
 * Check if product has passed its go-live date
 */
function checkHasPassedGoLiveDate(product: Product, config: ReleaseCalendarConfig): boolean {
  const goLiveDates = extractGoLiveDates(product, config);
  const now = new Date();

  return Object.values(goLiveDates).some((dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date <= now;
  });
}

/**
 * Check if a product belongs to a specific category
 * In Akeneo, products can belong to multiple categories in a tree structure
 */
function isProductInCategory(product: Product, categoryCode: string): boolean {
  if (!product.categories || !categoryCode) return false;
  return product.categories.includes(categoryCode);
}

/**
 * Check if a release date matches a product for a given locale
 * All specified criteria must match for the release date to be valid
 */
function doesReleaseDateMatch(
  releaseDate: ReleaseDate,
  product: Product,
  locale: string,
  config: ReleaseCalendarConfig
): boolean {
  // Check family match (if specified)
  if (releaseDate.family && releaseDate.family !== product.family) {
    return false;
  }

  // Check locale match (if specified)
  if (releaseDate.locale && releaseDate.locale !== locale) {
    return false;
  }

  // Check category match (if specified)
  if (releaseDate.category && !isProductInCategory(product, releaseDate.category)) {
    return false;
  }

  // Check channel match (if specified)
  if (releaseDate.channel && releaseDate.channel !== config.channel) {
    return false;
  }

  // All specified criteria match
  return true;
}

/**
 * Extract go-live dates per locale from configured release dates
 * Uses priority-based matching: first release date that matches wins
 * If no release date matches, returns null (product won't appear on calendar)
 */
export function extractGoLiveDates(
  product: Product,
  config: ReleaseCalendarConfig
): { [locale: string]: string | null } {
  const dates: { [locale: string]: string | null } = {};

  // Get all relevant locales
  const allLocales = [config.masterLocale, ...config.targetLocales];

  // Match release dates to product using priority order
  for (const locale of allLocales) {
    let matchedDate: string | null = null;

    // Find the first release date that matches (priority order)
    for (const releaseDate of config.releaseDates) {
      if (doesReleaseDateMatch(releaseDate, product, locale, config)) {
        matchedDate = releaseDate.date;
        break; // First match wins
      }
    }

    dates[locale] = matchedDate;
  }

  return dates;
}

/**
 * Extract completeness per locale
 */
export function extractCompletenessPerLocale(
  product: Product,
  config: ReleaseCalendarConfig
): { [locale: string]: number } {
  const completenessMap: { [locale: string]: number } = {};

  if (!product.completenesses) return completenessMap;

  const locales = [config.masterLocale, ...config.targetLocales];

  locales.forEach((locale) => {
    const completeness = product.completenesses?.find(
      (c: any) =>
        c.locale === locale &&
        (!config.channel || c.scope === config.channel)
    );

    completenessMap[locale] = completeness?.data || 0;
  });

  console.log(product.uuid, completenessMap);
  return completenessMap;
}

/**
 * Determine if product is at risk (missing critical items near go-live date)
 */
export function isProductAtRisk(
  product: Product,
  currentStage: ReleaseStage,
  config: ReleaseCalendarConfig
): { isAtRisk: boolean; missingItems: string[] } {
  const missingItems: string[] = [];
  const goLiveDates = extractGoLiveDates(product, config);
  const now = new Date();

  // Find nearest future go-live date
  const nearestDateInfo = findNearestGoLiveDate(goLiveDates, true);

  // If no future go-live date, not at risk
  if (!nearestDateInfo) {
    return { isAtRisk: false, missingItems: [] };
  }

  // Check if within 7 days of go-live
  const daysUntilGoLive = Math.ceil((nearestDateInfo.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isNearGoLive = daysUntilGoLive <= 7;

  // Check what's missing based on current stage
  if (isNearGoLive) {
    const masterCompleteness = getMasterCompleteness(product, config);
    const hasImages = checkHasImages(product, config);
    const localizationComplete = checkLocalizationComplete(product, config);

    if (masterCompleteness < config.thresholds.masterValidation) {
      missingItems.push(`Master completeness (${masterCompleteness}% / ${config.thresholds.masterValidation}%)`);
    }

    if (!hasImages) {
      missingItems.push('Master visuals');
    }

    if (!localizationComplete) {
      config.targetLocales.forEach((locale) => {
        const localeComp = extractCompletenessPerLocale(product, config)[locale] || 0;
        if (localeComp < config.thresholds.localization) {
          missingItems.push(`${locale} translation (${localeComp}%)`);
        }
      });
    }

    if (currentStage !== ReleaseStage.GO_LIVE && currentStage !== ReleaseStage.LIVE) {
      missingItems.push('Validation incomplete');
    }
  }

  return {
    isAtRisk: missingItems.length > 0,
    missingItems,
  };
}

/**
 * Determine which locales are live (have passed their go-live date)
 */
export function getLiveLocales(
  product: Product,
  config: ReleaseCalendarConfig
): string[] {
  const goLiveDates = extractGoLiveDates(product, config);
  const now = new Date();
  const liveLocales: string[] = [];

  Object.entries(goLiveDates).forEach(([locale, dateStr]) => {
    if (!dateStr) return;
    const date = new Date(dateStr);
    if (date <= now) {
      liveLocales.push(locale);
    }
  });

  return liveLocales;
}
