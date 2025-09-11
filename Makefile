.PHONY: install dev build upload

# Load environment variables from .env file if it exists
-include .env

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build the project
build:
	npm run build

# Upload the built extension to Akeneo PIM
upload: build
	@echo "Uploading extension to $(PIM_HOST)..."
	@curl --location '$(PIM_HOST)/api/rest/v1/ui-extensions' \
		--header 'Authorization: Bearer $(API_TOKEN)' \
		--form 'name="sdk_script_extension"' \
		--form 'type="sdk_script"' \
		--form 'position="pim.activity.navigation.tab"' \
		--form 'file=@"$(PROJECT_PATH)/dist/demo.js"' \
		--form 'configuration[labels][en_US]="SDK script test extension"' \
		--form 'configuration[default_label]="SDK script test extension"'
	@echo "Upload complete!"
