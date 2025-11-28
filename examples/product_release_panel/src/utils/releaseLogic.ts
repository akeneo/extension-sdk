import {
  ReleaseStage,
  ReleaseCalendarConfig,
  ReleaseDate,
  Product,
  LocaleDueDate,
} from '../types';

/**
 * Check if a product belongs to a category
 */
function isProductInCategory(product: Product, categoryCode: string): boolean {
  if (!product.categories || !categoryCode) return false;
  return product.categories.includes(categoryCode);
}

/**
 * Check if a release date matches a product for a given locale
 */
function doesReleaseDateMatch(
  releaseDate: ReleaseDate,
  product: Product,
  locale: string,
  config: ReleaseCalendarConfig
): boolean {
  if (releaseDate.family && releaseDate.family !== product.family) {
    return false;
  }
  if (releaseDate.locale && releaseDate.locale !== locale) {
    return false;
  }
  if (releaseDate.category && !isProductInCategory(product, releaseDate.category)) {
    return false;
  }
  if (releaseDate.channel && releaseDate.channel !== config.channel) {
    return false;
  }
  return true;
}

/**
 * Extract go-live date for a specific locale
 */
function extractGoLiveDateForLocale(
  product: Product,
  locale: string,
  config: ReleaseCalendarConfig
): string | null {
  for (const releaseDate of config.releaseDates) {
    if (doesReleaseDateMatch(releaseDate, product, locale, config)) {
      return releaseDate.date;
    }
  }
  return null;
}

/**
 * Get completeness for a locale
 */
function getCompletenessForLocale(
  product: Product,
  locale: string,
  config: ReleaseCalendarConfig
): number {
  if (!product.completenesses) return 0;

  const completeness = product.completenesses.find(
    (c: any) =>
      c.locale === locale && (!config.channel || c.scope === config.channel)
  );

  return completeness?.data || 0;
}

/**
 * Infer stage for a locale
 */
function inferStageForLocale(
  product: Product,
  locale: string,
  config: ReleaseCalendarConfig,
  dueDate: string | null
): ReleaseStage {
  const completeness = getCompletenessForLocale(product, locale, config);

  // Check if live (passed due date)
  if (dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    if (due <= now && completeness >= config.thresholds.centralValidation) {
      return ReleaseStage.LIVE;
    }
  }

  // Check stages based on completeness
  if (completeness >= config.thresholds.centralValidation) {
    return ReleaseStage.GO_LIVE;
  }
  if (completeness >= config.thresholds.localization) {
    return ReleaseStage.CENTRAL_VALIDATION;
  }
  if (completeness >= config.thresholds.masterValidation) {
    return ReleaseStage.LOCALIZATION;
  }
  if (completeness >= config.thresholds.masterVisuals) {
    return ReleaseStage.MASTER_VALIDATION;
  }
  if (completeness >= config.thresholds.masterEnrichment) {
    return ReleaseStage.MASTER_VISUALS;
  }
  if (completeness > 0) {
    return ReleaseStage.MASTER_ENRICHMENT;
  }

  return ReleaseStage.CREATION;
}

/**
 * Get missing items for a locale
 */
function getMissingItems(
  product: Product,
  locale: string,
  config: ReleaseCalendarConfig,
  currentStage: ReleaseStage
): string[] {
  const missing: string[] = [];
  const completeness = getCompletenessForLocale(product, locale, config);

  if (completeness < 100) {
    missing.push(`${Math.round(100 - completeness)}% content incomplete`);
  }

  // Check if we need validation
  if (
    [ReleaseStage.CREATION, ReleaseStage.MASTER_ENRICHMENT, ReleaseStage.MASTER_VISUALS].includes(
      currentStage
    )
  ) {
    missing.push('Validation pending');
  }

  return missing;
}

/**
 * Calculate due date information for all locales
 */
export function calculateDueDates(
  product: Product,
  config: ReleaseCalendarConfig
): LocaleDueDate[] {
  const allLocales = [config.masterLocale, ...config.targetLocales];
  const now = new Date();
  const results: LocaleDueDate[] = [];

  for (const locale of allLocales) {
    const dueDate = extractGoLiveDateForLocale(product, locale, config);

    // Skip locales without due dates
    if (!dueDate) continue;

    const due = new Date(dueDate);
    const completeness = getCompletenessForLocale(product, locale, config);
    const currentStage = inferStageForLocale(product, locale, config, dueDate);
    const missingItems = getMissingItems(product, locale, config, currentStage);

    const diffTime = due.getTime() - now.getTime();
    const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0;
    const isAtRisk = daysUntilDue <= 7 && daysUntilDue >= 0 && missingItems.length > 0;

    results.push({
      locale,
      dueDate,
      currentStage,
      completeness,
      isAtRisk,
      daysUntilDue,
      isOverdue,
      missingItems,
    });
  }

  return results;
}
