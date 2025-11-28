# Product Release Panel

A product panel extension that displays release due dates and status for the current product. This extension complements the Product Release Calendar by showing detailed release information for individual products.

## Overview

The Product Release Panel shows:
- **Due dates** for each locale the product needs to be released in
- **Current stage** in the release pipeline per locale
- **Completeness percentage** for each locale
- **Days until due** (or overdue status)
- **Missing items** that need to be completed
- **Visual indicators** for at-risk and overdue products

## Features

### Per-Locale Status

- Displays separate cards for each locale with a release date
- Shows completeness and stage for each market
- Highlights overdue and at-risk dates

### Visual Indicators

- **Color-coded cards**:
  - White: On track
  - Yellow: At risk (within 7 days of due date with missing items)
  - Red: Overdue
- **Progress bars**: Visual completeness indicator per locale
- **Status badges**: Current stage in the pipeline
- **Icons**: Visual cues for status (✓ for live, ⚠ for issues)

### Smart Release Date Matching

Uses the same priority-based matching system as the Product Release Calendar:
- Matches products to release dates based on family, category, locale, and channel
- Shows only applicable release dates for the current product
- If no release dates match, displays a helpful message

## Installation

1. **Build the Extension**:
   ```bash
   cd examples/product_release_panel
   npm install
   npm run build
   ```

2. **Upload to PIM**:
   - Navigate to System > Extensions in your Akeneo PIM
   - Upload the built extension bundle
   - Configure the custom_variables (same format as Product Release Calendar)

3. **Extension Point**:
   - This extension appears as a panel on product edit pages
   - Panel title: "Release Schedule"

## Configuration

The extension uses the same configuration as the Product Release Calendar via `custom_variables`:

```json
{
  "releaseDates": [
    { "date": "2025-12-01", "family": "cameras", "locale": "en_US" },
    { "date": "2025-12-15", "locale": "fr_FR" },
    { "date": "2026-01-10", "family": "cameras" }
  ],
  "masterLocale": "en_US",
  "targetLocales": ["fr_FR", "de_DE"],
  "masterRequiredAttributes": ["name", "description"],
  "imageAttributes": ["main_image"],
  "channel": "ecommerce",
  "thresholdMasterEnrichment": 40,
  "thresholdMasterVisuals": 60,
  "thresholdMasterValidation": 80,
  "thresholdLocalization": 80,
  "thresholdCentralValidation": 100
}
```

See the Product Release Calendar README for detailed configuration documentation.

## How It Works

### Context-Based

The extension reads product data from the PIM context:
```typescript
const product = globalThis.PIM.context.product;
```

This gives access to:
- Product identifier, family, categories
- Completeness data per locale/channel
- Product values and attributes

### Release Date Matching

For each configured locale (master + targets):
1. Checks if any release date matches the product using priority order
2. If match found, calculates:
   - Current stage based on completeness
   - Days until due date
   - Whether product is at risk or overdue
   - What items are missing
3. Displays a card for each applicable locale

### Status Calculation

- **Current Stage**: Inferred from completeness percentage
- **At Risk**: Within 7 days of due date with incomplete items
- **Overdue**: Past due date without being live
- **Missing Items**: Tracks incomplete content and pending validations

## Use Cases

### Individual Product Management

When editing a product:
- Quickly see all release dates for that product
- Identify which locales need attention
- Understand what's blocking go-live

### Multi-Market Releases

For products releasing in multiple markets:
- See status for each market separately
- Identify markets falling behind
- Prioritize work based on nearest due dates

### Validation Workflows

Track validation status:
- See which stages are complete
- Identify missing validations
- Monitor progress toward go-live

## Development

### Local Development

```bash
npm run dev
```

Starts a development server with hot reload.

### Build for Production

```bash
npm run build
```

Outputs bundle to `dist/` directory.

## Troubleshooting

### Panel Not Showing

- Verify the extension is installed and activated
- Check that you're on a product edit page
- Ensure custom_variables are configured

### No Release Dates Displayed

- Check that release dates are configured in custom_variables
- Verify at least one release date matches the product (family/category/etc.)
- Review the priority-based matching rules

### Incorrect Status

- Verify completeness is calculated for the configured channel
- Check threshold values in custom_variables
- Ensure product has completeness data

## Comparison with Product Release Calendar

| Feature | Product Release Panel | Product Release Calendar |
|---------|----------------------|-------------------------|
| **Scope** | Single product | All products |
| **Location** | Product edit page | Dashboard |
| **View** | Per-locale cards | Pipeline/Timeline views |
| **Purpose** | Individual tracking | Portfolio management |
| **Filtering** | N/A (single product) | Family, category, stage, locale |

These extensions work together:
- **Calendar**: Portfolio view, identify bottlenecks
- **Panel**: Detailed per-product view, take action

## Technical Details

- **React**: 17.0.2
- **TypeScript**: Full type safety
- **Styled Components**: CSS-in-JS styling
- **Akeneo Design System**: Consistent UI components
- **Bundle Size**: ~2.7 MB gzipped (includes all dependencies)

## Future Enhancements

Potential improvements:
- Direct editing of completeness inline
- Quick actions (mark validated, request review)
- History of status changes
- Export release schedule for product
- Integration with task management
