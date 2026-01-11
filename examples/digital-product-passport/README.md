# Digital Product Passport Extension

A comprehensive Akeneo PIM extension that displays a beautiful, dynamic Digital Product Passport (DPP) on product pages. This extension automatically fetches product data and presents it in a professional, violet-themed interface with support for composition, supply chain journey, certifications, care instructions, and sustainability metrics.

## Features

### 🎨 Professional UI
- Beautiful violet-themed design with transparent background
- Responsive card-based layout optimized for product panels
- Conditional rendering - sections only appear when data is available
- QR code generation for product sharing

### 🌍 Multi-locale & Multi-scope Support
- Automatically detects user's current locale and scope context
- Respects locale/scope combinations in attribute data
- Smart fallback strategy (exact match → locale+null → null+scope)
- Option to skip fallbacks and show only exact matches

### 📊 Dynamic Data Sections

#### 1. **Sustainability Impact**
Display environmental impact metrics:
- Water usage
- CO2 emissions
- Sustainability grade

**Supported Attributes:**
- `water_usage`
- `co2_emissions`
- `sustainability_grade`
- `sustainability` (structured JSON)

#### 2. **Material DNA (Composition)**
Visual composition breakdown with color-coded progress bars:
- Cotton, Elastane, Polyester, Wool, Silk, Linen, Nylon
- Percentage-based visualization
- Automatic color assignment

**Supported Attributes:**
- `cotton_percentage`
- `elastane_percentage`
- `polyester_percentage`
- `composition` (structured JSON array)

#### 3. **Product Journey**
Complete supply chain timeline with icons:
- Harvesting
- Spinning
- Dyeing
- Manufacturing
- Quality Control
- Distribution

**Supported Attributes:**
For each stage: `[stage]_location`, `[stage]_date`, `[stage]_supplier`
- Example: `harvesting_location`, `spinning_date`, `dyeing_supplier`
- Or: `journey` (structured JSON array)

#### 4. **Certifications & Compliance**
Display certification badges:
- GOTS
- Fair Trade
- OEKO-TEX
- Custom certifications

**Supported Attributes:**
- `gots_certified`
- `fair_trade_certified`
- `oeko_tex_certified`
- `certifications` (structured JSON array)

#### 5. **Care Instructions**
Display care symbols and instructions:
- Wash temperature
- Bleach allowed/not allowed
- Dry method
- Iron temperature

**Supported Attributes:**
- `wash_temperature`
- `bleach_allowed` (boolean)
- `dry_method`
- `iron_temperature`
- `care_instructions` (structured JSON array)

## Configuration

### QR Code Base URL
Update the `QR_CODE_BASE_URL` constant at the top of `src/dpp.js`:

```javascript
const QR_CODE_BASE_URL = 'https://your-storefront-url.com';
```

The QR code will generate URLs in the format: `{BASE_URL}/products/{product_identifier}`

### Skip Fallback Mode
By default, the extension uses a smart fallback strategy to find attribute values:
1. Exact match (locale + scope)
2. Locale match with null scope
3. Scope match with null locale
4. First available value (when `skipFallback=false`)

To show ONLY data matching the current locale/scope (no fallbacks), the extension uses `skipFallback=true` for all attributes by default. You can customize this behavior in the `getAttributeValue()` calls.

## Installation

### Option 1: Using Akeneo Extension Manager
1. Copy the contents of `src/dpp.js` into the Akeneo Extension Manager
2. Configure the extension position as "Product Panel"
3. Set the extension name and labels
4. Update the QR code base URL if needed
5. Activate the extension

### Option 2: Using Extension Configuration File
1. Copy the `extension_configuration.json` file to your Akeneo instance
2. Copy `src/dpp.js` to the appropriate location
3. Use the Akeneo CLI to activate the extension:
   ```bash
   bin/console akeneo:extension:install sdk_script_extension_digital_product_passport
   ```

## Attribute Setup

### Required Product Attributes
Create the following attributes in your Akeneo PIM (as needed):

**Basic Info:**
- `name` (Text, Localizable, Scopable)

**Sustainability:**
- `water_usage` (Text or Number)
- `co2_emissions` (Text or Number)
- `sustainability_grade` (Text or Select)

**Composition:**
- `cotton_percentage` (Number, 0-100, Localizable)
- `elastane_percentage` (Number, 0-100, Localizable)
- `polyester_percentage` (Number, 0-100, Localizable)

**Journey (for each stage: harvesting, spinning, dyeing, manufacturing, quality_control, distribution):**
- `[stage]_location` (Text, Localizable)
- `[stage]_date` (Date)
- `[stage]_supplier` (Text, Localizable)

**Certifications:**
- `gots_certified` (Boolean or Yes/No)
- `fair_trade_certified` (Boolean or Yes/No)
- `oeko_tex_certified` (Boolean or Yes/No)

**Care Instructions:**
- `wash_temperature` (Text, e.g., "30°C")
- `bleach_allowed` (Boolean)
- `dry_method` (Text, e.g., "Tumble dry low")
- `iron_temperature` (Text, e.g., "Medium heat")

### Alternative: Structured Attributes
Instead of individual attributes, you can use structured JSON attributes:
- `composition` (JSON array)
- `journey` (JSON array)
- `certifications` (JSON array)
- `care_instructions` (JSON array)
- `sustainability` (JSON object)

## Customization

### Adding New Materials
Update the `getColorForMaterial()` function in `src/dpp.js`:

```javascript
const colorMap = {
  'cotton': '#8e24aa',
  'your_material': '#your_color',
  // Add more materials
};
```

### Adding New Journey Stages
Update the `getIconForStage()` function:

```javascript
const iconMap = {
  'your_stage': '🔧',
  // Add more stages
};
```

### Styling
Customize the color scheme by modifying the `colors` object:

```javascript
const colors = {
  bg: "transparent",
  card: "#ffffff",
  text: "#4a148c",
  accent: "#ab47bc",
  // Modify colors
};
```

## Technical Details

- **SDK Version:** Compatible with Akeneo Extension SDK
- **Position:** `pim.product.panel`
- **Type:** `sdk_script`
- **API Used:** `PIM.api.product_uuid_v1.get()`
- **Context:** `PIM.context.product.uuid`, `PIM.context.user.catalog_locale`, `PIM.context.user.catalog_scope`

## Example Screenshots

The Digital Product Passport displays:
- Product name and SKU
- QR code for easy sharing
- Sustainability metrics in a grid layout
- Material composition with color-coded progress bars
- Complete product journey timeline
- Certification badges
- Care instruction icons with descriptions

## License

This example is part of the Akeneo Extension SDK examples and is provided as-is for demonstration purposes.

## Support

For questions or issues:
- Check the [Akeneo Extension SDK Documentation](https://api.akeneo.com/advanced-extensions/)
- Review the [Extension SDK GitHub Repository](https://github.com/akeneo/extension-sdk)
- Contact Akeneo Support
