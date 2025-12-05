# Product Release Calendar

A comprehensive example demonstrating how to build a multi-stage product release tracking system using the Akeneo PIM Extension SDK. This example showcases advanced features including custom_variables for configuration mapping, completeness-based stage inference, multi-locale support, and dual view modes (pipeline and timeline).

## Overview

The Product Release Calendar helps merchandising and product teams track products through their journey from creation to publication across multiple locales. It's designed to work with any PIM configuration by using `custom_variables` to map the calendar concepts to your specific PIM attributes.

## Features

### Core Functionality

- **Multi-Stage Pipeline**: Tracks products through 6 active stages with validation workflows:
  1. **Creation** - Product page created (empty)
  2. **Master Enrichment** - Adding information in master locale
  3. **Master Validation** - Master content ready for validation (shows validation button)
  4. **Localization** - Working on translations for other locales
  5. **Global Validation** - All locales ready for validation (shows validate all button)
  6. **Ready to Go Live** - Fully validated and awaiting publication (shows go-live button)

  **Note**: A 7th stage "Live" is reserved for future implementation (automatic status based on go-live date or external API integration)

- **Dual Display Modes**:
  - **Board Mode** (`displayMode: "board"`): Full-featured view for activity.navigation.tab position
    - **Pipeline View**: Kanban-style board showing products grouped by current stage
    - **Timeline View**: Calendar view showing products by their go-live dates
    - Complete statistics, filters, and bulk product management
  - **Panel Mode** (`displayMode: "panel"`): Simplified view for product.panel position
    - Shows current product's release status and stage
    - Displays all release dates per locale
    - Shows completeness per locale with progress bars
    - Lists missing items needed to complete stages
    - Displays validation buttons when applicable
    - Automatically syncs with the current product being viewed

- **Multi-Locale Support**: Track completeness and go-live dates per locale
  - Locales are dynamically fetched from your PIM instance
  - Shows all enabled locales in filter dropdowns
  - No need to hardcode locale lists in configuration

## Configuration

### Custom Variables

The extension uses `custom_variables` to map to your PIM structure. Release dates are configured directly in custom_variables, allowing you to define release schedules by locale, family, category, or channel.

#### Example 1: Release Dates by Locale

```json
{
  "releaseDates": [
    { "date": "2025-12-01", "locale": "en_US" },
    { "date": "2025-12-15", "locale": "fr_FR" },
    { "date": "2025-12-15", "locale": "de_DE" },
    { "date": "2025-12-20", "locale": "es_ES" }
  ],
  "masterLocale": "en_US",
  "targetLocales": ["fr_FR", "de_DE", "es_ES"],
  "validationAttribute": "validation_status",
  "displayLabelAttribute": "name",
  "channel": "ecommerce",
  "thresholdMasterEnrichment": 40,
  "thresholdLocalization": 80,
  "displayMode": "board"
}
```

#### Example 2: Release Dates by Family

```json
{
  "releaseDates": [
    { "date": "2025-11-15", "family": "winter_collection" },
    { "date": "2025-12-01", "family": "holiday_specials" },
    { "date": "2026-01-15", "family": "new_year_products" },
    { "date": "2025-12-10" }
  ],
  "masterLocale": "en_GB",
  "targetLocales": ["fr_FR", "de_DE", "it_IT", "es_ES"],
  "validationAttribute": "validation_status",
  "channel": "website",
  "thresholdMasterEnrichment": 50,
  "thresholdLocalization": 85,
  "displayMode": "board"
}
```

#### Example 3: Mixed Release Dates (Family + Locale)

```json
{
  "releaseDates": [
    { "date": "2025-11-15", "family": "shoes", "locale": "en_US" },
    { "date": "2025-11-20", "family": "shoes", "locale": "fr_FR" },
    { "date": "2025-12-01", "family": "accessories" },
    { "date": "2025-12-15", "locale": "de_DE" },
    { "date": "2026-01-01" }
  ],
  "masterLocale": "en_US",
  "targetLocales": ["fr_FR", "de_DE", "es_ES"],
  "validationAttribute": "validation_status",
  "channel": "ecommerce",
  "thresholdMasterEnrichment": 40,
  "thresholdLocalization": 75,
  "displayMode": "board"
}
```

#### Example 4: Advanced - Categories and Combined Parameters

```json
{
  "releaseDates": [
    { "date": "2025-11-01", "family": "camcoders", "category": "lenovo", "locale": "en_US", "channel": "ecommerce" },
    { "date": "2025-11-15", "family": "camcoders", "locale": "en_US" },
    { "date": "2025-12-01", "category": "sony", "locale": "fr_FR" },
    { "date": "2026-01-10", "family": "loudspeakers" },
    { "date": "2026-02-15", "locale": "de_DE" }
  ],
  "masterLocale": "en_US",
  "targetLocales": ["fr_FR", "de_DE", "es_ES", "it_IT"],
  "validationAttribute": "validation_status",
  "channel": "ecommerce",
  "thresholdMasterEnrichment": 50,
  "thresholdLocalization": 85,
  "displayMode": "board"
}
```

In this example (priority order):
1. Products in the "cameras" family within the "digital_cameras" category for "en_US" on "ecommerce" channel → **Nov 1** (most specific)
2. Products in "cameras" family for "en_US" (any category) → **Nov 15**
3. Products in "digital_cameras" category for "fr_FR" (any family) → **Dec 1**
4. All other "cameras" products → **Jan 10**
5. All other "de_DE" locale products → **Feb 15**
6. Products that don't match any rule → **Not shown on calendar**

#### Example 5: Panel Mode Configuration

For product.panel position (simplified view showing current product):

```json
{
  "releaseDates": [
    { "date": "2025-12-01", "locale": "en_US" },
    { "date": "2025-12-15", "locale": "fr_FR" },
    { "date": "2025-12-20", "locale": "de_DE" }
  ],
  "masterLocale": "en_US",
  "targetLocales": ["fr_FR", "de_DE", "es_ES"],
  "validationAttribute": "validation_status",
  "channel": "ecommerce",
  "thresholdMasterEnrichment": 40,
  "thresholdLocalization": 80,
  "displayMode": "panel"
}
```

**Panel mode features:**
- Shows current product's stage and status with color-coded indicators
- Displays all release dates per locale
- Shows completeness progress bars per locale with validation indicators (checkmark icons)
- Lists missing items to complete stages
- Displays validation buttons when product is ready for validation
- Shows success messages using Akeneo Design System message bars
- Automatically updates when viewing different products

### Configuration Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `releaseDates` | ReleaseDate[] | Yes | Array of release date configurations (see below) |
| `masterLocale` | string | Yes | Master locale code for initial content creation |
| `targetLocales` | string[] | Yes | Array of target locale codes for translations |
| `validationAttribute` | string | Yes | Attribute code for validation status (yes/no type, localizable, scopable) |
| `displayLabelAttribute` | string | No | Attribute code to use as display label on product cards and dots. Falls back to product identifier if not specified or value is empty. Prioritizes master locale for localizable attributes. |
| `channel` | string | No | Channel code to use for completeness calculations |
| `thresholdMasterEnrichment` | number | No | Completeness % threshold to reach master validation stage (default: 40) |
| `thresholdLocalization` | number | No | Completeness % threshold for localization per locale (default: 80) |
| `displayMode` | string | No | Display mode: "board" for full view (activity.navigation.tab) or "panel" for simplified product view (product.panel) (default: "board") |

#### ReleaseDate Object

Each release date object can specify:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | Yes | ISO date string (YYYY-MM-DD) for the release |
| `locale` | string | No | Specific locale for this release date |
| `family` | string | No | Specific product family for this release date |
| `category` | string | No | Specific category for this release date |
| `channel` | string | No | Specific channel/scope for this release date |

**Matching System**: The system uses a **priority-based matching** system:

- Release dates are evaluated **in order** (top to bottom in the array)
- The **first release date** where ALL specified criteria match is used
- For a match to occur, ALL specified criteria must match the product:
  - If `family` is specified, product must be in that family
  - If `locale` is specified, it must match the locale being checked
  - If `category` is specified, product must be in that category
  - If `channel` is specified, it must match the configured channel
- If **no release date matches**, the product will **not appear** on the calendar

**Priority Order Example**:

```json
"releaseDates": [
  { "date": "2025-11-01", "family": "cameras", "category": "digital", "locale": "en_US" },  // Most specific - checked first
  { "date": "2025-11-15", "family": "cameras", "locale": "en_US" },                         // Less specific
  { "date": "2025-12-01", "family": "cameras" },                                            // Even less specific
  { "date": "2026-01-10", "locale": "en_US" }                                               // Least specific - checked last
]
```

For a product in the "cameras" family, "digital" category, for locale "en_US":
- ✅ First rule matches (all criteria match) → Use Nov 1
- Other rules are never evaluated

**Important**: Order matters! Place more specific rules first, more general rules last.

## PIM Setup Requirements

### Required Attributes

1. **Validation Attribute** (Required for workflow)
   - Type: **Yes/No** (boolean)
   - Localizable: **Yes** (required)
   - Scopable: **Yes** (required if using channels)
   - Example code: `validation_status`
   - Purpose: Tracks validation approval for each locale/channel
   - Configure in `validationAttribute` in custom_variables

## Data Loading

- Products are fetched from the PIM API based on the selected family (required) and category (optional)
- The extension fetches up to 100 products per request
- **Locales are dynamically loaded** from the PIM API (`locale_v1.list`) showing all enabled locales
- Families and categories are also fetched dynamically from the PIM
- Completeness data is retrieved for all configured locales and channels
- Release dates are applied from `custom_variables` configuration based on product family, locale, and channel
- Use the Refresh button to reload data and see the latest changes from your PIM

## How Stage Inference Works

The extension automatically determines which stage a product is in by analyzing:

1. **Completeness in Master Locale**: Primary indicator of content enrichment progress
2. **Required Attributes**: Checks if critical attributes are filled
3. **Localization Completeness**: Measures translation progress across target locales
4. **Go-Live Dates**: Determines if product is ready to go live or already live

### Stage Determination Logic

The extension automatically determines a product's stage based on completeness, validation status, and go-live dates:

```
LIVE (7) - Reserved for Future Implementation
└─ Not currently active
└─ Planned: Automatic status based on go-live date or external publishing API

READY TO GO LIVE (6)
├─ All locales validated (validation attribute = true)
├─ Has future go-live date
└─ Shows "Go Live" button (displays success message)

GLOBAL VALIDATION (5)
├─ Master locale validated
├─ All target locales completeness >= localization threshold
├─ Not all target locales validated yet
└─ Shows "Validate All Locales" button

LOCALIZATION (4)
├─ Master locale validated (validation attribute = true for master)
├─ Target locales completeness < localization threshold
└─ Working on translations

MASTER VALIDATION (3)
├─ Master completeness >= master enrichment threshold
├─ Master locale not validated yet
└─ Shows "Validate Master" button

MASTER ENRICHMENT (2)
├─ Master completeness > 0
├─ Master completeness < master enrichment threshold
└─ Adding content

CREATION (1)
└─ Product exists but is empty (0% completeness)
```



## Installation

1. **Build the Extension**:
   ```bash
   cd examples/product_release_calendar
   npm install
   npm run build
   ```

2. **Upload to PIM**:
   - Navigate to System > Extensions in your Akeneo PIM
   - Upload the built extension bundle
   - Configure the custom_variables in the extension settings

3. **Add to PIM**:
   The extension can be added to two different positions:

   **Board Mode** (Full view):
   - Position: `activity.navigation.tab`
   - Configuration: Set `displayMode: "board"`
   - Use case: Team dashboard for managing all products across the release pipeline
   - Features: Full statistics, filters, pipeline/timeline views, bulk management

   **Panel Mode** (Product view):
   - Position: `product.panel`
   - Configuration: Set `displayMode: "panel"`
   - Use case: Individual product release tracking within product edit form
   - Features: Simplified view showing current product's status, dates, and validation buttons

## Development

### Local Development

```bash
npm run dev
```

This starts a development server with hot reload.

### Build for Production

```bash
npm run build
```

Outputs optimized bundle to `dist/` directory.

**Note**: Before deploying to production, consider removing debug console.log statements from `src/utils/stageInference.ts`

### TypeScript

The project includes comprehensive TypeScript types for:
- Product release tracking
- Configuration interfaces
- Stage definitions
- Filter states

## Troubleshooting

### No Products Showing

- **Check family selection**: Ensure a family is selected. The extension requires a family to be selected before loading products.
- **Verify products exist**: Confirm that products exist in the selected family in your PIM
- **Check category filter**: If using category filter, verify products are assigned to that category
- **Check custom_variables**: Ensure `custom_variables` are correctly configured with valid attribute codes
- **Browser console**: Check the browser console for API errors or permission issues
- **User permissions**: Ensure your user has permission to view products and access the API

### Incorrect Stage Assignment

- **Verify thresholds**: Check that `thresholdMasterEnrichment` and `thresholdLocalization` match your requirements
- **Channel configuration**: Ensure the `channel` in custom_variables matches a valid scope in your PIM
- **Completeness setup**: Verify completeness is calculated correctly in your PIM for the configured channel
- **Locale configuration**: Confirm `masterLocale` and `targetLocales` match your PIM's locale setup

### Empty or Missing Product Identifiers

The extension includes a fallback mechanism for empty identifiers. If you see products without identifiers:
- Check that the `pim_catalog_identifier` attribute type exists in product values
- Verify products have identifier values set in the PIM
- Check browser console for warnings about identifier extraction
