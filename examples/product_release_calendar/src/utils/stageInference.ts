import { ReleaseStage, ReleaseCalendarConfig } from '../types';

/**
 * Product interface matching PIM API product structure
 */
interface Product {
  uuid: string;
  identifier: string;
  family?: string;
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
  const hasRequiredAttributes = checkRequiredAttributes(product, config);
  const hasImages = checkHasImages(product, config);
  const localizationComplete = checkLocalizationComplete(product, config);
  const hasFutureGoLiveDate = checkHasFutureGoLiveDate(product, config);
  const hasPassedGoLiveDate = checkHasPassedGoLiveDate(product, config);

  // Stage 8: Live - product has passed go-live date and is published
  if (hasPassedGoLiveDate && masterCompleteness >= config.thresholds.centralValidation) {
    return ReleaseStage.LIVE;
  }

  // Stage 7: Ready to Go Live - all validations done, waiting for go-live date
  if (
    masterCompleteness >= config.thresholds.centralValidation &&
    localizationComplete &&
    hasFutureGoLiveDate
  ) {
    return ReleaseStage.GO_LIVE;
  }

  // Stage 6: Central Validation - all locales enriched, final validation
  if (
    masterCompleteness >= config.thresholds.masterValidation &&
    localizationComplete
  ) {
    return ReleaseStage.CENTRAL_VALIDATION;
  }

  // Stage 5: Localization - master is validated, working on translations
  if (
    masterCompleteness >= config.thresholds.masterValidation &&
    hasImages &&
    !localizationComplete
  ) {
    return ReleaseStage.LOCALIZATION;
  }

  // Stage 4: Master Validation - master content + images complete
  if (
    masterCompleteness >= config.thresholds.masterVisuals &&
    hasImages &&
    hasRequiredAttributes
  ) {
    return ReleaseStage.MASTER_VALIDATION;
  }

  // Stage 3: Master Visuals - master content present, adding images
  if (
    masterCompleteness >= config.thresholds.masterEnrichment &&
    hasRequiredAttributes &&
    !hasImages
  ) {
    return ReleaseStage.MASTER_VISUALS;
  }

  // Stage 2: Master Enrichment - adding basic information in master locale
  if (masterCompleteness > 0 && masterCompleteness < config.thresholds.masterVisuals) {
    return ReleaseStage.MASTER_ENRICHMENT;
  }

  // Stage 1: Creation - product exists but is empty
  return ReleaseStage.CREATION;
}

/**
 * Get completeness for master locale
 */
function getMasterCompleteness(product: Product, config: ReleaseCalendarConfig): number {
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
 * Extract go-live dates per locale from configured release dates
 * Matches products against release dates based on family, locale, and channel
 */
export function extractGoLiveDates(
  product: Product,
  config: ReleaseCalendarConfig
): { [locale: string]: string | null } {
  const dates: { [locale: string]: string | null } = {};

  // Get all relevant locales
  const allLocales = [config.masterLocale, ...config.targetLocales];

  // Match release dates to product
  allLocales.forEach((locale) => {
    // Try to find a matching release date with most specific criteria first

    // 1. Match by family + locale + channel (most specific)
    let matchedDate = config.releaseDates.find(
      (rd) =>
        rd.family === product.family &&
        rd.locale === locale &&
        rd.channel === config.channel
    );

    // 2. Match by family + locale
    if (!matchedDate) {
      matchedDate = config.releaseDates.find(
        (rd) => rd.family === product.family && rd.locale === locale && !rd.channel
      );
    }

    // 3. Match by locale + channel
    if (!matchedDate) {
      matchedDate = config.releaseDates.find(
        (rd) => !rd.family && rd.locale === locale && rd.channel === config.channel
      );
    }

    // 4. Match by locale only
    if (!matchedDate) {
      matchedDate = config.releaseDates.find(
        (rd) => !rd.family && rd.locale === locale && !rd.channel
      );
    }

    // 5. Match by family + channel (applies to all locales)
    if (!matchedDate) {
      matchedDate = config.releaseDates.find(
        (rd) => rd.family === product.family && !rd.locale && rd.channel === config.channel
      );
    }

    // 6. Match by family only (applies to all locales)
    if (!matchedDate) {
      matchedDate = config.releaseDates.find(
        (rd) => rd.family === product.family && !rd.locale && !rd.channel
      );
    }

    // 7. Match by channel only (applies to all locales and families)
    if (!matchedDate) {
      matchedDate = config.releaseDates.find(
        (rd) => !rd.family && !rd.locale && rd.channel === config.channel
      );
    }

    // 8. Default release date (no criteria)
    if (!matchedDate) {
      matchedDate = config.releaseDates.find(
        (rd) => !rd.family && !rd.locale && !rd.channel
      );
    }

    dates[locale] = matchedDate ? matchedDate.date : null;
  });

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

  // Find nearest go-live date
  let nearestDate: Date | null = null;
  Object.values(goLiveDates).forEach((dateStr: string | null) => {
    if (!dateStr) return;
    const date: Date = new Date(dateStr);
    if (date > now && (!nearestDate || date.getTime() < nearestDate.getTime())) {
      nearestDate = date;
    }
  });

  // If no future go-live date, not at risk
  if (!nearestDate) {
    return { isAtRisk: false, missingItems: [] };
  }

  // Check if within 7 days of go-live
  const nearestDateValue: Date = nearestDate as Date;
  const daysUntilGoLive = Math.ceil((nearestDateValue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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
