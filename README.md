# Akeneo PIM JavaScript SDK

## Overview

The Akeneo PIM JavaScript SDK is meant to help you build an app compatible with the UI extension Custom Component feature. Easy-to-use methods provide a simple and intuitive way to interact with the Akeneo PIM API, this SDK abstract all the complexity of API calls, authentication, and data transformation. It allowis you to focus on building your integration rather than managing API details.

The SDK offers a comprehensive set of functions to manage various Akeneo PIM entities such as products, attributes, assets, categories, and more. It's designed to provide a consistent developer experience with strong typing support through TypeScript declarations.

## How the SDK Works in Akeneo

### Integration Architecture

The Akeneo PIM JavaScript SDK is designed to run within the Akeneo PIM application itself, executing in a secure sandbox environment. This architecture provides several benefits:

1. **Direct Access**: Your code runs within the PIM context, allowing direct access to the current user session and context.
2. **Security**: The SDK code operates in a secure sandbox environment using the [SES (Secure ECMAScript)](https://github.com/endojs/endo) library, which restricts access to potentially harmful JavaScript capabilities.
3. **Controlled API Access**: All API calls are automatically authenticated using the current user's session.

### Development Workflow

To use the SDK for custom development, follow these steps:

1. **Import the SDK Type Definitions**: Use the TypeScript declaration file (`index.d.ts`) for development. This file contains all the type definitions for the SDK methods.

2. **Write Your Code**: Develop your custom functionality using the SDK methods defined in the declaration file. All API methods are accessible through the global `PIM` object.

3. **Compile Your Code**: Bundle all your JavaScript into a single file. This file should contain all your custom logic using the SDK methods.

4. **Upload to Akeneo**: Use an API call to upload your script to the Akeneo PIM. This makes your code available to run within the PIM.

   ```
   # Upload script example 
   curl --location 'your-pim-base-url/api/rest/v1/ui-extensions' --header 'Authorization: Bearer app_or_connection_token' --form 'name="sdk_extension"' --form 'type="sdk_script"' --form 'position="pim.product.panel"' --form 'file=@"/path/to/your/complied/file.js"' --form 'configuration[labels][en_US]="SDK test extension"' --form 'configuration[default_label]="sdk_test_extension"'
   ```

5. **Configuration**: 
   todo position / credentials / label

### Important Constraints

When developing with the SDK, keep these constraints in mind:

- **Restricted Environment**: Your code runs in a secure sandbox that limits JavaScript capabilities.
- **External Access**: Direct network requests (fetch, XMLHttpRequest) to external services are not allowed. All API interactions must go through the SDK methods.
- **DOM Access**: Limited access to the DOM is provided, with restrictions on what elements can be modified.
- **Global State**: The sandbox isolates your code from affecting the global state of the PIM application.
- **Resources**: Your script should be efficient as it runs within the PIM application context.

## Quick Start Example

Here's a simple example showing how to use the SDK to list assets from a specific family:

```typescript
// Access the Asset API
const assetApi = PIM.api.asset_v1;

// List assets with filters
const listParams = {
  assetFamilyCode: 'packshots',
  channel: 'ecommerce',        // Get values for specific channel
  locales: 'en_US,fr_FR',      // Get values for specific locales
};

// Call the API and handle the response
try {
  const assetList = await assetApi.list(listParams);
  console.log('Assets found:', assetList);
} catch (error) {
  console.error('Error fetching assets:', error);
}
```

## TypeScript Support

The SDK comes with comprehensive TypeScript declarations (`index.d.ts`), providing rich intellisense and autocompletion in compatible editors. This makes development faster and helps prevent errors by ensuring you're using the API correctly.

Benefits of the TypeScript declarations:
- **Autocomplete**: Get suggestions for available methods and properties
- **Type Checking**: Catch type errors before runtime
- **Documentation**: View parameter descriptions and requirements directly in your editor
- **Improved Developer Experience**: Navigate the SDK easily with proper typing

Example of how the declarations help in development:

```typescript
// The SDK will show you available parameters and their types
const params: AssetListParams = {
  assetFamilyCode: 'packshots',
  // Your editor will suggest other available params with descriptions
};

// Method autocomplete and parameter validation
const result = await PIM.api.asset_v1.list(params);
// TypeScript knows the return type (PaginatedList<Asset>)
```

## Available Features

The SDK provides access to the following API resources:

### Product Management
- **Product UUID API** (`PIM.api.product_uuid_v1`): Create, update, and retrieve products by UUID
- **Product Model API** (`PIM.api.product_model_v1`): Work with product models
- **Product Media File API** (`PIM.api.product_media_file_v1`): Upload and manage product images and files

### Attribute Management
- **Attribute API** (`PIM.api.attribute_v1`): Manage product attributes
- **Attribute Group API** (`PIM.api.attribute_group_v1`): Organize attributes into groups
- **Attribute Option API** (`PIM.api.attribute_option_v1`): Work with attribute options

### Catalog Structure
- **Family API** (`PIM.api.family_v1`): Manage product families
- **Family Variant API** (`PIM.api.family_variant_v1`): Work with family variants
- **Category API** (`PIM.api.category_v1`): Manage the category tree
- **Association Type API** (`PIM.api.association_type_v1`): Define product associations

### Asset Management
- **Asset API** (`PIM.api.asset_v1`): Create and manage assets
- **Asset Family API** (`PIM.api.asset_family_v1`): Work with asset families
- **Asset Attribute API** (`PIM.api.asset_attribute_v1`): Manage asset attributes
- **Asset Attribute Option API** (`PIM.api.asset_attribute_option_v1`): Work with asset attribute options
- **Asset Media File API** (`PIM.api.asset_media_file_v1`): Upload and manage asset files

### Reference Entities
- **Reference Entity API** (`PIM.api.reference_entity_v1`): Manage reference entities
- **Reference Entity Attribute API** (`PIM.api.reference_entity_attribute_v1`): Work with reference entity attributes
- **Reference Entity Record API** (`PIM.api.reference_entity_record_v1`): Manage reference entity records

### System & Configuration
- **System API** (`PIM.api.system`): Get system information
- **Currency API** (`PIM.api.currency_v1`): Work with currencies
- **Channel API** (`PIM.api.channel_v1`): Manage channels
- **Locale API** (`PIM.api.locale_v1`): Work with locales
- **Measurement Family API** (`PIM.api.measurement_family_v1`): Manage measurement families

## Common Patterns

Most API methods follow these common patterns:

### List Resources
```typescript
// List with optional filtering and pagination
const listParams = {
  // Required parameters specific to the resource
  // Optional filters, search, pagination
};
const items = await PIM.api.resource_v1.list(listParams);
```

### Get a Single Resource
```typescript
// Fetch a specific resource by its identifier
const getParams = {
  // Required parameters to identify the resource
};
const item = await PIM.api.resource_v1.get(getParams);
```

### Create or Update Resources
```typescript
// Create or update a resource
const upsertParams = {
  // Resource identifier
  // Data to create or update
};
const response = await PIM.api.resource_v1.upsert(upsertParams);
```

```typescript
// Patch a resource
const patchParams = {
  // Resource identifier
  // Data to patch
};
const response = await PIM.api.resource_v1.patch(patchParams);
```

```typescript
// Create a resource
const createParams = {
  // Resource identifier
  // Data to create
};
const response = await PIM.api.resource_v1.create(createParams);
```

## Example Files

TODO should we add example file for each entity ?

This folder contains numerous example files demonstrating how to use each part of the SDK:

- `asset-usage.ts`: Working with assets
- `asset-family-usage.ts`: Managing asset families
- `asset-attribute-usage.ts`: Working with asset attributes
- `product-uuid-usage.ts`: Managing products using UUIDs
- ... and many more

Each example file includes detailed code samples that you can use as a starting point for your own integrations.

## User Context

The SDK provides access to the current user context through:

```typescript
// Get user information
const currentUser = PIM.user;
console.log(`Current user: ${currentUser.first_name} ${currentUser.last_name}`);

// Get contextual information (if available)
const context = PIM.context;
if ('product' in context) {
  console.log(`Current product UUID: ${context.product.uuid}`);
}
```

## Error Handling

The SDK methods return promises that you can handle with try/catch:

```typescript
try {
  const result = await PIM.api.resource_v1.method(params);
  // Process successful result
} catch (error) {
  // Handle errors
  console.error('API Error:', error.message);
  // You may want to check for specific error types/codes
}
```

## Further Documentation

For more detailed information about the Akeneo PIM API, please refer to the official [Akeneo API documentation](https://api.akeneo.com/).
