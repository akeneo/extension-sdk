# SDK script example: Quickstart
This is a quickstart example for building a UI extension.

## Prerequisites
Before you begin, you need an active connection to an Akeneo PIM sandbox.
To learn more about setting up your connection, please follow the instructions in the [official documentation](https://api.akeneo.com/getting-started/connect-the-pim-4x/step-1.html#you-said-connection).

## Get started
To begin, run the setup command:
```bash
make start
```
...and follow the interactive instructions in your terminal. This will install dependencies, configure your environment, and create the extension in your PIM for the first time.

## Development

### Uploading changes
To upload your changes to Akeneo, use the following command. This will build the extension for development and push it to the PIM.
```bash
make update-dev
```

### Automatic updates (hot-reload)
To have your extension automatically update every time you save a code change, run the watch command:
```bash
make watch
```
This is highly recommended for an efficient development workflow.

## Customization

### Application logic
All the frontend logic is located in `src/App.tsx`. Please update this file to match your needs.

### Extension configuration
The `extension_configuration.json` file is crucial for defining how your UI extension behaves and appears within Akeneo PIM. Below is a detailed breakdown of its properties.

| Key | Type | Description | Required |
| --- | --- | --- | --- |
| `name` | `string` | A unique identifier for your extension. It's recommended to use a descriptive name, like `my-app-name`. | Yes |
| `type` | `string` | Defines the type of extension. For SDK scripts, this should always be `sdk_script`. | Yes |
| `position` | `string` | Determines where the extension will be displayed in the PIM interface. Examples: `pim.product.panel`, `pim.activity.navigation.tab`. See the [official documentation](https://api.akeneo.com/extensions/positions.html#available-positions-for-ui-extensions) for all available positions. | Yes |
| `file` | `string` | The path to the compiled JavaScript file for your extension, relative to the project root. This is used by the build process (Vite) to name the output file. Example: `dist/my-app.js`. | Yes |
| `configuration` | `object` | An object containing display settings for your extension. | Yes |
| `configuration.default_label` | `string` | The default label for your extension, displayed if no translation is available for the user's locale. | Yes |
| `configuration.labels` | `object` | A key-value map of translations for your extension's label. The key is the locale (e.g., `en_US`, `fr_FR`) and the value is the translated label. | No |
| `credentials` | `array` | An array of objects defining credentials that your extension may need to interact with external services. Each object represents a credential. | No |

#### Credentials object
Each object in the `credentials` array can have the following properties:

| Key | Type | Description |
| --- | --- | --- |
| `code` | `string` | A unique code to identify the credential within your extension. |
| `type` | `string` | The type of authentication. Supported values are `Bearer Token`, `Basic Auth`, and `Custom Header`. |
| `values` | `string` or `object` | The value(s) for the credential. For `Bearer Token` or `Custom Header`, this is a string. For `Basic Auth`, this is an object with `username` and `password`. |

**Example of `credentials`:**
```json
{
  "credentials": [
    {
      "code": "my_bearer_token",
      "type": "Bearer Token",
      "values": "your_auth_token"
    },
    {
      "code": "my_basic_auth",
      "type": "Basic Auth",
      "values": {
        "username": "your_username",
        "password": "your_password"
      }
    },
    {
      "code": "my_custom_header",
      "type": "Custom Header",
      "values": "your_custom_key"
    }
  ]
}
```

## Build for production
Once your project is finished, you can build it for production with the command:
```bash
make build
```
This will create an optimized production build in `dist/demo.js`.

To deploy this production version, use:
```bash
make update
```
