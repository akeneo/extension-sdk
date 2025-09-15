# SDK script example

## Installation

```
make install
```

## Build

```
make build
```

The file in `dist/demo.js` is your built UI Extension.

## Upload to PIM

Before uploading, configure your environment variables:

1. Copy the `.env.exemple` into a `.env` file and edit the `.env`  in the root directory:
```
PIM_HOST=https://your-pim-instance.com
API_TOKEN=your_api_token_here
PROJECT_PATH=$(pwd)
```

2. Then run:
```
make upload
```

This will build your extension and upload it to your Akeneo PIM instance.

## Update an Existing Extension

If you already have an extension uploaded and want to update it:

1. Add your extension UUID to the `.env` file:
```
EXTENSION_UUID=your_extension_uuid_here
```

2. Then run:
```
make update
```

This will build your extension and update the existing extension with the same configuration but new code.

## Customize

Please update `src/App.tsx` file to match your needs.
