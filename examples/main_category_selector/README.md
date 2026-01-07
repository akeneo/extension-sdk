# Main Category Selector

A product panel extension that allows users to designate a single "main" category from a product's assigned categories. This is useful when products belong to multiple categories but you need to identify one as the primary category for downstream systems, reporting, exports, or business logic.

## Overview

Products in Akeneo PIM can be assigned to multiple categories, but there's often a need to identify which category is the "main" or "primary" one. This extension adds a panel to the product edit form where users can select one of the product's assigned categories and save it to a text attribute.

## Features

- **Simple Dropdown Selection**: Shows all categories currently assigned to the product
- **Category Tree Filtering**: Optionally limit the dropdown to categories from a specific tree
- **Localized Labels**: Displays category labels in the user's locale with category codes in grey
- **Validation**: Verifies the save was successful and shows appropriate error messages
- **Auto-Refresh**: Refreshes the product page after saving to reflect changes

## Configuration

### Custom Variables

The extension uses `custom_variables` to map to your PIM structure.

#### Basic Example

```json
{
  "mainCategoryAttributeCode": "main_category"
}
```

#### With Category Tree Filter

```json
{
  "mainCategoryAttributeCode": "main_category",
  "categoryTreeCode": "master"
}
```

### Configuration Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mainCategoryAttributeCode` | string | Yes | The code of the text attribute where the selected main category code will be stored |
| `categoryTreeCode` | string | No | Limits the dropdown to only show categories belonging to this category tree. If not specified, all product categories are shown |

## PIM Setup Requirements

### Required Attribute

Create a text attribute to store the main category selection:

1. **Create the Attribute**
   - Go to Settings > Attributes
   - Create a new attribute with type **Text**
   - Example code: `main_category`
   - Localizable: **No** (recommended)
   - Scopable: **No** (recommended)

2. **Add to Product Families**
   - Go to Settings > Families
   - Add the attribute to all families where you want to use this feature
   - The attribute must be in the family for the save to work

### Extension Position

This extension is designed for the `pim.product.panel` position.

## How It Works

1. **Loading**: When the panel is opened, the extension fetches the product's assigned categories
2. **Tree Filtering**: If `categoryTreeCode` is configured, only categories within that tree are shown
3. **Display**: Categories are shown with their localized label and code: `Category Label [category_code]`
4. **Selection**: User selects a category from the dropdown
5. **Save**: The selected category's code is saved to the configured text attribute
6. **Refresh**: The page refreshes to reflect the change

### Category Tree Filtering

When `categoryTreeCode` is specified, the extension:
- Fetches each product category's parent chain
- Only includes categories that have the specified tree code as an ancestor
- This is useful when products span multiple trees but you only want to select from one

## Installation

1. **Build the Extension**:
   ```bash
   cd examples/main_category_selector
   npm install
   npm run build
   ```

2. **Deploy to PIM**:
   ```bash
   # First deployment
   make create

   # Update existing extension
   make update
   ```

3. **Configure Custom Variables**:
   - Navigate to your extension settings in the PIM
   - Add the `custom_variables` JSON with your attribute code

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build for development (unminified)
npm run build -- --mode development
```

## Troubleshooting

### "Extension not configured" Error

- Ensure `mainCategoryAttributeCode` is set in the extension's custom_variables
- Verify the JSON syntax is correct

### Save Appears Successful but Value Not Saved

- **Check attribute exists**: Verify the attribute code in `mainCategoryAttributeCode` matches an existing text attribute
- **Check family assignment**: The attribute must be assigned to the product's family
- **Check attribute type**: The attribute must be a simple text type (not textarea, not localizable/scopable)

### No Categories in Dropdown

- **Product has no categories**: Assign categories to the product first
- **Tree filter too restrictive**: If using `categoryTreeCode`, ensure the product has categories in that tree
- **Check tree code**: Verify `categoryTreeCode` matches an actual category tree root code

### "This extension can only be used on product pages" Error

- This extension requires a product context
