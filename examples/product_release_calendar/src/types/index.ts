/**
 * Release date configuration
 * Defines when products should go live based on locale, family, category, or channel
 */
export interface ReleaseDate {
  date: string; // ISO date string (YYYY-MM-DD)
  locale?: string; // Optional: specific locale
  family?: string; // Optional: specific family
  category?: string; // Optional: specific category
  channel?: string; // Optional: specific channel/scope
}

/**
 * Display mode for the extension
 */
export enum DisplayMode {
  BOARD = 'board', // Full board view for activity.navigation.tab
  PANEL = 'panel'  // Simplified panel view for product.panel
}

/**
 * Configuration interface for the Product Release Calendar
 * Maps PIM-agnostic concepts to specific PIM attributes using custom_variables
 */
export interface ReleaseCalendarConfig {
  // Release dates configuration
  releaseDates: ReleaseDate[];

  // Master locale for initial content creation
  masterLocale: string;

  // Target locales for translations
  targetLocales: string[];

  // Attribute code for validation status (localizable, scopable)
  // This attribute will be filled when validation buttons are clicked
  validationAttribute: string;

  // Completeness thresholds per stage
  thresholds: {
    masterEnrichment: number; // e.g., 50
    localization: number; // e.g., 90 per locale
  };

  // Optional: Channel to consider for completeness
  channel?: string;

  // Display mode: 'board' for full view, 'panel' for simplified product view
  displayMode?: DisplayMode;
}

/**
 * Release stages enum
 */
export enum ReleaseStage {
  CREATION = 'creation',
  MASTER_ENRICHMENT = 'master_enrichment',
  MASTER_VALIDATION = 'master_validation',
  LOCALIZATION = 'localization',
  GLOBAL_VALIDATION = 'global_validation',
  GO_LIVE = 'go_live',
  LIVE = 'live'
}

/**
 * Stage display configuration
 */
export const STAGE_CONFIG = {
  [ReleaseStage.CREATION]: {
    label: 'Creation',
    color: '#E0E0E0',
    description: 'Product page created (empty)',
  },
  [ReleaseStage.MASTER_ENRICHMENT]: {
    label: 'Master Enrichment',
    color: '#FFE082',
    description: 'Adding information and visuals in master locale',
  },
  [ReleaseStage.MASTER_VALIDATION]: {
    label: 'Master Validation',
    color: '#FFB74D',
    description: 'Master content ready for validation',
  },
  [ReleaseStage.LOCALIZATION]: {
    label: 'Localization',
    color: '#64B5F6',
    description: 'Translations and visuals for other locales',
  },
  [ReleaseStage.GLOBAL_VALIDATION]: {
    label: 'Global Validation',
    color: '#4DB6AC',
    description: 'All locales ready for validation',
  },
  [ReleaseStage.GO_LIVE]: {
    label: 'Ready to Go Live',
    color: '#9575CD',
    description: 'Validated and awaiting publication',
  },
  [ReleaseStage.LIVE]: {
    label: 'Live',
    color: '#66BB6A',
    description: 'Published on channels',
  },
};

/**
 * Base Product interface (from PIM API)
 */
interface BaseProduct {
  uuid: string;
  identifier: string;
  family?: string;
  categories?: string[]; // Array of category codes
  enabled: boolean;
  values?: {
    [key: string]: any;
  };
  completenesses?: Array<{
    locale: string;
    scope?: string;
    data: number;
  }>;
  created?: string;
  updated?: string;
}

/**
 * Product with release tracking information
 */
export interface ProductWithRelease extends BaseProduct {
  // Current stage in the release pipeline
  currentStage: ReleaseStage;

  // Completeness per locale
  completenessPerLocale: {
    [locale: string]: number;
  };

  // Go-live dates per locale (from scopable attribute)
  goLiveDates: {
    [locale: string]: string | null;
  };

  // Whether product has passed validation checkpoints
  validation: {
    masterValidated: boolean;
    centralValidated: boolean;
  };

  // Which locales are live
  liveLocales: string[];

  // Risk indicators
  isAtRisk: boolean;
  missingItems: string[];
}

/**
 * View mode for the calendar
 */
export enum ViewMode {
  PIPELINE = 'pipeline',
  TIMELINE = 'timeline',
}

/**
 * Filter state
 */
export interface FilterState {
  family: string;  // Required - always has a family selected
  category?: string;
  stage?: ReleaseStage;
  locale?: string;
  searchQuery?: string;
}
