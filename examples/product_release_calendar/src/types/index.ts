/**
 * Configuration interface for the Product Release Calendar
 * Maps PIM-agnostic concepts to specific PIM attributes using custom_variables
 */
export interface ReleaseCalendarConfig {
  // Date attribute for go-live (should be scopable per locale/channel)
  goLiveDateAttribute: string;

  // Master locale for initial content creation
  masterLocale: string;

  // Target locales for translations
  targetLocales: string[];

  // Optional: Attribute that stores validation status
  validationStatusAttribute?: string;

  // Optional: Attribute that stores central validation status
  centralValidationAttribute?: string;

  // Required attributes for master enrichment stage
  masterRequiredAttributes: string[];

  // Image/asset attributes for visuals
  imageAttributes: string[];

  // Asset family for images (if using Asset Manager)
  imageAssetFamily?: string;

  // Completeness thresholds per stage
  thresholds: {
    masterEnrichment: number; // e.g., 50
    masterVisuals: number; // e.g., 70
    masterValidation: number; // e.g., 90
    localization: number; // e.g., 90 per locale
    centralValidation: number; // e.g., 100
  };

  // Optional: Channel to consider for completeness
  channel?: string;
}

/**
 * Release stages enum
 */
export enum ReleaseStage {
  CREATION = 'creation',
  MASTER_ENRICHMENT = 'master_enrichment',
  MASTER_VISUALS = 'master_visuals',
  MASTER_VALIDATION = 'master_validation',
  LOCALIZATION = 'localization',
  CENTRAL_VALIDATION = 'central_validation',
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
    description: 'Adding information in master locale',
  },
  [ReleaseStage.MASTER_VISUALS]: {
    label: 'Master Visuals',
    color: '#FFB74D',
    description: 'Adding visuals for master locale',
  },
  [ReleaseStage.MASTER_VALIDATION]: {
    label: 'Master Validation',
    color: '#81C784',
    description: 'Master content validation',
  },
  [ReleaseStage.LOCALIZATION]: {
    label: 'Localization',
    color: '#64B5F6',
    description: 'Translations + visuals for other locales',
  },
  [ReleaseStage.CENTRAL_VALIDATION]: {
    label: 'Central Validation',
    color: '#4DB6AC',
    description: 'Central validation across all locales',
  },
  [ReleaseStage.GO_LIVE]: {
    label: 'Ready to Go Live',
    color: '#9575CD',
    description: 'Awaiting publication by webmaster',
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
  enabled: boolean;
  values?: {
    [key: string]: any;
  };
  completenesses?: Array<{
    locale: string;
    channel?: string;
    ratio: number;
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
  family?: string;
  stage?: ReleaseStage;
  locale?: string;
  searchQuery?: string;
}
