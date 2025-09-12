# Akeneo PIM JavaScript SDK

## Overview

The Akeneo PIM JavaScript SDK is designed to help you build applications that are compatible with the UI extension Custom Component feature. 

### How the UI extension Custom Component feature works?

The Custom Component feature is a type of UI Extension allowing `PIM` users to upload Javascript applications directly into the `PIM`.
With its intuitive methods, it simplifrd interactions with the Akeneo PIM API by abstracting the complexities of API calls, authentication, and data transformation. It is crafted to ensure a consistent developer experience, complete with strong typing support through TypeScript declarations. This enables you to focus on developing your integration without being hindered by API intricacies. 

If you're unfamiliar with the UI Extension feature, you can find more information in the [Akeneo documentation](httpshttps://api.akeneo.com/extensions/overview.html).

### Integration Architecture

Applications you will build are designed to run within the Akeneo PIM application itself, executing in a secure sandbox environment. This architecture provides several benefits:

1. **Direct Access**: Your code runs within the PIM context, allowing direct access to the current user session and context.
2. **Security**: The SDK code operates in a secure sandbox environment using the [SES (Secure ECMAScript)](https://github.com/endojs/endo) library, which restricts access to potentially harmful JavaScript capabilities.
3. **Controlled API Access**: All API calls are automatically authenticated using the current user's session.

### Important Constraints

When developing with the SDK, keep these constraints in mind:

- **Restricted Environment**: Your code runs in a secure sandbox that limits JavaScript capabilities.
- **External Access**: Direct network requests (fetch, XMLHttpRequest) to external services are not allowed. All API interactions must go through the SDK methods. There is a specific method available to allow acces to exeternal ressources.
- **DOM Access**: Limited access to the DOM is provided, with restrictions on what elements can be modified.
- **Global State**: The sandbox isolates your code from affecting the global state of the PIM application.
- **Resources**: Your script should be efficient as it runs within the PIM application context.

### Permissions and Access Control

The SDK operates under the permissions of the currently logged-in user. This means:

- **Inherited Permissions**: All API calls made through the SDK inherit the Web API permissions of the user who is currently logged into the PIM.
- **Role-Based Access**: What your extension can do depends entirely on the role and permissions assigned to the user running it.
- **Permission Variations**: The same extension may have different capabilities depending on who is using it.
- **Error Handling**: Your code should gracefully handle permission-denied scenarios, as different users may have different access levels.

For example, if a user doesn't have permission to edit products, any SDK calls attempting to update products will fail, even if your code is technically correct. Always design your extensions with these permission constraints in mind.

You can refer to the [Akeneo Web API permissions documentation](https://api.akeneo.com/documentation/permissions.html) for more details on the permission system.

## Development Workflow

To use the SDK for custom development, follow these steps:

1. **Import the SDK Type Definitions**: Use the TypeScript declaration file (`index.d.ts`) for development. This file contains all the type definitions for the SDK methods.

2. **Write Your Code**: Develop your custom functionality using the SDK methods defined in the declaration file. All API methods are accessible through the global `PIM` object.

3. **Compile Your Code**: Bundle all your JavaScript into a single file using `vite` or any other mean you like. This file should contain all your custom logic using the SDK methods.

4. **Configure Environment**: Copy the `.env.example` file to `.env` and fill in your PIM host, API token, and other configuration values:
   ```
   PIM_HOST=https://your-pim-instance.com
   API_TOKEN=your_api_token_here
   PROJECT_PATH=$(pwd)
   ```

5. **Build and Upload**: Use the provided Makefile commands to build and upload your extension:
   ```
   # Build the extension
   make build

   # Upload the extension to your PIM instance
   make upload
   ```

   This will automatically upload your compiled extension to the configured PIM instance using the API.

6. **Configuration**: 
   todo position / credentials / label
   todo should we add all the information about configuration inside api doc?

### Quick Start Example

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
- - **Reference Entity Attributes Option API** (`PIM.api.reference_entity_attribute_option_v1`): Manage reference entity attributes option
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

## Navigation within the PIM

The SDK provides a navigation method that allows you to open new tabs, but only within the Akeneo PIM application. This is useful for directing users to different sections of the PIM from your extension:

```typescript
// Navigate to a product edit page
PIM.navigate.internal('#/enrich/product/6b7546f8-929c-4ba3-b7ed-d55b61753313');

// Navigate to a category page
PIM.navigate.internal('#/enrich/product-category-tree/');

// Navigate to an asset page
PIM.navigate.internal('#/asset/video/asset/absorb_video/enrich');
```

Important limitations to keep in mind:
- This navigation method can **only** open tabs within the PIM application
- It cannot be used to navigate to external websites or applications
- The paths must be valid PIM routes that the user has permission to access
- Navigation will open in a new tab, preserving the current extension context

Use this feature to create helpful shortcuts or workflows that connect your extension's functionality with standard PIM screens.

## External API Calls

The SDK provides a secure gateway for making calls to external APIs and services. Since direct network requests (fetch, XMLHttpRequest) are not allowed within the sandbox environment, the SDK offers a dedicated method for external communication:

```typescript
// Make a GET request to an external API
const response = await PIM.api.external.call({
  method: 'GET',
  url: 'https://api.example.com/data',
  headers: {
    'my_super_header': 'your super header value',
    'Content-Type': 'application/json'
  }
});

// Make a POST request with a body
const createResponse = await PIM.api.external.call({
  method: 'POST',
  url: 'https://api.example.com/items',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Item',
    description: 'Item description'
  })
});
```

#### Authenticated calls and credentials:
You have the ability to make authenticated calls using the `external.call` method. To do so you have to specify as a paramter the code of the credential you want to use. The specified credential will be used as headers in the generated requests.

```typescript
// Make a request using stored credentials
const secureResponse = await PIM.api.external.call({
  method: 'GET',
  url: 'https://api.secure-service.com/data',
  credentials_code: 'my_registered_credentials' // Reference credentials stored in PIM
});
```

#### Available Credential Methods

| Methode              | Header                                             |
|----------------------|----------------------------------------------------|
| Basic Authentication | `Authorization : base64_encode(username:password)` |    
| Bearer Token         | `Authorization : Bearer token_value`               |
| Custom Credentials   | `custom_header_key : custom_header_value`          |

Basic Authentication and Bearer Token credentials are encrypted before being stored, ensuring the security of your sensitive data. Additionally, the API calls are made server-side, meaning that the credentials are not accessible from the front end of the application, further enhancing security.

#### How to add credential to your extension

When uploading or updating your extension you have the possibility to add one or more credentials. The expected format is an array of credentials with three fields, code, type and values.

```JSON
// Example of each supported credential type
{
"credentials": [
        {
            "code": "code_to_identify_the_credential",
            "type": "Bearer Token",
            "values": "your_auth_token"
        },
        {
            "code": "code_to_identify_the_credential",
            "type": "Basic Auth",
            "values": {
             "username": "your_username",
             "passwrd": "your_password"   
            }
        },
        {
            "code": "code_to_identify_the_credential",
            "type": "Custom Header",
            "values": "your_custom_key"
        }
    ]
}
```

Important considerations for external calls:
- This is the **only method** allowed for accessing external resources from your extension
- All external domains must be allowlisted in your extension configuration
- For security reasons, requests are proxied through the PIM server
- **Never hardcode credentials** in your extension code as it runs in the browser and can expose sensitive information
- Always use the `credentials_code` parameter to reference credentials that are securely stored in the PIM configuration
- The credential management is handled through the extension configuration in the PIM admin interface
- The method supports standard HTTP methods (GET, POST, PUT, DELETE, etc.)
- Responses are returned as promises that can be handled with async/await

The external gateway provides a secure way to integrate your extension with external systems while maintaining the security of the PIM environment.

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
