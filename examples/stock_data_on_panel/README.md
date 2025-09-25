# SDK Script Example: Stock Data on Panel

This is an example of a UI extension that displays stock data on a product panel in Akeneo PIM.

## Get Started

To begin, run the setup command:
```bash
make start
```
...and follow the interactive instructions in your terminal. This will install dependencies, configure your environment, and create the extension in your PIM for the first time.

## Development

### Uploading Changes
To upload your changes to Akeneo, use the following command. This will build the extension for development and push it to the PIM.
```bash
make update-dev
```

### Automatic Updates (Hot-Reload)
To have your extension automatically update every time you save a code change, run the watch command:
```bash
make watch
```
This is highly recommended for an efficient development workflow.

## Customization

### Application Logic
All the frontend logic is located in `src/App.tsx`. Please update this file to match your needs.

### Extension Configuration
Want to change the extension's display name or its position in the UI? Modify the `extension_configuration.json` file.

For more information on available positions, see the official documentation: https://api.akeneo.com/extensions/positions.html#available-positions-for-ui-extensions

## Build for Production

Once your project is finished, you can build it for production with the command:
```bash
make build
```
This will create an optimized production build in `dist/demo.js`.

To deploy this production version, use:
```bash
make update
```
