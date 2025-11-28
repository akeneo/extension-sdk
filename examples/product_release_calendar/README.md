# Product Release Calendar

A comprehensive example demonstrating how to build a multi-stage product release tracking system using the Akeneo PIM Extension SDK. This example showcases advanced features including custom_variables for configuration mapping, completeness-based stage inference, multi-locale support, and dual view modes (pipeline and timeline).

## Overview

The Product Release Calendar helps merchandising and product teams track products through their journey from creation to publication across multiple locales. It's designed to work with any PIM configuration by using `custom_variables` to map the calendar concepts to your specific PIM attributes.

## Features

### Core Functionality

- **Multi-Stage Pipeline**: Tracks products through 8 distinct stages:
  1. Creation - Product page created (empty)
  2. Master Enrichment - Adding information in master locale (English)
  3. Master Visuals - Adding visuals for master locale
  4. Master Validation - Validation of master content
  5. Localization - Translations + visuals for other regions
  6. Central Validation - Final global validation
  7. Ready to Go Live - Awaiting publication by webmaster
  8. Live - Published on channels

- **Dual View Modes**:
  - **Pipeline View**: Kanban-style board showing products grouped by current stage. Best for monitoring workflow progress and identifying bottlenecks across all stages.
  - **Timeline View**: Calendar view showing products by their go-live dates. Best for planning releases and ensuring products are ready by their target dates. Includes stage filtering for focused views.

- **Multi-Locale Support**: Track completeness and go-live dates per locale

- **Risk Detection**: Automatically identifies products at risk (near go-live date with missing content)

- **Smart Stage Inference**: Determines product stage based on:
  - Completeness percentage per locale
  - Presence of required attributes
  - Image/visual attributes
  - Validation status
  - Go-live dates

### User Interface

- **Required family selection**: Products are loaded based on the selected family
- Filter by category, locale, and search by product identifier
- **Stage filter** (timeline view only): Filter products by their current stage
- Click products to navigate to edit forms
- Visual indicators for:
  - Current stage (color-coded)
  - Validation status
  - Live locales
  - At-risk products
  - Completeness per locale

## Configuration

### Custom Variables

The extension uses `custom_variables` to map to your PIM structure. Release dates are configured directly in custom_variables, allowing you to define release schedules by locale, family, or channel.

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
  "masterRequiredAttributes": ["name", "description", "price"],
  "imageAttributes": ["main_image", "product_images"],
  "channel": "ecommerce",
  "thresholdMasterEnrichment": 40,
  "thresholdMasterVisuals": 60,
  "thresholdMasterValidation": 80,
  "thresholdLocalization": 80,
  "thresholdCentralValidation": 100
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
  "masterRequiredAttributes": ["name", "short_description", "long_description"],
  "imageAttributes": ["product_images", "lifestyle_images"],
  "imageAssetFamily": "product_assets",
  "channel": "website",
  "thresholdMasterEnrichment": 50,
  "thresholdMasterVisuals": 70,
  "thresholdMasterValidation": 90,
  "thresholdLocalization": 85,
  "thresholdCentralValidation": 100
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
  "masterRequiredAttributes": ["title", "description", "price"],
  "imageAttributes": ["main_image", "gallery"],
  "channel": "ecommerce",
  "thresholdMasterEnrichment": 40,
  "thresholdMasterVisuals": 60,
  "thresholdMasterValidation": 75,
  "thresholdLocalization": 75,
  "thresholdCentralValidation": 95
}
```

### Configuration Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `releaseDates` | ReleaseDate[] | Yes | Array of release date configurations (see below) |
| `masterLocale` | string | Yes | Master locale code for initial content creation |
| `targetLocales` | string[] | Yes | Array of target locale codes for translations |
| `masterRequiredAttributes` | string[] | Yes | Attribute codes required for master enrichment stage |
| `imageAttributes` | string[] | Yes | Attribute codes for images/visuals |
| `validationStatusAttribute` | string | No | Attribute storing validation status |
| `centralValidationAttribute` | string | No | Attribute storing central validation status |
| `imageAssetFamily` | string | No | Asset family code (if using Asset Manager) |
| `channel` | string | No | Channel code to use for completeness calculations |
| `thresholdMasterEnrichment` | number | No | Completeness % threshold for master enrichment (default: 40) |
| `thresholdMasterVisuals` | number | No | Completeness % threshold for master visuals (default: 60) |
| `thresholdMasterValidation` | number | No | Completeness % threshold for master validation (default: 80) |
| `thresholdLocalization` | number | No | Completeness % threshold for localization (default: 80) |
| `thresholdCentralValidation` | number | No | Completeness % threshold for central validation (default: 100) |

#### ReleaseDate Object

Each release date object can specify:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | Yes | ISO date string (YYYY-MM-DD) for the release |
| `locale` | string | No | Specific locale for this release date |
| `family` | string | No | Specific product family for this release date |
| `channel` | string | No | Specific channel for this release date |

**Matching Priority**: The system matches products to release dates using the most specific criteria first:
1. Family + Locale + Channel (most specific)
2. Family + Locale
3. Locale + Channel
4. Locale only
5. Family + Channel
6. Family only
7. Channel only
8. Default (no criteria) - applies to all products

## PIM Setup Requirements

### Product Families

The extension requires at least one product family to be configured in your PIM. Products must be assigned to families for the extension to display them.

### Categories (Optional)

If you want to use category filtering:
- Set up product categories in your PIM
- Assign products to categories
- The extension will automatically fetch and display available categories in the filter dropdown

### Required Attributes

1. **Master Required Attributes**
   - Typically: name, description, short_description
   - Should be text/textarea attributes
   - Localizable: Yes
   - Configure these in `masterRequiredAttributes` in custom_variables

2. **Image Attributes**
   - Type: Image, Asset Collection, or Media File
   - Examples: `main_image`, `images`, `product_photos`
   - Configure these in `imageAttributes` in custom_variables

### Optional Attributes

3. **Validation Status Attributes**
   - Type: Simple select or Boolean
   - Example values: "pending", "validated", "rejected"
   - Can be used to track validation checkpoints
   - Configure these in `validationStatusAttribute` and `centralValidationAttribute` in custom_variables

### Release Dates

Release dates are are configured in `custom_variables` and applied to products based on their family, locale, and channel. This allows you to:

- Define release schedules centrally without modifying products
- Update release dates globally by changing configuration
- Apply different release dates to different product families
- Coordinate multi-locale releases from a single configuration
- Avoid creating and maintaining date attributes per product

## Filtering and Data Loading

### Filter Behavior

The extension provides several filtering options to help you navigate your product catalog:

1. **Family (Required)**: Products are only loaded when a family is selected. The first family is automatically selected when the extension loads. Use this to focus on specific product types.

2. **Category (Optional)**: Filter products by category within the selected family. Shows all categories available in your PIM.

3. **Stage (Timeline View Only)**: In timeline view, filter products by their current stage in the release pipeline. This filter is hidden in pipeline view where stages are already visually separated.

4. **Locale (Optional)**: Filter products by checking completeness for a specific locale. Useful for tracking localization progress.

5. **Search**: Search products by their identifier. This filter appears last in the filter bar for quick access.

### Data Loading

- Products are fetched from the PIM API based on the selected family (required) and category (optional)
- The extension fetches up to 100 products per request
- Completeness data is retrieved for all configured locales and channels
- Release dates are applied from `custom_variables` configuration based on product family, locale, and channel
- Use the Refresh button to reload data and see the latest changes from your PIM

## How Stage Inference Works

The extension automatically determines which stage a product is in by analyzing:

1. **Completeness in Master Locale**: Primary indicator of content enrichment progress
2. **Required Attributes**: Checks if critical attributes are filled
3. **Image Presence**: Verifies visual assets are added
4. **Localization Completeness**: Measures translation progress across target locales
5. **Go-Live Dates**: Determines if product is ready to go live or already live

### Stage Determination Logic

```
LIVE (8)
├─ Has passed go-live date
└─ Completeness >= central validation threshold

READY TO GO LIVE (7)
├─ Completeness >= central validation threshold
├─ All locales complete
└─ Has future go-live date

CENTRAL VALIDATION (6)
├─ Master completeness >= master validation threshold
└─ All target locales >= localization threshold

LOCALIZATION (5)
├─ Master completeness >= master validation threshold
├─ Has images
└─ Target locales < localization threshold

MASTER VALIDATION (4)
├─ Master completeness >= master visuals threshold
├─ Has images
└─ Required attributes filled

MASTER VISUALS (3)
├─ Master completeness >= master enrichment threshold
├─ Required attributes filled
└─ Missing images

MASTER ENRICHMENT (2)
├─ Master completeness > 0
└─ Master completeness < master visuals threshold

CREATION (1)
└─ Product exists but is empty
```

## Risk Detection

Products are flagged as "at risk" when they are within 7 days of their go-live date and:
- Master completeness is below validation threshold
- Missing required visuals
- Translations incomplete for target locales
- Not yet validated

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

3. **Add to Dashboard**:
   - Add the extension as a custom component to your PIM dashboard

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

### TypeScript

The project includes comprehensive TypeScript types for:
- Product release tracking
- Configuration interfaces
- Stage definitions
- Filter states

## Use Cases

### E-commerce Product Launch

Track new product introductions across multiple markets:
- Ensure all content is enriched before launch
- Coordinate translations across regions
- Manage staged rollouts per locale
- Monitor products approaching launch dates

### Seasonal Collections

Manage seasonal product releases:
- Plan launches around key dates (holidays, seasons)
- Track progress for entire collections
- Identify bottlenecks in the pipeline

### Multi-Brand Catalog Management

For organizations managing multiple brands:
- Configure different locales per brand
- Track validation workflows
- Coordinate global launches

## Navigation Integration

The extension integrates with Akeneo's navigation system:
- Click any product card to navigate to its edit form
- Uses `PIM.navigate` API for seamless navigation
- Maintains context when returning to the calendar

## Technical Implementation Notes

### Product Identifier Handling

The extension includes a workaround for cases where the `identifier` field may be empty. It automatically searches the product's `values` object for attributes with type `pim_catalog_identifier` to retrieve the correct identifier:

```typescript
// Fallback mechanism for empty identifier field
if (!product.identifier || product.identifier.trim().length === 0) {
  // Search product.values for pim_catalog_identifier attribute type
  for (const attributeValue of Object.values(product.values)) {
    if (attributeValue.attribute_type === 'pim_catalog_identifier') {
      return attributeValue.data;
    }
  }
}
```

### Completeness API Structure

The extension works with Akeneo's completeness API which returns data in the following structure:

```typescript
completenesses: [
  {
    locale: "en_US",
    scope: "ecommerce",  // Channel/scope
    data: 85              // Completeness percentage (0-100)
  }
]
```

Ensure your `channel` configuration in custom_variables matches the `scope` values in your PIM.

## Limitations and Considerations

1. **Performance**: Fetches up to 100 products at a time. For larger catalogs, use family and category filters to narrow results.

2. **Family Selection Required**: Products are only loaded when a family is selected. The extension automatically selects the first available family on load.

3. **Release Date Configuration**: Release dates are configured in `custom_variables`, not stored as product attributes. This allows centralized schedule management but requires configuration updates to change dates.

4. **Completeness Calculation**: Relies on Akeneo's completeness API. Ensure completeness is correctly configured in your PIM for the specified channel/scope.

5. **Real-time Updates**: Data is fetched on load and when filters change. Use the refresh button for latest data.

## Customization Ideas

- Add workflow task integration for approval steps
- Implement bulk actions (set go-live dates, change stages)
- Add email notifications for at-risk products
- Integrate with external calendars (Google Calendar, Outlook)
- Add export functionality (CSV, iCal)
- Create custom stage definitions for your workflow

## Troubleshooting

### No Products Showing

- **Check family selection**: Ensure a family is selected. The extension requires a family to be selected before loading products.
- **Verify products exist**: Confirm that products exist in the selected family in your PIM
- **Check category filter**: If using category filter, verify products are assigned to that category
- **Check custom_variables**: Ensure `custom_variables` are correctly configured with valid attribute codes
- **Browser console**: Check the browser console for API errors or permission issues
- **User permissions**: Ensure your user has permission to view products and access the API

### Incorrect Stage Assignment

- **Verify thresholds**: Check that `thresholdMasterEnrichment`, `thresholdMasterVisuals`, etc. match your requirements
- **Check attributes**: Verify that `masterRequiredAttributes` and `imageAttributes` exist on your products
- **Channel configuration**: Ensure the `channel` in custom_variables matches a valid scope in your PIM
- **Completeness setup**: Verify completeness is calculated correctly in your PIM for the configured channel
- **Locale configuration**: Confirm `masterLocale` and `targetLocales` match your PIM's locale setup

### Empty or Missing Product Identifiers

The extension includes a fallback mechanism for empty identifiers. If you see products without identifiers:
- Check that the `pim_catalog_identifier` attribute type exists in product values
- Verify products have identifier values set in the PIM
- Check browser console for warnings about identifier extraction

### Stage Filter Not Visible

The stage filter only appears in **Timeline View**. If you don't see it:
- Switch to Timeline View using the view switcher in the header
- In Pipeline View, products are already organized by stage in columns

### Navigation Not Working

- Verify `PIM.navigate` API is available in your PIM version
- Check that product UUIDs are valid
- Ensure user has permission to edit products
- Check browser console for navigation errors
