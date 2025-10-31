# Akeneo PIM JavaScript SDK

## Overview

The Akeneo PIM JavaScript SDK is designed to help you build applications that are compatible with the UI extension Custom Component feature. 

### How the UI extension Custom Component feature works?

The Custom Component feature is a type of UI Extension allowing `PIM` users to upload JavaScript applications directly into the `PIM`.
With its intuitive methods, it simplifies interactions with the Akeneo PIM API by abstracting the complexities of API calls, authentication, and data transformation. It is designed to provide a uniform experience for developers, featuring robust typing support through TypeScript declarations. This enables you to focus on developing your integration without being hindered by API intricacies.

If you're unfamiliar with the UI Extension feature, you can find more information in the [Akeneo documentation](https://api.akeneo.com/extensions/overview.html).

For more information about the **available features**, **integration architecture**,  **constraints**, **permissions** and **access control** or **development workflow** you can look at the [Advanced Extension in depth documentation](https://api.akeneo.com/advanced-extensions/sdk-in-depth.html#sdk-in-depth). 

For more information about the SDK deployment you can look at the Advanced Extensions [API deployment](https://api.akeneo.com/advanced-extensions/api-deployment.html#api-deployment) or [UI deployment](https://api.akeneo.com/advanced-extensions/ui-deployment.html#ui-deployment).

### Quick Start Example

Here's a simple example showing how to use the SDK to list assets from a specific family:

```typescript
// Access the Asset API
const assetApi = PIM.api.asset_v1;

// List assets with filters
const listParams = {
  assetFamilyCode: 'packshots',
};

// Call the API and handle the response
try {
  const assetList = await assetApi.list(listParams);
  console.log('Assets found:', assetList);
} catch (error) {
  console.error('Error fetching assets:', error);
}
```

## Available SDK Positions

When configuring your UI extension, you must specify where it will appear in the PIM interface. The SDK supports the following positions:

- `pim.product.tab`: Adds a new tab in the product edit form
- `pim.category.tab`: Adds a new tab in the category edit form
- `pim.product.panel`: Displays in a side panel in the product edit form
- `pim.sub-product-model.panel`: Displays a side panel in the sub-product model edit form
- `pim.product-model.panel`: Displays a side panel in the product model edit form
- `pim.activity.navigation.tab`: Adds a new tab in the activity navigation

The position you choose will determine where and how your extension is presented to users in the PIM interface.


## Further Documentation

For more detailed information about the Akeneo PIM API, please refer to the official [Akeneo API documentation](https://api.akeneo.com/).
