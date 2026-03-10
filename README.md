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

### Claude Code Plugin _(Beta)_

This repository includes a **Claude Code plugin** (`akeneo-custom-component`) that helps you build and deploy Akeneo Custom Components directly from your Claude Code session. It provides an awareness skill that triggers automatically when Custom Components are mentioned, and a guided setup skill (`/akeneo-cc-setup`) that scaffolds, builds, and deploys a component step by step.

> **Note:** This plugin is currently in beta. Expect rough edges and breaking changes.

#### Installation

1. Open the **Plugins** panel in Claude Code (`/plugins`)
2. Go to **Marketplaces** and add the following marketplace URL:
   ```
   https://raw.githubusercontent.com/akeneo/extension-sdk/beta/marketplace.json
   ```
3. Go to **Discover**, find `akeneo-custom-component` and install it

## Further Documentation

For more detailed information about the Akeneo PIM API, please refer to the official [Akeneo API documentation](https://api.akeneo.com/).
