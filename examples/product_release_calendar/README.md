# Product Release Calendar

A comprehensive example demonstrating how to build a multi-stage product release tracking system using the Akeneo PIM Extension SDK. This example showcases advanced features including custom_variables for configuration mapping, completeness-based stage inference, multi-locale support, and dual view modes (pipeline and timeline).

## Overview

The Product Release Calendar helps merchandising and product teams track products through their journey from creation to publication across multiple locales. It's designed to work with any PIM configuration by using `custom_variables` to map the calendar concepts to your specific PIM attributes.

## Features

### Core Functionality

- **Multi-Stage Pipeline**: Tracks products through 6 active stages with validation workflows:
  1. **Creation** - Product page created (empty)
  2. **Master Enrichment** - Adding information and visuals in master locale
  3. **Master Validation** - Master content ready for validation (shows validation button)
  4. **Localization** - Working on translations and visuals for other locales
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

- **Risk Detection**: Automatically identifies products at risk (near go-live date with missing content)

- **Smart Stage Inference**: Determines product stage based on:
  - Completeness percentage per locale (master and target locales)
  - Validation status (tracked via a yes/no attribute)
  - Localization completeness across all target locales
  - Go-live dates configuration

- **Interactive Validation Workflow**:
  - **Master Validation**: Click "Validate Master" button to approve master locale content
    - Verifies the validation attribute exists in the product family
    - Sets the validation attribute to `true` for the master locale
    - Shows success message in bottom-right notification
    - Page reloads to reflect the new validation status
  - **Global Validation**: Click "Validate All Locales" button to approve all locale content
    - Verifies the validation attribute exists in the product family
    - Sets the validation attribute to `true` for all target locales
    - Shows success message in bottom-right notification
    - Page reloads to reflect the new validation status
  - **Go Live**: Click "Go Live" button when ready to publish
    - Displays a warning message that the go-live mechanism is not yet implemented
    - Can be customized in `src/utils/validationActions.ts` to integrate with publishing workflows or external APIs
  - Validation status is stored in a configurable yes/no attribute (localizable & scopable)
  - All notifications appear as message bars in the bottom-right corner using Akeneo Design System

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
  "imageAttributes": ["main_image", "product_images"],
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
  "imageAttributes": ["product_images", "lifestyle_images"],
  "imageAssetFamily": "product_assets",
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
  "imageAttributes": ["main_image", "gallery"],
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
  "imageAttributes": ["main_image", "gallery_images"],
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
  "imageAttributes": ["main_image"],
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
| `imageAttributes` | string[] | Yes | Attribute codes for images/visuals |
| `imageAssetFamily` | string | No | Asset family code (if using Asset Manager) |
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

### Product Families

The extension requires at least one product family to be configured in your PIM. Products must be assigned to families for the extension to display them.

### Categories (Optional)

If you want to use category filtering:
- Set up product categories in your PIM
- Assign products to categories
- The extension will automatically fetch and display available categories in the filter dropdown

### Required Attributes

1. **Validation Attribute** (Required for workflow)
   - Type: **Yes/No** (boolean)
   - Localizable: **Yes** (required)
   - Scopable: **Yes** (required if using channels)
   - Example code: `validation_status`
   - Purpose: Tracks validation approval for each locale/channel
   - Configure in `validationAttribute` in custom_variables

2. **Image Attributes**
   - Type: Image, Asset Collection, or Media File
   - Examples: `main_image`, `images`, `product_photos`
   - Configure these in `imageAttributes` in custom_variables

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

1. **Family (Required)**: Products are only loaded when a family is selected. The first family is automatically selected when the extension loads. This filter cannot be cleared as a family selection is required for the calendar to function.

2. **Category (Optional)**: Filter products by category within the selected family. Shows all categories available in your PIM.

3. **Stage (Timeline View Only)**: In timeline view, filter products by their current stage in the release pipeline. This filter is hidden in pipeline view where stages are already visually separated.

4. **Locale (Timeline View Only)**: Filter product dots on the calendar by locale. When a specific locale is selected, only products with go-live dates for that locale are displayed on their respective calendar dates. When "All Locales" is selected, products appear on dates corresponding to any of their configured locale go-live dates. This filter is hidden in pipeline view.

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
└─ Adding content and visuals

CREATION (1)
└─ Product exists but is empty (0% completeness)
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

### User Notifications

The extension uses the Akeneo Design System `MessageBar` component to display success, error, and warning messages. All notifications appear in a fixed position at the bottom-right corner of the screen:

```typescript
// Success message displayed with green MessageBar
<MessageBar
  level="success"
  title="Success"
  dismissTitle="Close"
  onClose={() => setMessage(null)}
>
  Master locale validated successfully!
</MessageBar>
```

**Message Types:**
- **Success** (green): Validation completed successfully
- **Error** (red): Validation attribute not found or validation failed
- **Warning** (yellow): Go-live mechanism not implemented

Messages automatically disappear after 5 seconds and can be manually dismissed. The fixed positioning ensures notifications don't interfere with the product cards or calendar view.

### Validation Attribute Checking

Before validating a product, the extension verifies that the validation attribute exists in the product's family definition:

```typescript
// Fetch the product and its family
const product = await PIM.api.product_uuid_v1.get({ uuid: productUuid });
const family = await PIM.api.family_v1.get({ code: product.family });

// Check if validation attribute exists in family
if (!family.attributes || !family.attributes.includes(config.validationAttribute)) {
  throw new Error(`Validation attribute "${config.validationAttribute}" not found in family`);
}
```

This provides accurate validation of PIM configuration and displays helpful error messages when the attribute is not properly configured.

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

- **Implement actual publishing workflow**: The "Go Live" button currently displays a warning message. Modify the `triggerGoLive` function in `src/utils/validationActions.ts` to:
  - Integrate with your publishing system or external API
  - Update product status or push to channels
  - Trigger external workflows or notifications
- **Add automatic "Live" stage**: Implement the commented-out logic in `src/utils/stageInference.ts` to automatically move products to "Live" stage based on go-live dates or API status
- Add workflow task integration for approval steps
- Implement bulk actions (set go-live dates, change stages)
- Add email notifications for at-risk products
- Integrate with external calendars (Google Calendar, Outlook)
- Add export functionality (CSV, iCal)
- Create custom stage definitions for your workflow
- Customize notification messages and durations in the MessageBar implementation

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
- **Check attributes**: Verify that `imageAttributes` exist on your products
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
