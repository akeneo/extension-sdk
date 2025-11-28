/**
 * Release date configuration
 */
export interface ReleaseDate {
  date: string; // ISO date string (YYYY-MM-DD)
  locale?: string;
  family?: string;
  category?: string;
  channel?: string;
}

/**
 * Configuration interface
 */
export interface ReleaseCalendarConfig {
  releaseDates: ReleaseDate[];
  masterLocale: string;
  targetLocales: string[];
  masterRequiredAttributes: string[];
  imageAttributes: string[];
  validationStatusAttribute?: string;
  centralValidationAttribute?: string;
  imageAssetFamily?: string;
  channel?: string;
  thresholds: {
    masterEnrichment: number;
    masterVisuals: number;
    masterValidation: number;
    localization: number;
    centralValidation: number;
  };
}

/**
 * Release stages
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
 * Stage configuration
 */
export const STAGE_CONFIG = {
  [ReleaseStage.CREATION]: {
    label: 'Creation',
    color: '#E0E0E0',
    description: 'Product page created',
  },
  [ReleaseStage.MASTER_ENRICHMENT]: {
    label: 'Master Enrichment',
    color: '#FFE082',
    description: 'Adding information in master locale',
  },
  [ReleaseStage.MASTER_VISUALS]: {
    label: 'Master Visuals',
    color: '#FFB74D',
    description: 'Adding visuals',
  },
  [ReleaseStage.MASTER_VALIDATION]: {
    label: 'Master Validation',
    color: '#81C784',
    description: 'Master content validation',
  },
  [ReleaseStage.LOCALIZATION]: {
    label: 'Localization',
    color: '#64B5F6',
    description: 'Translations + visuals',
  },
  [ReleaseStage.CENTRAL_VALIDATION]: {
    label: 'Central Validation',
    color: '#4DB6AC',
    description: 'Central validation',
  },
  [ReleaseStage.GO_LIVE]: {
    label: 'Ready to Go Live',
    color: '#9575CD',
    description: 'Awaiting publication',
  },
  [ReleaseStage.LIVE]: {
    label: 'Live',
    color: '#66BB6A',
    description: 'Published',
  },
};

/**
 * Product interface
 */
export interface Product {
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
  created?: string;
  updated?: string;
}

/**
 * Due date status for a locale
 */
export interface LocaleDueDate {
  locale: string;
  dueDate: string | null;
  currentStage: ReleaseStage;
  completeness: number;
  isAtRisk: boolean;
  daysUntilDue: number | null;
  isOverdue: boolean;
  missingItems: string[];
}
